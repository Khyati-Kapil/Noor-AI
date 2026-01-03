import User from "../models/User.js";
import { calculateCalories } from "../utils/calculateCalories.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    const dailyCalories = calculateCalories({
      weight: user.weight,
      height: user.height,
      age: user.age,
      gender: user.gender,
      activityLevel: user.activityLevel,
      goal: user.primaryGoal
    });

    res.status(200).json({
      success: true,
      user,
      dailyCalories
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};
