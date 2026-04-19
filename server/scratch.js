import dotenv from "dotenv";
dotenv.config();
import { HfInference } from "@huggingface/inference";

async function testModel() {
  const hf = new HfInference(process.env.HF_API_KEY);
  console.log("Using HF Key:", process.env.HF_API_KEY.substring(0, 10) + "...");
  try {
    const result = await hf.chatCompletion({
      model: 'Qwen/Qwen2.5-72B-Instruct',
      messages: [
        { role: 'user', content: 'What are 3 benefits of stretching daily?' }
      ],
      max_tokens: 150
    });
    console.log("SUCCESS:", result.choices[0].message.content);
  } catch(e) {
    console.log("ERROR IS:", e.message);
  }
}

testModel();
