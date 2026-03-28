"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogIn, LogInLoginValues, LogInRegisterValues } from "@/ui/features/LogIn";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/hooks/useAuth";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function AuthPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && !authLoading) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const handleLogin = async (values: LogInLoginValues) => {
    if (!supabase) {
      toast.error("Configuration Error", { description: "Authentication is not configured. Please check your .env variables." });
      return;
    }
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) {
        setError(error.message);
        toast.error("Login Failed", { description: error.message });
      } else {
        toast.success("Agent Verified", { description: "Session initialized successfully." });
      }
    } catch (err: any) {
      const msg = err.message || "An unexpected error occurred.";
      setError(msg);
      toast.error("Login Failed", { description: msg });
    }
  };

  const handleRegister = async (values: LogInRegisterValues) => {
    if (!supabase) {
      toast.error("Configuration Error", { description: "Authentication is not configured. Please check your .env variables." });
      return;
    }
    setError(null);
    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.name,
          },
        },
      });
      if (error) {
        setError(error.message);
        toast.error("Registration Failed", { description: error.message });
      } else {
        toast.success("Account Created", {
          description: "A 6-digit verification code has been sent to your email."
        });
      }
    } catch (err: any) {
      const msg = err.message || "An unexpected error occurred.";
      setError(msg);
      toast.error("Registration Failed", { description: msg });
    }
  };
  const handleSendOtp = async (email: string) => {
    if (!supabase) {
      toast.error("Configuration Error", { description: "Authentication is not configured. Please check your .env variables." });
      return;
    }
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        }
      });
      if (error) {
        setError(error.message);
        toast.error("OTP Failed", { description: error.message });
      } else {
        toast.success("Code Sent", { description: "Check your email for the 6-digit code." });
      }
    } catch (err: any) {
      const msg = err.message || "An unexpected error occurred.";
      setError(msg);
      toast.error("OTP Failed", { description: msg });
    }
  };

  const handleVerifyOtp = async (email: string, token: string) => {
    if (!supabase) {
      toast.error("Configuration Error", { description: "Authentication is not configured. Please check your .env variables." });
      return;
    }
    setError(null);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'signup',
      });

      if (error) {
        const { error: secondError } = await supabase.auth.verifyOtp({
          email,
          token,
          type: 'magiclink',
        });
        
        if (secondError) {
          setError(secondError.message);
          toast.error("Verification Failed", { description: secondError.message });
          return;
        }
      }
      
      toast.success("Verification Successful", { description: "Agent authenticated." });
      router.push("/");
    } catch (err: any) {
      const msg = err.message || "An unexpected error occurred.";
      setError(msg);
      toast.error("Verification Failed", { description: msg });
    }
  };

  if (authLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <LogIn
          registrationMode="otp"
          onLoginSubmit={handleLogin}
          onRegisterSubmit={handleRegister}
          onSendOtp={handleSendOtp}
          onVerifyOtp={handleVerifyOtp}
          extraFields={
            error && (
              <p className="text-rose-500 text-xs font-bold uppercase tracking-wider text-center animate-pulse">
                {error}
              </p>
            )
          }
        />
      </motion.div>
    </div>
  );
}
