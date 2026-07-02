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
import { Pencil, ArchiveX, MoreHorizontal, Eye, ArchiveRestore} from "lucide-react"
import TableWrapper from "../../../components/TableWrapper"
import StatusToggle from "../../../components/StatusToggle"


const tabs = [
	{ label: "Active", value: "active" },
	{ label: "Archived", value: "archived" },
]

const UserAccountsTable = ({data, isFetching, isError, error, onArchive, onRestore, onEdit, showArchived, onToggleArchived}) => {

	const columns = useMemo(
		() => [
			{
				accessorKey: "name",
				header: "Name",
				cell: ({ row }) => {
					const { first_name, middle_name, last_name, suffix } = row.original
					return [first_name, middle_name, last_name, suffix]
						.filter(Boolean)
						.join(" ")
				},
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
				accessorKey: "deleted_at",
				header: "Status",
				cell: ({ row }) => {
					return (
						<Badge
							className={
								showArchived
									? "bg-slate-100 text-slate-500"
									: "bg-green-100 text-green-700"
							}
						>
							{showArchived ? "Archived" : "Active"}
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
							{showArchived ? (
								<DropdownMenuItem
									className="text-green-600 focus:text-green-700"
									onSelect={() => {
										onRestore(row.original)
									}}
								>
									<ArchiveRestore className="h-4 w-4" /> Restore
								</DropdownMenuItem>
							) : (
								<>
									<DropdownMenuItem onSelect={() => onEdit(row.original)}>
										<Pencil className="h-4 w-4" /> Edit
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										variant="destructive"
										onSelect={() => {
											onArchive(row.original)
										}}
									>
										<ArchiveX className="h-4 w-4" /> Archive
									</DropdownMenuItem>
								</>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				),
			},
		],
		[onEdit, onArchive, onRestore],
	)

	return (
		<TableWrapper
			columns={columns}
			data={data?.data || []}
			isFetching={isFetching}
			isError={isError}
			error={error}
			searchKey="name"
			filterSlot={
        <StatusToggle
          checked={showArchived}
          onCheckedChange={onToggleArchived}
        />
			}
		/>
	)
}

export default UserAccountsTable
