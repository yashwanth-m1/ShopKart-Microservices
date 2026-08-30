import express from "express";
import {
  register,
  login
} from "../controllers/authcontroller.js";
import { authenticate } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/profile", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected profile route",
    user: req.user
  });
});

export default router;