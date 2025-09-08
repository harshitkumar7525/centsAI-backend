import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function apiCall({ prompt }) {
  const categories = [
    "food", "entertainment", "bills", "shopping", "travel", 
    "health", "education", "others"
  ];

  const formattedDate = new Date().toISOString().split('T')[0];
  
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig: {
        responseMimeType: "application/json",
    },
  });

  const chat_prompt = `
    You are a financial assistant. Your task is to extract expense details from a user's prompt.
    Follow the rules and examples below to extract the details.

    ## Categories Available
    ${categories.join(", ")}

    ## Rules
    1. If a specific date is mentioned (like "kal" for yesterday, or a specific date), use it.
    2. If no date is mentioned, you MUST use this date: ${formattedDate}.
    3. The amount must be a number. If no amount is found, use 0.
    4. The output must be ONLY a valid JSON array of objects.
    5. The amount should be in indian rupees (INR).
    6. Date format should be in such a way that it can be passed to new Date() in JS.
    7. Each object in the array must have "amount", "transactionDate", and "category" fields.
    8. The category must be one from the available categories above. If unsure, use "others".
    9. The JSON array should have at least one object. If no expenses are found, return an object with amount as 0, current date, and category as "others".
    10. If any other currency is mentioned, convert it to INR STRICTLY USING THE LAST KNOWN EXCHANGE RATE.

    ## Examples
    User Prompt: "I bought a pizza for 500"
    Output: [{"amount": 500, "transactionDate": "${formattedDate}", "category": "food"}]

    User Prompt: "maine kal Rs. 200 ki notebooks li"
    Output: [{"amount": 200, "transactionDate": "2025-09-04", "category": "education"}]

    User Prompt: "paid the electricity bill 1200 rs"
    Output: [{"amount": 1200, "transactionDate": "${formattedDate}", "category": "bills"}]

    ## User's Prompt to Process
    "${prompt}"
  `;

  const result = await model.generateContent(chat_prompt);
  const response = result.response;
  return response.text();
}

export default apiCall;