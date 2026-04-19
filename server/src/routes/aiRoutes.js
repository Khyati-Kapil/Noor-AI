import express from "express";
import { HfInference } from "@huggingface/inference";
import authMiddleware from "../middleware/authMiddleware.js";
import Meal from "../models/Meal.js";
import ChatSession from "../models/ChatSession.js";

const router = express.Router();

const HF_FAST_MODE = process.env.HF_FAST_MODE !== "false";
const CACHE_TTL_MS = 10 * 60 * 1000;

const getHfClient = () => {
  if (!process.env.HF_API_KEY) return null;
  return new HfInference(process.env.HF_API_KEY);
};

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
    roti: 120, chapati: 120, rice: 130, dal: 150, curry: 200, chicken: 250, fish: 200, vegetable: 80, salad: 50, bread: 80, butter: 100, cheese: 110, egg: 70, milk: 60, yogurt: 80, fruit: 60, apple: 95, banana: 105, orange: 60, pizza: 285, burger: 350, pasta: 220, noodle: 200, soup: 100, sandwich: 300
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

  return { foods: foundFoods, calories: Math.round(totalCalories) };
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

const chunkText = (text, chunkSize = 8) => {
  const chunks = [];
  for (let index = 0; index < text.length; index += chunkSize) {
    chunks.push(text.slice(index, index + chunkSize));
  }
  return chunks;
};

const streamSseEvent = (res, event, payload) => {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
};

const saveChatSession = async (userId, question, reply) => {
  try {
    if (userId) {
      await ChatSession.create({ user: userId, prompt: question, response: reply });
    }
  } catch (error) {
    console.error("Error saving ChatSession:", error.message);
  }
};

const generateWellnessReply = async (question, userId) => {
  const normalizedQuestion = question.trim().toLowerCase();
  const cacheKey = `ask:${normalizedQuestion}`;
  const cached = getCached(cacheKey);
  
  if (cached?.reply) {
    await saveChatSession(userId, question, cached.reply);
    return { reply: cached.reply, source: "cache" };
  }

  const fallbackReply = buildFallbackReply(question);
  const hf = getHfClient();

  if (HF_FAST_MODE || !hf) {
    setCached(cacheKey, { success: true, reply: fallbackReply });
    await saveChatSession(userId, question, fallbackReply);
    return { reply: fallbackReply, source: "fallback" };
  }

  try {
    const result = await hf.chatCompletion({
      model: 'Qwen/Qwen2.5-72B-Instruct',
      messages: [
        { role: 'user', content: `Answer this wellness question concisely in 3 bullet points: ${question}` }
      ],
      max_tokens: 150
    });

    const output = result.choices[0]?.message?.content;
    if (output && output.trim()) {
      const aiResponse = output.trim();
      setCached(cacheKey, { success: true, reply: aiResponse });
      await saveChatSession(userId, question, aiResponse);
      return { reply: aiResponse, source: "ai" };
    }
  } catch (hfError) {
    if (hfError.message.includes("sufficient permissions")) {
      console.error("HF ERROR: Your Hugging Face API key is missing 'Inference API' permissions.");
    } else {
      console.error("HF chat unavailable:", hfError.message);
    }
  }

  setCached(cacheKey, { success: true, reply: fallbackReply });
  await saveChatSession(userId, question, fallbackReply);
  return { reply: fallbackReply, source: "fallback" };
};

const saveMealToDb = async (userId, mealText, calories, foodItems) => {
  try {
    if (userId) {
      const meal = new Meal({ user: userId, name: mealText, calories, foodItems });
      await meal.save();
    }
  } catch (error) {
    console.error("Error saving Meal:", error.message);
  }
};

router.post("/analyze-meal", authMiddleware, async (req, res) => {
  try {
    const { mealText } = req.body;
    if (!mealText) return res.status(400).json({ message: "Meal text required" });

    const normalizedText = mealText.trim().toLowerCase();
    const cacheKey = `meal:${normalizedText}`;
    const cached = getCached(cacheKey);
    
    if (cached) {
      await saveMealToDb(req.user?.id, mealText, cached.calories, [mealText]);
      return res.json(cached);
    }

    const estimation = estimateCaloriesBasic(mealText);
    const hf = getHfClient();

    if (HF_FAST_MODE || !hf) {
      const fast = buildMealResponse(mealText, estimation, "fast estimate");
      setCached(cacheKey, fast);
      await saveMealToDb(req.user?.id, mealText, fast.calories, estimation.foods);
      return res.json(fast);
    }

    try {
      const result = await hf.chatCompletion({
        model: 'Qwen/Qwen2.5-72B-Instruct',
        messages: [
          { role: 'user', content: `Estimate the total calories for this meal: "${mealText}". Reply with ONLY the total calorie number and nothing else. No explanation.` }
        ],
        max_tokens: 20
      });

      const output = result.choices[0]?.message?.content || "";
      const calorieMatch = output.match(/\d+/);
      const calories = calorieMatch ? parseInt(calorieMatch[0], 10) : null;

      if (calories !== null && calories > 0 && calories < 5000) {
        const aiResult = {
          success: true,
          analysis: `Meal: ${mealText}\nEstimated Calories: ${calories} kcal (ai estimate)`,
          calories
        };
        setCached(cacheKey, aiResult);
        await saveMealToDb(req.user?.id, mealText, calories, [mealText]);
        return res.json(aiResult);
      }
    } catch (hfError) {
      console.error("HF meal estimation unavailable:", hfError.message);
    }

    const fallback = buildMealResponse(mealText, estimation, "fast estimate");
    setCached(cacheKey, fallback);
    await saveMealToDb(req.user?.id, mealText, fallback.calories, estimation.foods);
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

router.post("/ask", authMiddleware, async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ message: "Question required" });

    const { reply } = await generateWellnessReply(question, req.user?.id);
    return res.json({ success: true, reply });
  } catch (error) {
    console.error("Ask error:", error.message);
    return res.json({
      success: true,
      reply: "Noor is temporarily unavailable. Please try again shortly."
    });
  }
});

router.post("/chat/stream", authMiddleware, async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ success: false, message: "Question required" });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    streamSseEvent(res, "start", { success: true });
    
    const { reply, source } = await generateWellnessReply(question, req.user?.id);
    const chunks = chunkText(reply, 14);

    for (const token of chunks) {
      streamSseEvent(res, "token", { token });
      await new Promise((resolve) => setTimeout(resolve, 110));
    }

    streamSseEvent(res, "end", { success: true, source });
    res.end();
  } catch (error) {
    console.error("Chat stream error:", error.message);
    streamSseEvent(res, "error", { success: false, message: "Unable to stream reply right now." });
    res.end();
  }
});

router.post("/analyze-food-photo", authMiddleware, async (_req, res) => {
  return res.json({
    success: true,
    analysis: "Photo analysis quick mode: image received. Add a short meal description for more accurate calories.",
    foodItems: ["meal image"],
    calories: 300
  });
});

export default router;
