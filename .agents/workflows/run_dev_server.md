---
description: How to start the local development server
---

# Running the NeuralPath Dev Server

// turbo-all

## Steps

1. Navigate to the web directory:
   ```
   cd d:\Coding\hackathon\parent\4Byte\web
   ```

2. Install dependencies (only needed on first run or after adding packages):
   ```
   npm install
   ```

3. Start the dev server:
   ```
   npm run dev
   ```

4. Open the browser at: `http://localhost:3000`

## Notes
- The app uses Next.js 15 with the App Router. Hot reload is enabled.
- Firebase env vars are loaded from `web/.env`. **Never commit this file.**
- If you see a white screen or hydration mismatch, check for missing `"use client"` directives on components using hooks.
- TypeScript errors will appear in the terminal. Fix them before committing.
