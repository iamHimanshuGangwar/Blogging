import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const jobPortalUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    company: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["job_seeker", "employer"],
      default: "job_seeker",
    },
    phone: {
      type: String,
      default: null,
    },
    resume: {
      url: String,
      fileId: String,
      fileName: String,
      uploadedAt: Date,
    },
    preferences: {
      jobTypes: [String],
      industries: [String],
      locations: [String],
      salary: {
        min: Number,
        max: Number,
      },
    },
    notifications: {
      email: {
        type: Boolean,
        default: true,
      },
      jobRecommendations: {
        type: Boolean,
        default: true,
      },
      applicationUpdates: {
        type: Boolean,
        default: true,
      },
    },
    privacy: {
      profileVisible: {
        type: Boolean,
        default: true,
      },
      showEmail: {
        type: Boolean,
        default: false,
      },
      allowEmails: {
        type: Boolean,
        default: true,
      },
    },
    appliedJobs: [
      {
        jobId: mongoose.Schema.Types.ObjectId,
        appliedAt: Date,
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
jobPortalUserSchema.pre("save", async function (next) {
  // Only hash if password is new or modified
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
jobPortalUserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

export default mongoose.model("JobPortalUser", jobPortalUserSchema);
