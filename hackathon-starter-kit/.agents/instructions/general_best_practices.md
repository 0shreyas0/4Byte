# General AI Best Practices

General operational rules for AI agents in this environment.

## 1. Safety & Terminal
- **Wait for Output**: Always check the status of async commands before proceeding, (IF antigravity, never run chrome browser checks unless explicitly asked)
- **Port Management**: If `3000` is in use, verify which port the dev server actually started on.
- **Error Handling**: Don't ignore lint errors or TypeScript warnings; fix them as they occur.

## 2. Aesthetics (Aesthetic First)
- We aim for **Rich Aesthetics** (vibrant colors, dynamic animations).
- If a UI looks simple or "default," add micro-animations (Framer Motion) or subtle gradients.
- Typography should be modern (e.g., Plus Jakarta Sans).

## 3. Communication
- Be proactive but informative.
- Explain the "Why" behind architectural changes.

## 4. UI Safety (Flexbox & Headings)
- **Large Headings**: If using `text-h1` (which is exceptionally large in this project at `6rem`), always use `break-all` or `flex-wrap` to prevent it from pushing adjacent elements off-screen.
- **Flex Containers**: Always use `min-w-0` on flex items that contain text or large headings to allow them to shrink/wrap instead of overflowing the container.
- **Badge Safety**: Ensure metadata badges (like "Build Status") have `shrink-0` if they are positioned next to long dynamic text.
- **No Blinking Dots**: Never use blinking/pulsing dots (e.g., `animate-pulse` on a small circle) for "Live" or "Status" indicators. They are distracting and prohibited.

## 5. Periodic Updating
- This folder is a "Living Document." 
- When an agent discovers a new repository-specific "gotcha," it is **mandatory** to record it in one of these files.
