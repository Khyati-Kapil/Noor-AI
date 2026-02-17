import cors from "cors";

const corsOptions = {
  origin: function (origin, callback) {

    
    if (!origin) return callback(null, true);

    const allowed = 
      origin.includes("localhost") ||
      origin.includes("127.0.0.1") ||
      origin.endsWith("vercel.app");

    if (allowed) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(null, false);  
    }
  },
  credentials: true
};

export default cors(corsOptions);
