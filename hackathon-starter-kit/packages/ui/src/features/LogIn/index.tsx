'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/Card';
import { cn } from '../../utils/cn';
import { Mail } from 'lucide-react';

// ─────────────────────────────────────────── Types ────────────────────────────

export interface LogInLoginValues  { email: string; password: string; }
export interface LogInRegisterValues { name: string; email: string; password: string; }
export interface LogInOtpValues { email: string; token?: string; }

export interface LogInProps {
  /** Initial mode — defaults to 'login' */
  defaultMode?: 'login' | 'register';
  loading?: boolean;
  className?: string;

  /**
   * Controls what happens after a successful registration.
   *
   * - `'otp'`               — Supabase sends a 6-digit OTP; the form advances
   *                           to the verify-otp step automatically. (default)
   * - `'confirmation-link'` — Supabase sends a magic-link email; a "check your
   *                           inbox" screen is shown instead.
   */
  registrationMode?: 'otp' | 'confirmation-link';

  // Login handlers
  onLoginSubmit?:   (values: LogInLoginValues)    => Promise<void> | void;
  onGoogleSignIn?:  ()                            => Promise<void> | void;

  // Register handlers
  onRegisterSubmit?: (values: LogInRegisterValues) => Promise<void> | void;
  onGoogleSignUp?:   ()                            => Promise<void> | void;

  // OTP handlers
  onSendOtp?:        (email: string) => Promise<void> | void;
  onVerifyOtp?:      (email: string, token: string) => Promise<void> | void;

  /** Render extra fields inside the active form */
  extraFields?: React.ReactNode;
}

// ─────────────────────────────────── Google SVG icon ─────────────────────────

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" aria-hidden="true" viewBox="0 0 488 512" xmlns="http://www.w3.org/2000/svg">
    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
  </svg>
);

// ─────────────────────────────── Divider  "Or continue with" ─────────────────

const OrDivider = () => (
  <div className="relative my-1">
    <div className="absolute inset-0 flex items-center">
      <span className="w-full border-t border-border/70" />
    </div>
    <div className="relative flex justify-center text-[10px] uppercase tracking-[0.21em]">
      <span className="bg-card px-3 text-muted-foreground/60 font-black">Or continue with</span>
    </div>
  </div>
);

// ──────────────────────── "Check your inbox" screen ──────────────────────────

const CheckInboxScreen: React.FC<{ email: string; onBack: () => void }> = ({ email, onBack }) => (
  <motion.div
    key="check-inbox"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.25 }}
    className="flex flex-col items-center text-center space-y-6 py-8 px-2"
  >
    <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-xl shadow-primary/5">
      <Mail className="text-primary" size={28} />
    </div>

    <div className="space-y-2">
      <h3 className="text-h3 font-heading tracking-tight">Check your inbox</h3>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
        We sent a confirmation link to{' '}
        <span className="text-primary font-semibold">{email}</span>.
        Click it to activate your account.
      </p>
    </div>

    <p className="text-xs text-muted-foreground/60">
      Didn't receive it? Check your spam folder.
    </p>

    <button
      type="button"
      onClick={onBack}
      className="text-xs text-primary hover:underline font-bold transition-colors"
    >
      ← Back to login
    </button>
  </motion.div>
);

// ─────────────────────────────────── Main component ──────────────────────────

