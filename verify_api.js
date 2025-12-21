const axios = require('axios');
const fs = require('fs');

async function testEndpoints() {
    const baseURL = 'http://localhost:5000/api/agent';
    let log = 'Starting verification...\n';

    console.log('Testing /knowledge endpoint...');
    try {
        const res = await axios.get(`${baseURL}/knowledge`);
        if (res.data.content && res.data.content.includes('PAN')) {
            log += '✅ /knowledge endpoint passed\n';
            console.log('✅ /knowledge endpoint passed');
        } else {
            log += '❌ /knowledge endpoint failed: Unexpected response format\n' + JSON.stringify(res.data) + '\n';
            console.error('❌ /knowledge endpoint failed');
        }
    } catch (err) {
        log += '❌ /knowledge endpoint failed: ' + err.message + '\n';
        console.error('❌ /knowledge endpoint failed:', err.message);
    }

    fs.writeFileSync('verify_result.txt', log);
}

testEndpoints();
