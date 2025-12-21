const axios = require('axios');

async function testChat() {
    console.log('Testing /api/chat endpoint...');
    try {
        const res = await axios.post('http://localhost:5000/api/chat', { prompt: 'Hello' });

        console.log('✅ Response Status:', res.status);
        console.log('✅ Response Body:', res.data);

        if (res.data.reply && res.data.reply.includes('Demo Mode')) {
            console.log('✅ PASS: Correctly switched to Demo Mode fallback.');
        } else {
            console.log('⚠️ FAIL: Did not receive Demo Mode message.');
        }

    } catch (err) {
        if (err.response) {
            console.error(`❌ FAIL: Server returned status ${err.response.status}`);
            console.error('Error Data:', err.response.data);
        } else {
            console.error('❌ FAIL: Network error or server not reachable:', err.message);
        }
    }
}

testChat();
