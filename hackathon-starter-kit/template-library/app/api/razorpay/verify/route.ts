import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = await request.json();

    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      throw new Error('Razorpay secret is not configured');
    }

    // Create the expected signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // ✅ SUCCESS: Update your database here (e.g., mark order as 'paid')
      console.log('Payment Verified Successfully');
      
      return NextResponse.json({ 
        message: 'Payment verified successfully', 
        success: true 
      });
    } else {
      return NextResponse.json({ 
        message: 'Payment verification failed', 
        success: false 
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Verification Error:', error);
    return NextResponse.json({ 
      message: error.message || 'Verification failed' 
    }, { status: 500 });
  }
}
