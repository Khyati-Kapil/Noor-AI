import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";

import corsConfig from "./config/cors.js";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

app.use(corsConfig);

app.use(cookieParser());

app.use(express.json());


app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ai", aiRoutes);

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

app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: "Endpoint not found" 
  });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ 
    success: false,
    message: "Internal server error" 
  });
});

export default app;

