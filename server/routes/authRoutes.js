import express from "express";
import { register, verifyOTP, login, refreshToken, changePassword, deleteAccount } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.put("/change-password", authenticateToken, changePassword);
router.delete("/delete-account", authenticateToken, deleteAccount);

export default router;
