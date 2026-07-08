import { lazy } from "react"

const workspaceConfig = [
	{
		path: "checklist",
		component: lazy(() => import("../routes/workspace/Checklist/Checklist")),
		// wrapper: PasswordContextProvider,
	},
	{
		path: "checklist/builder/new",
		component: lazy(() => import("../components/checklist-forms/FormBuilder")),
	},
	{
		path: "checklist/builder/:id",
		component: lazy(() => import("../components/checklist-forms/FormBuilder")),
	},
	{
		path: "submission",
		component: lazy(() => import("../routes/workspace/Submission/Submission")),
	},
	{
		path: "reports",
		component: lazy(() => import("../routes/workspace/Reports/Reports")),
	},
]

export default workspaceConfig
