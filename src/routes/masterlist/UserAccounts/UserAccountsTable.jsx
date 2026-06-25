import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Pencil, ArchiveX, MoreHorizontal, Eye } from "lucide-react"
import TableWrapper from "../../../components/TableWrapper"
import StatusToggle from "../../../components/StatusToggle"

// dummy data — replace with useQuery/fetch
const data = [
	{
		id: 1,
		name: "Admin",
		username: "admin",
		roles: [
			{
				id: 1,
				name: "admin-mis",
			},
		],
		charge: {
			id: 398,
			code: "0398",
			name: "FOX173 - MAGLIMAN",
			company_code: "01",
			business_unit_code: "31",
			business_unit_name: "Fresh Options",
			department_code: "3100",
			department_name: "Sales and Marketing",
			unit_code: "3120",
			unit_name: "Region B",
			sub_unit_code: "0326",
			sub_unit_name: "Area 6",
			location_code: "2173",
			location_name: "FOX173 - Magliman",
		},
		first_name: "ADMIN",
		middle_name: null,
		last_name: "USER",
		suffix: null,
		role_id: 1,
		charge_id: 398,
		charge_name: "FOX173 - MAGLIMAN",
		created_at: "2026-05-21T03:29:41.000000Z",
		updated_at: "2026-05-25T05:02:37.000000Z",
		deleted_at: null,
	},
	{
		id: 2,
		name: "CHESTER JOHN DAROY",
		username: "cjdaroy",
		roles: [
			{
				id: 2,
				name: "admin-audit",
			},
		],
		charge: {
			id: 398,
			code: "0398",
			name: "FOX173 - MAGLIMAN",
			company_code: "01",
			business_unit_code: "31",
			business_unit_name: "Fresh Options",
			department_code: "3100",
			department_name: "Sales and Marketing",
			unit_code: "3120",
			unit_name: "Region B",
			sub_unit_code: "0326",
			sub_unit_name: "Area 6",
			location_code: "2173",
			location_name: "FOX173 - Magliman",
		},
		first_name: "CHESTER",
		middle_name: null,
		last_name: "DAROY",
		suffix: null,
		role_id: 2,
		charge_id: 398,
		charge_name: "FOX173 - MAGLIMAN",
		created_at: "2026-05-21T03:29:41.000000Z",
		updated_at: "2026-05-25T05:02:37.000000Z",
		deleted_at: null,
	},
	{
		id: 3,
		name: "JEROME PERONA",
		username: "jperona",
		roles: [
			{
				id: 3,
				name: "audit",
			},
		],
		charge: {
			id: 398,
			code: "0398",
			name: "FOX173 - MAGLIMAN",
			company_code: "01",
			business_unit_code: "31",
			business_unit_name: "Fresh Options",
			department_code: "3100",
			department_name: "Sales and Marketing",
			unit_code: "3120",
			unit_name: "Region B",
			sub_unit_code: "0326",
			sub_unit_name: "Area 6",
			location_code: "2173",
			location_name: "FOX173 - Magliman",
		},
		first_name: "JEROME",
		middle_name: null,
		last_name: "PERONA",
		suffix: null,
		role_id: 3,
		charge_id: 398,
		charge_name: "FOX173 - MAGLIMAN",
		created_at: "2026-05-21T03:29:41.000000Z",
		updated_at: "2026-05-25T05:02:37.000000Z",
		deleted_at: null,
	},
	{
		id: 1,
		name: "AUDIT",
		username: "audit",
		roles: [
			{
				id: 1,
				name: "audit",
			},
		],
		charge: {
			id: 398,
			code: "0398",
			name: "FOX173 - MAGLIMAN",
			company_code: "01",
			business_unit_code: "31",
			business_unit_name: "Fresh Options",
			department_code: "3100",
			department_name: "Sales and Marketing",
			unit_code: "3120",
			unit_name: "Region B",
			sub_unit_code: "0326",
			sub_unit_name: "Area 6",
			location_code: "2173",
			location_name: "FOX173 - Magliman",
		},
		first_name: "AUDIT",
		middle_name: null,
		last_name: "USER",
		suffix: null,
		role_id: 3,
		charge_id: 398,
		charge_name: "FOX173 - MAGLIMAN",
		created_at: "2026-05-21T03:29:41.000000Z",
		updated_at: "2026-05-25T05:02:37.000000Z",
		deleted_at: "2026-05-25T05:02:37.000000Z",
	},
]

const tabs = [
	{ label: "Active", value: "active" },
	{ label: "Archived", value: "archived" },
]

const UserAccountsTable = () => {
  const [showArchived, setShowArchived] = useState(false)

	const filteredData = useMemo(
		() =>
			data.filter((u) =>
				showArchived ? u.deleted_at !== null : u.deleted_at === null,
			),
		[showArchived],
	)
	const columns = useMemo(
		() => [
			{
				accessorKey: "name",
				header: "Name",
			},
			{
				accessorKey: "username",
				header: "Username",
			},
			{
				accessorKey: "roles",
				header: "Role",
				cell: ({ row }) => (
					<div className="flex gap-1 flex-wrap">
						{row.getValue("roles").map((role) => (
							<Badge key={role.id} variant="outline" className="capitalize">
								{role.name}
							</Badge>
						))}
					</div>
				),
			},
			{
				accessorKey: "deleted_at",
				header: "Status",
				cell: ({ row }) => {
					const isArchived = row.getValue("deleted_at") !== null
					return (
						<Badge
							className={
								isArchived
									? "bg-slate-100 text-slate-500"
									: "bg-green-100 text-green-700"
							}
						>
							{isArchived ? "Archived" : "Active"}
						</Badge>
					)
				},
			},
			{
				id: "actions",
				header: "Actions",
				cell: ({ row }) => (
					<DropdownMenu>
						{/* button */}
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="h-8 w-8">
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						{/* content */}
						<DropdownMenuContent align="end" className="w-40 rounded-xl">
							<DropdownMenuItem>
								<Pencil className="h-4 w-4" /> Edit
							</DropdownMenuItem>

							<DropdownMenuSeparator />

							<DropdownMenuItem variant="destructive">
								<ArchiveX className="h-4 w-4" /> Archive
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				),
			},
		],
		[],
	)

	return (
		<TableWrapper
			columns={columns}
			data={filteredData}
			searchKey="name"
			filterSlot={
        <StatusToggle
          checked={showArchived}
          onCheckedChange={setShowArchived}
        />
			}
		/>
	)
}

export default UserAccountsTable
