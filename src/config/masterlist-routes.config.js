import { lazy } from "react"

const masterlistConfig = [
	{
		path: "user-accounts",
		component: lazy(
			() => import("../routes/masterlist/UserAccounts/UserAccounts"),
		),
		// wrapper: PasswordContextProvider,
	},
	{
		path: "roles",
		component: lazy(() => import("../routes/masterlist/Roles/Roles")),
	},
]

export default masterlistConfig
