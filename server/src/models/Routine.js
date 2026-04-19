import mongoose from "mongoose";

const routineSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["skincare", "haircare", "fitness", "diet"],
      required: true,
    },
    steps: [
      {
        order: Number,
        title: String,
        description: String,
        timeOfDay: {
          type: String,
          enum: ["morning", "afternoon", "evening", "night", "anytime"],
          default: "anytime",
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Routine", routineSchema);
