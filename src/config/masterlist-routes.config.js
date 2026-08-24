import { lazy } from "react"

const masterlistConfig = [
	{
		path: "user-accounts",
		component: lazy(
			() => import("../routes/masterlist/UserAccounts/UserAccounts"),
		),
		permissions: ["Masterlist"]
	},
	{
		path: "roles",
    component: lazy(() => import("../routes/masterlist/Roles/Roles")),
		permissions: ["Masterlist"]
	},
	{
		path: "supplier",
    component: lazy(() => import("../routes/masterlist/Supplier/Supplier")),
		permissions: ["Masterlist"]
	},
	{
		path: "category",
    component: lazy(() => import("../routes/masterlist/Category/Category")),
		permissions: ["Masterlist"]
	},
]

export default masterlistConfig
