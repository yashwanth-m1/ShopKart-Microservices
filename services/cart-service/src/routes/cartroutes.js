// import express from "express";

// import {
//   getCart,
//   addToCart,
//   updateCartItem,
//   removeFromCart,
//   clearCart
// } from "../controllers/cartcontroller.js";

// import { authenticate } from "../middleware/authmiddleware.js";

// const router = express.Router();


// // All cart routes require authentication
// router.use(authenticate);


// // Get cart
// router.get("/", getCart);


// // Add product
// router.post("/", addToCart);


// // Update product quantity
// router.put("/:productId", updateCartItem);


// // Remove product
// router.delete("/:productId", removeFromCart);


// // Clear cart
// router.delete("/", clearCart);


// export default router;

import express from "express";

import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from "../controllers/cartcontroller.js";

import { authenticate } from "../middleware/authmiddleware.js";

const router = express.Router();


// GET CART
router.get(
  "/",
  authenticate,
  getCart
);


// ADD TO CART
router.post(
  "/",
  authenticate,
  addToCart
);


// UPDATE CART ITEM
router.put(
  "/:productId",
  authenticate,
  updateCartItem
);


// REMOVE PRODUCT
router.delete(
  "/:productId",
  authenticate,
  removeFromCart
);


// CLEAR CART
router.delete(
  "/",
  authenticate,
  clearCart
);


export default router;