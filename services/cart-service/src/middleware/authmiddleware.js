// import jwt from "jsonwebtoken";

// export const authenticate = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.status(401).json({
//         success: false,
//         message: "Authorization header is required"
//       });
//     }

//     if (!authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid authorization format"
//       });
//     }

//     const token = authHeader.split(" ")[1];

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Token is required"
//       });
//     }

//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET
//     );

//     req.user = decoded;

//     next();
//   } catch (error) {
//     console.error("Authentication error:", error.message);

//     return res.status(401).json({
//       success: false,
//       message: "Invalid or expired token"
//     });
//   }
// };

import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header is required"
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format"
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is required"
      });
    }

    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
    console.log(
      "JWT_SECRET length:",
      process.env.JWT_SECRET?.length
    );

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("Decoded JWT:", decoded);

    req.user = decoded;

    next();

  } catch (error) {

    console.error("JWT ERROR NAME:", error.name);
    console.error("JWT ERROR MESSAGE:", error.message);

    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
};