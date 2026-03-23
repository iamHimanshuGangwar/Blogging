import express from "express";
import {
  searchJobs,
  getSalaryInsights,
  getTrendingCompanies,
  getCategories,
  getJobDetails,
  healthCheck,
} from "../controllers/adzunaController.js";

const router = express.Router();

/**
 * Adzuna Job Search Routes
 * Public routes - no authentication required
 */

// Health check endpoint
router.get("/health", healthCheck);

// Search jobs
router.get("/search", searchJobs);

// Get salary insights
router.get("/salary", getSalaryInsights);

// Get trending companies
router.get("/trending-companies", getTrendingCompanies);

// Get job categories
router.get("/categories", getCategories);

// Get job details by ID
router.get("/jobs/:jobId", getJobDetails);

export default router;
