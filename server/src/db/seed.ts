import bcrypt from 'bcrypt';
import { env } from '../config/env.js';
import { getPrisma } from './client.js';

type SeedUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  picturePath: string;
  role: string;
  location: string;
  employeeId: string;
  supplierId: string;
  phoneNumber: string;
  securityQuestion: string;
  securityAnswer: string;
};

/** The demo accounts documented in Readme.md (credentials in plain text here). */
const seedUsers: SeedUser[] = [
  {
    id: 'seed_user_johndoe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    password: 'password123',
    picturePath: 'path/to/picture1.jpg',
    role: 'supplier',
    location: 'New York, USA',
    employeeId: 'E123456',
    supplierId: 'S654321',
    phoneNumber: '1234567890',
    securityQuestion: "What is your mother's maiden name?",
    securityAnswer: 'Smith',
  },
  {
    id: 'seed_user_janesmith',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'janesmith@example.com',
    password: 'password456',
    picturePath: 'path/to/picture2.jpg',
    role: 'employee',
    location: 'Los Angeles, USA',
    employeeId: 'E234567',
    supplierId: 'S765432',
    phoneNumber: '2345678901',
    securityQuestion: 'What was the name of your first pet?',
    securityAnswer: 'Buddy',
  },
  {
    id: 'seed_user_michaeljohnson',
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michaeljohnson@example.com',
    password: 'password789',
    picturePath: 'path/to/picture3.jpg',
    role: 'supplier',
    location: 'Chicago, USA',
    employeeId: 'E345678',
    supplierId: 'S876543',
    phoneNumber: '3456789012',
    securityQuestion: 'What is your favorite book?',
    securityAnswer: '1984',
  },
  {
    id: 'seed_user_emilydavis',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emilydavis@example.com',
    password: 'password101',
    picturePath: 'path/to/picture4.jpg',
    role: 'supplier',
    location: 'Houston, USA',
    employeeId: 'E456789',
    supplierId: 'S987654',
    phoneNumber: '4567890123',
    securityQuestion: 'What is the name of your favorite teacher?',
    securityAnswer: 'Mrs. Williams',
  },
  {
    id: 'seed_user_davidwilson',
    firstName: 'David',
    lastName: 'Wilson',
    email: 'davidwilson@example.com',
    password: 'password102',
    picturePath: 'path/to/picture5.jpg',
    role: 'employee',
    location: 'Phoenix, USA',
    employeeId: 'E567890',
    supplierId: 'S098765',
    phoneNumber: '5678901234',
    securityQuestion: 'What is your favorite movie?',
    securityAnswer: 'The Matrix',
  },
  {
    id: 'seed_user_sophiamartinez',
    firstName: 'Sophia',
    lastName: 'Martinez',
    email: 'sophiamartinez@example.com',
    password: 'password103',
    picturePath: 'path/to/picture6.jpg',
    role: 'supplier',
    location: 'San Diego, USA',
    employeeId: 'E678901',
    supplierId: 'S109876',
    phoneNumber: '6789012345',
    securityQuestion: 'What city were you born in?',
    securityAnswer: 'Miami',
  },
  {
    id: 'seed_user_danielanderson',
    firstName: 'Daniel',
    lastName: 'Anderson',
    email: 'danielanderson@example.com',
    password: 'password104',
    picturePath: 'path/to/picture7.jpg',
    role: 'employee',
    location: 'Dallas, USA',
    employeeId: 'E789012',
    supplierId: 'S210987',
    phoneNumber: '7890123456',
    securityQuestion: 'What was your first car?',
    securityAnswer: 'Toyota',
  },
];

type SeedProduct = {
  id: string;
  ownerEmail: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  minQuantity: number;
  reorderPoint: number;
  maxQuantity: number;
  category: string;
};

