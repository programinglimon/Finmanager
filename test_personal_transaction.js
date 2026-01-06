const http = require('http');

// 1. Create Personal Account
function createAccount() {
    const postData = JSON.stringify({
        name: 'Test Personal',
        type: 'Personal',
        number: '01700000000',
        provider: 'Bkash',
        commission: 5, // 5 per 1000
        balance: 1000
    });

    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/accounts',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length
        }
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            const acc = JSON.parse(data);
            console.log(`Created Account: ${acc._id}, Balance: ${acc.balance}, Profit: ${acc.dailyProfit}`);
            testCashIn(acc._id);
        });
    });
    req.write(postData);
    req.end();
}

// 2. Test Cash In (Should increase balance, NO profit)
function testCashIn(id) {
    const postData = JSON.stringify({
        action: 'CASH_IN',
        amount: 500
    });

    const options = {
        hostname: 'localhost',
        port: 5000,
        path: `/api/accounts/${id}/transaction`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': postData.length }
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            const acc = JSON.parse(data);
            console.log(`[CASH IN] Balance: ${acc.balance} (Exp: 1500), Profit: ${acc.dailyProfit} (Exp: 0)`);
            testSendMoney(id);
        });
    });
    req.write(postData);
    req.end();
}

// 3. Test Send Money (Should decrease balance, INCREASE profit)
function testSendMoney(id) {
    const postData = JSON.stringify({
        action: 'SEND_MONEY',
        amount: 1000
    });

    const options = {
        hostname: 'localhost',
        port: 5000,
        path: `/api/accounts/${id}/transaction`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': postData.length }
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            const acc = JSON.parse(data);
            // Profit should be 1000 * (5/1000) = 5
            console.log(`[SEND MONEY] Balance: ${acc.balance} (Exp: 500), Profit: ${acc.dailyProfit} (Exp: 5)`);
        });
    });
    req.write(postData);
    req.end();
}

createAccount();
