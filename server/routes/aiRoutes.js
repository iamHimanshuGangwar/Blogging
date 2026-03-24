import express from "express";
import {
  generateResume,
  downloadResume,
  generateImage,
  generateTTS,
  generateBlogSummary,
  analyzeResume,
  generateBlogContent,
} from "../controllers/aiController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

// Resume Builder Routes
router.post("/resume/generate", generateResume);
router.post("/resume/download", downloadResume);
router.post("/resume/analyze", analyzeResume);

// Image Generator Routes
router.post("/image/generate-image", generateImage);

// Server-side High Quality TTS
router.post('/tts', generateTTS);

// Blog Routes
router.post('/summary', generateBlogSummary);
router.post('/blog/generate-content', auth, generateBlogContent);

export default router;
