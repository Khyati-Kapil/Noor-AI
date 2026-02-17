import cors from "cors";

const corsOptions = {
  origin: function (origin, callback) {

    if (!origin) return callback(null, true); // allow server-to-server

    if (
      origin.includes("localhost") ||
      origin.includes("127.0.0.1") ||
      origin.includes("vercel.app")
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
};

export default cors(corsOptions);
