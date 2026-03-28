import { useCallback } from 'react';

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  handler: (response: any) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
}

export const useRazorpay = () => {
  const loadScript = useCallback((src: string) => {
    return new Promise((resolve) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const initializePayment = useCallback(async (options: Omit<RazorpayOptions, 'key'>) => {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    
    if (!razorpayKey || razorpayKey.includes('XXXXXXXXX')) {
      const msg = 'Razorpay Key ID is missing or not configured. Please check your .env.local file.';
      console.error(msg);
      alert(msg);
      return;
    }

    const rzp = new (window as any).Razorpay({
      ...options,
      key: razorpayKey,
    });

    rzp.open();
  }, [loadScript]);

  return { initializePayment };
};
