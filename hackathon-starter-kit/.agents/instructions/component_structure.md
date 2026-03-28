# Component Structure Instructions

Best practices for creating and maintaining React components in this project.

## 1. Modularity
- Components should be self-contained in the `components/` directory.
- **Rule: 150-Line Limit**: If a component exceeds 150 lines, it MUST be modularized. Break logic into custom hooks, constants into separate files, and sub-components into a dedicated folder (e.g., `components/ui/my-component/`).
- **Example**: See `components/ui/theme-customizer/` where `ThemeCustomizer.tsx` uses `ColorPanel.tsx` and `TypographyPanel.tsx` to maintain readability.
- Large monolithic files are harder for both humans and AI to parse and maintain.

## 2. Folder Structure for Complex Components
- Use a dedicated folder for complex components:
    - **`index.tsx`**: (The main component logic goes directly here. **Avoid forming a `ThingName.tsx` just to re-export it from `index.ts`**.)
    - `types.ts`
    - `constants.ts`
    - `utils.ts` or `hooks.ts`
    - `SubComponentA.tsx`
    - `SubComponentB.tsx`
- **Strings**: If a string is a brand name or a configuration value (like "Your Marketplace"), it should be passed as a **prop**.
- **Images**: Use the `Image` component from `next/image` with proper `alt` tags.

## 3. UI Consistency
- Use the provided UI primitives (buttons, inputs, etc.) located in `components/ui`.
- All layouts should be mobile-responsive by default.

## 4. Updates & Evolution
- If you find yourself repeatedly explaining the same logic or fix, update THIS file so future agents (or your future self) don't repeat the mistake.
