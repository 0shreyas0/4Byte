# Styling and Themes Instructions

This project uses a dynamic theming engine that supports multiple themes (Classic, Tokyo Night, Gruvbox, etc.) across two modes (Light/Dark).

## 1. Universal CSS Variables
NEVER use hex codes, RGB, or HSL literals in individual components.
Always use the following semantic variables:

| Variable | Usage |
| :--- | :--- |
| `--background` | Main page/app background |
| `--foreground` | Primary text color |
| `--primary` | Main action/accent color |
| `--secondary` | Subtle background elements |
| `--muted` | De-emphasized text or backgrounds |
| `--accent` | Hover states or highlights |
| `--border` | Dividers and object boundaries |
| `--card` | Background for cards/elevated surfaces |
| `--popover` | Tooltips, menus, and dropdowns |

## 2. Extended Semantic Variables
For deeper UI consistency, use these specific variables:

### Typography Scale
- `text-h1` to `text-h3`: Hero and section headings.
- `text-base`, `text-sm`, `text-xs`: Standard body text.
- `text-2xs` (10px), `text-3xs` (9px), `text-4xs` (8px), `text-5xs` (6px): Micro-copy and metadata.

### Typography Aliases & Global Font Variables
The whole app is driven by CSS variables that are controlled by the `ThemeCustomizer`:

- **Role-based font families (what you should target in components)**  
  - `font-heading` → uses `--font-heading`  
  - `font-body` → uses `--font-body`  
  - `font-action` → uses `--font-action`

- **Base variables on `:root` (do not hardcode against these; just know they exist)**  
  - `--font-sans`: global fallback for body text  
  - `--font-heading`: main heading family  
  - `--font-body`: main body/paragraph family  
  - `--font-action`: buttons, chips, small UI text  
  - `--font-mono`: code/mono (driven by Geist Mono)

The theme engine currently wires **6 actual font families** into those roles via Next.js fonts:

- `--font-jakarta` (Plus Jakarta Sans)
- `--font-inter` (Inter)
- `--font-outfit` (Outfit)
- `--font-lora` (Lora)
- `--font-space-mono` (Space Mono)
- `--font-geist-mono` (Geist Mono → mapped to `--font-mono`)

The typography tab in the `ThemeCustomizer` lets the user independently set:

- Heading font family (writes to `--font-heading`)
- Body font family (writes to `--font-body` and `--font-sans`)
- UI/Action font family (writes to `--font-action`)

**Rule**: In components, always use `font-heading`, `font-body`, or `font-action` classes instead of hardcoding any of the above families. This guarantees the whole site responds correctly when the user changes typography.

### Specialized Components
- `--code-bg`, `--code-border`: Specific variables for syntax highlighting and code blocks.
- `--category-[name]`: Preset colors for item categorization (e.g., electronics, clothing).

## 3. Dynamic Theme Compatibility
When creating a new component, you must verify it looks premium in:
1. **Light Mode** (Classic/White)
2. **Dark Mode** (Deep/Dark)
3. **High Contrast Themes** (like AMOLED)

## 4. Tailwind Usage
Prefer Tailwind utility classes that reference these variables (e.g., `bg-background`, `text-foreground`, `border-border`).
- **Do not** add custom colors to `tailwind.config.js` unless absolutely necessary.
- **Do not** use specific colors like `bg-blue-500` if it's meant to be a theme-colored element; use `bg-primary` instead.

## 5. Dynamic Theme Generation (Coolors Style)
The application supports a "Coolors Mode" (Magic Shuffle) which generates a cohesive theme dynamically using HSL math.
- **Rule**: When adding new semantic variables, ensure they are also included in the `handleCoolorsMode` logic in `useThemeEngine.ts` to maintain harmony.

## 6. Real-time Typography Updates
The typography system is reactive.
- **Rule**: Never hardcode font families. The `useThemeEngine` hook manages the application of font variables to the root element. Ensure components use the `font-heading`, `font-body`, or `font-action` classes to benefit from this.
