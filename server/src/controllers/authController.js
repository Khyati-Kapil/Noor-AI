import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const TOKEN_EXPIRY = "7d";
const googleClient = process.env.GOOGLE_CLIENT_ID ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID) : null;

/**
 * Generate JWT token for user
 * @param {string} userId - The user ID to encode in the token
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
};

const normalizeOptionalProfile = (payload = {}) => ({
  age: Number(payload.age) || 24,
  height: Number(payload.height) || 165,
  weight: Number(payload.weight) || 60,
  gender: payload.gender || "other",
  primaryGoal: payload.primaryGoal || "wellness",
  activityLevel: payload.activityLevel || "moderate",
  skinType: payload.skinType || "normal",
  skinConcerns: Array.isArray(payload.skinConcerns) ? payload.skinConcerns : [],
  hairType: payload.hairType || "normal",
  hairConcerns: Array.isArray(payload.hairConcerns) ? payload.hairConcerns : []
});

const authUserPayload = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email
});

// Register new user
export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      age,
      height,
      weight,
      gender,
      primaryGoal,
      activityLevel,
      skinType,
      skinConcerns,
      hairType,
      hairConcerns
    } = req.body;

    // Validate required fields
    if (!email || !password || !age || !height || !weight || !primaryGoal || !activityLevel) {
      return res.status(400).json({ 
        success: false,
        message: "Missing required fields" 
      });
    }

    // Normalize email
    const emailNormalized = email.trim().toLowerCase();

    // Check if user exists
    const existingUser = await User.findOne({ email: emailNormalized });
    if (existingUser) {
      return res.status(409).json({ 
        success: false,
        message: "User already exists" 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(String(password), 12);

    // Create user
    const user = await User.create({
      name: name?.trim() || "",
      email: emailNormalized,
      password: hashedPassword,
      age: Number(age),
      height: Number(height),
      weight: Number(weight),
      gender,
      primaryGoal,
      activityLevel,
      skinType,
      skinConcerns: skinConcerns || [],
      hairType,
      hairConcerns: hairConcerns || []
    });

    // Generate JWT token
    const token = generateToken(user._id);

    // Return success with token in body (no cookies)
    res.status(201).json({
      success: true,
      token,
      user: authUserPayload(user)
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error during registration" 
    });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email and password required" 
      });
    }

    const emailNormalized = email.trim().toLowerCase();
    
    const user = await User.findOne({ email: emailNormalized });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "This account uses Google sign in. Please continue with Google."
      });
    }

    const isMatch = await bcrypt.compare(String(password), user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Return token in body (no cookies)
    res.json({
      success: true,
      token,
      user: authUserPayload(user)
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error during login" 
    });
  }
};

// Login/Register with Google ID token
export const googleLogin = async (req, res) => {
  try {
    const { idToken, profile = {} } = req.body || {};

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "Google credential token is required"
      });
    }

    if (!googleClient) {
      return res.status(500).json({
        success: false,
        message: "Google sign in is not configured on server"
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload?.email || !payload?.sub) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google token"
      });
    }

    const emailNormalized = payload.email.trim().toLowerCase();
    let user = await User.findOne({ email: emailNormalized });
    const defaults = normalizeOptionalProfile(profile);

    if (!user) {
      user = await User.create({
        name: payload.name || profile.name || "Noor User",
        email: emailNormalized,
        password: null,
        authProvider: "google",
        googleId: payload.sub,
        ...defaults
      });
    } else {
      const updates = {};
      if (!user.googleId) updates.googleId = payload.sub;
      if (user.authProvider !== "google") updates.authProvider = "google";
      if (!user.name && payload.name) updates.name = payload.name;
      if (Object.keys(updates).length > 0) {
        user = await User.findByIdAndUpdate(user._id, updates, { new: true });
      }
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      token,
      user: authUserPayload(user)
    });
  } catch (err) {
    console.error("Google login error:", err);
    return res.status(401).json({
      success: false,
      message: "Google authentication failed"
    });
  }
};

export const getGoogleAuthConfig = (_req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  return res.json({
    success: true,
    configured: Boolean(clientId),
    clientId
  });
};

// Logout user
// Note: No server-side action needed for header-based auth
// Client simply clears the token from memory
export const logoutUser = (req, res) => {
  res.json({ 
    success: true,
    message: "Logged out successfully" 
  });
};

// Check authentication status
export const checkAuth = async (req, res) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        success: false,
        message: "Not authenticated",
        authenticated: false
      });
    }

    const token = authHeader.split(" ")[1];
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "User not found",
        authenticated: false
      });
    }

    res.json({
      success: true,
      authenticated: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        height: user.height,
        weight: user.weight,
        gender: user.gender,
        primaryGoal: user.primaryGoal,
        activityLevel: user.activityLevel,
        skinType: user.skinType,
        skinConcerns: user.skinConcerns,
        hairType: user.hairType,
        hairConcerns: user.hairConcerns,
        dailyCalories: user.dailyCalories
      }
    });
  } catch (err) {
    console.error("Auth check error:", err);
    res.status(401).json({ 
      success: false,
      message: "Invalid or expired token",
      authenticated: false
    });
  }
};
