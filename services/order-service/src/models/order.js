import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    image: {
      type: String,
      default: null
    }
  },
  {
    _id: false
  }
);


const orderSchema = new mongoose.Schema(
  {
    // User who placed the order
    userId: {
      type: String,
      required: true,
      index: true
    },

    // Products in the order
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "Order must contain at least one item"
      }
    },

    // Total number of products
    totalItems: {
      type: Number,
      required: true,
      min: 1
    },

    // Total order amount
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },

    // Order status
    status: {
      type: String,
      enum: [
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED"
      ],
      default: "PENDING"
    },

    // Payment status
    paymentStatus: {
      type: String,
      enum: [
        "PENDING",
        "PAID",
        "FAILED",
        "REFUNDED"
      ],
      default: "PENDING"
    },

    // Payment method
    paymentMethod: {
      type: String,
      enum: [
        "COD",
        "CARD",
        "UPI"
      ],
      default: "COD"
    },

    // Shipping address
    shippingAddress: {
      fullName: {
        type: String,
        required: true,
        trim: true
      },

      phone: {
        type: String,
        required: true,
        trim: true
      },

      addressLine1: {
        type: String,
        required: true,
        trim: true
      },

      addressLine2: {
        type: String,
        default: "",
        trim: true
      },

      city: {
        type: String,
        required: true,
        trim: true
      },

      state: {
        type: String,
        required: true,
        trim: true
      },

      postalCode: {
        type: String,
        required: true,
        trim: true
      },

      country: {
        type: String,
        default: "India",
        trim: true
      }
    }
  },
  {
    timestamps: true
  }
);


const Order = mongoose.model(
  "Order",
  orderSchema
);

export default Order;