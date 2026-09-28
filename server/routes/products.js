import express from "express";
import {
  getFeedProducts,
  getUserProducts,
  getProductDetails,
  deleteProduct,
  updateProduct,
  getBookedProducts,
  BookProduct,
} from "../controllers/products.js";
import { requireRole, requireSelf, verifyToken } from "../middleware/auth.js";

const router = express.Router();

/*READ*/
router.get("/", getFeedProducts);
router.get("/:userId/products", verifyToken, requireSelf("userId"), getUserProducts);
router.get("/:productId/product", getProductDetails);
router.get("/:userId/bookedproducts", verifyToken, requireSelf("userId"), getBookedProducts);

/*UPDATE*/
router.patch("/:productId/update", verifyToken, requireRole("supplier", "admin"), updateProduct);
router.patch("/:id/booking", verifyToken, requireRole("employee"), BookProduct);

/* DELETE */
router.delete(
  "/:userId/:productId/delete",
  verifyToken,
  requireSelf("userId"),
  requireRole("supplier", "admin"),
  deleteProduct,
);

export default router;
