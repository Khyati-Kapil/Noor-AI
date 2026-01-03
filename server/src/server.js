import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/noor-ai";


mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    

    app.listen(PORT, () => {
      console.log(` Noor AI API running on http://localhost:${PORT}`);

    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });


