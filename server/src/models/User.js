import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
      },
    password: { type: String, default: null },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
    googleId: { type: String, unique: true, sparse: true },

    age: { type: Number, default: 24 },
    height: { type: Number, default: 165 }, 
    weight: { type: Number, default: 60 }, 
    gender: { type: String, enum: ["male", "female", "other"], default: "other" },

    primaryGoal: {
      type: String,
      enum: ["loss", "gain", "maintain", "skin", "hair", "wellness"],
      default: "wellness",
    },
    activityLevel: {
        type: String,
        enum: ["light", "moderate", "active"],
        default: "moderate",
      },
      sleepHours: Number,
      waterIntake: Number,

    skinType: {
      type: String,
      enum: ["dry", "oily", "combination", "normal"],
    },
    skinConcerns: [String],

    hairType: {
      type: String,
      enum: ["dry", "oily", "normal", "combination"],
    },
    hairConcerns: [String],
  },
  
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
