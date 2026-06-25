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
		name: "Jollibee",
		address: "13th Street. 47 W 13th St, New York, NY 10011, USA",
		status: "active",
		created_at: "2026-03-18T01:59:34.000000Z",
		updated_at: "2026-05-15T08:36:52.000000Z",
		deleted_at: null,
	},
	{
		id: 2,
		name: "McDonalds",
		address: "14th Street. 47 W 13th St, New York, NY 10011, USA",
		status: "active",
		created_at: "2026-03-18T01:59:34.000000Z",
		updated_at: "2026-05-15T08:36:52.000000Z",
		deleted_at: null,
	},
	{
		id: 3,
		name: "KFC",
		address: "14th Street. 47 W 13th St, New York, NY 10011, USA",
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

const SupplierTable = () => {
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
				accessorKey: "address",
        header: "Address",
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

export default SupplierTable
