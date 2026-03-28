import Razorpay from 'razorpay';

export const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// Check if credentials are valid
const isConfigured = 
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && 
  !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID.includes('XXXXXXXXX') &&
  process.env.RAZORPAY_KEY_SECRET &&
  !process.env.RAZORPAY_KEY_SECRET.includes('XXXXXXXXX');

export const createRazorpayOrder = async (amount: number, currency: string = 'INR') => {
  if (!isConfigured) {
    throw new Error('Razorpay credentials are not configured in .env.local');
  }

  const options = {
    amount: Math.round(amount * 100), // amount in the smallest currency unit
    currency,
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);
    throw error;
  }
};

export const verifyRazorpayPayment = (
  order_id: string,
  payment_id: string,
  signature: string
) => {
  if (!isConfigured) {
    throw new Error('Razorpay credentials are not configured in .env.local');
  }

  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!);
  
  hmac.update(order_id + "|" + payment_id);
  const generated_signature = hmac.digest('hex');

  return generated_signature === signature;
};
