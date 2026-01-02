import express from "express";
import { registerUser, loginUser, logoutUser, checkAuth } from "../controllers/authController.js";

const router = express.Router();

// All routes are JSON-only - NO redirects
// All routes work with origin = null (PDF/sandboxed iframes)

// Register new user
// POST /api/auth/register
// Body: { name, email, password, age, height, weight, gender, primaryGoal, activityLevel, skinType, skinConcerns, hairType, hairConcerns }
router.post("/register", registerUser);

// Login user
// POST /api/auth/login
// Body: { email, password }
router.post("/login", loginUser);

// Logout user
// POST /api/auth/logout
router.post("/logout", logoutUser);

// Check authentication status
// GET /api/auth/me
// Returns user info if authenticated, 401 if not
router.get("/me", checkAuth);

export default router;

