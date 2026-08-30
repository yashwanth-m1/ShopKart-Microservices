import express from "express";

import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus
} from "../controllers/ordercontroller.js";

import { authenticate } from "../middleware/authmiddleware.js";

const router = express.Router();


// ==========================================
// GET MY ORDERS
// GET /api/orders
// ==========================================

router.get(
  "/",
  authenticate,
  getMyOrders
);


// ==========================================
// CANCEL ORDER
// PATCH /api/orders/:orderId/cancel
// ==========================================

router.patch(
  "/:orderId/cancel",
  authenticate,
  cancelOrder
);

// ==========================================
// UPDATE ORDER STATUS
// PATCH /api/orders/:orderId/status
// ==========================================

router.patch(
  "/:orderId/status",
  authenticate,
  updateOrderStatus
);



// ==========================================
// CREATE ORDER
// POST /api/orders
// ==========================================

router.post(
  "/",
  authenticate,
  createOrder
);
// ==========================================
// GET ORDER BY ID
// GET /api/orders/:orderId
// ==========================================

router.get(
  "/:orderId",
  authenticate,
  getOrderById
);

export default router;