# Code Check Skill

Use this skill when reviewing, validating, or finishing any code change in the 4Byte smart EdTech platform.
This is the default quality gate skill.

## Goal
Catch structural, styling, documentation, and quality issues before a change is considered done.

## Always read first
- `.agents/instructions/README.md`
- `.agents/instructions/component_structure.md`
- `.agents/instructions/documentation_workflow.md`
- `.agents/instructions/styling_and_themes.md`
- `.agents/instructions/general_best_practices.md`
- `.agents/instructions/web_platform_standards.md`

## Run this checklist
1. Folder structure scan
- Verify new EdTech features use the expected namespaces:
  - `components/edtech/<FeatureName>/`
  - `hooks/edtech/use<FeatureName>.ts`
  - `lib/edtech/<featureName>.ts`
  - `app/<route>/page.tsx`
- Flag legacy `hackkit` placement for new work.
- Check large complex components for modularization if they exceed the 150-line guideline.

2. Export and dependency check
- Confirm reusable UI is exported explicitly where required.
- Watch for dead imports, duplicate helpers, and logic copied across features.
- Ensure critical business logic is not buried in page components.

3. Lint and static checks
- Run `npm run lint` when available.
- Treat lint errors and relevant warnings as work to fix, not noise to ignore.
- Review for obvious TypeScript issues, unhandled async flows, and stale props.

4. Color and theme conventions
- Reject hardcoded hex, rgb, or hsl values where semantic tokens should be used.
- Prefer theme-aware classes such as `bg-background`, `text-foreground`, `border-border`, `bg-card`, `text-primary`, `text-accent`, `text-success`, `text-warning`, and `text-danger`.
- Confirm new UI remains usable in Light and Dark mode.

5. Font conventions
- Ensure components use `font-heading`, `font-body`, or `font-action`.
- Flag hardcoded font families in components unless there is a documented exception.

6. Layout and interaction safety
- Check for flex overflow issues; use `min-w-0` on text-bearing flex children when needed.
- Check large heading wrapping safety.
- Confirm primary buttons, forms, and interactive states are visually obvious.
- Never introduce blinking or pulsing status dots.

7. Documentation workflow
- If a new surfaced feature or major component was added or renamed, verify:
  - `lib/registry.ts`
  - `app/docs/ComponentPreview.tsx`
  - `app/docs/Sidebar.tsx` when categories change
  - `packages/ui/src/index.ts`

8. Product language
- Prefer EdTech terms like learner, lesson, course, assessment, classroom, feedback, mastery, and study plan.
- Avoid generic `Agent*` naming for user-facing features unless it is literally an AI assistant.

## Output format
- `Passes`: concise list of what is compliant
- `Findings`: bugs, regressions, or convention violations ordered by severity
- `Fixes`: recommended next actions

## Done criteria
- Structure is correct
- Lint passes or remaining issues are explicitly called out
- Theme and font conventions are respected
- Documentation is in sync for surfaced features
