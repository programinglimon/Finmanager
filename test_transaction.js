const http = require('http');

// First, get an account ID
const getOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/accounts?type=Agent',
    method: 'GET',
};

const getReq = http.request(getOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        if (res.statusCode === 200) {
            const accounts = JSON.parse(data);
            if (accounts.length > 0) {
                const accId = accounts[0]._id;
                console.log(`Testing with Account ID: ${accId}`);
                performTransaction(accId);
            } else {
                console.log('No Agent accounts found to test.');
            }
        } else {
            console.log(`Failed to fetch accounts: ${res.statusCode}`);
        }
    });
});

getReq.end();

function performTransaction(id) {
    const postData = JSON.stringify({
        action: 'CASH_IN',
        amount: 100
    });

    const options = {
        hostname: 'localhost',
        port: 5000,
        path: `/api/accounts/${id}/transaction`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length
        }
    };

    const req = http.request(options, (res) => {
        console.log(`TRANS STATUS: ${res.statusCode}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log(`TRANS BODY: ${chunk}`);
        });
    });

    req.on('error', (e) => {
        console.error(`Link Error: ${e.message}`);
    });

    req.write(postData);
    req.end();
}
