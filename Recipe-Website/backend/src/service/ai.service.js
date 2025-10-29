import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
apiKey: process.env.GEMINI_API_KEY,
});

export async function generateRecipeFromIngredients(ingredients, preferences) {
const prompt = `
You are a professional chef AI assistant.
Create a detailed, creative recipe using these ingredients: ${ingredients.join(", ")}.
Include any specific preferences: ${preferences || "none"}.
Respond ONLY in this exact JSON format (no extra text):

{
"title": "string - name of the recipe",
"ingredients": ["ingredient 1", "ingredient 2", "..."],
"steps": ["step 1", "step 2", "..."]
}
`;

try {
const response = await ai.models.generateContent({
model: "gemini-2.5-flash",
contents: [{ type: "text", text: prompt }],
maxOutputTokens: 500,
temperature: 0.7,
});


let text =
  response.response?.text?.() ||
  response.text ||
  "";

// 🧹 Clean extra markdown or code fences
text = text.replace(/```json/g, "").replace(/```/g, "").trim();

const recipeJSON = JSON.parse(text);
return recipeJSON;


} catch (error) {
console.error("Failed to parse AI response as JSON:", error);
return {
title: "Generated Recipe",
ingredients,
steps: ["Could not parse AI response properly.", "Try again."],
};
}
}
