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
      hairConcerns
    } = req.body;

    if (!email || !password || !age || !height || !weight || !primaryGoal || !activityLevel) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const emailNormalized = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: emailNormalized });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    const user = await User.create({
      email: emailNormalized,
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
      hairConcerns
    });

    const dailyCalories = calculateCalories({
      weight,
      height,
      age,
      gender,
      activityLevel,
      goal: primaryGoal
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
      dailyCalories
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginRedirect = async (req, res) => {
  try {
    const email = req.query.email?.trim().toLowerCase();
    const password = String(req.query.password || "");

    if (!email || !password) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=missing`);
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=invalid`);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=invalid`);
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  } catch (err) {
    console.error("Login redirect error:", err);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=server`);
  }
};

export const checkAuth = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(401).json({ message: "User not found" });

    res.json({
      authenticated: true,
      userId: user._id,
      email: user.email
    });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};


export const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

export const registerRedirect = async (req, res) => {
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
      hairConcerns
    } = req.query;

    if (!email || !password || !age || !height || !weight || !primaryGoal || !activityLevel) {
      return res.redirect(`${process.env.FRONTEND_URL}/register?error=missing`);
    }

    const emailNormalized = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: emailNormalized });
    if (existingUser) {
      return res.redirect(`${process.env.FRONTEND_URL}/register?error=exists`);
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    const user = await User.create({
      email: emailNormalized,
      password: hashedPassword,
      age: Number(age),
      height: Number(height),
      weight: Number(weight),
      gender,
      primaryGoal,
      activityLevel,
      skinType,
      skinConcerns: skinConcerns?.split(",") || [],
      hairType,
      hairConcerns: hairConcerns?.split(",") || []
    });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  } catch (err) {
    console.error("Register redirect error:", err);
    res.redirect(`${process.env.FRONTEND_URL}/register?error=server`);
  }
};