const seedProducts: SeedProduct[] = [
  {
    id: 'seed_product_wireless_mouse',
    ownerEmail: 'janesmith@example.com',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with adjustable DPI.',
    price: 25.99,
    quantity: 150,
    minQuantity: 20,
    reorderPoint: 30,
    maxQuantity: 200,
    category: 'Electronics',
  },
  {
    id: 'seed_product_water_bottle',
    ownerEmail: 'michaeljohnson@example.com',
    name: 'Stainless Steel Water Bottle',
    description: 'Insulated bottle, keeps liquids cold for 24 hours.',
    price: 18.99,
    quantity: 75,
    minQuantity: 10,
    reorderPoint: 15,
    maxQuantity: 100,
    category: 'Home & Kitchen',
  },
  {
    id: 'seed_product_yoga_mat',
    ownerEmail: 'emilydavis@example.com',
    name: 'Yoga Mat',
    description: 'Eco-friendly, non-slip yoga mat with carrying strap.',
    price: 30,
    quantity: 50,
    minQuantity: 10,
    reorderPoint: 20,
    maxQuantity: 70,
    category: 'Fitness',
  },
  {
    id: 'seed_product_bluetooth_speaker',
    ownerEmail: 'davidwilson@example.com',
    name: 'Bluetooth Speaker',
    description: 'Portable Bluetooth speaker with 12-hour battery life.',
    price: 45.5,
    quantity: 40,
    minQuantity: 5,
    reorderPoint: 10,
    maxQuantity: 60,
    category: 'Electronics',
  },
  {
    id: 'seed_product_green_tea',
    ownerEmail: 'sophiamartinez@example.com',
    name: 'Organic Green Tea',
    description: 'Premium organic green tea leaves, 100g pack.',
    price: 12.99,
    quantity: 200,
    minQuantity: 30,
    reorderPoint: 50,
    maxQuantity: 250,
    category: 'Grocery',
  },
  {
    id: 'seed_product_desk_lamp',
    ownerEmail: 'danielanderson@example.com',
    name: 'LED Desk Lamp',
    description: 'Adjustable LED desk lamp with USB charging port.',
    price: 35.75,
    quantity: 60,
    minQuantity: 10,
    reorderPoint: 20,
    maxQuantity: 80,
    category: 'Office Supplies',
  },
  {
    id: 'seed_product_running_shoes',
    ownerEmail: 'johndoe@example.com',
    name: 'Running Shoes',
    description: 'Lightweight running shoes with breathable mesh.',
    price: 65,
    quantity: 100,
    minQuantity: 15,
    reorderPoint: 25,
    maxQuantity: 120,
    category: 'Footwear',
  },
];

/**
 * Idempotent boot-time seed: creates the seven demo accounts (bcrypt-hashed
 * passwords) and their marketplace listings exactly once. Every seeded product
 * gets `status: "Marketplace"` so the employee order/booking flow in
 * `ProductDetailWidget` is usable from the first visit.
 */
export const seedDatabase = async (): Promise<void> => {
  if (!env.databaseUrl) {
    console.log(
      JSON.stringify({ service: 'warewise-api', event: 'seed_skipped', reason: 'DATABASE_URL not set' }),
    );
    return;
  }
  const prisma = getPrisma();
  try {
    const userIdByEmail = new Map<string, string>();
    for (const user of seedUsers) {
      const existing = await prisma.user.findUnique({ where: { id: user.id }, select: { id: true } });
      if (!existing) {
        const { password, securityAnswer, ...fields } = user;
        const [passwordHash, securityAnswerHash] = await Promise.all([
          bcrypt.hash(password, 10),
          bcrypt.hash(securityAnswer, 10),
        ]);
        await prisma.user.create({
          data: { ...fields, password: passwordHash, securityAnswer: securityAnswerHash },
        });
      }
      userIdByEmail.set(user.email, user.id);
    }
    for (const product of seedProducts) {
      const existing = await prisma.product.findUnique({ where: { id: product.id }, select: { id: true } });
      if (!existing) {
        const { ownerEmail, ...fields } = product;
        await prisma.product.create({
          data: {
            ...fields,
            userId: userIdByEmail.get(ownerEmail) ?? seedUsers[0].id,
            status: 'Marketplace',
            bookings: {},
          },
        });
      }
    }
    console.log(JSON.stringify({ service: 'warewise-api', event: 'seed_complete' }));
  } catch (error) {
    console.error(
      JSON.stringify({
        service: 'warewise-api',
        event: 'seed_failed',
        error: error instanceof Error ? error.message : String(error),
      }),
    );
  }
};
