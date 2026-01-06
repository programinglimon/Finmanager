const http = require('http');

let itemId = null;

// 1. Create Inventory Item
function createItem() {
    const postData = JSON.stringify({
        name: 'Test Item',
        category: 'Grameenphone',
        quantity: 50,
        buyPrice: 10,
        sellPrice: 12
    });

    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/recharge/inventory',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': postData.length }
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            const item = JSON.parse(data);
            itemId = item._id;
            console.log(`[CREATE] Item Created. ID: ${itemId}, Qty: ${item.quantity}`);
            testAddStock();
        });
    });
    req.write(postData);
    req.end();
}

// 2. Add Stock (Add 10)
function testAddStock() {
    console.log('[ADD STOCK] Adding 10...');
    const postData = JSON.stringify({
        action: 'ADD_STOCK',
        quantity: 10
    });

    const options = {
        hostname: 'localhost',
        port: 5000,
        path: `/api/recharge/inventory/${itemId}/transaction`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': postData.length }
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            console.log(`[ADD STOCK] Response Status: ${res.statusCode}`);
            console.log(`[ADD STOCK] Response Body: ${data}`);
            if (res.statusCode === 200) {
                testDailyUpdate();
            }
        });
    });
    req.write(postData);
    req.end();
}

// 3. Daily Update (Set to 40, Sold 20)
// Sold = 60 (current) - 40 (new) = 20
// Profit = 20 * (12 - 10) = 40
function testDailyUpdate() {
    console.log('[DAILY UPDATE] Updating to 40...');
    const postData = JSON.stringify({
        action: 'DAILY_UPDATE',
        newQuantity: 40
    });

    const options = {
        hostname: 'localhost',
        port: 5000,
        path: `/api/recharge/inventory/${itemId}/transaction`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': postData.length }
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            console.log(`[DAILY UPDATE] Response Status: ${res.statusCode}`);
            console.log(`[DAILY UPDATE] Response Body: ${data}`);
        });
    });
    req.write(postData);
    req.end();
}

createItem();
