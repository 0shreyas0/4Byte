# Documentation Workflow

This project is a component template library. Any new component or major update MUST be immediately reflected in the documentation.

## Mandatory Steps for New Components

Whenever you create a new component (or rename an existing one), you MUST p erform these steps:

### 1. Register in COMPONENT_REGISTRY (`lib/registry.ts`)
Add a metadata entry:
- **id**: A unique kebab-case slug (e.g., `search-bar`)
- **name**: Human-readable name (e.g., `SearchBar`)
- **description**: A concise, premium-sounding one-liner
- **category**: Must be one of: `Base UI` | `Layout` | `Auth` | `AI & Tools` | `Search & Data` | `Payment`
- **difficulty**: `Simple` | `Modular` | `Advanced`
- **modularStructure**: List the key files and directories

### 2. Add to ComponentPreview (`app/docs/ComponentPreview.tsx`)
- Add a `dynamic()` import for the component (always `{ ssr: false }`)
- Add a `case` in the `switch (id)` block with a working, realistic demo
- Wrap the component in a sensible container with `max-w-*` and `mx-auto`

### 3. Update Sidebar if adding a NEW category (`app/docs/Sidebar.tsx`)
- The `CATEGORIES` array in `Sidebar.tsx` controls what appears in the sidebar nav
- Add the new category name to the array in a logical position

### 4. Verify export from index (`packages/ui/src/index.ts`)
Ensure the component is re-exported from the root barrel file.

## Current Component Catalog (20 components)

| Category | Components |
|---|---|
| Base UI | Button, Card, Input, CodeSnippet, ThemeToggler, UserProfile, PageTransition |
| Layout | Navbar, Footer |
| Auth | LogIn |
| AI & Tools | AIChat, AIDemo, AgentVoiceControl, PDFProcessor, TeamChat, VoiceComms, ThemeCustomizer |
| Search & Data | SearchBar |
| Payment | RazorpayButton |

## Why This Matters
The `app/docs` route dynamically generates pages for components based on the registry. If you don't update the registry, the component essentially doesn't exist for the end-user browsing the library.

