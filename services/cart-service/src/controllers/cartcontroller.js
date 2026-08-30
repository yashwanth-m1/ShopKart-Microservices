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
    (total, item) => total + item.quantity,
    0
  );

  cart.totalPrice = cart.items.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  return cart;
};


// ------------------------------------------
// GET CART
// GET /api/cart
// ------------------------------------------

export const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cartKey = getCartKey(userId);

    const cartData = await redisClient.get(cartKey);

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

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    console.error("Get cart error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get cart"
    });
  }
};


// ------------------------------------------
// ADD PRODUCT TO CART
// POST /api/cart
// ------------------------------------------

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

    // Validation
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Product name is required"
      });
    }

    if (price === undefined || price === null) {
      return res.status(400).json({
        success: false,
        message: "Product price is required"
      });
    }

    if (!quantity) {
      return res.status(400).json({
        success: false,
        message: "Quantity is required"
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0"
      });
    }

    // Redis key
    const cartKey = getCartKey(userId);

    // Get existing cart
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

    // Check whether product already exists
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

    // Save cart
    await redisClient.set(
      cartKey,
      JSON.stringify(cart)
    );

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart
    });
  } catch (error) {
    console.error("Add to cart error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add product to cart"
    });
  }
};


// ------------------------------------------
// UPDATE CART ITEM
// PUT /api/cart/:productId
// ------------------------------------------

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { productId } = req.params;

    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0"
      });
    }

    const cartKey = getCartKey(userId);

    const existingCart =
      await redisClient.get(cartKey);

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

    item.quantity = Number(quantity);

    calculateCartTotals(cart);

    await redisClient.set(
      cartKey,
      JSON.stringify(cart)
    );

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart
    });
  } catch (error) {
    console.error("Update cart error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update cart"
    });
  }
};


// ------------------------------------------
// REMOVE PRODUCT FROM CART
// DELETE /api/cart/:productId
// ------------------------------------------

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { productId } = req.params;

    const cartKey = getCartKey(userId);

    const existingCart =
      await redisClient.get(cartKey);

    if (!existingCart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    const cart = JSON.parse(existingCart);

    const originalLength = cart.items.length;

    cart.items = cart.items.filter(
      (item) => item.productId !== productId
    );

    if (cart.items.length === originalLength) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart"
      });
    }

    calculateCartTotals(cart);

    await redisClient.set(
      cartKey,
      JSON.stringify(cart)
    );

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart
    });
  } catch (error) {
    console.error(
      "Remove from cart error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to remove product"
    });
  }
};


// ------------------------------------------
// CLEAR CART
// DELETE /api/cart
// ------------------------------------------

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cartKey = getCartKey(userId);

    await redisClient.del(cartKey);

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully"
    });
  } catch (error) {
    console.error("Clear cart error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to clear cart"
    });
  }
};