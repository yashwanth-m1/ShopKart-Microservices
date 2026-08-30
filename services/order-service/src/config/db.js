import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Order Service MongoDB connected successfully");
  } catch (error) {
    console.error(
      "Order Service MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  }
};