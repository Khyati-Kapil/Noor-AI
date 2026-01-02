import cors from "cors";

// Safe CORS config for PDF/sandboxed iframes with origin = null
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like PDFs, file://, sandboxed iframes)
    // Also allow localhost for development
    if (!origin || 
        origin.startsWith('http://localhost') ||
        origin.startsWith('http://127.0.0.1') ||
        origin === 'null' ||
        origin === undefined) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie']
};

export default cors(corsOptions);

