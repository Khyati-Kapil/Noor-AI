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
  
      res.status(200).json({
        message: "Login successful",
        token
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

  
  