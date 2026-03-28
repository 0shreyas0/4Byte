---
description: NeuralPath Development and Syncing Workflow
---

# 🚀 NeuralPath Development & Syncing

Follow this workflow to maintain a clean, high-performance environment for the NeuralPath AI EdTech platform.

## 1. Local Development
Run the development server for real-time frontend updates.
// turbo
1. Start the server:
   ```bash
   npm run dev
   ```
2. Open [http://localhost:3000](http://localhost:3000)

## 2. Environment Setup
Keep your `.env` file updated with these critical keys:
- `NEXT_PUBLIC_FIREBASE_API_KEY` (Auth)
- `GOOGLE_GENERATIVE_AI_API_KEY` (AI Analysis)
- `NEXT_PUBLIC_YOUTUBE_API_KEY` (Learning Content)

## 3. Syncing with the Team (The "Linear" Way)
To avoid "Git Mess" and merge commits, always use rebase.
// turbo
1. Fetch latest changes:
   ```bash
   git fetch origin
   ```
2. Rebase your work on top of main:
   ```bash
   git rebase origin/main
   ```
3. If there are conflicts, resolve them and continue:
   ```bash
   git add .
   git rebase --continue
   ```
4. Push your clean history:
   ```bash
   git push origin main
   ```

## 4. Testing the Coding Lab
When testing new problems or compilers:
1. Ensure `lib/edtech/compiler.ts` has the correct `RESULT_MARKER` for the language.
2. Select the correct **Domain** (DSA, Python, etc.) from the Landing page.
3. Check the **Output Panel** for real-time Wandbox server logs.

## 5. Deployment
Before deploying, always run a build check.
// turbo
1. Run full build:
   ```bash
   npm run build
   ```
2. If the build passes, deploy to Vercel/Firebase.
