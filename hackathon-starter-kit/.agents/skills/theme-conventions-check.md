# Theme Conventions Check Skill

Use this skill when reviewing UI work for consistency with the repository's theme engine and typography system.

## Goal
Keep the product visually consistent across themes without hardcoded styling drift.

## Checklist
1. Semantic color usage
- Confirm semantic classes or CSS variables are used for primary visual styling.
- Flag hex, rgb, hsl, or arbitrary hardcoded brand colors in components unless strictly necessary.

2. Typography roles
- Use `font-heading`, `font-body`, and `font-action`.
- Avoid hardcoded font family declarations in component code.

3. Theme-mode compatibility
- Check Light mode, Dark mode, and high-contrast-like states when possible.
- Ensure foreground/background contrast remains readable.

4. Neo-brutalist fit
- Prefer strong borders, tactile surfaces, and bold hierarchy.
- Avoid soft, low-contrast, overly minimal, or pastel-heavy styling that clashes with the platform identity.

5. Layout safety
- Look for text overflow inside flex rows.
- Ensure headings wrap cleanly and important badges do not collapse awkwardly.

## Deliverable
- Report violations by file.
- Recommend token-based replacements instead of one-off style fixes.