export const LogIn: React.FC<LogInProps> = ({
  defaultMode = 'login',
  loading = false,
  className,
  registrationMode = 'otp',
  onLoginSubmit,
  onGoogleSignIn,
  onRegisterSubmit,
  onGoogleSignUp,
  onSendOtp,
  onVerifyOtp,
  extraFields,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'otp' | 'verify-otp' | 'check-inbox'>(defaultMode);
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [token, setToken]         = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isBusy   = loading || submitting;
  const isLogin  = mode === 'login';
  const isOtp    = mode === 'otp';
  const isVerify = mode === 'verify-otp';
  const isCheckInbox = mode === 'check-inbox';

  const withBusy = async (fn: () => Promise<void> | void) => {
    setSubmitting(true);
    try { await fn(); } finally { setSubmitting(false); }
  };

  const handleSwitch = () => {
    setMode(m => {
      if (m === 'login') return 'register';
      if (m === 'register') return 'otp';
      return 'login';
    });
    setName(''); setEmail(''); setPassword(''); setToken('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      if (onLoginSubmit) withBusy(() => onLoginSubmit!({ email, password }));
    } else if (isOtp) {
      if (onSendOtp) {
        withBusy(async () => {
          await onSendOtp!(email);
          setMode('verify-otp');
        });
      }
    } else if (isVerify) {
      if (onVerifyOtp) withBusy(() => onVerifyOtp!(email, token));
    } else {
      // Register mode
      if (onRegisterSubmit) {
        withBusy(async () => {
          await onRegisterSubmit!({ name, email, password });
          // Advance to the correct post-registration screen
          if (registrationMode === 'otp') {
            setMode('verify-otp');
          } else {
            setMode('check-inbox');
          }
        });
      }
    }
  };

  const handleGoogle = () => {
    const fn = isLogin ? onGoogleSignIn : onGoogleSignUp;
    if (fn) withBusy(fn);
  };

  const showGoogle = isLogin ? !!onGoogleSignIn : !!onGoogleSignUp;

  // ── Render the "check inbox" screen separately (no card form)
  if (isCheckInbox) {
    return (
      <div className={cn('flex items-center justify-center p-4', className)}>
        <Card className="w-full max-w-md border-border/70 bg-background/80 backdrop-blur-xl shadow-2xl shadow-primary/5 overflow-hidden">
          <CardContent className="pt-6">
            <AnimatePresence mode="wait">
              <CheckInboxScreen email={email} onBack={() => { setMode('login'); setEmail(''); setPassword(''); setName(''); }} />
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center justify-center p-4', className)}>
      <Card className="w-full max-w-md border-border/70 bg-background/80 backdrop-blur-xl shadow-2xl shadow-primary/5 overflow-hidden">

        {/* ── Header ── */}
        <CardHeader className="space-y-1 text-center pb-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
            >
              <CardTitle className="text-h3 font-heading tracking-tight">
                {isLogin ? 'Welcome Back' : isOtp ? 'Sign in with OTP' : isVerify ? 'Verify Identity' : 'Create Account'}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground font-body leading-relaxed mt-1">
                {isLogin
                  ? 'Sign in to continue where you left off.'
                  : isOtp
                    ? 'Enter your email to receive a 6-digit code.'
                    : isVerify
                      ? `Enter the code sent to ${email}`
                      : 'Join us and start your journey today.'}
              </CardDescription>
            </motion.div>
          </AnimatePresence>
        </CardHeader>

        {/* ── Form ── */}
        <CardContent className="space-y-5 pt-4">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <AnimatePresence initial={false}>
              {!isLogin && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <Input
                    label="Full Name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    disabled={isBusy}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={isBusy || isVerify}
            />

            <AnimatePresence initial={false}>
              {(isLogin || mode === 'register') && (
                <motion.div
                  key="password-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={isLogin ? undefined : 8}
                    disabled={isBusy}
                  />
                </motion.div>
              )}

              {isVerify && (
                <motion.div
                  key="otp-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <Input
                    label="6-Digit Code"
                    type="text"
                    placeholder="123456"
                    value={token}
                    onChange={e => setToken(e.target.value)}
                    required
                    maxLength={6}
                    disabled={isBusy}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {extraFields}

            <Button
              type="submit"
              className="w-full h-11 font-semibold tracking-wide"
              loading={isBusy}
            >
              {isBusy
                ? (isLogin ? 'Signing in…' : isOtp ? 'Sending code…' : isVerify ? 'Verifying…' : 'Creating account…')
                : (isLogin ? 'Sign In' : isOtp ? 'Send OTP' : isVerify ? 'Verify Code' : 'Create Account')}
            </Button>
          </form>

          {showGoogle && (
            <>
              <OrDivider />
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 bg-muted/30 hover:bg-muted border-border/50 text-foreground"
                disabled={isBusy}
                onClick={handleGoogle}
              >
                <GoogleIcon />
                {isLogin ? 'Continue with Google' : 'Sign up with Google'}
              </Button>
            </>
          )}
        </CardContent>

        {/* ── Footer toggle ── */}
        <CardFooter className="flex flex-wrap justify-center text-xs text-muted-foreground border-t border-border/40 bg-muted/5 py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1"
            >
              {isLogin ? "Don't have an account?" : isOtp ? "Back to password login?" : isVerify ? "Didn't get the code?" : 'Already have an account?'}
              <button
                type="button"
                onClick={isVerify ? () => setMode('otp') : handleSwitch}
                className="text-primary hover:underline font-bold transition-colors"
              >
                {isLogin ? 'Sign Up' : isOtp ? 'Log In' : isVerify ? 'Resend' : 'Log In'}
              </button>
            </motion.div>
          </AnimatePresence>
        </CardFooter>

      </Card>
    </div>
  );
};
