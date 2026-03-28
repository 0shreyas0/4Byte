# AI Instructions System

This folder contains critical instructions that any AI agent working on this codebase MUST read and follow before starting any task. 

## Purpose
To ensure consistency, high-quality aesthetics, and maintainability across the application. This project uses a sophisticated theming system and specific architectural patterns that must be respected.

## Core Rules for All Agents
1. **Read Before Writing**: Check all `.md` files in this directory before modifying or creating any code.
2. **Never Hardcode Colors**: Always use the semantic CSS variables defined in `/styles/globals.css`.
3. **Respect the Theme Mode**: All UI elements must be tested in both Light and Dark modes.
4. **Self-Updating**: If you encounter a new pattern, rule, or recurring "lesson learned," you are expected to update the relevant instruction file or add a new one here.

## Directory Index
- [styling_and_themes.md](./styling_and_themes.md): Rules for CSS, colors, and the theme engine.
- [component_structure.md](./component_structure.md): Best practices for React components.
- [documentation_workflow.md](./documentation_workflow.md): Mandatory steps to register components in the library.
- [smart_edtech_conventions.md](./smart_edtech_conventions.md): Naming, structure, and taxonomy for the new smart EdTech product.
- [web_platform_standards.md](./web_platform_standards.md): Next.js standards for the web EdTech experience.
- [flutter_platform_standards.md](./flutter_platform_standards.md): Flutter app standards for the smart EdTech platform.
