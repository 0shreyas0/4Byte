---
description: How to add a new screen/page to NeuralPath
---

# Adding a New Screen to NeuralPath

## Overview
The app uses a flat single-page state machine in `web/app/page.tsx`. All screens are rendered conditionally based on the `screen` state.

## Steps

1. **Define the screen name** — Add a new string literal to the `Screen` union type in `web/components/edtech/Navbar/index.tsx`:
   ```ts
   export type Screen = "landing" | "auth" | "domain-select" | ... | "your-new-screen";
   ```

2. **Create the component** — Create a new folder in `web/components/edtech/YourScreenName/` with an `index.tsx` file. Must be a `"use client"` React functional component in Neo-Brutalist style.

3. **Import in page.tsx** — Add the import at the top of `web/app/page.tsx`:
   ```ts
   import YourScreenName from "@/components/edtech/YourScreenName";
   ```

4. **Add state handler** — Define a `useCallback` handler if navigation logic is needed:
   ```ts
   const handleYourAction = useCallback(() => {
     navigate("your-new-screen");
   }, [navigate]);
   ```

5. **Render the screen** — Add a conditional block inside `<main>` in `page.tsx`:
   ```tsx
   {screen === "your-new-screen" && (
     <YourScreenName
       onComplete={() => navigate("next-screen")}
       onBack={() => navigate("prev-screen")}
     />
   )}
   ```

6. **Add Navbar entry (optional)** — If this screen should appear in the top nav, add it to `NAV_ITEMS` in `Navbar/index.tsx` with the appropriate `group` array.

## Design Checklist
- [ ] Sharp 0-radius corners only
- [ ] Dot-grid background via `backgroundImage: "radial-gradient(circle, #00000018 1.5px, transparent 1.5px)"` with `backgroundSize: "24px 24px"`
- [ ] `border: 4px solid #0D0D0D` on major containers
- [ ] Hard `box-shadow: 6px 6px 0 #0D0D0D` on cards
- [ ] Accent color is `#FFD60A` (yellow)
- [ ] Micro-animations: use `.animate-slide-in`, `.pop-in`, `.shake` from `globals.css`
- [ ] Lucide icons with `strokeWidth={2.5}`
