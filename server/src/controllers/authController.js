import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const TOKEN_EXPIRY = "7d";

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
      user: {
        id: user._id,
        name: user.name,
        email: user.email
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

    // Generate JWT token
    const token = generateToken(user._id);

    // Return token in body (no cookies)
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
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

