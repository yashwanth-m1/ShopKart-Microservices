// ==========================================
// ADMIN AUTHORIZATION MIDDLEWARE
// ==========================================

export const authorizeAdmin = (req, res, next) => {
  try {
    // req.user is added by authenticate middleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    // Check user role
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Admin access required"
      });
    }

    next();

  } catch (error) {
    console.error(
      "Admin authorization error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Authorization failed"
    });
  }
};