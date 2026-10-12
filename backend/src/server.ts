import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import bookmarkRoutes from "./routes/bookmark.routes.js";
import searchRoutes from "./routes/search.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import {
  generalLimiter,
  authLimiter,
  uploadLimiter,
  verifyRequestOrigin,
} from "./middleware/security.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Trust proxy for Render / Vercel reverse proxy IP tracking
app.set("trust proxy", 1);

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// Strict CORS setup using exact env.CLIENT_URL
app.use(
  cors({
    origin: env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));

// General Rate Limiting & Origin Verification for State Mutations
app.use("/api", generalLimiter);
app.use("/api", verifyRequestOrigin);

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res
    .status(200)
    .json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Mount Routes with specialized rate limits where critical
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/upload", uploadLimiter, uploadRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/search", searchRoutes);

// Global Error Handler
app.use(errorHandler);

const startServer = async () => {
  // If { connectDatabase } is a function (named or default), call it
  if (typeof { connectDatabase } === "function") {
    await connectDatabase();
  }
  app.listen(env.PORT, () => {
    console.log(`🚀 DevPostify Nova API running on port ${env.PORT}`);
  });
};

startServer();

export default app;
