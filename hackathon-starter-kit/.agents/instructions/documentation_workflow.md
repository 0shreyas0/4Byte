# Documentation Workflow

This repository is being re-oriented toward a smart EdTech product. Any new feature, page, or major component update MUST be reflected in the documentation metadata and preview system.

## Mandatory Steps for New EdTech Features

Whenever you create a new feature or rename an existing one, perform these steps:

### 1. Register in the COMPONENT REGISTRY (`lib/registry.ts`)
Add or update a metadata entry:
- **id**: unique kebab-case slug (e.g., `course-card`)
- **name**: human-readable component name (e.g., `CourseCard`)
- **description**: concise learner-facing one-liner
- **category**: must be one of the new EdTech categories below
- **difficulty**: `Simple` | `Modular` | `Advanced`
- **modularStructure**: list the key files and folders for the feature

### 2. Add a Preview in `app/docs/ComponentPreview.tsx`
- Add a dynamic import for the new feature with `{ ssr: false }`
- Add a new `case` branch in `switch (id)` with a realistic interactive preview
- Wrap the preview in a responsive container with `max-w-*`, `mx-auto`, and safe spacing
- Show the feature in context, not just as a bare component

### 3. Update Sidebar Categories if Needed (`app/docs/Sidebar.tsx`)
- `CATEGORIES` defines documentation sections and navigation order
- If you add a new category, insert it logically for the learner experience
- Keep categories focused on product flows, not internal implementation details

### 4. Export from the UI Barrel (`packages/ui/src/index.ts`)
- Ensure the feature is exported from the root UI entrypoint
- Use explicit exports instead of `export *` where possible for clarity

### 5. Register New Feature Assets
If the feature includes hooks or library helpers, keep those under `hooks/edtech` and `lib/edtech` and document the modular structure in the registry entry.

## EdTech Documentation Categories
Replace legacy categories with platform-first categories:
- `Learning Experience`
- `Assessment`
- `Classroom`
- `Collaboration`
- `Analytics`
- `Admin`

## Recommended EdTech Feature Names
Use domain-specific names instead of generic `Agent*` terms:
- `CourseCard`, `LessonPlayer`, `PracticeSession`, `QuizBuilder`, `ProgressDashboard`
- `ClassroomRoster`, `InstructorPanel`, `PeerReview`, `AchievementBadge`
- `AdaptiveTutor`, `StudyPlan`, `FeedbackPanel`, `AssessmentSummary`

## Example Registry Entry
```ts
{
  id: 'progress-dashboard',
  name: 'ProgressDashboard',
  description: 'Shows a student’s learning progress, mastery levels, and next recommended lessons.',
  category: 'Analytics',
  difficulty: 'Modular',
  modularStructure: [
    'components/edtech/ProgressDashboard/ProgressDashboard.tsx',
    'hooks/edtech/useProgressDashboard.ts',
    'lib/edtech/progress.ts'
  ]
}
```

## Why This Matters
The docs route is the product catalog for the platform. If the registry is out of sync, the feature may not be searchable or discoverable by product teams.

## Legacy Cleanup Guidance
- Do not add new features under the old `hackkit` namespace.
- Keep legacy HackKit code in `legacy/hackkit/` if needed for reference.
- New features should use `components/edtech`, `lib/edtech`, and `hooks/edtech` where appropriate.

## Documentation Best Practices
- Keep demos interactive and relevant to the learner flow
- Use real-looking data in previews (courses, students, grades, assignments)
- Keep copy user-focused: student/teacher, lesson, assessment, feedback
- Register every feature change immediately; do not rely on auto-discovery

