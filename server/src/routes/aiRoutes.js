import express from "express";
import axios from "axios";

const router = express.Router();

const hfClient = axios.create({
  baseURL: "https://api-inference.huggingface.co",
  headers: {
    Authorization: `Bearer ${process.env.HF_API_KEY}`,
    "Content-Type": "application/json"
  },
  timeout: 120000
});

function estimateCaloriesBasic(mealText) {
  const text = mealText.toLowerCase();

  const calorieMap = {
    'roti': 120,
    'chapati': 120,
    'rice': 130,
    'dal': 150,
    'curry': 200,
    'chicken': 250,
    'fish': 200,
    'vegetable': 80,
    'salad': 50,
    'bread': 80,
    'butter': 100,
    'cheese': 110,
    'egg': 70,
    'milk': 60,
    'yogurt': 80,
    'fruit': 60,
    'apple': 95,
    'banana': 105,
    'orange': 60,
    'pizza': 285,
    'burger': 350,
    'pasta': 220,
    'noodle': 200,
    'soup': 100,
    'sandwich': 300
  };

  let totalCalories = 0;
  let foundFoods = [];

  Object.keys(calorieMap).forEach(food => {
    const regex = new RegExp(`\\b${food}\\w*\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) {
      const count = matches.length;
      totalCalories += calorieMap[food] * count;
      foundFoods.push(`${count} ${food}${count > 1 ? 's' : ''}`);
    }
  });

  
  if (totalCalories === 0) {
    totalCalories = 300; 
    foundFoods = ['meal items'];
  }

  return {
    foods: foundFoods,
    calories: Math.round(totalCalories)
  };
}

router.post("/analyze-meal", async (req, res) => {
  try {
    const { mealText } = req.body;

    if (!mealText) {
      return res.status(400).json({ message: "Meal text required" });
    }

    console.log("Analyzing meal:", mealText);

    try {
      // Try using a different model that's known to work well
      const response = await hfClient.post(
        "/models/google/flan-t5-base",
        {
          inputs: `How many calories are in ${mealText}? Give only the number.`,
          parameters: {
            max_new_tokens: 10,
            temperature: 0.1,
            do_sample: false
          }
        }
      );

      const output = response.data?.[0]?.generated_text || response.data?.generated_text || "";
      console.log("HF Response:", output);

      const calories = output.match(/\d+/) ? parseInt(output.match(/\d+/)[0]) : null;

      if (calories && calories > 0 && calories < 5000) {
        return res.json({
          success: true,
          analysis: `Meal: ${mealText}\nEstimated Calories: ${calories} kcal`,
          calories: calories
        });
      }
    } catch (hfError) {
      console.log("HF API failed, using basic estimation:", hfError.response?.data || hfError.message);
    }

  
    const estimation = estimateCaloriesBasic(mealText);

    res.json({
      success: true,
      analysis: `Meal: ${mealText}\nFoods: ${estimation.foods.join(', ')}\nEstimated Calories: ${estimation.calories} kcal`,
      calories: estimation.calories
    });

  } catch (error) {
    console.error("General Error:", error.message);

    res.json({
      success: true,
      analysis: `Meal: ${req.body.mealText || 'Unknown meal'}\nEstimated Calories: ~300 kcal (basic estimate)`,
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

    console.log("Noor AI processing question:", question);

    // Use HuggingFace for general wellness questions
    try {
      const response = await hfClient.post(
        "/models/google/flan-t5-base",
        {
          inputs: `Answer this wellness question concisely: ${question}`,
          parameters: {
            max_new_tokens: 150,
            temperature: 0.7,
            do_sample: true
          }
        }
      );

      const output = response.data?.[0]?.generated_text || response.data?.generated_text || "";
      console.log("HF Response:", output);

      if (output && output.trim()) {
        return res.json({
          success: true,
          reply: output.trim()
        });
      }
    } catch (hfError) {
      console.log("HF API failed, using basic response:", hfError.response?.data || hfError.message);
    }

    // Fallback responses for common wellness questions
    const questionLower = question.toLowerCase();
    let fallbackReply = "";

    if (questionLower.includes("weight loss") || questionLower.includes("lose weight")) {
      fallbackReply = "For weight loss: 1) Create a calorie deficit of 300-500 cal/day, 2) Eat more protein and fiber, 3) Exercise regularly (30 min daily), 4) Stay hydrated, 5) Get 7-8 hours of sleep.";
    } else if (questionLower.includes("acne") || questionLower.includes("skin")) {
      fallbackReply = "For better skin: 1) Cleanse twice daily, 2) Use non-comedogenic products, 3) Stay hydrated, 4) Eat antioxidant-rich foods, 5) Don't touch your face, 6) Consider consulting a dermatologist.";
    } else if (questionLower.includes("hair") || questionLower.includes("frizz")) {
      fallbackReply = "For hair care: 1) Use sulfate-free shampoo, 2) Condition regularly, 3) Avoid heat styling, 4) Eat biotin-rich foods, 5) Get regular trims, 6) Use silk pillowcases.";
    } else if (questionLower.includes("diet") || questionLower.includes("eating")) {
      fallbackReply = "Healthy eating tips: 1) Eat mostly whole foods, 2) Include protein at every meal, 3) Choose complex carbs, 4) Eat colorful vegetables, 5) Limit processed foods and sugar.";
    } else {
      fallbackReply = "I'm Noor AI, your wellness companion. I can help with diet, skincare, haircare, fitness, and general health questions. What would you like to know?";
    }

    res.json({
      success: true,
      reply: fallbackReply
    });

  } catch (error) {
    console.error("Ask Error:", error.message);

    res.json({
      success: true,
      reply: "Noor AI is taking a short break. Please try again in a moment!"
    });
  }
});

export default router;

