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


export default router;

