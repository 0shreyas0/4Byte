import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { ConceptMap } from "./pages/ConceptMap";
import { Practice } from "./pages/Practice";
import { Analytics } from "./pages/Analytics";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "concept-map", Component: ConceptMap },
      { path: "practice", Component: Practice },
      { path: "analytics", Component: Analytics },
    ],
  },
]);
