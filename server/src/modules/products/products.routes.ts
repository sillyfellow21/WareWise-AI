import { Router } from 'express';
import multer from 'multer';
import {
  bookProduct,
  createProduct,
  deleteProduct,
  getBookedProducts,
  getFeedProducts,
  getProductDetails,
  getUserProducts,
  updateProduct,
} from './products.controller.js';
import { verifyToken } from '../../middleware/verifyToken.js';

// The client posts products as multipart form data (no image today, but the
// legacy route accepted a `picture` part, so the shape stays compatible).
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

export const productsRouter = Router();

productsRouter.get('/', getFeedProducts);
productsRouter.post('/', upload.single('picture'), verifyToken, createProduct);
productsRouter.get('/:userId/products', getUserProducts);
productsRouter.get('/:productId/product', getProductDetails);
productsRouter.get('/:userId/bookedproducts', getBookedProducts);
productsRouter.patch('/:productId/update', verifyToken, updateProduct);
productsRouter.patch('/:id/booking', verifyToken, bookProduct);
productsRouter.delete('/:userId/:productId/delete', verifyToken, deleteProduct);
