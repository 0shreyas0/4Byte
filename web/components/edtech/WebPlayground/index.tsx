"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowLeft, Eye, Code2, CheckCircle2, XCircle, Lightbulb, RefreshCw, ChevronRight, ChevronLeft, Maximize2 } from "lucide-react";
import { LearningMode } from "@/components/edtech/SandboxIDE";

export interface UIChallenge {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  targetHTML: string;
  targetCSS: string;
  starterHTML: string;
  starterCSS: string;
  hints: string[];
  checks: { label: string; fn: (html: string, css: string) => boolean }[];
}

const buildDoc = (html: string, css: string) => `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; }
  ${css}
</style>
</head>
<body>${html}</body>
</html>`;

// ─── Challenge Data ────────────────────────────────────────────────────────
const CHALLENGES: Record<string, UIChallenge[]> = {
  beginner: [
    {
      id: "w-b1",
      title: "Centered Login Card",
      difficulty: "Easy",
      description: "Build a centered login card with a heading, two input fields (Email & Password), and a submit button. Use flexbox to center everything on the page.",
      targetHTML: `<div class="page">
  <div class="card">
    <h2>Welcome Back</h2>
    <p class="sub">Sign in to continue</p>
    <input type="email" placeholder="Email address" />
    <input type="password" placeholder="Password" />
    <button>Sign In</button>
    <a href="#">Forgot password?</a>
  </div>
</div>`,
      targetCSS: `.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f4ff;
}
.card {
  background: #fff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.1);
  width: 360px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
h2 { font-size: 1.6rem; font-weight: 800; color: #111; }
.sub { color: #888; font-size: 0.875rem; margin-top: -8px; }
input {
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
  transition: border 0.2s;
}
input:focus { border-color: #6366f1; }
button {
  padding: 12px;
  background: #6366f1;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
}
a { text-align: center; color: #6366f1; font-size: 0.85rem; text-decoration: none; }`,
      starterHTML: `<div class="page">
  <div class="card">
    <h2>Welcome Back</h2>
    <!-- Add inputs and button here -->
  </div>
</div>`,
      starterCSS: `.page {
  min-height: 100vh;
  /* Center the card here */
}
.card {
  /* Style the card */
}`,
      hints: [
        "Use display:flex + align-items:center + justify-content:center on .page to center",
        "Give .card a fixed width (like 360px), padding, box-shadow, and border-radius",
        "Set flex-direction:column + gap on .card to stack elements vertically",
        "Style the button with background-color, color:white, border-radius, and cursor:pointer",
      ],
      checks: [
        { label: "Page uses flexbox to center", fn: (_, css) => css.includes("display") && css.includes("flex") && css.includes("center") },
        { label: "Has email and password inputs", fn: (html) => html.includes("email") && html.includes("password") },
        { label: "Has a button element", fn: (html) => html.includes("<button") || html.includes("type=\"submit\"") },
        { label: "Card has box-shadow or border-radius", fn: (_, css) => css.includes("box-shadow") || css.includes("border-radius") },
      ],
    },
    {
      id: "w-b2",
      title: "Product Card",
      difficulty: "Easy",
      description: "Create a product card with an image placeholder (a colored div), product name, price, star rating, and an 'Add to Cart' button.",
      targetHTML: `<div class="page">
  <div class="card">
    <div class="img-ph"></div>
    <div class="body">
      <div class="badge">New</div>
      <h3>Wireless Headphones</h3>
      <div class="stars">★★★★☆ <span>4.0</span></div>
      <div class="price">₹2,499 <del>₹3,999</del></div>
      <button>Add to Cart</button>
    </div>
  </div>
</div>`,
      targetCSS: `.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f8f8;
}
.card {
  width: 280px;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
}
.img-ph {
  height: 200px;
  background: linear-gradient(135deg, #667eea, #764ba2);
}
.body { padding: 20px; display: flex; flex-direction: column; gap: 10px; }
.badge {
  background: #fef3c7; color: #d97706;
  font-size: 0.72rem; font-weight: 800;
  padding: 2px 8px; border-radius: 20px;
  width: fit-content; text-transform: uppercase;
}
h3 { font-size: 1rem; font-weight: 700; color: #111; }
.stars { color: #f59e0b; font-size: 0.85rem; }
.stars span { color: #888; margin-left: 4px; }
.price { font-size: 1.2rem; font-weight: 800; color: #111; }
.price del { color: #aaa; font-size: 0.85rem; margin-left: 8px; font-weight: 400; }
button {
  background: #111; color: #fff; border: none;
  padding: 12px; border-radius: 8px;
  font-weight: 700; cursor: pointer; font-size: 0.9rem;
}`,
      starterHTML: `<div class="page">
  <div class="card">
    <div class="img-ph"></div>
    <div class="body">
      <!-- Add product info here -->
    </div>
  </div>
</div>`,
      starterCSS: `.page {
  min-height: 100vh;
  /* Center card */
}
.card { width: 280px; /* Style card */ }
.img-ph { height: 200px; /* Add a gradient background */ }
.body { padding: 20px; }`,
      hints: [
        "Use background: linear-gradient(135deg, #667eea, #764ba2) on .img-ph for the image placeholder",
        "Add overflow:hidden on .card so the image corners are clipped by border-radius",
        "Use flex-direction:column + gap on .body to space out the content",
        "Use del tag for the strikethrough old price",
      ],
      checks: [
        { label: "Has an image placeholder div", fn: (html) => html.includes("img-ph") || html.includes("placeholder") },
        { label: "Has a price element", fn: (html) => html.includes("₹") || html.includes("$") || html.includes("price") },
        { label: "Has Add to Cart button", fn: (html) => html.toLowerCase().includes("cart") || html.includes("<button") },
        { label: "Card has shadow or rounded corners", fn: (_, css) => css.includes("box-shadow") || css.includes("border-radius") },
      ],
    },
    {
      id: "w-b3",
      title: "Navigation Bar",
      difficulty: "Medium",
      description: "Build a sticky top navigation bar with a logo on the left, navigation links in the center, and a CTA button on the right. Make it look clean and modern.",
      targetHTML: `<nav class="navbar">
  <div class="logo">⚡ Brand</div>
  <ul class="links">
    <li><a href="#">Home</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Services</a></li>
    <li><a href="#">Blog</a></li>
  </ul>
  <button class="cta">Get Started</button>
</nav>
<div class="hero">
  <h1>Below the navbar</h1>
  <p>Your page content goes here</p>
</div>`,
      targetCSS: `* { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, sans-serif; }
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.logo { font-size: 1.2rem; font-weight: 900; color: #111; }
.links {
  display: flex;
  list-style: none;
  gap: 32px;
}
.links a { text-decoration: none; color: #555; font-weight: 600; font-size: 0.9rem; }
.links a:hover { color: #6366f1; }
.cta {
  background: #6366f1;
  color: #fff;
  border: none;
  padding: 10px 22px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
}
.hero { padding: 60px 40px; background: #f0f4ff; min-height: 400px; }
.hero h1 { font-size: 2rem; }`,
      starterHTML: `<nav class="navbar">
  <div class="logo">⚡ Brand</div>
  <ul class="links">
    <li><a href="#">Home</a></li>
    <li><a href="#">Services</a></li>
  </ul>
  <button class="cta">Get Started</button>
</nav>`,
      starterCSS: `.navbar {
  display: flex;
  align-items: center;
  /* Space logo, links, button */
  padding: 0 40px;
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}
.links { display: flex; list-style: none; gap: 24px; }
.links a { text-decoration: none; color: #555; }`,
      hints: [
        "Use justify-content:space-between on .navbar to push logo left and button right",
        "Add position:sticky + top:0 + z-index:100 to make the navbar stick while scrolling",
        "Remove list-style:none and padding:0 from the ul to clean up default list styles",
        "Style the .cta button with background-color, color:white, and border-radius",
      ],
      checks: [
        { label: "Navbar uses flexbox", fn: (_, css) => css.includes(".navbar") && css.includes("flex") },
        { label: "Has navigation links (ul/li/a)", fn: (html) => html.includes("<ul") && html.includes("<li") && html.includes("<a") },
        { label: "Has a CTA/action button", fn: (html) => html.includes("<button") },
        { label: "Logo and button are space-between", fn: (_, css) => css.includes("space-between") },
      ],
    },
    {
      id: "w-b4",
      title: "Profile Card",
      difficulty: "Medium",
      description: "Build a user profile card with a circular avatar (colored div), full name, username/handle, a short bio, stat counters (Posts, Followers, Following), and a Follow button.",
      targetHTML: `<div class="page">
  <div class="card">
    <div class="avatar">JD</div>
    <h2>John Doe</h2>
    <span class="handle">@johndoe</span>
    <p class="bio">Frontend developer. Coffee addict. Building cool stuff one component at a time.</p>
    <div class="stats">
      <div class="stat"><strong>128</strong><span>Posts</span></div>
      <div class="stat"><strong>4.2K</strong><span>Followers</span></div>
      <div class="stat"><strong>320</strong><span>Following</span></div>
    </div>
    <div class="actions">
      <button class="follow">Follow</button>
      <button class="msg">Message</button>
    </div>
  </div>
</div>`,
      targetCSS: `.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea22, #764ba222);
}
.card {
  background: #fff;
  border-radius: 20px;
  padding: 32px 24px;
  width: 300px;
  text-align: center;
  box-shadow: 0 12px 40px rgba(0,0,0,0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.avatar {
  width: 80px; height: 80px; border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff; display: flex;
  align-items: center; justify-content: center;
  font-size: 1.4rem; font-weight: 900;
}
h2 { font-size: 1.2rem; font-weight: 800; color: #111; }
.handle { color: #6366f1; font-size: 0.85rem; font-weight: 600; margin-top: -4px; }
.bio { color: #666; font-size: 0.85rem; line-height: 1.5; }
.stats { display: flex; gap: 24px; padding: 12px 0; border-top: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0; width: 100%; justify-content: center; }
.stat { display: flex; flex-direction: column; align-items: center; }
.stat strong { font-size: 1rem; font-weight: 800; }
.stat span { color: #888; font-size: 0.75rem; }
.actions { display: flex; gap: 10px; width: 100%; }
.follow { flex: 1; background: #6366f1; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 700; cursor: pointer; }
.msg { flex: 1; background: #f3f4f6; color: #333; border: none; padding: 10px; border-radius: 8px; font-weight: 700; cursor: pointer; }`,
      starterHTML: `<div class="page">
  <div class="card">
    <div class="avatar">JD</div>
    <h2>John Doe</h2>
    <!-- Add handle, bio, stats, buttons -->
  </div>
</div>`,
      starterCSS: `.page {
  min-height: 100vh;
  /* Center card */
}
.card {
  background: #fff;
  border-radius: 20px;
  padding: 32px 24px;
  width: 300px;
  text-align: center;
}
.avatar {
  width: 80px; height: 80px;
  border-radius: 50%;
  /* Add gradient background and center text */
}`,
      hints: [
        "border-radius: 50% makes the avatar circular — add display:flex to center the initials inside",
        "Use background: linear-gradient(135deg, #6366f1, #8b5cf6) for the avatar gradient",
        "The .stats row: display:flex + gap + justify-content:center",
        "Stat items should use flex-direction:column + align-items:center",
      ],
      checks: [
        { label: "Avatar is circular (border-radius:50%)", fn: (_, css) => css.includes("50%") },
        { label: "Has stat counters (Posts/Followers)", fn: (html) => html.toLowerCase().includes("follow") && (html.includes("post") || html.includes("stat")) },
        { label: "Has at least one button", fn: (html) => html.includes("<button") },
        { label: "Card is centered with flexbox", fn: (_, css) => css.includes("flex") && css.includes("center") },
      ],
    },
  ],
  revision: [
    {
      id: "w-r1",
      title: "Pricing Card",
      difficulty: "Easy",
      description: "Recreate a simple pricing plan card with plan name, price, feature list with checkmarks, and a subscribe button. Center it on the page.",
      targetHTML: `<div class="page">
  <div class="card">
    <div class="badge">Most Popular</div>
    <h3>Pro Plan</h3>
    <div class="price">₹999<span>/mo</span></div>
    <ul>
      <li>✅ Unlimited Projects</li>
      <li>✅ Priority Support</li>
      <li>✅ Custom Domain</li>
      <li>✅ Analytics Dashboard</li>
      <li>❌ White Label</li>
    </ul>
    <button>Subscribe Now</button>
  </div>
</div>`,
      targetCSS: `.page { min-height:100vh; display:flex; align-items:center; justify-content:center; background:#f0f4ff; }
.card { background:#fff; border-radius:16px; padding:32px; width:300px; text-align:center; box-shadow:0 8px 30px rgba(99,102,241,0.15); border:2px solid #6366f1; display:flex; flex-direction:column; gap:16px; }
.badge { background:#6366f1; color:#fff; font-size:0.7rem; font-weight:800; padding:4px 12px; border-radius:20px; width:fit-content; margin:0 auto; text-transform:uppercase; }
h3 { font-size:1.4rem; font-weight:900; }
.price { font-size:2rem; font-weight:900; color:#6366f1; }
.price span { font-size:0.9rem; color:#888; font-weight:400; }
ul { list-style:none; text-align:left; display:flex; flex-direction:column; gap:8px; }
li { font-size:0.875rem; color:#444; }
button { background:#6366f1; color:#fff; border:none; padding:14px; border-radius:10px; font-weight:800; font-size:0.95rem; cursor:pointer; }`,
      starterHTML: `<div class="page">
  <div class="card">
    <h3>Pro Plan</h3>
    <div class="price">₹999<span>/mo</span></div>
    <!-- Add features list and button -->
  </div>
</div>`,
      starterCSS: `.page { min-height:100vh; }
.card { background:#fff; padding:32px; width:300px; }`,
      hints: [
        "Center .page with display:flex + align-items/justify-content:center",
        "Use border:2px solid #6366f1 on .card for the highlighted border",
        "Make the price large and prominent: font-size:2rem + color:#6366f1",
        "Use list-style:none and display:flex + flex-direction:column + gap on ul",
      ],
      checks: [
        { label: "Centered layout with flexbox", fn: (_, css) => css.includes("flex") && css.includes("center") },
        { label: "Has feature list (ul/li)", fn: (html) => html.includes("<ul") && html.includes("<li") },
        { label: "Has subscribe/CTA button", fn: (html) => html.includes("<button") },
        { label: "Price has prominent styling", fn: (html) => html.includes("price") || html.includes("₹") || html.includes("$") },
      ],
    },
    {
      id: "w-r2",
      title: "Toast Notification",
      difficulty: "Medium",
      description: "Build a success toast notification fixed to the bottom-right of the screen. It should have an icon, message text, and a close button.",
      targetHTML: `<div class="toast-wrap">
  <div class="toast success">
    <div class="icon">✅</div>
    <div class="content">
      <strong>Success!</strong>
      <p>Your changes have been saved.</p>
    </div>
    <button class="close">✕</button>
  </div>
  <div class="toast info">
    <div class="icon">ℹ️</div>
    <div class="content">
      <strong>Info</strong>
      <p>New update available for download.</p>
    </div>
    <button class="close">✕</button>
  </div>
</div>`,
      targetCSS: `body { background:#1a1a2e; min-height:100vh; }
.toast-wrap { position:fixed; bottom:24px; right:24px; display:flex; flex-direction:column; gap:12px; }
.toast { display:flex; align-items:flex-start; gap:12px; background:#fff; border-radius:12px; padding:16px 20px; width:320px; box-shadow:0 8px 30px rgba(0,0,0,0.2); border-left:4px solid #10b981; }
.toast.info { border-left-color:#6366f1; }
.icon { font-size:1.2rem; flex-shrink:0; margin-top:2px; }
.content { flex:1; }
.content strong { font-size:0.9rem; color:#111; }
.content p { font-size:0.8rem; color:#666; margin-top:2px; }
.close { background:none; border:none; font-size:0.9rem; color:#999; cursor:pointer; margin-left:auto; flex-shrink:0; }`,
      starterHTML: `<div class="toast-wrap">
  <div class="toast">
    <div class="icon">✅</div>
    <div class="content">
      <strong>Success!</strong>
      <p>Your changes have been saved.</p>
    </div>
    <button class="close">✕</button>
  </div>
</div>`,
      starterCSS: `body { background:#1a1a2e; min-height:100vh; }
.toast-wrap {
  /* Fix to bottom-right */
}
.toast {
  display:flex;
  background:#fff;
  border-radius:12px;
  padding:16px;
  width:320px;
  /* Add left colored border */
}`,
      hints: [
        "position:fixed + bottom:24px + right:24px on .toast-wrap pins it to bottom-right",
        "Use border-left:4px solid #10b981 for the green accent",
        "Inside .toast: display:flex + align-items:flex-start + gap:12px",
        "Give .content flex:1 to push the close button to the far right",
      ],
      checks: [
        { label: "Toast is fixed position", fn: (_, css) => css.includes("fixed") },
        { label: "Pinned to bottom-right", fn: (_, css) => css.includes("bottom") && css.includes("right") },
        { label: "Has close button", fn: (html) => html.includes("<button") && (html.includes("close") || html.includes("✕") || html.includes("×")) },
        { label: "Toast uses flexbox layout", fn: (_, css) => css.includes("flex") },
      ],
    },
    {
      id: "w-r3",
      title: "Dashboard Header",
      difficulty: "Hard",
      description: "Build a dark-themed admin dashboard header. It should include a sidebar toggle icon (☰), page title, search bar, and user avatar with notification bell on the right.",
      targetHTML: `<header class="header">
  <div class="left">
    <button class="menu">☰</button>
    <div class="title">
      <span class="sup">Good morning 👋</span>
      <h1>Dashboard</h1>
    </div>
  </div>
  <div class="right">
    <div class="search">
      <span>🔍</span>
      <input placeholder="Search anything..." />
    </div>
    <button class="bell">🔔 <span class="dot"></span></button>
    <div class="avatar">AK</div>
  </div>
</header>
<div class="content">
  <div class="stat-cards">
    <div class="sc">📈 Revenue <strong>₹1.2L</strong></div>
    <div class="sc">👥 Users <strong>4,200</strong></div>
    <div class="sc">🛒 Orders <strong>842</strong></div>
  </div>
</div>`,
      targetCSS: `body { margin:0; background:#0f0f1a; font-family:system-ui,sans-serif; color:#fff; }
.header { display:flex; align-items:center; justify-content:space-between; padding:0 28px; height:68px; background:#1a1a2e; border-bottom:1px solid #ffffff12; }
.left { display:flex; align-items:center; gap:16px; }
.menu { background:none; border:none; color:#fff; font-size:1.4rem; cursor:pointer; }
.sup { font-size:0.75rem; color:#888; display:block; }
h1 { margin:0; font-size:1.1rem; font-weight:800; }
.right { display:flex; align-items:center; gap:16px; }
.search { display:flex; align-items:center; gap:8px; background:#ffffff0f; border:1px solid #ffffff18; border-radius:8px; padding:8px 14px; }
.search input { background:none; border:none; outline:none; color:#fff; font-size:0.85rem; width:160px; }
.search input::placeholder { color:#666; }
.bell { position:relative; background:none; border:none; cursor:pointer; font-size:1.1rem; }
.dot { position:absolute; top:0; right:0; width:8px; height:8px; background:#ef4444; border-radius:50%; border:2px solid #1a1a2e; }
.avatar { width:38px; height:38px; border-radius:50%; background:linear-gradient(135deg,#6366f1,#8b5cf6); display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:800; cursor:pointer; }
.content { padding:28px; }
.stat-cards { display:flex; gap:16px; }
.sc { background:#1a1a2e; border:1px solid #ffffff12; border-radius:12px; padding:20px 24px; flex:1; display:flex; flex-direction:column; gap:8px; font-size:0.85rem; color:#aaa; }
.sc strong { font-size:1.4rem; font-weight:900; color:#fff; }`,
      starterHTML: `<header class="header">
  <div class="left">
    <button class="menu">☰</button>
    <h1>Dashboard</h1>
  </div>
  <div class="right">
    <input class="search" placeholder="Search..." />
    <div class="avatar">AK</div>
  </div>
</header>`,
      starterCSS: `body { margin:0; background:#0f0f1a; font-family:system-ui,sans-serif; color:#fff; }
.header {
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:0 28px;
  height:68px;
  background:#1a1a2e;
  border-bottom:1px solid #ffffff12;
}
.left { display:flex; align-items:center; gap:16px; }
.right { display:flex; align-items:center; gap:16px; }`,
      hints: [
        "Search bar: display:flex + background:#ffffff0f + border:1px solid #ffffff18 + border-radius for glassmorphism",
        "Avatar: border-radius:50% + gradient background + display:flex to center initials",
        "Notification dot: position:absolute + small width/height + border-radius:50% + background:red",
        "Use border-bottom:1px solid #ffffff12 for the subtle header separator line",
      ],
      checks: [
        { label: "Header uses flexbox with space-between", fn: (_, css) => css.includes("flex") && css.includes("space-between") },
        { label: "Has search input", fn: (html) => html.includes("search") || html.includes("<input") },
        { label: "Has user avatar element", fn: (html) => html.includes("avatar") || html.includes("AK") },
        { label: "Dark background applied", fn: (_, css) => css.includes("#0f0f") || css.includes("#1a1a") || css.includes("dark") || css.includes("1e1e") },
      ],
    },
  ],
};

