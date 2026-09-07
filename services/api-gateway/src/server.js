import "dotenv/config";
import express from "express";
import cors from "cors";
import {
  createProxyMiddleware,
  fixRequestBody
} from "http-proxy-middleware";

const app = express();

const PORT = process.env.PORT || 3000;

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL;
const CART_SERVICE_URL = process.env.CART_SERVICE_URL;
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL;

// =====================================================
// CORS
// =====================================================

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// =====================================================
// Environment URLs
// =====================================================

console.log("=================================");
console.log("USER_SERVICE_URL:", USER_SERVICE_URL);
console.log("PRODUCT_SERVICE_URL:", PRODUCT_SERVICE_URL);
console.log("CART_SERVICE_URL:", CART_SERVICE_URL);
console.log("ORDER_SERVICE_URL:", ORDER_SERVICE_URL);
console.log("=================================");

// =====================================================
// Health Check
// =====================================================

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ShopKart API Gateway is running"
  });
});

// =====================================================
// USER SERVICE
// Gateway:
// http://localhost:3000/api/users/...
// =====================================================

app.use(
  "/api/users",
  express.json(),
  createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,

    pathRewrite: {
      "^/": "/api/auth/"
    },

    on: {
      proxyReq: (proxyReq, req, res) => {
        fixRequestBody(proxyReq, req, res);

        console.log(
          `Gateway → User Service: ${req.method} ${req.originalUrl}`
        );
      },

      proxyRes: (proxyRes, req) => {
        console.log(
          `User Service Response: ${proxyRes.statusCode} ${req.originalUrl}`
        );
      },

      error: (error, req, res) => {
        console.error(
          "User Service Proxy Error:",
          error.message
        );

        if (!res.headersSent) {
          res.status(503).json({
            success: false,
            message: "User service unavailable"
          });
        }
      }
    }
  })
);

// =====================================================
// PRODUCT SERVICE
// Gateway:
// http://localhost:3000/api/products/...
// =====================================================

app.use(
  "/api/products",
  express.json(),
  createProxyMiddleware({
    target: PRODUCT_SERVICE_URL,
    changeOrigin: true,

    pathRewrite: {
      "^/": "/api/products/"
    },

    on: {
      proxyReq: (proxyReq, req, res) => {
        fixRequestBody(proxyReq, req, res);

        console.log(
          `Gateway → Product Service: ${req.method} ${req.originalUrl}`
        );
      },

      proxyRes: (proxyRes, req) => {
        console.log(
          `Product Service Response: ${proxyRes.statusCode} ${req.originalUrl}`
        );
      },

      error: (error, req, res) => {
        console.error(
          "Product Service Proxy Error:",
          error.message
        );

        if (!res.headersSent) {
          res.status(503).json({
            success: false,
            message: "Product service unavailable"
          });
        }
      }
    }
  })
);

// =====================================================
// CART SERVICE
// Gateway:
// http://localhost:3000/api/cart/...
// =====================================================

app.use(
  "/api/cart",
  express.json(),
  createProxyMiddleware({
    target: CART_SERVICE_URL,
    changeOrigin: true,

    pathRewrite: {
      "^/": "/api/cart/"
    },

    on: {
      proxyReq: (proxyReq, req, res) => {
        fixRequestBody(proxyReq, req, res);

        console.log(
          `Gateway → Cart Service: ${req.method} ${req.originalUrl}`
        );
      },

      proxyRes: (proxyRes, req) => {
        console.log(
          `Cart Service Response: ${proxyRes.statusCode} ${req.originalUrl}`
        );
      },

      error: (error, req, res) => {
        console.error(
          "Cart Service Proxy Error:",
          error.message
        );

        if (!res.headersSent) {
          res.status(503).json({
            success: false,
            message: "Cart service unavailable"
          });
        }
      }
    }
  })
);

// =====================================================
// ORDER SERVICE
// Gateway:
// http://localhost:3000/api/orders/...
// =====================================================

app.use(
  createProxyMiddleware({
    target: ORDER_SERVICE_URL,
    changeOrigin: true,

    pathFilter: "/api/orders",

    on: {
      proxyReq: (proxyReq, req) => {
        console.log(
          `Gateway → Order Service: ${req.method} ${req.originalUrl}`
        );
      },

      proxyRes: (proxyRes, req) => {
        console.log(
          `Order Service Response: ${proxyRes.statusCode} ${req.originalUrl}`
        );
      },

      error: (error, req, res) => {
        console.error(
          "Order Service Proxy Error:",
          error.message
        );

        if (!res.headersSent) {
          res.status(503).json({
            success: false,
            message: "Order service unavailable"
          });
        }
      }
    }
  })
);

// =====================================================
// Start Server
// =====================================================

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});