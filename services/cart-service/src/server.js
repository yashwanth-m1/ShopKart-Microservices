import "dotenv/config";
import express from "express";

import { connectRedis } from "./config/redis.js";
import cartRoutes from "./routes/cartroutes.js";

const app = express();

const PORT = process.env.PORT || 3003;


// ------------------------------------------
// Middleware
// ------------------------------------------

app.use(express.json());


// ------------------------------------------
// Health Check
// ------------------------------------------

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Cart service is running"
  });
});


// ------------------------------------------
// Cart Routes
// ------------------------------------------

app.use("/api/cart", cartRoutes);


// ------------------------------------------
// Start Server
// ------------------------------------------

const startServer = async () => {
  try {
    await connectRedis();

    app.listen(PORT, () => {
      console.log(
        `Cart service running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Cart service startup failed:",
      error.message
    );

    process.exit(1);
  }
};


startServer();