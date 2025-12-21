const axios = require('axios');

const GOOGLE_API_KEY = 'AIzaSyAQftb5dnBEbTBrn_b9LbVnxAr1_srjxs4';

const testModel = async (modelName) => {
    console.log(`\nTesting model: ${modelName}`);
    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GOOGLE_API_KEY}`,
            {
                contents: [{ parts: [{ text: "Say hello" }] }],
            },
            { headers: { 'Content-Type': 'application/json' } }
        );
        console.log(`Success with ${modelName}!`);
        console.log("Response:", response.data?.candidates?.[0]?.content?.parts?.[0]?.text);
    } catch (err) {
        console.error(`Error with ${modelName}:`, err.response?.status, err.response?.statusText);
        console.error('Data:', JSON.stringify(err.response?.data, null, 2));
    }
};

const run = async () => {
    await testModel('gemini-2.5-flash');
    await testModel('gemini-1.5-flash');
};

run();
