
import mongoose from 'mongoose';
import { Order } from '../models/order.model';
import { logAction } from './audit.service';
import Razorpay from 'razorpay';
import { env } from '../config/env';
import crypto from 'crypto';
const PaytmChecksum = require('paytmchecksum');


// Debugging helper
const fs = require('fs');
const logFile = require('path').join(process.cwd(), 'paytm_debug.log');

const logDebug = (msg: string, data?: any) => {
  const time = new Date().toISOString();
  const logMsg = `[${time}] ${msg} ${data ? JSON.stringify(data) : ''}\n`;
  try {
    fs.appendFileSync(logFile, logMsg);
  } catch (e) {
    console.error("Failed to write to log file", e);
  }
  console.log(logMsg);
};

export const createPaymentOrder = async (
  orderId: string,
  provider: 'RAZORPAY' | 'PAYTM'
) => {
  logDebug(`createPaymentOrder called for ${orderId} with provider ${provider}`);
  try {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new Error('Invalid order ID');
    }


    const order = await Order.findById(orderId);
    if (!order) throw new Error('Order not found');
    if (order.status !== 'CREATED') throw new Error('Order is not payable');

    let paymentOrderId = '';
    let paymentOrderData: any = {};

    if (provider === 'RAZORPAY') {
      // Create Razorpay order
      const razorpay = new Razorpay({
        key_id: env.payments.razorpay.key_id,
        key_secret: env.payments.razorpay.key_secret,
      });
      const amount = Math.round((order as any).payableAmount ?? order.totalAmount) * 100; // in paise
      const rzpOrder = await razorpay.orders.create({
        amount,
        currency: 'INR',
        receipt: order._id.toString(),
        payment_capture: true, // Fixed type error (boolean)
        notes: {
          userId: order.userId.toString(),
          orderId: order._id.toString(),
        },
      });
      paymentOrderId = rzpOrder.id;
      paymentOrderData = rzpOrder;
    } else if (provider === 'PAYTM') {
      // Paytm Integration
      const totalAmount = ((order as any).payableAmount ?? order.totalAmount).toFixed(2);
      paymentOrderId = `ORDER_${order._id}_${Date.now()}`;

      // Params for Paytm signature
      const paytmParams: any = {};
      paytmParams.body = {
        requestType: "Payment",
        mid: env.payments.paytm.merchantId,
        websiteName: env.payments.paytm.website,
        orderId: paymentOrderId,
        callbackUrl: env.payments.paytm.isProduction
          ? `https://${env.payments.paytm.merchantId}.gw.paytm.in/theia/paytmCallback?ORDER_ID=${paymentOrderId}`
          : `https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=${paymentOrderId}`,
        txnAmount: {
          value: totalAmount,
          currency: "INR",
        },
        userInfo: {
          custId: order.userId.toString(),
        },
        channelId: "WAP",
        industryTypeId: "Retail",
      };

      // Generate Checksum
      // Generate Checksum
      const checksum = await PaytmChecksum.generateSignature(
        JSON.stringify(paytmParams.body),
        env.payments.paytm.merchantKey
      );

      paytmParams.head = {
        signature: checksum
      };

      // Call Paytm API to get TXN_TOKEN
      const post_data = JSON.stringify(paytmParams);

      // Helper to make https request
      const https = require('https');
      const getTxnToken = (): Promise<string> => {
        return new Promise((resolve, reject) => {
          const options = {
            hostname: env.payments.paytm.isProduction ? 'securegw.paytm.in' : 'securegw-stage.paytm.in',
            port: 443,
            path: `/theia/api/v1/initiateTransaction?mid=${env.payments.paytm.merchantId}&orderId=${paymentOrderId}`,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': post_data.length
            }
          };

          const req = https.request(options, (res: any) => {
            let response = '';
            res.on('data', (chunk: any) => { response += chunk; });
            res.on('end', () => {
              try {
                const json = JSON.parse(response);
                if (json.body && json.body.txnToken) {
                  resolve(json.body.txnToken);
                } else {
                  console.error('Paytm Error Response:', JSON.stringify(json));
                  logDebug('Paytm API Failure:', json);
                  reject(new Error(json.body?.resultInfo?.resultMsg || 'Failed to get txnToken'));
                }
              } catch (e) {
                reject(e);
              }
            });
          });

          req.on('error', (e: any) => { reject(e); });
          req.write(post_data);
          req.end();
        });
      };

      let txnToken = '';
      try {
        txnToken = await getTxnToken();
      } catch (e) {
        console.error('Paytm Initiate Transaction Failed:', e);
        logDebug('Paytm Init Exception:', e);
        // Fallback or throw? If we can't get token, payment cannot proceed via SDK
        throw new Error('Failed to initiate Paytm transaction');
      }

      paymentOrderData = {
        mid: env.payments.paytm.merchantId,
        orderId: paymentOrderId,
        amount: totalAmount,
        callbackUrl: paytmParams.body.callbackUrl,
        txnToken: txnToken,
        isStaging: !env.payments.paytm.isProduction,
        restrictAppInvoke: false
      };
    } else {
      // Mock for other providers
      paymentOrderId = `${provider}-${order._id}-${Date.now()}`;
      paymentOrderData = { id: paymentOrderId };
    }

    order.paymentProvider = provider;
    order.paymentOrderId = paymentOrderId;
    order.paymentStatus = 'PENDING';
    await order.save();

    void logAction({
      userId: order.userId.toString(),
      role: undefined,
      action: 'PAYMENT_ORDER_CREATED',
      entityType: 'PAYMENT',
      entityId: order._id.toString(),
      metadata: { provider, paymentOrderId },
    });

    return {
      paymentOrderId,
      amount: (order as any).payableAmount ?? order.totalAmount,
      provider,
      paymentOrderData,
      key_id: provider === 'RAZORPAY' ? env.payments.razorpay.key_id : undefined,
      currency: 'INR',
      name: 'EcommerceEarn',
      description: 'Order Payment',
      orderId: order._id,
    };
  } catch (error: any) {
    logDebug('Error in createPaymentOrder:', error.message);
    logDebug('Stack:', error.stack);
    throw error;
  }
};


