import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables FIRST before importing anything that needs them
// Use explicit path to ensure .env is loaded from server directory
const envPath = path.join(__dirname, '.env');
console.log('[SERVER] Loading .env from:', envPath);
console.log('[SERVER] .env exists:', fs.existsSync(envPath));
const envResult = dotenv.config({ 
  path: envPath,
  quiet: false
});
console.log('[SERVER] dotenv.config result:', envResult.error ? 'ERROR: ' + envResult.error.message : 'SUCCESS');
console.log('[SERVER] Loaded env vars count:', Object.keys(process.env).filter(k => k.includes('IMAGEKIT') || k.includes('ADZUNA') || k.includes('MONGODB')).length);

// NOW import routes that depend on env vars
const { connectDB } = await import("./configs/db.js");
const authRouter = (await import("./routes/authRoutes.js")).default;
const adminRouter = (await import("./routes/adminRoutes.js")).default;
const blogRouter = (await import("./routes/blogRoutes.js")).default;
const imageRouter = (await import("./routes/imageRoutes.js")).default;
const aiRouter = (await import("./routes/aiRoutes.js")).default;
const subscribeRouter = (await import("./routes/subscribeRoutes.js")).default;
const featureRouter = (await import("./routes/featureRoutes.js")).default;
const uploadRouter = (await import("./routes/uploadRoutes.js")).default;
const jobPortalAuthRouter = (await import("./routes/jobPortalAuthRoutes.js")).default;
const { subscribe: subscribeHandler, unsubscribe: unsubscribeHandler } = await import("./controllers/subscriberController.js");
const jobRouter = (await import("./routes/jobRoutes.js")).default;
const jobListingRouter = (await import("./routes/jobListingRoutes.js")).default;
const userRouter = (await import("./routes/userRoutes.js")).default;
const adzunaRouter = (await import("./routes/adzunaRoutes.js")).default;
const notificationRouter = (await import("./routes/notificationRoutes.js")).default;

async function startServer() {

const app = express();
// Middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for PDF downloads)
app.use('/downloads', express.static(path.join(__dirname, 'uploads')));
// Connect to DB
connectDB();

// Default route
app.get("/", (req, res) => {
  res.send("Backend is running.");
});

// API Routes
app.use("/api/auth", authRouter);      // /api/auth/*
app.use("/api/admin", adminRouter);    // /api/admin/*
app.use("/api/add", blogRouter);       // /api/add/*
app.use("/api/image", imageRouter);    // /api/image/*
app.use("/api/ai", aiRouter);          // /api/ai/*
app.use("/api/subscribe", subscribeRouter); // /api/subscribe
app.use("/api/features", featureRouter); // /api/features
app.use("/api/uploads", uploadRouter); // /api/uploads (resume uploads)
app.use("/api/job-auth", jobPortalAuthRouter); // /api/job-auth (job portal auth)
app.use("/api/jobs", jobRouter); // /api/jobs (applications)
app.use("/api/job-listings", jobListingRouter); // /api/job-listings (postings)
app.use("/api/user", userRouter); // /api/user (profile, resume)
app.use("/api/adzuna", adzunaRouter); // /api/adzuna (Adzuna job search)
app.use("/api", notificationRouter); // /api/notifications (notifications)

// Serve client build (if present) and add SPA fallback for non-API routes
const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));

  // For any non-API route, serve the client's index.html so client-side router can handle it
  app.use((req, res, next) => {
    if (req.path && req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// Backup direct route in case router mounting fails or server wasn't restarted after deploys
app.post('/api/subscribe', express.json(), subscribeHandler);
app.get('/api/subscribe/unsubscribe', unsubscribeHandler);

// Ensure API routes always return JSON on 404 (avoid HTML error page breaking client JSON parsing)
app.use((req, res, next) => {
  if (req.path && req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, message: `Cannot ${req.method} ${req.path}` });
  }
  next();
});

// Global error handler (returns JSON for API errors)
app.use((err, req, res, next) => {
  console.error('Global error handler:', err && err.stack ? err.stack : err);
  if (req.path && req.path.startsWith('/api/')) {
    return res.status(err.status || 500).json({ success: false, message: err.message || 'Server error' });
  }
  next(err);
});
// Server Port
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

return app;
}

// Start the server
startServer().catch(err => {
  console.error('[SERVER] Failed to start:', err);
  process.exit(1);
});

export default null;
