import type { RequestHandler } from 'express';
import type { Prisma } from '@prisma/client';
import { getPrisma } from '../../db/client.js';
import { serializeProduct } from '../../lib/serialize.js';

const asString = (value: unknown): string => (typeof value === 'string' ? value : '');

const toNumber = (value: unknown): number | null => {
  if (value === undefined || value === null || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const sortFields = new Set([
  'quantity',
  'price',
  'name',
  'category',
  'status',
  'minQuantity',
  'maxQuantity',
  'reorderPoint',
  'createdAt',
  'updatedAt',
]);

/** "All"/"" mean "no filter" (legacy semantics); otherwise "a,b" list. */
const parseList = (value: unknown): string[] => {
  if (typeof value !== 'string') return [];
  const raw = value.trim();
  if (!raw || raw === 'All') return [];
  return raw
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
};

const parseSort = (value: unknown): { field: string; order: 'asc' | 'desc' } => {
  const raw = asString(value) || 'quantity';
  const [field, order] = raw.split(',');
  return {
    field: field && sortFields.has(field) ? field : 'quantity',
    order: order === 'desc' ? 'desc' : 'asc',
  };
};

/**
 * Shared implementation of the three paginated product feeds (general, by
 * owner, booked-by-user) — all answer the exact legacy shape read by
 * `ProductsWidget`: `{ error, total, page, limit, category, status, products }`.
 */
const queryFeed = async (
  request: Parameters<RequestHandler>[0],
  extraWhere: Prisma.ProductWhereInput = {},
) => {
  const page = Math.max((Number.parseInt(String(request.query.page ?? '1'), 10) || 1) - 1, 0);
  const limit = Number.parseInt(String(request.query.limit ?? ''), 10) || 5;
  const name = asString(request.query.name);
  const categories = parseList(request.query.category);
  const statuses = parseList(request.query.status);
  const { field, order } = parseSort(request.query.sort);
  const where: Prisma.ProductWhereInput = {
    ...(categories.length > 0 ? { category: { in: categories } } : {}),
    ...(statuses.length > 0 ? { status: { in: statuses } } : {}),
    ...(name ? { name: { contains: name, mode: 'insensitive' } } : {}),
    ...extraWhere,
  };
  const prisma = getPrisma();
  const [total, products, categoryRows, statusRows] = await prisma.$transaction([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: { [field]: order } as Prisma.ProductOrderByWithRelationInput,
      skip: page * limit,
      take: limit,
    }),
    prisma.product.groupBy({ by: ['category'], orderBy: { category: 'asc' } }),
    prisma.product.groupBy({ by: ['status'], orderBy: { status: 'asc' } }),
  ]);
  return {
    error: false,
    total,
    page: page + 1,
    limit,
    category: categoryRows.map((row) => row.category),
    status: statusRows.map((row) => row.status).filter((value): value is string => value !== null),
    products: products.map(serializeProduct),
  };
};

/* READ */

export const getFeedProducts: RequestHandler = async (request, response) => {
  try {
    response.status(200).json(await queryFeed(request));
  } catch (error) {
    response.status(500).json({ message: error instanceof Error ? error.message : String(error) });
  }
};

export const getUserProducts: RequestHandler = async (request, response) => {
  try {
    response
      .status(200)
      .json(await queryFeed(request, { userId: String(request.params.userId) }));
  } catch (error) {
    response.status(404).json({ message: error instanceof Error ? error.message : String(error) });
  }
};

export const getBookedProducts: RequestHandler = async (request, response) => {
  try {
    const userId = String(request.params.userId);
    // JSON path filter reproduces the legacy `bookings.<userId>: true` query.
    response
      .status(200)
      .json(await queryFeed(request, { bookings: { path: [userId], equals: true } }));
  } catch (error) {
    response.status(500).json({ message: error instanceof Error ? error.message : String(error) });
  }
};

