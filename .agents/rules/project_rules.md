---
description: Rules and constraints all agents must follow for this project
---

# NeuralPath — Project Rules

## Design: Neo-Brutalism (NON-NEGOTIABLE)
- **Zero border radius** everywhere. No `rounded-*` classes unless it's a circle (`rounded-full`).
- **Primary colors**: Yellow `#FFD60A`, Black `#0D0D0D`, Cream `#F5F0E8`.
- **Accent colors**: Red `#FF3B3B`, Blue `#0A84FF`, Green `#34C759`, Orange `#FF9F0A`, Purple `#AF52DE`, Cyan `#5AC8FA`.
- **Borders**: `border: 4px solid #0D0D0D` for major containers. `border: 3px solid #0D0D0D` for cards. `border: 2px solid #0D0D0D` for inputs/badges.
- **Shadows**: Hard-edged. `box-shadow: 6px 6px 0 #0D0D0D` on cards. `box-shadow: 8px 8px 0 #0D0D0D` on hero panels.
- **Icons**: Lucide React only. `strokeWidth={2.5}` for bold feel. No other icon libs.
- **Background**: Dot grid: `radial-gradient(circle, #00000018 1.5px, transparent 1.5px)` with `backgroundSize: 24px 24px` on `#F5F0E8`.
- **Typography**: Space Grotesk (loaded via Next.js layout). All labels uppercase + `letter-spacing: 0.1em`.

## Technical Stack
- **Framework**: Next.js 15, App Router only. No Pages router.
- **Styling**: Tailwind CSS v4 + CSS Variables in `globals.css`. No arbitrary Tailwind values—use CSS variables.
- **State**: Single state machine in `app/page.tsx`. Screen is a discriminated union type.
- **Auth**: Firebase Auth + Firestore. Import from `@/lib/firebase`. Auth state via `useAuth()`.
- **Fonts**: Via `next/font` in `app/layout.tsx`. Never use @import in CSS for fonts.

## Screen/Navigation Rules
- All screens are defined in `components/edtech/Navbar/index.tsx` as the `Screen` type union.
- Navigation is done via `navigate(screen: Screen)` from `page.tsx`.
- New screens must be added to the `Screen` type before use.
- Never use Next.js routing or `router.push()` — the app is single-page.

## Auth + User Profile
- Every new user goes through `OnboardingSurvey` after their first sign-up.
- User profile is stored in Firestore at `users/{uid}`.
- The `UserProfile` interface is defined in `lib/AuthContext.tsx`.
- Always use `useAuth()` hook, never import `auth` directly in UI components.
- The `onboarding` screen is shown when `profile.onboardingComplete === false`.

## Code Quality
- No placeholders. No lorem ipsum. All mock data must be high-fidelity.
- Every component file is `"use client"` and exports a single default component.
- No inline `<style>` tags in JSX — use `globals.css` for animations.
- Use `useCallback` for all event handlers passed as props.
- No `any` types except in catch blocks (`err: unknown` or `err: any`).
