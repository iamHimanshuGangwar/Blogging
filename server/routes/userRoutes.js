import express from "express";
import { uploadResume, getUserProfile } from "../controllers/userController.js";
import { authenticateToken } from "../middlewares/auth.js";
import uploadResumeMiddleware from "../middlewares/uploadResume.js";

const router = express.Router();

// Get user profile
router.get("/profile", authenticateToken, getUserProfile);

// Upload resume
router.post("/upload-resume", authenticateToken, uploadResumeMiddleware.single("resume"), uploadResume);

export default router;
