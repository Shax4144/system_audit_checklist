import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArchiveX, MoreHorizontal, Pencil } from "lucide-react"
import { useMemo, useState } from "react"
import StatusToggle from "../../../components/StatusToggle"
import TableWrapper from "../../../components/TableWrapper"

// dummy data — replace with useQuery/fetch
const data = [
	{
		id: 1,
		name: "admin",
		permissions: ["masterlist", "checklist"],
		status: "active",
		created_at: "2026-03-18T01:59:34.000000Z",
		updated_at: "2026-05-15T08:36:52.000000Z",
		deleted_at: null,
	},
	{
		id: 2,
		name: "admin-audit",
		permissions: ["masterlist", "checklist"],
		status: "active",
		created_at: "2026-03-18T01:59:34.000000Z",
		updated_at: "2026-05-15T08:36:52.000000Z",
		deleted_at: null,
	},
	{
		id: 3,
		name: "audit",
		permissions: ["checklist-build"],
		status: "inactive",
		created_at: "2026-03-18T01:59:34.000000Z",
		updated_at: "2026-05-15T08:36:52.000000Z",
		deleted_at: "2026-05-15T08:36:52.000000Z",
	},
]

const tabs = [
	{ label: "Active", value: "active" },
	{ label: "Archived", value: "archived" },
]

const RolesTable = () => {
	const [showArchived, setShowArchived] = useState(false)

	const filteredData = useMemo(
		() =>
			data.filter((u) => u.status === (showArchived ? "inactive" : "active")),
		[showArchived],
	)
	const columns = useMemo(
		() => [
			{
				accessorKey: "name",
				header: "Name",
			},
			{
				accessorKey: "permissions",
				header: "Permission",
				cell: ({ row }) => {
					const permissions = row.getValue("permissions")
					return (
						<div className="flex flex-wrap gap-1">
							{permissions.map((permission) => (
								<Badge
									key={permission}
									variant="outline"
									className="capitalize"
								>
									{permission}
								</Badge>
							))}
						</div>
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

export default RolesTable
