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
		username: "Admin-MIS",
		role: "admin",
		status: "active",
	},
	{
		id: 2,
		name: "Admin",
		username: "Admin-Audit",
		role: "admin-audit",
		status: "active",
	},
	{
		id: 3,
		name: "Audit",
		username: "Audit",
		role: "audit",
		status: "inactive",
	},
]

const tabs = [
	{ label: "Active", value: "active" },
	{ label: "Archived", value: "archived" },
]

const UserAccountsTable = () => {
  const [showArchived, setShowArchived] = useState(false)

	const filteredData = useMemo(
		() => data.filter((u) => u.status === (showArchived ? "inactive" : "active")),
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
				accessorKey: "role",
				header: "Role",
				cell: ({ row }) => (
					<Badge variant="outline" className="capitalize">
						{row.getValue("role")}
					</Badge>
				),
			},
			{
				accessorKey: "status",
				header: "Status",
				cell: ({ row }) => {
					const status = row.getValue("status")
					return (
						<Badge
							className={
								status === "active"
									? "bg-green-100 text-green-700"
									: "bg-slate-100 text-slate-500"
							}
						>
							{status}
						</Badge>
					)
				},
			},
			{
				id: "actions",
				header: "Actions",
				cell: ({ row }) => (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="h-8 w-8">
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-40 rounded-xl">
							<DropdownMenuItem>
								<Eye className="h-4 w-4" /> View
							</DropdownMenuItem>
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
