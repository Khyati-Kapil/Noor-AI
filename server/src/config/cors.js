import cors from "cors";

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://noor-ai.khyatikapil.dev"
  ],
  credentials: true
};

export default cors(corsOptions);


