# Folder Structure Scan Skill

Use this skill when verifying whether new files were added to the right places and follow repository conventions.

## Goal
Prevent feature sprawl, legacy namespace drift, and oversized monolithic files.

## Checklist
1. Confirm new platform features live under EdTech-first paths where appropriate:
- `components/edtech/<FeatureName>/`
- `hooks/edtech/use<FeatureName>.ts`
- `lib/edtech/<featureName>.ts`
- `app/<route>/page.tsx`

2. Check component organization
- For complex components, prefer a dedicated folder.
- Use `index.tsx` as the main entry for complex component folders when following the repo pattern.
- Split constants, types, helpers, and subcomponents when the file becomes hard to parse.

3. Flag structure drift
- New work should not be added under legacy `hackkit` naming.
- Reusable primitives belong in `components/ui/`.
- Page-specific code should stay close to its route unless it becomes reusable.

4. Audit modularity
- If a component exceeds the 150-line rule of thumb, recommend modularization.
- Separate business logic, view logic, and configuration where possible.

## Deliverable
- List structure issues with file references.
- Suggest the target path or folder pattern for each issue.
