# Hackathon Starter Kit 🚀

A comprehensive "boilerplate-killer" library for hackathons. Designed to let you focus on your core idea and ship in minutes, not hours.

## 📦 Features

- **Project Starters**: Pre-configured Next.js + TypeScript + Tailwind.
- **UI library**: Premium components using Framer Motion & Lucide.
- **Payments**: Ready-to-use Razorpay integration (Order creation + Frontend Button).
- **AI Integration**: OpenAI wrappers for standard and streaming responses.
- **Auth & DB**: CRUD templates and interface definitions for Supabase/Prisma.
- **Algorithms**: Common utilities (debounce, throttle, deepClone, etc.).
- **Data Parsing**: CSV parsers and file download helpers.
- **Deployment**: Configured `.env.example` for Vercel, Railway, and Supabase.

## 📂 Structure

```text
hackathon-kit/
├── algorithms/      # Core logic utilities (debounce, uuid, etc.)
├── components/
│   ├── layouts/     # Navbar, Footer, Sidebar
│   ├── ui/          # Atomic components (Buttons, Modals, Cards)
│   ├── templates/   # Complex UI patterns (Filter sidebars, Dashboards)
│   └── charts/      # Data visualization (Recharts/Chart.js)
├── docs/            # Pitch templates and guides
├── hooks/           # Custom React hooks (useRazorpay, useMediaQuery)
├── lib/
│   ├── ai/          # OpenAI wrappers
│   ├── api/         # Fetcher, Razorpay, Realtime
│   ├── db/          # Database CRUD helpers
│   └── utils/       # Validation (Zod), Parsers, Formatting
├── scripts/         # Mock data generators and seed scripts
└── templates/       # Full project starter repos
```

## 🚀 Getting Started

1. **Clone the pattern**:
   ```bash
   # Copy the folders you need into your project
   ```

2. **Install core dependencies**:
   ```bash
   npm install framer-motion lucide-react clsx tailwind-merge class-variance-authority next-themes razorpay zod
   ```

3. **Configure Environment**:
   Copy `.env.example` to `.env.local` and add your keys.

## ✨ Key Components

### Razorpay Payments
Includes a `useRazorpay` hook and a `RazorpayButton` component. Simply pass the amount and handle success.

### AI Wrapper
Functions in `lib/ai/openai.ts` handles API calls and streaming out of the box.

### Modern UI
All components in `components/ui` are built with **Glassmorphism**, **Spring Animations**, and **Dark Mode** support.

---

*Built for speed. Built for the win.* 🏆
