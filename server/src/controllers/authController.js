import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const TOKEN_EXPIRY = "7d";

// Helper to set HTTP-only cookie
const setTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === "production";
  const isSecure = process.env.NODE_ENV === "production";
  
  res.cookie("token", token, {
    httpOnly: true,
    secure: isSecure, // true for production HTTPS
    sameSite: isProduction ? "none" : "lax", // none for cross-origin (production), lax for local
    partitioned: false,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/"
  });
};

// Helper to clear cookie
const clearTokenCookie = (res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/"
  });
};

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

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    // Set cookie
    setTokenCookie(res, token);

    // Return success (NO redirects)
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dailyCalories: user.dailyCalories
      }
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
    if (!user || !user.password) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    const isMatch = await bcrypt.compare(String(password), user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    setTokenCookie(res, token);

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dailyCalories: user.dailyCalories
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error during login" 
    });
  }
};

// Logout user
export const logoutUser = (req, res) => {
  clearTokenCookie(res);
  res.json({ 
    success: true,
    message: "Logged out successfully" 
  });
};

// Check authentication status
export const checkAuth = async (req, res) => {
  try {
    const token = req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Not authenticated",
        authenticated: false
      });
    }

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

