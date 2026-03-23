import express from "express";
import multer from "multer";
import imagekit from "../configs/imagekit.js";

const router = express.Router();

// Setup multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF, DOC, and DOCX are allowed."));
    }
  },
});

/**
 * POST /api/uploads/resume
 * Upload resume file to ImageKit
 */
router.post("/resume", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: req.file.buffer,
      fileName: `resume_${userId}_${Date.now()}_${req.file.originalname}`,
      folder: "/resumes",
      tags: ["resume", userId],
      isPrivateFile: false,
      customMetadata: {
        userId,
        uploadedAt: new Date().toISOString(),
      },
    });

    res.json({
      success: true,
      message: "Resume uploaded successfully",
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
      fileName: uploadResponse.name,
      size: uploadResponse.size,
      uploadedAt: new Date(),
    });
  } catch (error) {
    console.error("Resume upload error:", error);

    if (error.message.includes("Invalid file type")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message.includes("File size too large")) {
      return res.status(413).json({
        success: false,
        message: "File size exceeds 5MB limit",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload resume",
    });
  }
});

/**
 * DELETE /api/uploads/resume/:fileId
 * Delete resume file from ImageKit
 */
router.delete("/resume/:fileId", async (req, res) => {
  try {
    const { fileId } = req.params;

    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: "File ID is required",
      });
    }

    // Delete from ImageKit
    await imagekit.deleteFile(fileId);

    res.json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("Resume deletion error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete resume",
    });
  }
});

/**
 * GET /api/uploads/auth-signature
 * Get authentication signature for client-side upload (optional)
 */
router.get("/auth-signature", (req, res) => {
  try {
    const signature = imagekit.getAuthenticationParameters();

    res.json({
      success: true,
      ...signature,
    });
  } catch (error) {
    console.error("Auth signature error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to get authentication",
    });
  }
});

export default router;