export const getProductDetails: RequestHandler = async (request, response) => {
  try {
    const product = await getPrisma().product.findUnique({
      where: { id: String(request.params.productId) },
    });
    if (!product) {
      response.status(404).json({ message: 'Product not found' });
      return;
    }
    response.status(200).json(serializeProduct(product));
  } catch (error) {
    response.status(500).json({ message: error instanceof Error ? error.message : String(error) });
  }
};

/* CREATE */

export const createProduct: RequestHandler = async (request, response) => {
  try {
    const body = request.body as Record<string, unknown>;
    const userId = asString(body.userId);
    const name = asString(body.name);
    const category = asString(body.category);
    const price = toNumber(body.price);
    const quantity = toNumber(body.quantity);
    if (!userId || !name || !category || price === null || quantity === null) {
      response.status(409).json({ message: 'userId, name, category, price and quantity are required' });
      return;
    }
    await getPrisma().product.create({
      data: {
        userId,
        name,
        description: asString(body.description) || null,
        price,
        quantity,
        minQuantity: toNumber(body.minQuantity),
        reorderPoint: toNumber(body.reorderPoint),
        maxQuantity: toNumber(body.maxQuantity),
        status: asString(body.status) || null,
        category,
        bookings: {},
      },
    });
    // Legacy contract: creation answers with the full product list, which the
    // client dispatches straight into `setProducts`.
    const products = await getPrisma().product.findMany();
    response.status(201).json(products.map(serializeProduct));
  } catch (error) {
    response.status(409).json({ message: error instanceof Error ? error.message : String(error) });
  }
};

/* UPDATE */

export const updateProduct: RequestHandler = async (request, response) => {
  try {
    const body = request.body as Record<string, unknown>;
    const data: Prisma.ProductUpdateInput = {};
    for (const field of ['name', 'description', 'status', 'category'] as const) {
      const value = body[field];
      if (typeof value === 'string') data[field] = value;
    }
    for (const field of [
      'price',
      'quantity',
      'minQuantity',
      'reorderPoint',
      'maxQuantity',
    ] as const) {
      const value = toNumber(body[field]);
      if (value !== null && body[field] !== undefined) data[field] = value;
    }
    const existing = await getPrisma().product.findUnique({
      where: { id: String(request.params.productId) },
    });
    if (!existing) {
      response.status(404).json({ message: 'product not found' });
      return;
    }
    const product = await getPrisma().product.update({
      where: { id: existing.id },
      data,
    });
    response
      .status(200)
      .json({ message: 'Product details updated successfully', product: serializeProduct(product) });
  } catch (error) {
    response.status(500).json({ message: error instanceof Error ? error.message : String(error) });
  }
};

/* BOOKING (toggle) */

export const bookProduct: RequestHandler = async (request, response) => {
  try {
    const product = await getPrisma().product.findUnique({
      where: { id: String(request.params.id) },
    });
    if (!product) {
      response.status(404).json({ message: 'Product not found' });
      return;
    }
    const userId = asString((request.body as Record<string, unknown>).userId);
    const bookings: Record<string, boolean> =
      product.bookings && typeof product.bookings === 'object' && !Array.isArray(product.bookings)
        ? { ...(product.bookings as Record<string, boolean>) }
        : {};
    if (bookings[userId]) {
      delete bookings[userId];
    } else {
      bookings[userId] = true;
    }
    const updated = await getPrisma().product.update({
      where: { id: product.id },
      data: { bookings },
    });
    response.status(200).json(serializeProduct(updated));
  } catch (error) {
    response.status(500).json({ message: error instanceof Error ? error.message : String(error) });
  }
};

/* DELETE */

export const deleteProduct: RequestHandler = async (request, response) => {
  try {
    const productId = String(request.params.productId);
    const userId = String(request.params.userId);
    const product = await getPrisma().product.findUnique({ where: { id: productId } });
    if (!product) {
      response.status(404).json({ message: 'Product not found' });
      return;
    }
    if (product.userId !== userId) {
      response.status(403).json({ message: 'You are not authorized to delete this product' });
      return;
    }
    await getPrisma().product.delete({ where: { id: product.id } });
    response.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    response.status(500).json({ message: error instanceof Error ? error.message : String(error) });
  }
};
