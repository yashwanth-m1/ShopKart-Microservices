import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check Authorization header
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header is required"
      });
    }

    // Check Bearer format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format"
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is required"
      });
    }

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Store decoded user information
    req.user = decoded;

    next();

  } catch (error) {
    console.error(
      "Order authentication error:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};