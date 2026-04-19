import mongoose from "mongoose";

const dailyLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    waterIntake: {
      type: Number,
      default: 0,
      description: "Water consumed in liters or glasses",
    },
    sleepHours: {
      type: Number,
      default: 0,
      description: "Hours of sleep last night",
    },
    caloriesConsumed: {
      type: Number,
      default: 0,
      description: "Total calories consumed today",
    },
    mood: {
      type: String,
      enum: ["great", "good", "okay", "bad", "terrible"],
      default: "okay",
    },
  },
  { timestamps: true }
);

export default mongoose.model("DailyLog", dailyLogSchema);
