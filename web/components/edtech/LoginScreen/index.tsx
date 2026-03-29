"use client";

import { useState } from "react";
import { ArrowRight, BookOpen, Eye, EyeOff, Zap, Brain, GitBranch, Globe } from "lucide-react";
import { auth } from "@/lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from "firebase/auth";

interface LoginScreenProps {
  onLogin: () => void;
  onGetStarted: () => void; // goes straight to onboarding/domain select
}

export default function LoginScreen({ onLogin, onGetStarted }: LoginScreenProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [hoveredCta, setHoveredCta] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        // Note: Name saving would require updating user profile or firestore, 
        // but for now we'll just handle the auth.
      }
      onLogin();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onLogin();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F5F0E8",
        display: "flex",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Dot-grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(#0D0D0D18 1.5px, transparent 1.5px), linear-gradient(90deg, #0D0D0D18 1.5px, transparent 1.5px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      {/* ─── LEFT PANEL ─── */}
      <div
        style={{
          width: "52%",
          background: "#0D0D0D",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px 56px",
          position: "relative",
          overflow: "hidden",
        }}
        className="hidden lg:flex"
      >
        {/* Yellow accent blobs */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 320,
            height: 320,
            background: "#FFD60A",
            opacity: 0.06,
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 240,
            height: 240,
            background: "#FFD60A",
            opacity: 0.05,
            borderRadius: "50%",
          }}
        />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative" }}>
          <div
            style={{
              width: 44,
              height: 44,
              background: "#FFD60A",
              border: "3px solid #FFD60A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "4px 4px 0 #ffffff33",
            }}
          >
            <BookOpen size={22} color="#0D0D0D" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ color: "#fff", fontWeight: 900, fontSize: "1.15rem", letterSpacing: "-0.04em", lineHeight: 1 }}>
              NEURAL
            </div>
            <div style={{ color: "#FFD60A", fontWeight: 900, fontSize: "1.15rem", letterSpacing: "-0.04em", lineHeight: 1 }}>
              PATH
            </div>
          </div>
        </div>

        {/* Hero text */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              color: "#FFD60A",
              fontWeight: 800,
              fontSize: "0.75rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            ⚡ AI-Powered EdTech
          </div>
          <h1
            style={{
              color: "#fff",
              fontWeight: 900,
              fontSize: "clamp(2.4rem, 4vw, 4rem)",
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              marginBottom: 28,
            }}
          >
            Understand
            <br />
            what you
            <br />
            <span
              style={{
                background: "#FFD60A",
                color: "#0D0D0D",
                padding: "0.04em 0.16em",
                display: "inline-block",
              }}
            >
              don&apos;t know
            </span>
            <br />
            <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.7)" }}>— and why.</em>
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: "1rem",
              fontWeight: 500,
              lineHeight: 1.65,
              maxWidth: 360,
              marginBottom: 36,
            }}
          >
            We trace the root cause of every failure. Pick a domain, take a quiz, get a personalized recovery plan.
          </p>

          {/* Feature pills */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { icon: <Brain size={14} />, text: "AI-traced root cause analysis" },
              { icon: <GitBranch size={14} />, text: "Concept dependency mapping" },
              { icon: <Zap size={14} />, text: "Personalized recovery paths" },
            ].map(({ icon, text }) => (
              <div
                key={text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: "rgba(255,255,255,0.75)",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    background: "#FFD60A",
                    border: "2px solid #FFD60A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ color: "#0D0D0D" }}>{icon}</span>
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ display: "flex", gap: 32, position: "relative" }}>
          {[
            { value: "93%", label: "Root Cause Accuracy" },
            { value: "3x", label: "Faster Learning" },
            { value: "10K+", label: "Concepts Mapped" },
          ].map((s) => (
            <div key={s.value}>
              <div
                style={{
                  color: "#FFD60A",
                  fontWeight: 900,
                  fontSize: "1.8rem",
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontWeight: 600,
                  fontSize: "0.78rem",
                  marginTop: 4,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── RIGHT PANEL ─── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
          position: "relative",
        }}
      >
        {/* Mobile logo */}
        <div
          className="flex lg:hidden"
          style={{ alignItems: "center", gap: 10, marginBottom: 32 }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              background: "#0D0D0D",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "3px solid #0D0D0D",
              boxShadow: "4px 4px 0 #FFD60A",
            }}
          >
            <BookOpen size={20} color="#FFD60A" />
          </div>
          <span style={{ fontWeight: 900, fontSize: "1.3rem", letterSpacing: "-0.04em" }}>
            NEURAL<span style={{ color: "#FFD60A" }}>PATH</span>
          </span>
        </div>

        {/* Card */}
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            background: "#fff",
            border: "3px solid #0D0D0D",
            boxShadow: "8px 8px 0 #0D0D0D",
            padding: "36px 32px",
          }}
        >
          {/* Card header */}
          <div style={{ marginBottom: 28 }}>
            <h2
              style={{
                fontWeight: 900,
                fontSize: "1.6rem",
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
                marginBottom: 8,
              }}
            >
              {mode === "login" ? "Welcome back ✌" : "Join NeuralPath 🧠"}
            </h2>
            <p style={{ color: "#666", fontSize: "0.9rem", fontWeight: 500 }}>
              {mode === "login"
                ? "Sign in to continue your learning journey."
                : "Create an account to get started."}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border-2 border-black text-xs font-bold shadow-[3px_3px_0px_#000]">
              {error}
            </div>
          )}

          {/* Mode tabs */}
          <div
            style={{
              display: "flex",
              border: "3px solid #0D0D0D",
              marginBottom: 24,
              overflow: "hidden",
            }}
          >
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  fontWeight: 900,
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  cursor: "pointer",
                  background: mode === m ? "#0D0D0D" : "#fff",
                  color: mode === m ? "#FFD60A" : "#0D0D0D",
                  border: "none",
                  borderRight: m === "login" ? "3px solid #0D0D0D" : "none",
                  transition: "background 0.15s, color 0.15s",
                }}
              >
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {mode === "signup" && (
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 800,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: 6,
                  }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ada Lovelace"
                  className="brutal-input"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    fontSize: "0.95rem",
                  }}
                  required={mode === "signup"}
                />
              </div>
            )}

            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 6,
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="brutal-input"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  fontSize: "0.95rem",
                }}
                required
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 6,
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="brutal-input"
                  style={{
                    width: "100%",
                    padding: "12px 44px 12px 14px",
                    fontSize: "0.95rem",
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#888",
                    display: "flex",
                    alignItems: "center",
                  }}
                  aria-label="Toggle password visibility"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="brutal-btn"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: "#FFD60A",
                fontSize: "1rem",
                marginTop: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      border: "3px solid #0D0D0D",
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin-slow 0.7s linear infinite",
                    }}
                  />
                  Processing…
                </span>
              ) : (
                <>
                  {mode === "login" ? "Sign In" : "Create Account"}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              margin: "20px 0",
            }}
          >
            <div style={{ flex: 1, height: 2, background: "#E5E5E5" }} />
            <span style={{ color: "#999", fontSize: "0.8rem", fontWeight: 700 }}>OR</span>
            <div style={{ flex: 1, height: 2, background: "#E5E5E5" }} />
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="brutal-btn"
            style={{
              width: "100%",
              padding: "13px",
              background: "#fff",
              color: "#0D0D0D",
              fontSize: "0.95rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginBottom: 12
            }}
          >
            <Globe size={17} />
            Continue with Google
          </button>

          {/* Get Started CTA (no-auth) */}
          <button
            onClick={onGetStarted}
            onMouseEnter={() => setHoveredCta(true)}
            onMouseLeave={() => setHoveredCta(false)}
            className="brutal-btn"
            style={{
              width: "100%",
              padding: "13px",
              background: "#0D0D0D",
              color: "#FFD60A",
              fontSize: "0.95rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <ArrowRight
              size={17}
              style={{
                transform: hoveredCta ? "translateX(4px)" : "translateX(0)",
                transition: "transform 0.2s",
              }}
            />
          </button>

          <p
            style={{
              textAlign: "center",
              color: "#888",
              fontSize: "0.78rem",
              fontWeight: 600,
              marginTop: 14,
            }}
          >
          </p>
        </div>

        {/* Footer note */}
        <p
          style={{
            marginTop: 24,
            color: "#999",
            fontSize: "0.78rem",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          By continuing you agree to our{" "}
          <span style={{ textDecoration: "underline", cursor: "pointer" }}>Terms</span> &amp;{" "}
          <span style={{ textDecoration: "underline", cursor: "pointer" }}>Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
