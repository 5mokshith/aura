// Test script to list available Gemini models
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GOOGLE_GEMINI_API_KEY || "REDACTED";
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    console.log("Testing Gemini API with key:", apiKey.substring(0, 20) + "...");
    
    // Try different model names
    const modelsToTest = [
      "gemini-1.5-flash",
      "gemini-1.5-pro", 
      "gemini-pro",
      "gemini-1.0-pro",
      "gemini-2.0-flash-exp"
    ];
    
    for (const modelName of modelsToTest) {
      try {
        console.log(`\nTesting model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Say hello");
        const response = await result.response;
        console.log(`✓ ${modelName} works! Response:`, response.text().substring(0, 50));
      } catch (error) {
        console.log(`✗ ${modelName} failed:`, error.message);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

listModels();

