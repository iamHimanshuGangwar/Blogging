import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getAllJobsAdmin,
  createJobByEmployer,
} from "../controllers/jobListingController.js";

const router = express.Router();

// Public routes
router.get("/all-jobs", getAllJobs);
router.get("/:jobId", getJobById);

// Employer routes (for Job Portal users)
router.post("/create-employer", createJobByEmployer);

// Admin routes
router.post("/create", auth, createJob);
router.put("/:jobId", auth, updateJob);
router.delete("/:jobId", auth, deleteJob);
router.get("/admin/list", auth, getAllJobsAdmin);

export default router;
