import axios from "axios";

const HF_API_KEY = process.env.HF_API_KEY;

export const hfClient = axios.create({
  baseURL: "https://router.huggingface.co",
  headers: {
    Authorization: `Bearer ${HF_API_KEY}`,
    "Content-Type": "application/json"
  },
  timeout: 20000
});