// ─── Component ────────────────────────────────────────────────────────────
interface WebPlaygroundProps {
  mode: LearningMode;
  onExit: () => void;
}

export default function WebPlayground({ mode, onExit }: WebPlaygroundProps) {
  const challenges = CHALLENGES[mode] || CHALLENGES["beginner"];
  const [activeIdx, setActiveIdx] = useState(0);
  const challenge = challenges[activeIdx];

  const [html, setHtml] = useState(challenge.starterHTML);
  const [css, setCss] = useState(challenge.starterCSS);
  const [tab, setTab] = useState<"html" | "css">("html");
  const [checkResults, setCheckResults] = useState<boolean[] | null>(null);
  const [hintIdx, setHintIdx] = useState(-1);
  const [panel, setPanel] = useState<"split" | "target" | "preview">("split");

  const previewRef = useRef<HTMLIFrameElement>(null);
  const targetRef = useRef<HTMLIFrameElement>(null);

  // Live preview update
  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.srcdoc = buildDoc(html, css);
    }
  }, [html, css]);

  // Target preview
  useEffect(() => {
    if (targetRef.current) {
      targetRef.current.srcdoc = buildDoc(challenge.targetHTML, challenge.targetCSS);
    }
  }, [challenge]);

  const handleSelect = (idx: number) => {
    setActiveIdx(idx);
    setHtml(challenges[idx].starterHTML);
    setCss(challenges[idx].starterCSS);
    setCheckResults(null);
    setHintIdx(-1);
    setTab("html");
  };

  const handleCheck = useCallback(() => {
    const results = challenge.checks.map(c => c.fn(html, css));
    setCheckResults(results);
  }, [html, css, challenge]);

  const handleReset = () => {
    setHtml(challenge.starterHTML);
    setCss(challenge.starterCSS);
    setCheckResults(null);
    setHintIdx(-1);
  };

  const score = checkResults ? checkResults.filter(Boolean).length : null;
  const total = challenge.checks.length;

  return (
    <div className="flex flex-col" style={{ minHeight: "100vh", background: "#F5F0E8", fontFamily: "system-ui, sans-serif" }}>

      {/* ── Header ── */}
      <header style={{ background: "#0D0D0D", borderBottom: "4px solid #FFD60A", height: 52, display: "flex", alignItems: "center", padding: "0 20px", gap: 16 }}>
        <button onClick={onExit} style={{ background: "none", border: "none", color: "#FFD60A", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: "0.85rem" }}>
          <ArrowLeft size={16} /> Exit
        </button>
        <div style={{ width: 1, height: 24, background: "#333" }} />
        <span style={{ color: "#FFD60A", fontWeight: 900, fontSize: "0.85rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          🎨 UI Playground
        </span>
        <div style={{ background: "#FFD60A", color: "#0D0D0D", fontSize: "0.65rem", fontWeight: 900, padding: "2px 8px", textTransform: "uppercase" }}>
          {mode} mode
        </div>

        {/* panel toggles */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {(["split", "target", "preview"] as const).map(p => (
            <button key={p} onClick={() => setPanel(p)}
              style={{ background: panel === p ? "#FFD60A" : "#222", color: panel === p ? "#0D0D0D" : "#888", border: "none", padding: "6px 14px", fontWeight: 800, fontSize: "0.72rem", textTransform: "uppercase", cursor: "pointer", letterSpacing: "0.05em" }}>
              {p === "split" ? <><Maximize2 size={12} style={{ display: "inline", marginRight: 4 }} />Split</> : p === "target" ? <><Eye size={12} style={{ display: "inline", marginRight: 4 }} />Target</> : <><Code2 size={12} style={{ display: "inline", marginRight: 4 }} />Preview</>}
            </button>
          ))}
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "calc(100vh - 52px)" }}>

        {/* ── Sidebar: Challenge list ── */}
        <div style={{ width: 240, background: "#fff", borderRight: "4px solid #0D0D0D", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "12px 16px", borderBottom: "2px dashed #ddd", fontSize: "0.7rem", fontWeight: 900, textTransform: "uppercase", opacity: 0.5 }}>
            Challenges ({challenges.length})
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {challenges.map((c, i) => (
              <button key={c.id} onClick={() => handleSelect(i)}
                style={{ textAlign: "left", padding: 12, border: "2px solid #0D0D0D", background: activeIdx === i ? "#FFD60A" : "#fff", cursor: "pointer", boxShadow: activeIdx === i ? "4px 4px 0 #0D0D0D" : "none", transform: activeIdx === i ? "translate(-2px,-2px)" : "none", transition: "all 0.1s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontWeight: 900, fontSize: "0.82rem" }}>{c.title}</span>
                  <span style={{ fontSize: "0.6rem", fontWeight: 900, padding: "2px 6px", border: "2px solid #0D0D0D", background: c.difficulty === "Easy" ? "#1DB954" : c.difficulty === "Medium" ? "#FFD60A" : "#FF3B3B", color: c.difficulty === "Medium" ? "#000" : "#fff" }}>
                    {c.difficulty}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Main Content ── */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

          {/* Target Preview Panel */}
          {(panel === "split" || panel === "target") && (
            <div style={{ flex: panel === "target" ? 1 : "0 0 38%", borderRight: panel === "split" ? "3px solid #0D0D0D" : "none", display: "flex", flexDirection: "column", background: "#fff" }}>
              <div style={{ padding: "8px 16px", borderBottom: "2px solid #0D0D0D", background: "#0D0D0D", display: "flex", alignItems: "center", gap: 8 }}>
                <Eye size={14} color="#FFD60A" />
                <span style={{ color: "#FFD60A", fontWeight: 900, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Target Design</span>
                <div style={{ marginLeft: "auto", background: "#FFD60A", color: "#0D0D0D", padding: "2px 8px", fontSize: "0.65rem", fontWeight: 900, textTransform: "uppercase" }}>
                  READ ONLY
                </div>
              </div>
              <iframe ref={targetRef} style={{ flex: 1, border: "none" }} title="target-preview" sandbox="allow-scripts" />

              {/* Problem Description */}
              <div style={{ padding: 16, borderTop: "3px solid #0D0D0D", background: "#FFFEF0", maxHeight: 180, overflowY: "auto" }}>
                <div style={{ fontWeight: 900, fontSize: "1rem", marginBottom: 6 }}>{challenge.title}</div>
                <p style={{ fontSize: "0.82rem", color: "#555", lineHeight: 1.6, margin: 0 }}>{challenge.description}</p>

                {/* Checks */}
                {checkResults && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontWeight: 900, fontSize: "0.7rem", textTransform: "uppercase", marginBottom: 6 }}>
                      Score: {score}/{total} {score === total ? "🎉 Perfect!" : ""}
                    </div>
                    {challenge.checks.map((c, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.78rem", marginBottom: 4 }}>
                        {checkResults[i] ? <CheckCircle2 size={14} color="#1DB954" /> : <XCircle size={14} color="#FF3B3B" />}
                        <span style={{ color: checkResults[i] ? "#1DB954" : "#FF3B3B", fontWeight: 700 }}>{c.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Hint */}
                {hintIdx >= 0 && (
                  <div style={{ marginTop: 8, padding: 10, background: "#FFF3CD", border: "2px solid #FFD60A", fontSize: "0.8rem", borderRadius: 4 }}>
                    💡 {challenge.hints[hintIdx]}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Editor + Live Preview */}
          {(panel === "split" || panel === "preview") && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

              {/* Editor Area */}
              <div style={{ flex: "0 0 55%", borderBottom: "3px solid #0D0D0D", display: "flex", flexDirection: "column" }}>

                {/* Tab bar */}
                <div style={{ display: "flex", background: "#1a1a1a", borderBottom: "2px solid #333" }}>
                  {(["html", "css"] as const).map(t => (
                    <button key={t} onClick={() => setTab(t)}
                      style={{ padding: "8px 20px", background: tab === t ? "#0D0D0D" : "transparent", color: tab === t ? "#FFD60A" : "#666", border: "none", cursor: "pointer", fontWeight: 900, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em", borderRight: "1px solid #333" }}>
                      {t === "html" ? "🏗️ HTML" : "🎨 CSS"}
                    </button>
                  ))}
                  <div style={{ marginLeft: "auto", display: "flex", gap: 8, padding: "0 12px", alignItems: "center" }}>
                    <button onClick={() => setHintIdx(h => Math.min(h + 1, challenge.hints.length - 1))}
                      style={{ background: "#2a2a2a", border: "1px solid #444", color: "#FFD60A", padding: "4px 10px", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                      <Lightbulb size={12} /> Hint
                    </button>
                    <button onClick={handleReset}
                      style={{ background: "#2a2a2a", border: "1px solid #444", color: "#888", padding: "4px 10px", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                      <RefreshCw size={12} /> Reset
                    </button>
                    <button onClick={handleCheck}
                      style={{ background: "#1DB954", border: "none", color: "#fff", padding: "4px 14px", fontSize: "0.72rem", fontWeight: 900, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      ✓ Check
                    </button>
                  </div>
                </div>

                <textarea
                  key={`${activeIdx}-${tab}`}
                  value={tab === "html" ? html : css}
                  onChange={e => tab === "html" ? setHtml(e.target.value) : setCss(e.target.value)}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoComplete="off"
                  style={{ flex: 1, background: "#0D0D0D", color: tab === "html" ? "#79b8ff" : "#FFD60A", fontFamily: "'Fira Code', 'JetBrains Mono', monospace", fontSize: "0.85rem", lineHeight: 1.7, padding: "16px 20px", border: "none", outline: "none", resize: "none" }}
                />
              </div>

              {/* Live Preview */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "6px 16px", background: "#111", borderBottom: "2px solid #333", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ display: "flex", gap: 5 }}>
                    {["#FF5F57", "#FEBC2E", "#28C840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
                  </div>
                  <span style={{ color: "#555", fontSize: "0.7rem", fontFamily: "monospace" }}>localhost › live preview</span>
                </div>
                <iframe ref={previewRef} style={{ flex: 1, border: "none", background: "#fff" }} title="live-preview" sandbox="allow-scripts" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
