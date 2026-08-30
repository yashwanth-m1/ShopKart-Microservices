// import Order from "../models/order.js";
// import axios from "axios";

// const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL;
// // ==========================================
// // CREATE ORDER
// // POST /api/orders
// // ==========================================

// export const createOrder = async (req, res) => {
//   try {
//     // User ID comes from JWT
//     const userId = req.user.userId;

//     const {
//       items,
//       shippingAddress,
//       paymentMethod
//     } = req.body;


//     // ------------------------------------------
//     // Validate Items
//     // ------------------------------------------

//     if (!items || !Array.isArray(items)) {
//       return res.status(400).json({
//         success: false,
//         message: "Order items are required"
//       });
//     }

//     if (items.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Order must contain at least one item"
//       });
//     }


//     // ------------------------------------------
//     // Validate Shipping Address
//     // ------------------------------------------

//     if (!shippingAddress) {
//       return res.status(400).json({
//         success: false,
//         message: "Shipping address is required"
//       });
//     }


//     const {
//       fullName,
//       phone,
//       addressLine1,
//       addressLine2,
//       city,
//       state,
//       postalCode,
//       country
//     } = shippingAddress;


//     if (
//       !fullName ||
//       !phone ||
//       !addressLine1 ||
//       !city ||
//       !state ||
//       !postalCode
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Complete shipping address is required"
//       });
//     }


//     // ------------------------------------------
//     // Validate Payment Method
//     // ------------------------------------------

//     const allowedPaymentMethods = [
//       "COD",
//       "CARD",
//       "UPI"
//     ];

//     const selectedPaymentMethod =
//       paymentMethod || "COD";


//     if (
//       !allowedPaymentMethods.includes(
//         selectedPaymentMethod
//       )
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid payment method"
//       });
//     }


//     // ------------------------------------------
//     // Validate Items
//     // ------------------------------------------

//     for (const item of items) {

//       if (!item.productId) {
//         return res.status(400).json({
//           success: false,
//           message: "Product ID is required"
//         });
//       }

//       if (!item.name) {
//         return res.status(400).json({
//           success: false,
//           message: "Product name is required"
//         });
//       }

//       if (
//         item.price === undefined ||
//         item.price === null
//       ) {
//         return res.status(400).json({
//           success: false,
//           message: "Product price is required"
//         });
//       }

//       if (
//         !item.quantity ||
//         item.quantity <= 0
//       ) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid product quantity"
//         });
//       }
//     }


//     // ------------------------------------------
//     // Calculate Totals
//     // ------------------------------------------

//     const totalItems = items.reduce(
//       (total, item) =>
//         total + Number(item.quantity),
//       0
//     );


//     const totalPrice = items.reduce(
//       (total, item) =>
//         total +
//         Number(item.price) *
//         Number(item.quantity),
//       0
//     );
//         // ------------------------------------------
//   // CHECK AND REDUCE PRODUCT STOCK
//    // ------------------------------------------

// for (const item of items) {
//   const response = await fetch(
//     `${PRODUCT_SERVICE_URL}/api/products/${item.productId}/reduce-stock`,
//     {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         quantity: Number(item.quantity)
//       })
//     }
//   );

//   const result = await response.json();

//   if (!response.ok || !result.success) {
//     return res.status(response.status || 400).json({
//       success: false,
//       message: result.message || "Failed to update product stock",
//       productId: item.productId,
//       availableStock: result.availableStock
//     });
//   }
// }
     
//     // ------------------------------------------
//     // Create Order
//     // ------------------------------------------

//     const order = await Order.create({

//       userId,

//       items: items.map((item) => ({
//         productId: item.productId,
//         name: item.name,
//         price: Number(item.price),
//         quantity: Number(item.quantity),
//         image: item.image || null
//       })),

//       totalItems,

//       totalPrice,

//       status: "PENDING",

//       paymentStatus: "PENDING",

//       paymentMethod: selectedPaymentMethod,

//       shippingAddress: {
//         fullName,
//         phone,
//         addressLine1,
//         addressLine2: addressLine2 || "",
//         city,
//         state,
//         postalCode,
//         country: country || "India"
//       }
//     });




//     // ------------------------------------------
//     // Response
//     // ------------------------------------------

