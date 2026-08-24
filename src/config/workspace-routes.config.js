import { lazy } from "react";

const workspaceConfig = [
  {
    path: "dashboard",
    component: lazy(() => import("../routes/workspace/Dashboard/Dashboard")),
    permissions: ["Dashboard"]
  },
  {
    path: "checklist",
    component: lazy(() => import("../routes/workspace/Checklist/Checklist")),
    permissions: ["Checklist"]
  },
  {
    path: "checklist/builder/new",
    component: lazy(() => import("../components/checklist-forms/FormBuilder")),
    permissions: ["Checklist"]
  },
  {
    path: "checklist/builder/:id",
    component: lazy(() => import("../components/checklist-forms/FormBuilder")),
    permissions: ["Checklist"]
  },
  {
    path: "checklist/builder/:id/preview",
    component: lazy(() => import("../components/checklist-forms/FormPreview")),
    permissions: ["Checklist"]
  },
  {
    path: "checklist-assignment",
    component: lazy(
      () =>
        import("../routes/workspace/ChecklistAssignment/ChecklistAssignmentDashboard"),
    ),
    permissions: ["Checklist-build"]
  },
  {
    path: "checklist-assignment/:id",
    component: lazy(
      () =>
        import("../routes/workspace/ChecklistAssignment/ChecklistAssignmentDetail"),
    ),
    permissions: ["Checklist-build"]
  },
  // {
  // 	path: "submission",
  // 	component: lazy(() => import("../routes/workspace/Submission/Submission")),
  // },
  {
    path: "reports",
    component: lazy(
      () => import("../routes/workspace/Reports/ReportDashboard"),
    ),
    permissions: ["Report"]
  },
  {
    path: "reports/:id",
    component: lazy(() => import("../routes/workspace/Reports/ReportDetail")),
    permissions: ["Report"]
  },
];

export default workspaceConfig;
