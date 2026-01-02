import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173", 
    "http://localhost:3000",
    "https://noor-ai.khyatikapil.dev",
    "https://noor-ai.vercel.app",
    "https://noor-ai-owjj.vercel.app/"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Security headers to prevent clickjacking and sandbox issues
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.removeHeader('X-Powered-By');
  next();
});

app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Noor AI API running");
});

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/ai", aiRoutes);

export default app;
