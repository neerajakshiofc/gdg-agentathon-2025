const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

async function listModels() {
    try {
        const response = await axios.get(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${GOOGLE_API_KEY}`
        );

        const names = response.data.models
            .filter(m => m.supportedGenerationMethods.includes("generateContent"))
            .map(m => m.name);

        fs.writeFileSync('models.json', JSON.stringify(names, null, 2));
        console.log("Written models to models.json");
    } catch (err) {
        console.error("Error listing models:", err.response ? err.response.data : err.message);
        fs.writeFileSync('models.json', JSON.stringify({ error: err.message }, null, 2));
    }
}

listModels();
