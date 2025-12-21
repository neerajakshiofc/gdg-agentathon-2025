const express = require('express');
const axios = require('axios');
const router = express.Router();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

router.post('/', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `You are a helpful, conversational financial assistant. 
Keep your responses SHORT, concise, and easy to read. 
Use bullet points where possible. 
Avoid long paragraphs. 
Format nicely with Markdown (bold, lists).

User Request: ${prompt}`
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No reply';
    res.json({ reply });

  } catch (err) {
    console.error('Gemini API error:', err.response?.data || err.message);
    // Fallback Mock Response for Demo
    res.json({ reply: "I'm currently running in **Demo Mode** (API Key error or quota limit). \n\nI can help you with:\n- Budgeting tips\n- Investment basics\n- Expense tracking help\n\n*What would you like to know?*" });
  }
});

module.exports = router;
