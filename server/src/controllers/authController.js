import bcrypt from "bcrypt";
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

      if (!email || !password || !age || !height || !weight || !primaryGoal || !activityLevel) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const existingUser = await User.findOne({email})
      if({existingUser}){
        return res.status(409).json({ message: "User already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        email,
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
  
  