//     // return res.status(201).json({
//     //   success: true,
//     //   message: "Order created successfully",
//     //   order
//     // });
//      // ------------------------------------------
// // Clear Cart After Successful Order
// // ------------------------------------------
//  console.log("CART_SERVICE_URL:", process.env.CART_SERVICE_URL);
// console.log(
//   "CLEAR CART URL:",
//   `${process.env.CART_SERVICE_URL}/api/cart`
// );

// try {
//   await axios.delete(
//     `${process.env.CART_SERVICE_URL}/api/cart`,
//     {
//       headers: {
//         Authorization: req.headers.authorization
//       }
//     }
//   );

//   console.log(
//     "Cart cleared successfully after order creation"
//   );

// } catch (cartError) {

//   console.error(
//     "Cart clearing failed:",
//     cartError.response?.data || cartError.message
//   );
// }


// // ------------------------------------------
// // Response
// // ------------------------------------------

// return res.status(201).json({
//   success: true,
//   message: "Order created successfully",
//   order
// });

//     // yash
//   } catch (error) {

//     console.error(
//       "Create order error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message: "Failed to create order"
//     });
//   }
// };

// // ==========================================
// // GET MY ORDERS
// // GET /api/orders
// // ==========================================

// export const getMyOrders = async (req, res) => {
//   try {
//     // User ID comes from JWT
//     const userId = req.user.userId;

//     // Find only orders belonging to logged-in user
//     const orders = await Order.find({ userId })
//       .sort({ createdAt: -1 });

//     return res.status(200).json({
//       success: true,
//       count: orders.length,
//       orders
//     });

//   } catch (error) {

//     console.error(
//       "Get my orders error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message: "Failed to get orders"
//     });
//   }
// };

// // ==========================================
// // GET ORDER BY ID
// // GET /api/orders/:orderId
// // ==========================================

// export const getOrderById = async (req, res) => {
//   try {

//     // User ID comes from JWT
//     const userId = req.user.userId;

//     // Order ID comes from URL
//     const { orderId } = req.params;


//     // Find order belonging to logged-in user
//     const order = await Order.findOne({
//       _id: orderId,
//       userId
//     });


//     // Order not found
//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found"
//       });
//     }


//     // Return order
//     return res.status(200).json({
//       success: true,
//       order
//     });

//   } catch (error) {

//     console.error(
//       "Get order by ID error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message: "Failed to get order"
//     });
//   }
// };

// // ==========================================
// // CANCEL ORDER
// // PATCH /api/orders/:orderId/cancel
// // ==========================================

// export const cancelOrder = async (req, res) => {
//   try {
//     // User ID comes from JWT
//     const userId = req.user.userId;

//     // Order ID comes from URL
//     const { orderId } = req.params;

//     // Find order belonging to logged-in user
//     const order = await Order.findOne({
//       _id: orderId,
//       userId
//     });

//     // Order not found
//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found"
//       });
//     }

//     // Only pending orders can be cancelled
//     if (order.status !== "PENDING") {
//       return res.status(400).json({
//         success: false,
//         message: `Order cannot be cancelled because its status is ${order.status}`
//       });
//     }

//     // Update order status
//     order.status = "CANCELLED";

//     await order.save();

//     return res.status(200).json({
//       success: true,
//       message: "Order cancelled successfully",
//       order
//     });

//   } catch (error) {
//     console.error(
//       "Cancel order error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message: "Failed to cancel order"
//     });
//   }
// };
import Order from "../models/order.js";
import axios from "axios";
import sqsClient from "../config/sqs.js";
import { SendMessageCommand } from "@aws-sdk/client-sqs";

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL;
const CART_SERVICE_URL = process.env.CART_SERVICE_URL;

// ==========================================
// CREATE ORDER
// POST /api/orders
// ==========================================

export const createOrder = async (req, res) => {
  try {
    // User ID comes from JWT
    const userId = req.user.userId;

    const {
      items,
      shippingAddress,
      paymentMethod
    } = req.body;

    // ------------------------------------------
    // Validate Items
    // ------------------------------------------

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: "Order items are required"
      });
    }

    if (items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item"
      });
    }

    // ------------------------------------------
    // Validate Shipping Address
    // ------------------------------------------

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required"
      });
    }

    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country
    } = shippingAddress;

    if (
      !fullName ||
      !phone ||
      !addressLine1 ||
      !city ||
      !state ||
      !postalCode
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete shipping address is required"
      });
    }

    // ------------------------------------------
    // Validate Payment Method
    // ------------------------------------------

    const allowedPaymentMethods = [
      "COD",
      "CARD",
      "UPI"
    ];

    const selectedPaymentMethod =
      paymentMethod || "COD";

    if (
      !allowedPaymentMethods.includes(
        selectedPaymentMethod
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method"
      });
    }
    // ------------------------------------------
