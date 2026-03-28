# Smart EdTech Platform Conventions

This document defines naming, structure, and architecture conventions for the new smart education platform. It replaces the legacy HackKit-focused agent conventions with a domain-specific, learner-first framework.

## Purpose
- Align the codebase to an educational product that blends:
  - Adaptive learning paths (Duolingo)
  - Review, scoring, and practice management (Mathongo)
  - Classroom management and assignments (Google Classroom)
  - Team collaboration and live learning sessions (Microsoft Teams)
- Remove the old HackKit module/agent mindset in favor of EdTech-centered terminology.

## Project structure
Use a feature-based structure with an `edtech` namespace for all new platform modules.

- `components/edtech/<FeatureName>/...`
- `lib/edtech/<featureName>/...`
- `hooks/edtech/use<FeatureName>.ts`
- `app/` remains the application shell and route layer.

Example:
- `components/edtech/CourseCard/index.tsx`
- `components/edtech/QuizBuilder/QuizBuilder.tsx`
- `lib/edtech/course.ts`
- `hooks/edtech/useCourseProgress.ts`

## Naming conventions
Use descriptive, domain-specific names instead of generic "agent" labels.

- Prefer `Adaptive`, `Tutor`, `Coach`, `Learner`, `Course`, `Lesson`, `Assessment`, `Classroom`, `Study`, `Feedback`.
- Avoid `Agent*` for UI components or platform features unless the feature is literally an AI assistant submodule.
- Keep exported component names PascalCase, file names match exported component names.
- Use kebab-case for registry IDs and routes.

### Example feature names
- `CourseCard`
- `LessonPlayer`
- `PracticeSession`
- `QuizBuilder`
- `ProgressDashboard`
- `ClassroomRoster`
- `InstructorPanel`
- `PeerReview`
- `AchievementBadge`
- `AdaptiveTutor`

## Registry categories
Replace the old `AI & Tools` / `Payment` categories with EdTech-specific categories.

- `Learning Experience`
- `Assessment`
- `Classroom`
- `Collaboration`
- `Analytics`
- `Admin`

## Data model conventions
Use school/learning-specific entities consistently.

- `studentId`, `teacherId`, `courseId`, `lessonId`, `assignmentId`, `quizId`
- `studentProfile`, `classroomMembers`, `learningPath`, `assessmentResults`
- `progressScore`, `masteryLevel`, `feedbackComment`, `gradingRubric`

## Component conventions
New components should follow a feature-first pattern.

- `components/edtech/FeatureName/index.tsx`
- `components/edtech/FeatureName/FeatureName.tsx`
- `components/edtech/FeatureName/FeatureName.test.tsx`
- `components/edtech/FeatureName/FeatureName.module.css` or `FeatureName.css`

React component exports should be explicit and stable:
- `export const CourseCard = () => { ... }`
- `export { CourseCard } from './components/CourseCard';`

## Hook conventions
- Use `use<FeatureName>` names.
- Place platform hooks in `hooks/edtech/`.
- Keep hook responsibilities narrow: data loading, user state, classroom status, quiz interactions.

## New documentation workflow
- Register new learning components in `lib/registry.ts`.
- Use category names from the EdTech registry list.
- Add any new feature preview under `app/docs/previews/` if it is a surfaced product experience.

## Legacy cleanup guidance
- Keep old HackKit files in `legacy/hackkit/` if you need them for reference.
- Do not create new UI widgets or APIs under `hackkit` namespace.
- New code should use `edtech` or no namespace at all when imported from the app root.

## Quality guardrails
- Prioritize accessibility for students: focus states, keyboard navigation, readable typography.
- Use semantic markup and avoid overly aggressive animation during learning tasks.
- Treat assessments as high-confidence interactions: error states should be clear and avoid ambiguity.
- Use the platform theme variables consistently, but allow a separate edtech theme palette if needed.

## When to call this document
- Before adding a new feature to the smart EdTech product.
- Whenever a new UI module is introduced for learning, grading, collaboration, or analytics.
- Before renaming or migrating legacy HackKit assets into the new platform.
