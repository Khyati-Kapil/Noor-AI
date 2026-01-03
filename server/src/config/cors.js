import cors from "cors";

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://noor-ai.khyatikapil.dev",
    "https://noor-ai-owjj.vercel.app"
  ],
  credentials: true
};

export default cors(corsOptions);


