import cors from "cors";

const corsOptions = {
  origin: function (origin, callback) {

    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:5174", 
      "http://localhost:5175",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
      "http://127.0.0.1:5175",
     
      "https://noor-ai-owjj.vercel.app",
      
      "https://noor-ai-backend.onrender.com"
    ];
    
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

export default cors(corsOptions);


