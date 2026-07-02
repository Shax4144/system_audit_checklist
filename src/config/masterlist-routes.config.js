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
	{
		path: "supplier",
		component: lazy(() => import("../routes/masterlist/Supplier/Supplier")),
	},
	{
		path: "category",
		component: lazy(() => import("../routes/masterlist/Category/Category")),
	},
	// {
	// 	path: "address",
	// 	component: lazy(() => import("../routes/masterlist/Address/Address")),
	// }
]

export default masterlistConfig
