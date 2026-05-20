# Noor-AI

Noor-AI is a full-stack wellness platform that provides personalized guidance for nutrition, skincare, haircare, hydration, and daily routine tracking.

The project includes:
- A React + Vite frontend (`client`)
- An Express + MongoDB backend (`server`)
- AI-assisted endpoints for meal analysis and wellness Q&A
- JWT authentication with optional Google Sign-In

## Core Features

- User registration and login
- Google OAuth login integration
- Protected dashboard for authenticated users
- Meal text analysis with estimated calories
- Ask Noor assistant for wellness Q&A
- Streaming chat response endpoint (SSE)
- Food photo analysis endpoint
- Skincare and haircare routine pages
- Dark mode support with light mode as default

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Axios
- Lucide React

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- Google Auth Library
- Hugging Face Inference API
- Google GenAI API (for image-based food analysis route)

## Project Structure

```text
Noor-AI/
  client/
    src/
    package.json
  server/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      app.js
      server.js
    package.json
  README.md
```

## Local Setup

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB (local or cloud URI)

### 1. Clone

```bash
git clone https://github.com/Khyati-Kapil/Noor-AI.git
cd Noor-AI
```

### 2. Install dependencies

```bash
cd client && npm install
cd ../server && npm install
```

### 3. Configure environment variables

Create `server/.env` with:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/noor-ai
JWT_SECRET=replace_with_strong_secret
GOOGLE_CLIENT_ID=your_google_client_id
HF_API_KEY=your_huggingface_api_key
HF_FAST_MODE=true
GEMINI_API_KEY=your_gemini_api_key
```

Notes:
- `HF_FAST_MODE=true` uses fast fallback behavior for chat/meal routes.
- Set `HF_FAST_MODE=false` to force Hugging Face inference usage.
- If Mongo is unavailable, server currently starts in degraded mode.

### 4. Run backend

```bash
cd server
npm run dev
```

Backend runs on: `http://localhost:5000`

### 5. Run frontend

```bash
cd client
npm run dev
```

Frontend runs on: `http://localhost:5173`

## API Overview

Base URL: `http://localhost:5000`

### Health
- `GET /health`

### Auth (`/api/auth`)
- `POST /register`
- `POST /login`
- `POST /google`
- `GET /google-config`
- `POST /logout`
- `GET /me`

### User (`/api/user`)
- `GET /profile` (protected)

### AI (`/api/ai`)
- `POST /analyze-meal` (protected)
- `POST /ask` (protected)
- `POST /chat/stream` (protected, SSE stream)
- `POST /analyze-food-photo` (protected, multipart image upload)

## Authentication Flow

1. User logs in through email/password or Google.
2. Backend validates credentials/token and issues JWT.
3. Frontend stores auth token and sends it in `Authorization: Bearer <token>` headers.
4. Protected routes and APIs validate token via middleware.

## AI Integration Summary

- Hugging Face `chatCompletion` is used in wellness Q&A and meal estimation routes.
- Caching is applied to reduce repeated inference latency.
- Fallback logic returns deterministic wellness guidance when AI is unavailable.
- Streaming endpoint sends incremental tokens over SSE for real-time response rendering.

## Deployment Notes

- Frontend can be deployed on Vercel.
- Backend can be deployed on Render.
- If Vercel root directory error appears, set Root Directory to `client`.
- Ensure frontend API base URL points to deployed backend.

## Scripts

### Client
- `npm run dev` - start dev server
- `npm run build` - create production build
- `npm run preview` - preview production build

### Server
- `npm run dev` - start backend with nodemon
- `npm start` - start backend with node

## Current Limitations

- Single primary user model; data model can be expanded for production use cases.
- Background jobs/queues are not yet added.
- Advanced analytics module is not yet implemented.

## Roadmap

- Weekly analytics with trend charts and streak metrics
- RAG-based wellness knowledge module with source-grounded responses
- Better observability (logs, metrics, tracing)
- Test coverage (unit + integration + E2E)

## License

This project is currently unlicensed. Add a license file if you plan to distribute or open source it formally.
