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

    age: { type: Number, required: true },
    height: { type: Number, required: true }, 
    weight: { type: Number, required: true }, 
    gender: { type: String, enum: ["male", "female", "other"] },

    primaryGoal: {
      type: String,
      enum: ["loss", "gain", "maintain", "skin", "hair", "wellness"],
      required: true,
    },
    activityLevel: {
        type: String,
        enum: ["light", "moderate", "active"],
        required: true,
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

