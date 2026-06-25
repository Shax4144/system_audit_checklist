export const users = [
	{
		id: 1,
		username: "admin",
		password: "admin",
		name: "Admin",
		role: "admin-mis",
		permissions: ["masterlist", "checklist", "checklist-build"],
	},
	{
		id: 2,
		username: "cjdaroy",
		password: "1",
		name: "Chester John Daroy",
		role: "admin-audit",
		permissions: ["checklist", "checklist-build"],
	},
	{
		id: 3,
		username: "jperona",
		password: "1",
		name: "Jerome Perona",
		role: "audit",
		permissions: ["checklist-build"],
	},
]

export const roles = {
  admin:  { label: "Admin",  color: "bg-red-100 text-red-700"    },
  // editor: { label: "Editor", color: "bg-blue-100 text-blue-700"  },
  // viewer: { label: "Viewer", color: "bg-gray-100 text-gray-600"  },
}