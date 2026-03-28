# Web Platform Standards (v1.0)

## 1. Responsiveness
- All components must be **Mobile First**.
- Use `clamp()` for font sizes: `fontSize: "clamp(2rem, 5vw, 3.5rem)"`.
- Grid systems must be `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` to handle varied viewport widths.
- Padding should scale: `px-4 sm:px-6 md:px-12`.

## 2. Accessibility (a11y)
- **High Contrast**: Minimum 4.5:1 ratio (Black on Yellow is 19:1 — excellent).
- **Focus Rings**: Use `focus-visible:ring-4 focus-visible:ring-yellow-400`.
- **Buttons**: All buttons must have `aria-label` or descriptive text.
- **Semantic HTML**: Use `<header>`, `<main>`, `<nav>`, `<aside>`, and `<section>` tags.
- **Labels**: No interactive element without an `id`.

## 3. SEO & Metadata
- Every page component should export `Metadata`.
- Use descriptive `<Title>` tags.
- Ensure `robots.txt` and `sitemap.xml` are generated.
- `h1` must contain primary keywords for the page context.

## 4. Design Consistency
- **Buttons**: All use the `.brutal-btn` class (or equivalent inline styles).
- **Headers**: Sticky `z-50` headers everywhere.
- **Shadows**: Same hard-edged shadow on all cards for "stacked" depth effect.
- **Fonts**: Use Google Fonts `Inter` or `Outfit` for modern brutalist look.
