// import express from "express";

// import {
//   createProduct,
//   getProducts,
//   getProductById,
//   updateProduct,
//   deleteProduct,
//   reduceStock,
//   restoreStock
// } from "../controllers/productcontroller.js";

// const router = express.Router();


// // ==========================================
// // CREATE PRODUCT
// // POST /api/products
// // ==========================================

// router.post("/", createProduct);


// // ==========================================
// // GET ALL PRODUCTS
// // GET /api/products
// // ==========================================

// router.get("/", getProducts);


// // ==========================================
// // REDUCE PRODUCT STOCK
// // PATCH /api/products/:id/reduce-stock
// // ==========================================

// router.patch(
//   "/:id/reduce-stock",
//   reduceStock
// );


// // ==========================================
// // GET PRODUCT BY ID
// // GET /api/products/:id
// // ==========================================

// router.get("/:id", getProductById);


// // ==========================================
// // UPDATE PRODUCT
// // PUT /api/products/:id
// // ==========================================

// router.put("/:id", updateProduct);


// // ==========================================
// // DELETE PRODUCT
// // DELETE /api/products/:id
// // ==========================================

// router.delete("/:id", deleteProduct);

// // restore product stock
// router.patch(
//   "/:id/restore-stock",
//   restoreStock
// );


// export default router;
import express from "express";
import upload from "../middleware/uploadmiddleware.js";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  reduceStock,
  restoreStock,
  uploadProductImage

} from "../controllers/productcontroller.js";

import { authenticate } from "../middleware/authmiddleware.js";
import { authorizeAdmin } from "../middleware/adminmiddleware.js";

const router = express.Router();


// ==========================================
// CREATE PRODUCT - ADMIN ONLY
// POST /api/products
// ==========================================

router.post(
  "/",
  authenticate,
  authorizeAdmin,
  createProduct
);


// ==========================================
// GET ALL PRODUCTS - PUBLIC
// GET /api/products
// ==========================================

router.get(
  "/",
  getProducts
);


// ==========================================
// REDUCE PRODUCT STOCK - INTERNAL SERVICE
// PATCH /api/products/:id/reduce-stock
// ==========================================

router.patch(
  "/:id/reduce-stock",
  reduceStock
);


// ==========================================
// RESTORE PRODUCT STOCK - INTERNAL SERVICE
// PATCH /api/products/:id/restore-stock
// ==========================================

router.patch(
  "/:id/restore-stock",
  restoreStock
);
// ==========================================
// UPLOAD PRODUCT IMAGE
// POST /api/products/:id/images
// ==========================================

router.post(
  "/:id/images",
  upload.single("image"),
  uploadProductImage
);

// ==========================================
// GET PRODUCT BY ID - PUBLIC
// GET /api/products/:id
// ==========================================

router.get(
  "/:id",
  getProductById
);


// ==========================================
// UPDATE PRODUCT - ADMIN ONLY
// PUT /api/products/:id
// ==========================================

router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  updateProduct
);


// ==========================================
// DELETE PRODUCT - ADMIN ONLY
// DELETE /api/products/:id
// ==========================================

router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  deleteProduct
);


export default router;