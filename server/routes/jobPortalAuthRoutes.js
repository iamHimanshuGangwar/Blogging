import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  updatePreferences,
  updateNotifications,
  updatePrivacy,
} from "../controllers/jobPortalAuthController.js";

const router = express.Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);

// Profile routes
router.get("/profile", getProfile);
router.put("/profile/:id", updateProfile);

// Settings routes
router.put("/preferences/:id", updatePreferences);
router.put("/notifications/:id", updateNotifications);
router.put("/privacy/:id", updatePrivacy);

export default router;
