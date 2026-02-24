import User from "../models/user.js";
import imagekit from "../configs/imagekit.js";

// UPLOAD RESUME
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Upload to ImageKit
    const fileBuffer = req.file.buffer;
    const fileName = `${user._id}_${Date.now()}_${req.file.originalname}`;

    const uploadResponse = await imagekit.upload({
      file: fileBuffer,
      fileName: fileName,
      folder: "/resumes",
      useUniqueFileName: false,
    });

    // Save resume URL to user
    user.resume = uploadResponse.url;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      resumeUrl: uploadResponse.url,
    });
  } catch (error) {
    console.error("Resume upload error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to upload resume" });
  }
};

// GET USER PROFILE
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        lastname: user.lastname,
        resume: user.resume || null,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
