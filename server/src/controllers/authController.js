import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

import { calculateCalories } from "../utils/calculateCalories.js";

export const registerUser = async (req, res) => {
    try {
      const {
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
        hairConcerns,
      } = req.body;
      const emailNormalized = req.body.email.trim().toLowerCase();

      if (!email || !password || !age || !height || !weight || !primaryGoal || !activityLevel) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const existingUser = await User.findOne({ email: emailNormalized })
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        email:emailNormalized,
        password: hashedPassword,
        age,
        height,
        weight,
        gender,
        primaryGoal,
        activityLevel,
        skinType,
        skinConcerns,
        hairType,
        hairConcerns,
      });
      const dailyCalories = calculateCalories({
        weight,
        height,
        age,
        gender,
        activityLevel,
        goal: primaryGoal,
      });
      res.status(201).json({
        message: "User registered successfully",
        userId: user._id,
        dailyCalories,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }

    
  };

  export const loginUser = async (req, res) => {
    try {
      const emailNormalized = req.body.email?.trim().toLowerCase();
      const { password } = req.body;
  
      if (!emailNormalized || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }
  
      const user = await User.findOne({ email: emailNormalized });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      const token = jwt.sign(
        { userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(200).json({
        message: "Login successful"
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

  // Redirect-based login for cookie flow
  export const loginRedirect = async (req, res) => {
    try {
      const { email, password } = req.query;
      const emailNormalized = email?.trim().toLowerCase();
  
      if (!emailNormalized || !password) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=missing`);
      }
  
      const user = await User.findOne({ email: emailNormalized });
      if (!user) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=invalid`);
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=invalid`);
      }
  
      const token = jwt.sign(
        { userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

      // Set cookie with lax SameSite for cross-origin redirect
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      // Redirect to dashboard
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard`);
    } catch (error) {
      console.error("Login redirect error:", error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=server`);
    }
  };

  // Check if user is authenticated via cookie
  export const checkAuth = async (req, res) => {
    try {
      const token = req.cookies?.token;
      
      if (!token) {
        return res.status(401).json({ message: "Not authenticated" });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
  
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
  
      res.status(200).json({ 
        message: "Authenticated",
        userId: user._id,
        email: user.email
      });
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  };

  // Logout user
  export const logoutUser = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: "Logged out successfully" });
  };

  
  