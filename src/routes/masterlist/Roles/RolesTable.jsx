import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArchiveRestore, ArchiveX, MoreHorizontal, Pencil } from "lucide-react"
import { useMemo } from "react"
import StatusToggle from "../../../components/StatusToggle"
import MasterlistTableWrapper from "../../../components/tables/MasterlistTableWrapper"

const tabs = [
	{ label: "Active", value: "active" },
	{ label: "Archived", value: "archived" },
]

const RolesTable = ({
	data,
	isFetching,
	isError,
	error,
	onEdit,
	onArchive,
	onRestore,
	showArchived,
	onToggleArchived,
	page,
	onPageChange,
	pageSize,
	onPageSizeChange,
	search,
	onSearchChange,
}) => {
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
				accessorKey: "deleted_at",
				header: "Status",
				cell: ({ row }) => {
					return (
						<Badge
							className={
								showArchived
									? "bg-secondary text-secondary-foreground border"
									: "bg-active-status-bg text-success-foreground border border-success/40"
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
		<MasterlistTableWrapper
			columns={columns}
			data={data?.data || []}
			paginationData={data}
			isFetching={isFetching}
			isError={isError}
			error={error}
			searchKey="name"
			searchValue={search}
			onSearchChange={onSearchChange}
			page={page}
			onPageChange={onPageChange}
			pageSize={pageSize}
			onPageSizeChange={onPageSizeChange}
			filterSlot={
				<StatusToggle
					checked={showArchived}
					onCheckedChange={onToggleArchived}
				/>
			}
		/>
	)
}

export default RolesTable
