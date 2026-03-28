---
description: How to add a new learning domain to the platform
---

# Adding a New Learning Domain

Learning domains are defined in `components/edtech/DomainSelection/index.tsx` in the `DOMAINS` array.

## Steps

### 1. Add domain card data
In the `DOMAINS` array, add an entry:
```ts
{
  id: "YourDomain",         // Unique ID used throughout the app
  name: "Display Name",
  fullName: "Subtitle / Track Name",
  icon: SomeIcon,           // Lucide icon component
  color: "#HEX",            // Card background when selected
  textColor: "#HEX",        // Text/icon color when selected
  shadow: "#HEX",           // Box-shadow color (slightly darker than color)
  description: "...",       // 1-2 sentence description
  topics: ["Topic1", ...],  // 5 topic tags shown on card
  tag: "LABEL",             // Badge label e.g. "POPULAR", "NICHE"
  difficulty: "Easy|Medium|Hard",
  level: "Beginner → Advanced",
  questions: 8,             // Always 8 for consistency
}
```

### 2. Add quiz questions
In `lib/edtech/quizData.ts`, add a new object keyed by the domain ID with 8 question objects.

### 3. Add concept graph
In `lib/edtech/conceptGraph.ts`, add the domain's concept dependency graph so the AI analysis engine knows which concepts to recommend.

### 4. Decide coding capability
In `page.tsx`, the `CODING_DOMAINS` array controls which domains offer a Coding Lab mode:
```ts
const CODING_DOMAINS = ["DSA", "Web Dev", "Python", "App Dev"];
```
Add your new domain here only if it supports live code execution.

### 5. (Optional) Add AI topic data
In `lib/edtech/ai.ts`, add domain-specific prompts or processing logic if deviating from the default.

## Design Constraints
- Each domain must have a unique, vibrant `color` from the project's accent palette.
- Use an icon that clearly represents the domain (Lucide only).
- Tags should be one of: `CORE`, `POPULAR`, `TRENDING`, `PLACEMENT`, `SPECIALIZED`, `NICHE`, `MOBILE`, `BEGINNER`.
