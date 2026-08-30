import "dotenv/config";
import express from "express";
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
// =====================================================
//
// Gateway:
// POST http://localhost:3000/api/users/register
//
// Goes to User Service:
// POST http://localhost:USER_PORT/api/auth/register
//
// Gateway:
// POST http://localhost:3000/api/users/login
//
// Goes to User Service:
// POST http://localhost:USER_PORT/api/auth/login
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
// =====================================================
//
// Gateway:
// POST http://localhost:3000/api/products
//
// Goes to Product Service:
// POST http://localhost:PRODUCT_PORT/api/products
//
// Gateway:
// GET http://localhost:3000/api/products
//
// Goes to Product Service:
// GET http://localhost:PRODUCT_PORT/api/products
//
// Gateway:
// GET http://localhost:3000/api/products/:id
//
// Goes to Product Service:
// GET http://localhost:PRODUCT_PORT/api/products/:id
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
// ------------------------------------------
// CART SERVICE
// ------------------------------------------

// =====================================================
// CART SERVICE
// =====================================================
//
// Gateway:
// GET http://localhost:3000/api/cart
//
// Goes to Cart Service:
// GET http://localhost:3003/api/cart
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
// ==========================================
// Order Service Proxy
// ==========================================
// ==========================================
// Order Service Proxy
// ==========================================

// ==========================================
// Order Service Proxy
// ==========================================

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
// 

// =====================================================
// Start Server
// =====================================================

app.listen(PORT, () => {
  console.log(
    `API Gateway running on port ${PORT}`
  );
});
