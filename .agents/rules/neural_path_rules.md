# Core Engineering Rules & Design Principles

## 1. Design Philosophy: Neo-Brutalism
- **Sharp Corners Only**: No `rounded-*` classes unless it's a circle (e.g. `rounded-full`). All cards, buttons, and inputs must use 0 border radius.
- **High Contrast Palette**: 
  - Primary: `#FFD60A` (Stark Yellow)
  - Secondary: `#0D0D0D` (Deep Black)
  - Accent: Vibrant colors (Red `#FF3B3B`, Green `#1DB954`, Blue `#3B82F6`)
- **Stark Borders**: Use `border: 4px solid #0D0D0D` for most containers.
- **Harsh Shadows**: Use hard-edged shadows: `box-shadow: 4px 4px 0px #000`.
- **Micro-Animations**: Use `shake`, `fade-in`, `pop-in`, and `float` animations (defined in `globals.css`) for interactivity.

## 2. Technical Stack
- **Framework**: Next.js 15+ (App Router).
- **Styling**: Tailwind CSS v4 + Vanilla CSS Variables.
- **Icons**: Lucide React only. Use `strokeWidth={2.5}` for a bold look.
- **State Management**: React `useState`/`useCallback` for local UI; state-machine logic in `page.tsx`.

## 3. Code Standards
- **Components**: Functional components with TypeScript interfaces.
- **Performance**: Use `useCallback` for all stable functions passed to children.
- **Clean Code**: No placeholders. All mock data should be high-fidelity.
- **SEO**: Every page must have proper metadata and a single `h1`.

## 4. EdTech Logic
- **Concept Graph**: All learning paths must honor concept dependencies.
- **Feedback**: Wrong answers must re-trigger the `shake` animation (use key-cycling).
- **Processing**: Simulate AI "thinking" with an expressive `AIProcessingScreen`.
