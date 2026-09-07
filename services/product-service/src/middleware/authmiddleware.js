// // import jwt from "jsonwebtoken";

// // // ==========================================
// // // AUTHENTICATION MIDDLEWARE
// // // ==========================================

// // export const authenticate = (req, res, next) => {
// //   try {
// //     const authHeader = req.headers.authorization;

// //     if (
// //       !authHeader ||
// //       !authHeader.startsWith("Bearer ")
// //     ) {
// //       return res.status(401).json({
// //         success: false,
// //         message: "Authentication required"
// //       });
// //     }

// //     const token = authHeader.split(" ")[1];

// //     const decoded = jwt.verify(
// //       token,
// //       process.env.JWT_SECRET
// //     );

// //     req.user = decoded;

// //     next();

// //   } catch (error) {
// //     console.error(
// //       "Authentication error:",
// //       error.message
// //     );

// //     return res.status(401).json({
// //       success: false,
// //       message: "Invalid or expired token"
// //     });
// //   }
// // };
// import jwt from "jsonwebtoken";

// // ==========================================
// // AUTHENTICATION MIDDLEWARE
// // ==========================================

// export const authenticate = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (
//       !authHeader ||
//       !authHeader.startsWith("Bearer ")
//     ) {
//       return res.status(401).json({
//         success: false,
//         message: "Authentication required"
//       });
//     }

//     const token = authHeader.split(" ")[1];

//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET
//     );

//     // Save logged-in user data
//     req.user = decoded;

//     next();

//   } catch (error) {
//     console.error(
//       "Authentication error:",
//       error.message
//     );

//     return res.status(401).json({
//       success: false,
//       message: "Invalid or expired token"
//     });
//   }
// };


// // ==========================================
// // ADMIN ONLY MIDDLEWARE
// // ==========================================

// export const adminOnly = (req, res, next) => {
//   try {
//     // Check whether authenticated user exists
//     if (!req.user) {
//       return res.status(401).json({
//         success: false,
//         message: "Authentication required"
//       });
//     }

//     // Check admin role
//     if (req.user.role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         message: "Admin access required"
//       });
//     }

//     next();

//   } catch (error) {
//     console.error(
//       "Admin authorization error:",
//       error.message
//     );

//     return res.status(500).json({
//       success: false,
//       message: "Authorization failed"
//     });
//   }
// };
import jwt from "jsonwebtoken";

// ==========================================
// AUTHENTICATE USER
// ==========================================

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    console.log("Authenticated user:", req.user);

    next();

  } catch (error) {
    console.error(
      "Authentication error:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};


// ==========================================
// ADMIN AUTHORIZATION
// ==========================================

export const adminOnly = (req, res, next) => {
  try {
    console.log("Admin check user:", req.user);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

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