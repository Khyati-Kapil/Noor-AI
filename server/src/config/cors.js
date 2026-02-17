import cors from "cors";

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174", 
    "http://localhost:5175",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

export default cors(corsOptions);