// Check for Duplicate Products
// ------------------------------------------

const productIds = items.map(
  (item) => item.productId
);

const uniqueProductIds = new Set(productIds);

if (uniqueProductIds.size !== productIds.length) {
  return res.status(400).json({
    success: false,
    message: "Duplicate products are not allowed in an order"
  });
}

    // ------------------------------------------
    // Validate Order Items
    // Client sends only productId + quantity
    // ------------------------------------------


    for (const item of items) {
      if (!item.productId) {
        return res.status(400).json({
          success: false,
          message: "Product ID is required"
        });
      }

      if (
        item.quantity === undefined ||
        item.quantity === null ||
        Number(item.quantity) <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Valid product quantity is required"
        });
      }
    }

    // ------------------------------------------
    // GET REAL PRODUCT DETAILS
    // ------------------------------------------

    const orderItems = [];

    for (const item of items) {
      try {
        const productResponse = await axios.get(
          `${PRODUCT_SERVICE_URL}/api/products/${item.productId}`
        );

        const product = productResponse.data.product;

        if (!product) {
          return res.status(404).json({
            success: false,
            message: "Product not found",
            productId: item.productId
          });
        }

        // Check stock before reducing
        if (Number(product.stock) < Number(item.quantity)) {
          return res.status(400).json({
            success: false,
            message: "Insufficient product stock",
            productId: item.productId,
            availableStock: product.stock
          });
        }

        // Use REAL data from Product Service
        orderItems.push({
          productId: product._id.toString(),
          name: product.name,
          price: Number(product.price),
          quantity: Number(item.quantity),
          image:
            product.images && product.images.length > 0
              ? product.images[0]
              : null
        });

      } catch (productError) {
        console.error(
          "Product fetch error:",
          productError.response?.data ||
          productError.message
        );

        return res.status(
          productError.response?.status || 500
        ).json({
          success: false,
          message:
            productError.response?.data?.message ||
            "Failed to get product details",
          productId: item.productId
        });
      }
    }

    // ------------------------------------------
    // Calculate Totals Using REAL Product Price
    // ------------------------------------------

    const totalItems = orderItems.reduce(
      (total, item) =>
        total + Number(item.quantity),
      0
    );

    const totalPrice = orderItems.reduce(
      (total, item) =>
        total +
        Number(item.price) *
        Number(item.quantity),
      0
    );

    // ------------------------------------------
    // REDUCE PRODUCT STOCK
    // ------------------------------------------

    for (const item of orderItems) {
      const response = await fetch(
        `${PRODUCT_SERVICE_URL}/api/products/${item.productId}/reduce-stock`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            quantity: Number(item.quantity)
          })
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        return res.status(response.status || 400).json({
          success: false,
          message:
            result.message ||
            "Failed to update product stock",
          productId: item.productId,
          availableStock: result.availableStock
        });
      }

      console.log(
        `Stock reduced for product ${item.productId}`
      );
    }

    // ------------------------------------------
    // Create Order
    // ------------------------------------------

    const order = await Order.create({
      userId,

      items: orderItems,

      totalItems,

      totalPrice,

      status: "PENDING",

      paymentStatus: "PENDING",

      paymentMethod: selectedPaymentMethod,

      shippingAddress: {
        fullName,
        phone,
        addressLine1,
        addressLine2: addressLine2 || "",
        city,
        state,
        postalCode,
        country: country || "India"
      }
    });

    // ------------------------------------------
    // Clear Cart After Successful Order
    // ------------------------------------------

    try {
      console.log(
        "Clearing cart:",
        `${CART_SERVICE_URL}/api/cart`
      );

      await axios.delete(
        `${CART_SERVICE_URL}/api/cart`,
        {
          headers: {
            Authorization: req.headers.authorization
          }
        }
      );

      console.log(
        "Cart cleared successfully after order creation"
      );

    } catch (cartError) {
      console.error(
        "Cart clearing failed:",
        cartError.response?.data ||
        cartError.message
      );
    }
    // ------------------------------------------
// SEND ORDER_CREATED EVENT TO AWS SQS
// ------------------------------------------

try {
  const event = {
    eventType: "ORDER_CREATED",
    orderId: order._id.toString(),
    userId: order.userId.toString(),
    totalPrice: order.totalPrice,
    totalItems: order.totalItems,
    paymentMethod: order.paymentMethod,
    createdAt: order.createdAt
  };

  await sqsClient.send(
    new SendMessageCommand({
      QueueUrl: process.env.AWS_SQS_QUEUE_URL,
      MessageBody: JSON.stringify(event)
    })
  );

  console.log(
    "ORDER_CREATED event sent to SQS:",
    order._id.toString()
  );

} catch (sqsError) {
  console.error(
    "Failed to send ORDER_CREATED event:",
    sqsError.message
  );
}

    // ------------------------------------------
    // Response
    // ------------------------------------------

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order
    });

  } catch (error) {
    console.error(
      "Create order error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create order"
    });
  }
};


// ==========================================
// GET MY ORDERS
// GET /api/orders
// ==========================================

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    console.error(
      "Get my orders error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get orders"
    });
  }
};


// ==========================================
// GET ORDER BY ID
// GET /api/orders/:orderId
// ==========================================

export const getOrderById = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      userId
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    return res.status(200).json({
      success: true,
      order
    });

  } catch (error) {
    console.error(
      "Get order by ID error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get order"
    });
  }
};


// ==========================================
// CANCEL ORDER
// PATCH /api/orders/:orderId/cancel
// ==========================================

// ==========================================
// CANCEL ORDER
// PATCH /api/orders/:orderId/cancel
// ==========================================

export const cancelOrder = async (req, res) => {
  try {
    // User ID comes from JWT
    const userId = req.user.userId;

    // Order ID comes from URL
    const { orderId } = req.params;

    // Find order belonging to logged-in user
    const order = await Order.findOne({
      _id: orderId,
      userId
    });

    // Order not found
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Only pending orders can be cancelled
    if (order.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because its status is ${order.status}`
      });
    }

    // ------------------------------------------
    // RESTORE PRODUCT STOCK
    // ------------------------------------------

    for (const item of order.items) {
      try {
        const response = await axios.patch(
          `${PRODUCT_SERVICE_URL}/api/products/${item.productId}/restore-stock`,
          {
            quantity: Number(item.quantity)
          }
        );

        if (!response.data.success) {
          return res.status(400).json({
            success: false,
            message: "Failed to restore product stock",
            productId: item.productId
          });
        }

        console.log(
          `Stock restored for product ${item.productId}`
        );

      } catch (stockError) {
        console.error(
          "Stock restore error:",
          stockError.response?.data || stockError.message
        );

        return res.status(
          stockError.response?.status || 500
        ).json({
          success: false,
          message: "Failed to restore product stock",
          productId: item.productId
        });
      }
    }

    // ------------------------------------------
    // UPDATE ORDER STATUS
    // ------------------------------------------

    order.status = "CANCELLED";

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully and stock restored",
      order
    });

  } catch (error) {
    console.error(
      "Cancel order error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to cancel order"
    });
  }
};

// ==========================================
// UPDATE ORDER STATUS
// PATCH /api/orders/:orderId/status
// ==========================================

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Allowed order statuses
    const allowedStatuses = [
      "PENDING",
      "CONFIRMED",
      "SHIPPED",
      "DELIVERED"
    ];

    // Validate status
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Order status is required"
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status"
      });
    }

    // Find order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Prevent updating cancelled orders
    if (order.status === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Cancelled order status cannot be updated"
      });
    }

   // ------------------------------------------
// VALID STATUS TRANSITIONS
// ------------------------------------------

const validTransitions = {
  PENDING: ["CONFIRMED"],
  CONFIRMED: ["SHIPPED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: []
};

// Check whether the requested transition is allowed
if (!validTransitions[order.status].includes(status)) {
  return res.status(400).json({
    success: false,
    message: `Cannot change order status from ${order.status} to ${status}`
  });
}

// Update status
order.status = status;

await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order
    });

  } catch (error) {
    console.error(
      "Update order status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update order status"
    });
  }
};
