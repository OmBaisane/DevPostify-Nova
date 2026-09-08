import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";

import healthRoutes from "./routes/health.routes";
import authRoutes from "./routes/auth.routes";
import postRoutes from "./routes/post.routes";
import profileRoutes from "./routes/profile.routes";
import bookmarkRoutes from "./routes/bookmark.routes";

import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Welcome to DevPostify Nova API",
  });
});

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/bookmarks", bookmarkRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