export const verifyPayment = async (
  orderId: string,
  payload: any
): Promise<'SUCCESS' | 'FAILED'> => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new Error('Invalid order ID');
  }

  const order = await Order.findById(orderId);
  if (!order) throw new Error('Order not found');

  let success = false;
  if (order.paymentProvider === 'RAZORPAY') {
    // Razorpay signature verification
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = payload;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new Error('Missing Razorpay payment details');
    }
    const hmac = crypto.createHmac('sha256', env.payments.razorpay.key_secret);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generatedSignature = hmac.digest('hex');
    if (generatedSignature === razorpay_signature) {
      success = true;
    }
  } else if (order.paymentProvider === 'PAYTM') {
    // Verify Paytm Signature
    // payload should contain the response from Paytm
    // Typically we call "Transaction Status API" to double check status from backend
    // But for verify step with checksum:
    const paytmParams = payload;
    const paytmChecksum = payload.CHECKSUMHASH;
    delete paytmParams.CHECKSUMHASH;

    const isVerifySignature = PaytmChecksum.verifySignature(paytmParams, env.payments.paytm.merchantKey, paytmChecksum);
    if (isVerifySignature && paytmParams.STATUS === 'TXN_SUCCESS') {
      success = true;
    }
  } else {
    // Placeholder for other providers
    success = payload?.success === true;
  }

  order.paymentStatus = success ? 'SUCCESS' : 'FAILED';
  if (success) {
    order.status = 'PAID';
    // Increment coupon usage only when payment succeeds
    if ((order as any).couponCode) {
      try {
        const { incrementUsage } = await import('./coupon.service');
        await incrementUsage((order as any).couponCode as string);
      } catch {
        // ignore coupon increment errors
      }
    }
    void logAction({
      userId: order.userId.toString(),
      role: undefined,
      action: 'ORDER_PAID',
      entityType: 'ORDER',
      entityId: order._id.toString(),
      metadata: { provider: order.paymentProvider },
    });
  }

  await order.save();

  void logAction({
    userId: order.userId.toString(),
    role: undefined,
    action: 'PAYMENT_STATUS_UPDATED',
    entityType: 'PAYMENT',
    entityId: order._id.toString(),
    metadata: { provider: order.paymentProvider, status: order.paymentStatus },
  });

  return order.paymentStatus as 'SUCCESS' | 'FAILED';
};
