import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Product Service MongoDB connected");
  } catch (error) {
    console.error(
      "Product Service MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  }
};