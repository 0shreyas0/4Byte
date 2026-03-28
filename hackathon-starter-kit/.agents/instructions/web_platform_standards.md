# Web Platform Standards

This document defines the Next.js web standards for the 4Byte smart EdTech platform.
It is written for the web lead and should align closely with the Flutter standards to keep feature workflows seamless.

## 1. Platform identity
- Project: smart EdTech product that focuses on where learners fail, why they fail, and how they recover.
- Web stack: **Next.js + Tailwind + Firebase + Node.js backend**.
- Style direction: **Neo Brutalism** with high contrast, tactile panels, strong borders, asymmetric layout, and bold learner-first copy.

## 2. Feature structure
- Use a feature-based `edtech` namespace for all new platform modules.
- Preferred folder layout:
  - `components/edtech/<FeatureName>/`
  - `hooks/edtech/use<FeatureName>.ts`
  - `lib/edtech/<featureName>.ts`
  - `app/<route>/page.tsx`

### Naming
- Component names: `CourseCard`, `LessonPlayer`, `PracticeSession`, `QuizBuilder`, `ProgressDashboard`, `ClassroomRoster`, `AdaptiveTutor`.
- Registry IDs: `kebab-case`, e.g. `progress-dashboard`, `quiz-builder`, `adaptive-tutor`.
- Use the same domain terms as Flutter so features share a consistent vocabulary.

## 3. Neo Brutalism theme rules
- Use raw geometry, thick outlines, contrast edges, and bold accent statements.
- Prefer semantic CSS variables and Tailwind theme aliases, never hardcode colors.
- Key visual tokens:
  - `--background`, `--surface`, `--foreground`
  - `--border`, `--primary`, `--secondary`, `--accent`
  - `--danger`, `--success`, `--warning`
- Use bold border strokes on cards and panels instead of soft rounded containers.
- Embrace intentional asymmetry, layered cards, cutout shapes, and subtle texture.
- Keep typography prominent: large headings, strong subheads, compact informational copy.
- Maintain accessibility with good contrast and focus states.

## 4. UI / design token mapping
- Use shared semantic intent, not platform-specific color names.
- Example Web token usage:
  - `bg-background`, `text-foreground`
  - `border-border`, `bg-card`, `text-primary`
  - `shadow-[0_35px_60px_-15px_rgba(0,0,0,0.45)]` only when needed
- For accent states, use `text-accent`, `bg-accent/10`, `border-accent`.
- For status states, map to: `text-success`, `text-danger`, `text-warning`, `text-info`.

## 5. Firebase + backend
- Keep all Firebase wrappers in `lib/firebase/` or `lib/edtech/firebase/`.
- Use typed helpers and shared DTOs for Firestore documents.
- Auth flows should use the same domain model as Flutter: `Learner`, `Instructor`, `Session`, `Course`, `AssessmentResult`.
- Back-end APIs should be thin and feature-driven, exposing endpoints like:
  - `POST /api/session/checkpoint`
  - `GET /api/learning-paths/<id>`
  - `POST /api/feedback/submit`
- Keep business logic in the Node backend, not buried in page components.

## 6. Cross-platform workflow expectations
- Every new feature must exist in both web and Flutter with the same canonical feature name.
- Share a single feature concept across platforms, even when UI implementation differs.
- Keep data contracts aligned for:
  - Course progress
  - Quiz answers and feedback
  - Classroom membership
  - Real-time collaboration state
- Use consistent event/action names like `startLesson`, `submitAnswer`, `requestHint`, `markComplete`, `syncProgress`.

## 7. Documentation and previews
- Register new web features in `lib/registry.ts` per the docs workflow.
- Add documentation preview entries in `app/docs/ComponentPreview.tsx`.
- Use real learner-centered examples in preview: courses, quiz items, study plans, coach feedback.

## 8. Developer handoff and team alignment
- Keep a shared glossary in the repo or notes so Web / Flutter / Backend use the same names.
- Define one `Neo Brutalism` design token set for Web and one matching set for Flutter.
- Use issue titles and PR descriptions that reference the shared feature name, not just `web` or `flutter`.

## 9. Code quality checks
- Use Tailwind utility classes with semantic tokens.
- Keep reusable UI primitives in `components/ui/`.
- Prefer explicit exports in `packages/ui/src/index.ts`.
- Test interactive learning surfaces in both Light and Dark modes.
- Use readable copy, stable spacing, and strong visual hierarchy.

## 10. What to avoid
- Avoid generic `Agent*` names unless the feature is literally an AI assistant.
- Avoid soft, pastel, or overly minimal styling that loses neo brutalism energy.
- Avoid mixing legacy HackKit code with new `edtech` features.
- Avoid undocumented new features; every new page or module must be registered.
