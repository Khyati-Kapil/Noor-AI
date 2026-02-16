import express from "express";
import axios from "axios";

const router = express.Router();

const HF_TIMEOUT_MS = Number(process.env.HF_TIMEOUT_MS) || 9000;
const HF_FAST_MODE = process.env.HF_FAST_MODE !== "false";
const CACHE_TTL_MS = 10 * 60 * 1000;

const hfClient = axios.create({
  baseURL: "https://api-inference.huggingface.co",
  headers: {
    Authorization: `Bearer ${process.env.HF_API_KEY}`,
    "Content-Type": "application/json"
  },
  timeout: HF_TIMEOUT_MS
});

const responseCache = new Map();

const getCached = (key) => {
  const item = responseCache.get(key);
  if (!item) return null;
  if (Date.now() - item.timestamp > CACHE_TTL_MS) {
    responseCache.delete(key);
    return null;
  }
  return item.value;
};

const setCached = (key, value) => {
  responseCache.set(key, { value, timestamp: Date.now() });
};

function estimateCaloriesBasic(mealText) {
  const text = mealText.toLowerCase();

  const calorieMap = {
    roti: 120,
    chapati: 120,
    rice: 130,
    dal: 150,
    curry: 200,
    chicken: 250,
    fish: 200,
    vegetable: 80,
    salad: 50,
    bread: 80,
    butter: 100,
    cheese: 110,
    egg: 70,
    milk: 60,
    yogurt: 80,
    fruit: 60,
    apple: 95,
    banana: 105,
    orange: 60,
    pizza: 285,
    burger: 350,
    pasta: 220,
    noodle: 200,
    soup: 100,
    sandwich: 300
  };

  let totalCalories = 0;
  const foundFoods = [];

  Object.keys(calorieMap).forEach((food) => {
    const regex = new RegExp(`\\b${food}\\w*\\b`, "gi");
    const matches = text.match(regex);
    if (matches) {
      const count = matches.length;
      totalCalories += calorieMap[food] * count;
      foundFoods.push(`${count} ${food}${count > 1 ? "s" : ""}`);
    }
  });

  if (totalCalories === 0) {
    totalCalories = 300;
    foundFoods.push("meal items");
  }

  return {
    foods: foundFoods,
    calories: Math.round(totalCalories)
  };
}

const buildMealResponse = (mealText, estimation, source = "fast") => ({
  success: true,
  analysis: `Meal: ${mealText}\nFoods: ${estimation.foods.join(", ")}\nEstimated Calories: ${estimation.calories} kcal (${source})`,
  calories: estimation.calories
});

const buildFallbackReply = (question) => {
  const q = question.toLowerCase();

  if (q.includes("weight loss") || q.includes("lose weight")) {
    return "Try a 300-500 calorie deficit, increase protein and fiber, walk daily, and prioritize 7-8 hours of sleep.";
  }
  if (q.includes("acne") || q.includes("skin")) {
    return "Use a gentle cleanser, non-comedogenic moisturizer, and SPF every morning. Add actives slowly and stay consistent.";
  }
  if (q.includes("hair") || q.includes("frizz")) {
    return "Use sulfate-free shampoo, condition well, reduce heat styling, and add a leave-in or serum for frizz control.";
  }
  if (q.includes("diet") || q.includes("eating") || q.includes("meal")) {
    return "Focus on whole foods, include protein at each meal, and keep hydration and meal timing consistent.";
  }
  if (q.includes("sleep")) {
    return "Set a fixed bedtime, avoid heavy meals late night, reduce screen exposure before sleep, and keep your room cool and dark.";
  }

  return "I can help with nutrition, skincare, haircare, sleep, and fitness. Share your goal and current routine for a more specific plan.";
};

router.post("/analyze-meal", async (req, res) => {
  try {
    const { mealText } = req.body;

    if (!mealText) {
      return res.status(400).json({ message: "Meal text required" });
    }

    const normalizedText = mealText.trim().toLowerCase();
    const cacheKey = `meal:${normalizedText}`;
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    const estimation = estimateCaloriesBasic(mealText);

    if (HF_FAST_MODE || !process.env.HF_API_KEY) {
      const fast = buildMealResponse(mealText, estimation, "fast estimate");
      setCached(cacheKey, fast);
      return res.json(fast);
    }

    try {
      const response = await hfClient.post("/models/google/flan-t5-base", {
        inputs: `How many calories are in ${mealText}? Give only the number.`,
        parameters: {
          max_new_tokens: 10,
          temperature: 0.1,
          do_sample: false
        }
      });

      const output = response.data?.[0]?.generated_text || response.data?.generated_text || "";
      const calories = output.match(/\d+/) ? parseInt(output.match(/\d+/)[0], 10) : null;

      if (calories && calories > 0 && calories < 5000) {
        const result = {
          success: true,
          analysis: `Meal: ${mealText}\nEstimated Calories: ${calories} kcal (ai estimate)`,
          calories
        };
        setCached(cacheKey, result);
        return res.json(result);
      }
    } catch (hfError) {
      console.log("HF meal estimation unavailable:", hfError.message);
    }

    const fallback = buildMealResponse(mealText, estimation, "fast estimate");
    setCached(cacheKey, fallback);
    return res.json(fallback);
  } catch (error) {
    console.error("Meal analyze error:", error.message);
    return res.json({
      success: true,
      analysis: `Meal: ${req.body?.mealText || "Unknown meal"}\nEstimated Calories: ~300 kcal`,
      calories: 300
    });
  }
});

router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question required" });
    }

    const normalizedQuestion = question.trim().toLowerCase();
    const cacheKey = `ask:${normalizedQuestion}`;
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    const fallbackReply = buildFallbackReply(question);

    if (HF_FAST_MODE || !process.env.HF_API_KEY) {
      const fast = { success: true, reply: fallbackReply };
      setCached(cacheKey, fast);
      return res.json(fast);
    }

    try {
      const response = await hfClient.post("/models/google/flan-t5-base", {
        inputs: `Answer this wellness question concisely in 3 bullet points: ${question}`,
        parameters: {
          max_new_tokens: 120,
          temperature: 0.5,
          do_sample: true
        }
      });

      const output = response.data?.[0]?.generated_text || response.data?.generated_text || "";
      if (output && output.trim()) {
        const aiResponse = { success: true, reply: output.trim() };
        setCached(cacheKey, aiResponse);
        return res.json(aiResponse);
      }
    } catch (hfError) {
      console.log("HF chat unavailable:", hfError.message);
    }

    const finalFallback = { success: true, reply: fallbackReply };
    setCached(cacheKey, finalFallback);
    return res.json(finalFallback);
  } catch (error) {
    console.error("Ask error:", error.message);
    return res.json({
      success: true,
      reply: "Noor is temporarily unavailable. Please try again shortly."
    });
  }
});

router.post("/analyze-food-photo", async (_req, res) => {
  return res.json({
    success: true,
    analysis: "Photo analysis quick mode: image received. Add a short meal description for more accurate calories.",
    foodItems: ["meal image"],
    calories: 300
  });
});

export default router;
