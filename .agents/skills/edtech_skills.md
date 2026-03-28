# EdTech Project Skills: Concept Graph & AI Learning

## 1. Skill: Concept Graph Analysis
**Skill Description**: Analyze student performance patterns to identify deep knowledge gaps.
- **Data Source**: Python mock scores (`Record<string, TopicScore>`).
- **Core Logic**: `lib/edtech/conceptGraph.ts`.
- **Instruction**: When analyzing a user's failure, traverse the dependency tree inverse to find the first unmastered concept.
- **Visualization**: Use SVG graphs or hierarchical lists in the `MainDashboard`.

## 2. Skill: Dynamic UI Mocking
**Skill Description**: Generate high-fidelity mockup data for any domain (Web, IoT, Security, etc.).
- **Rule**: Never use `lorem ipsum`. Generate 5-10 realistic topics per domain.
- **Rule**: Every domain should have a unique accent color (`#FF3B3B`, `#0A84FF`, `#34C759`, etc.).
- **Rule**: Icons must be context-aware (e.g. `Shield` for Security, `Smartphone` for App Dev).

## 3. Skill: Neo-Brutalist Micro-Interactions
**Skill Description**: Implement "game-feel" animations using vanilla CSS + Tailwind.
- **Input**: User clicks, hover states, errors.
- **Output**: `translate(-2px, -2px)` on hover, `shake` on error, `pop-in` on success.
- **CSS**: Keyframe definitions for `fade-in`, `float`, and `shake` in `globals.css`.

## 4. Skill: Simulation Engine
**Skill Description**: Predict how fixing one topic impacts overall performance.
- **Logic**: If topic X is fixed, it bubbles up to improve all child topics that depend on it.
- **Visual**: Use `SimulationMode` with real-time sliders and dynamic color transitions in the concept graph.
