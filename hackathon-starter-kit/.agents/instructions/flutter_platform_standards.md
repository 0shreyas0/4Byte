# Flutter Platform Standards

This document defines the Flutter app standards for the 4Byte smart EdTech platform.
It is designed to match the Web standards and keep both codebases aligned around the same learning product.

## 1. Platform identity
- Mobile app stack: **Flutter + Firebase + Node.js backend**.
- Style direction: **Neo Brutalism** with bold forms, vivid accent colors, strong borders, and tactile educational surfaces.
- Focus: help learners identify failure points, surface corrective feedback, and make learning progress visible.

## 2. Feature structure
- Use a feature-based project layout under `lib/`.
- Preferred folder layout:
  - `lib/features/<feature_name>/widgets/`
  - `lib/features/<feature_name>/models/`
  - `lib/features/<feature_name>/services/`
  - `lib/features/<feature_name>/controllers/` or `providers/`
  - `lib/themes/`

### Naming
- Widget names should match Web feature names: `CourseCard`, `LessonPlayer`, `PracticeSession`, `QuizBuilder`, `ProgressDashboard`, `ClassroomRoster`, `AdaptiveTutor`.
- Use Dart lower_snake_case for files: `course_card.dart`, `lesson_player.dart`, `practice_session.dart`.
- Keep domain models consistent with Web: `studentId`, `teacherId`, `courseId`, `lessonId`, `assignmentId`, `quizId`, `feedbackComment`.

## 3. Neo Brutalism theme rules
- Build a shared theme palette in `lib/themes/neo_brutalism_theme.dart`.
- Use `ColorScheme` and semantic color variables, not hardcoded hex values scattered across widgets.
- Key design tokens:
  - `background`, `surface`, `border`, `primary`, `secondary`, `accent`
  - `success`, `error`, `warning`, `info`
- Embrace bold borders and raw panels. Use `Border.all(width: 3)` or more for key cards.
- Prefer blocky shape language, asymmetric sections, and elevated components with strong shadows.
- Typography should be large and directive for learner flows.

## 4. Shared token patterns
- Create a shared semantic style contract that maps to Web tokens.
- Example Dart naming:
  - `AppColors.background`
  - `AppColors.surface`
  - `AppColors.border`
  - `AppColors.primary`
  - `AppColors.accent`
  - `AppTextStyles.heading`, `AppTextStyles.body`, `AppTextStyles.caption`
- Use semantic tokens in Flutter widgets:
  - `Container(color: AppColors.surface)`
  - `Text('Quiz', style: AppTextStyles.heading)`
  - `OutlinedButton(style: borderSide: BorderSide(color: AppColors.border))`

## 5. Firebase + backend
- Keep Firebase utilities in `lib/services/firebase/`.
- Use `firebase_auth`, `cloud_firestore`, and optionally `firebase_functions`.
- Map data models to the same domain contract as Web, so Firestore documents share field names.
- Keep auth and user state consistent:
  - `Learner`, `Instructor`, `Session`, `Course`, `AssessmentResult`, `ProgressSnapshot`
- Prefer a thin app layer; business logic should be in services/controllers, not UI widgets.

## 6. Cross-platform workflow expectations
- Mirror Web feature names and behavior semantics across Flutter.
- Keep shared user journeys aligned for:
  - course enrollment
  - lesson playback
  - quiz completion
  - hint/help requests
  - feedback and remediation
- Use the same glossary, event names, and feature definitions across both repos.
- When a Web feature lands, Flutter should adopt the same canonical domain name in the next sprint.

## 7. Accessibility and usability
- Use high contrast text, large touch targets, and clear focus indicators.
- Avoid tiny buttons, faint labels, and subtle section dividers.
- Use strong spacing around cards and panels, especially in mobile contexts.
- Provide clear state transitions on learner actions: success, warning, error.

## 8. Documentation and release discipline
- Document every new Flutter feature in the shared project governance notes.
- Keep a feature alignment table in the team runbook if needed: feature name, Web path, Flutter module, backend contract.
- Use the same feature name in PR titles and issue tickets to avoid drift.

## 9. What to avoid
- Avoid generic UI patterns that feel like standard admin apps. This must feel educational, not enterprise-only.
- Avoid bright gradients or soft shadows that contradict the neo brutalism theme.
- Avoid duplicating state logic in multiple widgets; centralize it in controllers, providers, or services.
- Avoid inconsistent domain names between the Flutter app and Web app.
