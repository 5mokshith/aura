const { GoogleGenerativeAI } = require("@google/generative-ai");

// Read API key from environment variable
const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

console.log('🔑 API Key exists:', !!apiKey);
console.log('🔑 API Key length:', apiKey?.length);
console.log('🔑 API Key starts with AIza:', apiKey?.startsWith('AIza'));

async function testAPI() {
    try {
        console.log('\n🧪 Testing Gemini API connection...\n');

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp",
            generationConfig: {
                temperature: 0.6,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 100,
            },
        });

        const result = await model.generateContent({
            contents: [
                { role: 'user', parts: [{ text: 'Say "Hello" in exactly one word.' }] }
            ]
        });

        const response = result.response.text();
        console.log('✅ SUCCESS! API is working.');
        console.log('📝 Response:', response);

    } catch (error) {
        console.error('❌ ERROR:', error.message);
        console.error('\n🔍 Error Details:');
        console.error('   Name:', error.name);
        console.error('   Code:', error.code);
        console.error('   Status:', error.status);

        if (error.message.includes('fetch failed')) {
            console.error('\n⚠️  DIAGNOSIS: Network/Connectivity Issue');
            console.error('   Possible causes:');
            console.error('   1. Firewall blocking Google API');
            console.error('   2. Proxy configuration needed');
            console.error('   3. No internet connection');
            console.error('   4. Corporate network restrictions');
        } else if (error.message.includes('API_KEY_INVALID') || error.status === 400) {
            console.error('\n⚠️  DIAGNOSIS: Invalid API Key');
            console.error('   Please verify your key at: https://aistudio.google.com/app/apikey');
        }
    }
}

testAPI();
