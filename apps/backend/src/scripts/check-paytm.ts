
import dotenv from 'dotenv';
import path from 'path';

// Load .env from root of backend
dotenv.config({ path: path.join(__dirname, '../../.env') });

const checkPaytm = async () => {
    console.log('Checking Paytm Configuration...');

    const mid = process.env.PAYTM_MID;
    const key = process.env.PAYTM_MKEY;
    const website = process.env.PAYTM_WEBSITE;
    const env = process.env.PAYTM_ENV;

    console.log('PAYTM_MID:', mid ? 'SET' : 'MISSING');
    console.log('PAYTM_MKEY:', key ? 'SET' : 'MISSING');
    console.log('PAYTM_WEBSITE:', website || 'DEFAULT (WEBSTAGING)');
    console.log('PAYTM_ENV:', env || 'DEFAULT (STAGE)');

    if (!mid || !key) {
        console.error('❌ Missing Paytm Credentials. Please add PAYTM_MID and PAYTM_MKEY to .env');
        process.exit(1);
    }

    try {
        console.log('Testing Signature Generation...');
        const PaytmChecksum = require('paytmchecksum');
        const orderId = `TEST_${Date.now()}`;
        const params = {
            body: {
                requestType: "Payment",
                mid: mid,
                websiteName: "WEBSTAGING",
                orderId: orderId,
                callbackUrl: `https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=${orderId}`,
                txnAmount: {
                    value: "1.00",
                    currency: "INR",
                },
                userInfo: {
                    custId: "CUST_001",
                },
                channelId: "WAP",
                industryTypeId: "Retail109",
            }
        };
        const signature = await PaytmChecksum.generateSignature(JSON.stringify(params.body), key);
        console.log('✅ Signature Generated Successfully:', signature);

        console.log('Testing Initiate Transaction API...');
        const https = require('https');

        const post_data = JSON.stringify({
            body: params.body,
            head: { signature: signature }
        });

        const options = {
            hostname: env === 'PROD' ? 'securegw.paytm.in' : 'securegw-stage.paytm.in',
            port: 443,
            path: `/theia/api/v1/initiateTransaction?mid=${mid}&orderId=${params.body.orderId}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': post_data.length
            }
        };

        await new Promise((resolve, reject) => {
            const req = https.request(options, (res: any) => {
                let response = '';
                res.on('data', (chunk: any) => { response += chunk; });
                res.on('end', () => {
                    console.log('--- Paytm Response ---');
                    console.log(response);
                    console.log('----------------------');
                    const json = JSON.parse(response);
                    if (json.body && json.body.txnToken) {
                        console.log('✅ TxnToken received:', json.body.txnToken);
                        resolve(null);
                    } else {
                        console.error('❌ Failed to get txnToken:', json.body?.resultInfo?.resultMsg);
                        reject(new Error(json.body?.resultInfo?.resultMsg));
                    }
                });
            });
            req.on('error', (e: any) => {
                console.error('Request Error:', e);
                reject(e);
            });
            req.write(post_data);
            req.end();
        });

        console.log('✅ Configuration looks good! Ensure you restart the backend.');
    } catch (error: any) {
        console.error('❌ Failed to generate signature:', error.message);
        console.error('Stack:', error.stack);
        console.error('Key Length:', key.length);
        console.error('Ensure paytmchecksum is installed and Key is correct.');
    }
};

checkPaytm();
