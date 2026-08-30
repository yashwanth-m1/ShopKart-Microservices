import "dotenv/config";
import express from "express";

import { connectDB } from "./config/db.js";
import orderRoutes from "./routes/orderroutes.js";

const app = express();

const PORT = process.env.PORT || 3004;


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json());


// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Order service is running"
  });
});


// ==========================================
// ORDER ROUTES
// ==========================================

app.use(
  "/api/orders",
  orderRoutes
);


// ==========================================
// START SERVER
// ==========================================

const startServer = async () => {
  try {

    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `Order service running on port ${PORT}`
      );
    });

  } catch (error) {

    console.error(
      "Order service startup failed:",
      error.message
    );

    process.exit(1);
  }
};

startServer();