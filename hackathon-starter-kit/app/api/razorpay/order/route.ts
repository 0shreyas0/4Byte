import { NextResponse } from 'next/server';
import { createRazorpayOrder } from '@/lib/api/razorpay';

export async function POST(request: Request) {
  try {
    const { amount, currency } = await request.json();

    if (!amount) {
      return NextResponse.json(
        { message: 'Amount is required' },
        { status: 400 }
      );
    }

    const order = await createRazorpayOrder(amount, currency || 'INR');

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Razorpay API Route Error:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to create Razorpay order' },
      { status: 500 }
    );
  }
}
