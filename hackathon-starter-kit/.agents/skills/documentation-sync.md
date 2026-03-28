# Documentation Sync Skill

Use this skill when a change introduces a new feature, renames a surfaced module, or significantly changes a documented component.

## Goal
Keep the product catalog, preview system, and exported component surface in sync with the implementation.

## Checklist
1. Registry
- Add or update the feature entry in `lib/registry.ts`.
- Ensure `id`, `name`, `description`, `category`, `difficulty`, and `modularStructure` are accurate.

2. Preview
- Add or update the feature in `app/docs/ComponentPreview.tsx`.
- Use a realistic learner-centered preview, not a bare placeholder.

3. Sidebar
- Update `app/docs/Sidebar.tsx` if a new category or navigation grouping is needed.

4. UI exports
- Confirm surfaced components are exported from `packages/ui/src/index.ts` when appropriate.

5. Vocabulary
- Use EdTech category names:
  - `Learning Experience`
  - `Assessment`
  - `Classroom`
  - `Collaboration`
  - `Analytics`
  - `Admin`

## Deliverable
- State whether docs are fully synced.
- If not, list the missing files and exact follow-up needed.
