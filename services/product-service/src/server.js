import "dotenv/config";
import express from "express";

import { connectDB } from "./config/db.js";
import productRoutes from "./routes/productroutes.js";

const app = express();

const PORT = process.env.PORT || 3002;

app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Product service is running"
  });
});

// Product routes
app.use("/api/products", productRoutes);

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Product service running on port ${PORT}`);
  });
}; 

startServer();