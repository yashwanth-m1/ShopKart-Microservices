import Product from "../models/product.js";
import s3Client from "../config/s3.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";

// ==========================================
// CREATE PRODUCT WITH IMAGE
// POST /api/products
// ==========================================

export const createProduct = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file);

    const {
      name,
      description,
      price,
      category,
      brand,
      stock
    } = req.body;

    // ------------------------------------------
    // Validate Product Data
    // ------------------------------------------

    if (
      !name ||
      !description ||
      price === undefined ||
      !category ||
      !brand
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, description, price, category and brand are required"
      });
    }

    // ------------------------------------------
    // Image Array
    // ------------------------------------------

    const images = [];

    // ------------------------------------------
    // Upload Image to AWS S3
    // ------------------------------------------

    if (req.file) {
      const fileName = `products/${Date.now()}-${req.file.originalname}`;

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
      });

      await s3Client.send(command);

      const imageUrl =
        `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

      images.push(imageUrl);

      console.log("Image uploaded to S3:", imageUrl);
    }

    // ------------------------------------------
    // Create Product in MongoDB
    // ------------------------------------------

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      brand,
      stock: Number(stock) || 0,
      images
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product
    });

  } catch (error) {
    console.error("Create product error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Internal server error"
    });
  }
};


// ==========================================
// GET ALL PRODUCTS
// GET /api/products
// ==========================================

export const getProducts = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 10, 1),
      100
    );

    const skip = (page - 1) * limit;

    const products = await Product.find({
      isActive: true
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments({
      isActive: true
    });

    return res.status(200).json({
      success: true,
      page,
      limit,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      products
    });

  } catch (error) {
    console.error("Get products error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


// ==========================================
// GET PRODUCT BY ID
// GET /api/products/:id
// ==========================================

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      product
    });

  } catch (error) {
    console.error("Get product error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


// ==========================================
// UPDATE PRODUCT
// PUT /api/products/:id
// ==========================================

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product
    });

  } catch (error) {
    console.error("Update product error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Internal server error"
    });
  }
};


// ==========================================
// DELETE PRODUCT
// DELETE /api/products/:id
// SOFT DELETE
// ==========================================

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false
      },
      {
        new: true
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    console.error("Delete product error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


// ==========================================
// REDUCE PRODUCT STOCK
// PATCH /api/products/:id/reduce-stock
// ==========================================

export const reduceStock = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (
      quantity === undefined ||
      quantity === null ||
      Number(quantity) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid quantity is required"
      });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (Number(product.stock) < Number(quantity)) {
      return res.status(400).json({
        success: false,
        message: "Insufficient product stock",
        availableStock: product.stock
      });
    }

    product.stock -= Number(quantity);

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product stock reduced successfully",
      productId: product._id,
      remainingStock: product.stock
    });

  } catch (error) {
    console.error("Reduce stock error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reduce product stock"
    });
  }
};


// ==========================================
// RESTORE PRODUCT STOCK
// PATCH /api/products/:id/restore-stock
// ==========================================

export const restoreStock = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (
      quantity === undefined ||
      quantity === null ||
      Number(quantity) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid quantity is required"
      });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    product.stock += Number(quantity);

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product stock restored successfully",
      productId: product._id,
      currentStock: product.stock
    });

  } catch (error) {
    console.error("Restore stock error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to restore product stock"
    });
  }
};


// ==========================================
// UPLOAD PRODUCT IMAGE TO AWS S3
// POST /api/products/:id/images
// ==========================================

export const uploadProductImage = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("REQ FILE:", req.file);

    // ------------------------------------------
    // Check Uploaded File
    // ------------------------------------------

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required"
      });
    }

    // ------------------------------------------
    // Check Product Exists
    // ------------------------------------------

    const product = await Product.findOne({
      _id: id,
      isActive: true
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // ------------------------------------------
    // Create Unique File Name
    // ------------------------------------------

    const fileName =
      `products/${Date.now()}-${req.file.originalname}`;

    // ------------------------------------------
    // Upload Image to S3
    // ------------------------------------------

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    });

    await s3Client.send(command);

    // ------------------------------------------
    // Generate S3 Image URL
    // ------------------------------------------

    const imageUrl =
      `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    // ------------------------------------------
    // Save Image URL in MongoDB
    // ------------------------------------------

    product.images.push(imageUrl);

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product image uploaded successfully",
      imageUrl,
      product
    });

  } catch (error) {
    console.error(
      "Upload product image error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to upload product image"
    });
  }
};