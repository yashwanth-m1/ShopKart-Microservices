import "dotenv/config";
import express from "express";

import { connectDB } from "./config/db.js";
import authroutes from "./routes/authroutes.js";

const app = express();

const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "User service is running"
  });
});

// Routes
app.use("/api/auth", authroutes);

// Start server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`User service running on port ${PORT}`);
  });
};

startServer();