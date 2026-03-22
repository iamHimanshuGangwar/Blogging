import express from "express";
import {
  generateResume,
  downloadResume,
  generateImage,
  generateTTS,
  generateBlogSummary,
  analyzeResume,
} from "../controllers/aiController.js";

const router = express.Router();

// Resume Builder Routes
router.post("/resume/generate", generateResume);
router.post("/resume/download", downloadResume);
router.post("/resume/analyze", analyzeResume);

// Image Generator Routes
router.post("/image/generate-image", generateImage);

// Server-side High Quality TTS
router.post('/tts', generateTTS);

// Blog Summary Route
router.post('/summary', generateBlogSummary);

export default router;
