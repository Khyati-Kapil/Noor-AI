import dotenv from "dotenv";
dotenv.config();
import { HfInference } from "@huggingface/inference";

async function testMeal() {
  try {
    const hf = new HfInference(process.env.HF_API_KEY);
    const result = await hf.chatCompletion({
      model: 'Qwen/Qwen2.5-72B-Instruct',
      messages: [
        { role: 'user', content: 'How many calories are in an apple? Give only the number.' }
      ],
      max_tokens: 20
    });
    console.log("SUCCESS:", result.choices[0].message.content);
  } catch(e) {
    console.log("ERROR IS:", e.message);
  }
}

testMeal();
