import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";

// Import safe CORS config for PDF/sandboxed iframes
import corsConfig from "./config/cors.js";

// Import routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

// Use safe CORS for origin = null (PDF/sandboxed iframes)
app.use(corsConfig);

// Cookie parser for HTTP-only cookies
app.use(cookieParser());

// JSON body parser
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ai", aiRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({ 
    name: "Noor AI API", 
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      user: "/api/user",
      ai: "/api/ai"
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: "Endpoint not found" 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ 
    success: false,
    message: "Internal server error" 
  });
});

export default app;

