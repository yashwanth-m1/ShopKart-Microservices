import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  reduceStock,
  restoreStock,
  uploadProductImage
} from "../controllers/productController.js";

import upload from "../middleware/uploadmiddleware.js";

import {
  authenticate,
  adminOnly
} from "../middleware/authmiddleware.js";

const router = express.Router();


// GET ALL PRODUCTS
router.get("/", getProducts);


// GET PRODUCT BY ID
router.get("/:id", getProductById);


// CREATE PRODUCT WITH IMAGE
router.post(
  "/",
  authenticate,
  adminOnly,
  upload.single("image"),
  createProduct
);


// UPDATE PRODUCT
router.put(
  "/:id",
  authenticate,
  adminOnly,
  updateProduct
);


// DELETE PRODUCT
router.delete(
  "/:id",
  authenticate,
  adminOnly,
  deleteProduct
);


// REDUCE STOCK
router.patch(
  "/:id/reduce-stock",
  reduceStock
);


// RESTORE STOCK
router.patch(
  "/:id/restore-stock",
  restoreStock
);


// UPLOAD ADDITIONAL PRODUCT IMAGE
router.post(
  "/:id/images",
  authenticate,
  adminOnly,
  upload.single("image"),
  uploadProductImage
);


export default router;