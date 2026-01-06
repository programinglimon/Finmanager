const http = require('http');

// Create Due Item
function createDue() {
    const postData = JSON.stringify({
        name: 'Test Due',
        amount: 1000,
        type: 'DUE',
        note: 'Test Note'
    });

    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/due',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': postData.length }
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            console.log(`[CREATE] Status: ${res.statusCode} | Body: ${data}`);
        });
    });
    req.write(postData);
    req.end();
}

createDue();
