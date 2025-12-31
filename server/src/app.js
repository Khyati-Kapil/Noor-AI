import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Noor AI API running");
});

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/ai", aiRoutes);

export default app;
