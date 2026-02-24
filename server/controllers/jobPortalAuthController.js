import JobPortalUser from "../models/JobPortalUser.js";
import jwt from "jsonwebtoken";

/**
 * Register a new job portal user
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, role = "job_seeker" } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Check if user already exists
    const existingUser = await JobPortalUser.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Create new user
    const user = new JobPortalUser({
      name,
      email: email.toLowerCase(),
      password,
      role,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "your_secret_key",
      { expiresIn: "30d" }
    );

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error registering user",
    });
  }
};

/**
 * Login to job portal
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await JobPortalUser.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "your_secret_key",
      { expiresIn: "30d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error logging in",
    });
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");

    // Find user
    const user = await JobPortalUser.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching profile",
    });
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, company, phone, role } = req.body;

    const user = await JobPortalUser.findByIdAndUpdate(
      id,
      {
        name,
        company,
        phone,
        role,
      },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error updating profile",
    });
  }
};

/**
 * Update user preferences
 */
export const updatePreferences = async (req, res) => {
  try {
    const { id } = req.params;
    const { jobTypes, industries, locations, salary } = req.body;

    const user = await JobPortalUser.findByIdAndUpdate(
      id,
      {
        preferences: {
          jobTypes: jobTypes || [],
          industries: industries || [],
          locations: locations || [],
          salary: salary || {},
        },
      },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Update preferences error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error updating preferences",
    });
  }
};

/**
 * Update notification settings
 */
export const updateNotifications = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, jobRecommendations, applicationUpdates } = req.body;

    const user = await JobPortalUser.findByIdAndUpdate(
      id,
      {
        notifications: {
          email: email !== undefined ? email : true,
          jobRecommendations: jobRecommendations !== undefined ? jobRecommendations : true,
          applicationUpdates: applicationUpdates !== undefined ? applicationUpdates : true,
        },
      },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Update notifications error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error updating notifications",
    });
  }
};

/**
 * Update privacy settings
 */
export const updatePrivacy = async (req, res) => {
  try {
    const { id } = req.params;
    const { profileVisible, showEmail, allowEmails } = req.body;

    const user = await JobPortalUser.findByIdAndUpdate(
      id,
      {
        privacy: {
          profileVisible: profileVisible !== undefined ? profileVisible : true,
          showEmail: showEmail !== undefined ? showEmail : false,
          allowEmails: allowEmails !== undefined ? allowEmails : true,
        },
      },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Update privacy error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error updating privacy settings",
    });
  }
};
