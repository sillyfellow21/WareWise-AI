import type { Product, User } from '@prisma/client';

/**
 * The React client was written against the legacy Mongoose API, so documents
 * are serialized with `_id` (instead of `id`) and secret fields are stripped:
 * `login`/`getUser` responses feed `state.user` directly in the browser.
 */
export type SerializedUser = Omit<
  User,
  'id' | 'password' | 'securityAnswer' | 'pictureData'
> & { _id: string };

export type SerializedProduct = Omit<Product, 'id' | 'bookings'> & {
  _id: string;
  bookings: Record<string, boolean>;
};

export const serializeUser = (user: User): SerializedUser => {
  const { id, password, securityAnswer, pictureData, ...rest } = user;
  return { _id: id, ...rest };
};

export const serializeProduct = (product: Product): SerializedProduct => {
  const { id, bookings, ...rest } = product;
  const bookingMap =
    bookings && typeof bookings === 'object' && !Array.isArray(bookings)
      ? (bookings as Record<string, boolean>)
      : {};
  return { _id: id, ...rest, bookings: bookingMap };
};
