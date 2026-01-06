const http = require('http');

let simId = null;

// 1. Create SIM with 2000 balance, 28 commission
function createSim() {
    const postData = JSON.stringify({
        name: 'Test GP',
        number: '01711111111',
        balance: 2000,
        commission: 28
    });

    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/recharge/sims',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': postData.length }
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            const sim = JSON.parse(data);
            simId = sim._id;
            console.log(`[CREATE] SIM Created. Balance: ${sim.balance} (Exp: 2000), Profit: ${sim.dailyProfit}`);
            testAddBalance();
        });
    });
    req.write(postData);
    req.end();
}

// 2. Add Balance (2000)
function testAddBalance() {
    console.log('[ADD BALANCE] Adding 2000...');
    const postData = JSON.stringify({
        action: 'ADD_BALANCE',
        amount: 2000
    });

    const options = {
        hostname: 'localhost',
        port: 5000,
        path: `/api/recharge/sims/${simId}/transaction`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': postData.length }
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            const sim = JSON.parse(data);
            console.log(`[ADD BALANCE] Balance: ${sim.balance} (Exp: 4000)`);
            testDailyUpdate();
        });
    });
    req.write(postData);
    req.end();
}

// 3. Daily Update (New Balance 1000)
// Sell = 4000 - 1000 = 3000
// Profit = (3000/1000) * 28 = 84
function testDailyUpdate() {
    console.log('[DAILY UPDATE] Updating to 1000...');
    const postData = JSON.stringify({
        action: 'DAILY_UPDATE',
        newBalance: 1000
    });

    const options = {
        hostname: 'localhost',
        port: 5000,
        path: `/api/recharge/sims/${simId}/transaction`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': postData.length }
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            const sim = JSON.parse(data);
            console.log(`[DAILY UPDATE] Balance: ${sim.balance} (Exp: 1000), Profit: ${sim.dailyProfit} (Exp: 84)`);
        });
    });
    req.write(postData);
    req.end();
}

createSim();
