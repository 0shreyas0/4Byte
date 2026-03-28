"use client";

import React, { useState } from 'react';
import { useRazorpay } from '@/hooks/useRazorpay';
import { Button } from '../../components/Button';
import { api } from '@/lib/api/fetcher';

interface RazorpayButtonProps {
  amount: number;
  name?: string;
  description?: string;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

export const RazorpayButton: React.FC<RazorpayButtonProps> = ({
  amount,
  name = "Hackathon Project",
  description = "Payment for services",
  onSuccess,
  onError
}) => {
  const [loading, setLoading] = useState(false);
  const { initializePayment } = useRazorpay();

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      // 1. Create order on the server
      const order = await api.post<{ id: string }>('/api/razorpay/order', {
        amount,
      });

      // 2. Initialize Razorpay Checkout
      await initializePayment({
        amount: amount * 100, // Amount in paise
        currency: "INR",
        name,
        description,
        order_id: order.id,
        handler: async (response: any) => {
          setLoading(true);
          try {
            // 3. Verify payment on the server
            const verification = await api.post<{ success: boolean }>('/api/razorpay/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verification.success) {
              if (onSuccess) onSuccess(response);
              alert("Payment successful and verified!");
            } else {
              alert("Payment verification failed.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Payment completed but verification failed.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: "John Doe",
          email: "john@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "var(--primary)",
        },
      });
    } catch (error: any) {
      console.error("Payment Failed:", error);
      if (onError) onError(error);
      const msg = error.data?.message || error.message || "Payment failed to initialize";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment} 
      loading={loading}
      variant="primary"
    >
      Pay ₹{amount}
    </Button>
  );
};
