import express from "express";

import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from "../controllers/cartController.js";

import {
  authenticate
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getCart);

router.post("/", authenticate, addToCart);

router.delete("/", authenticate, clearCart);

router.put(
  "/:productId",
  authenticate,
  updateCartItem
);

router.delete(
  "/:productId",
  authenticate,
  removeFromCart
);

export default router;