import redisClient from "../config/redis.js";

// ------------------------------------------
// Helper: Generate Redis Cart Key
// ------------------------------------------

const getCartKey = (userId) => {
  return `cart:${userId}`;
};

// ------------------------------------------
// Helper: Calculate Cart Totals
// ------------------------------------------

const calculateCartTotals = (cart) => {
  cart.totalItems = cart.items.reduce(
    (total, item) => total + Number(item.quantity),
    0
  );

  cart.totalPrice = cart.items.reduce(
    (total, item) =>
      total +
      Number(item.price) * Number(item.quantity),
    0
  );

  return cart;
};

// ==========================================
// GET CART
// GET /api/cart
// ==========================================

export const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cartKey = getCartKey(userId);

    const cartData = await redisClient.get(cartKey);

    // Return empty cart if no cart exists
    if (!cartData) {
      return res.status(200).json({
        success: true,
        cart: {
          items: [],
          totalItems: 0,
          totalPrice: 0
        }
      });
    }

    const cart = JSON.parse(cartData);

    return res.status(200).json({
      success: true,
      cart
    });

  } catch (error) {
    console.error("Get cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get cart"
    });
  }
};

// ==========================================
// ADD PRODUCT TO CART
// POST /api/cart
// ==========================================

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      productId,
      name,
      price,
      quantity,
      image
    } = req.body;

    // Validate product ID
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    // Validate name
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Product name is required"
      });
    }

    // Validate price
    if (
      price === undefined ||
      price === null
    ) {
      return res.status(400).json({
        success: false,
        message: "Product price is required"
      });
    }

    // Validate quantity
    if (
      quantity === undefined ||
      quantity === null ||
      Number(quantity) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0"
      });
    }

    const cartKey = getCartKey(userId);

    // Get existing cart from Redis
    const existingCart = await redisClient.get(cartKey);

    let cart;

    if (existingCart) {
      cart = JSON.parse(existingCart);
    } else {
      cart = {
        items: [],
        totalItems: 0,
        totalPrice: 0
      };
    }

    // Check if product already exists
    const existingItem = cart.items.find(
      (item) => item.productId === productId
    );

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({
        productId,
        name,
        price: Number(price),
        quantity: Number(quantity),
        image: image || null
      });
    }

    // Calculate totals
    calculateCartTotals(cart);

    // Save cart in Redis
    await redisClient.set(
      cartKey,
      JSON.stringify(cart)
    );

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart
    });

  } catch (error) {
    console.error("Add to cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add product to cart"
    });
  }
};

// ==========================================
// UPDATE CART ITEM
// PUT /api/cart/:productId
// ==========================================

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;
    const { quantity } = req.body;

    // Validate quantity
    if (
      quantity === undefined ||
      quantity === null ||
      Number(quantity) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0"
      });
    }

    const cartKey = getCartKey(userId);

    const existingCart = await redisClient.get(cartKey);

    if (!existingCart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    const cart = JSON.parse(existingCart);

    const item = cart.items.find(
      (item) => item.productId === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart"
      });
    }

    // Update quantity
    item.quantity = Number(quantity);

    // Recalculate totals
    calculateCartTotals(cart);

    // Save updated cart
    await redisClient.set(
      cartKey,
      JSON.stringify(cart)
    );

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart
    });

  } catch (error) {
    console.error("Update cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update cart"
    });
  }
};

// ==========================================
// REMOVE PRODUCT FROM CART
// DELETE /api/cart/:productId
// ==========================================

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    const cartKey = getCartKey(userId);

    const existingCart = await redisClient.get(cartKey);

    if (!existingCart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    const cart = JSON.parse(existingCart);

    const originalLength = cart.items.length;

    // Remove selected product
    cart.items = cart.items.filter(
      (item) => item.productId !== productId
    );

    // Product was not found
    if (cart.items.length === originalLength) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart"
      });
    }

    // Calculate new totals
    calculateCartTotals(cart);

    // Save cart
    await redisClient.set(
      cartKey,
      JSON.stringify(cart)
    );

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart
    });

  } catch (error) {
    console.error(
      "Remove from cart error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to remove product"
    });
  }
};

// ==========================================
// CLEAR ENTIRE CART
// DELETE /api/cart
// ==========================================

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cartKey = getCartKey(userId);

    console.log("Clearing Redis cart:", cartKey);

    // Delete user's cart from Redis
    const result = await redisClient.del(cartKey);

    console.log("Redis delete result:", result);

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully"
    });

  } catch (error) {
    console.error(
      "Clear cart error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to clear cart"
    });
  }
};
