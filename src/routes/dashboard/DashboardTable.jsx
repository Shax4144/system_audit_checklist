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
import DashboardTableWrapper from "../../components/tables/DashboardTableWrapper"

const tabs = [
	{ label: "Active", value: "active" },
	{ label: "Archived", value: "archived" },
]

const DashboardTable = ({
	data,
	isFetching,
	isError,
	error,
	onArchive,
	onRestore,
	onEdit,
	showArchived,
	onToggleArchived,
	page,
	onPageChange,
	pageSize,
	onPageSizeChange,
	activeTab,
	onTabChange,
}) => {
	const columns = useMemo(
		() => [
			{
				accessorKey: "name",
				header: "Supplier's Name",
				cell: ({ row }) => {
					const { first_name, middle_name, last_name, suffix } = row.original
					return [first_name, middle_name, last_name, suffix]
						.filter(Boolean)
						.join(" ")
				},
			},
			{
				accessorKey: "business_address",
				header: "Business address",
			},
			{
				accessorKey: "tin_no",
				header: "TIN #",
			},
			{
				accessorKey: "contact_person",
				header: "Contact Person",
			},
			{
				accessorKey: "contact_no",
				header: "Contact #",
			},
			{
				accessorKey: "email",
				header: "Email",
			},
			{
				accessorKey: "products_offered",
				header: "Products Offered",
			},
			{
				accessorKey: "status",
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
				accessorKey: "remarks",
				header: "Remarks",
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
		<DashboardTableWrapper
			columns={columns}
			data={data?.data || []}
			paginationData={data}
			isFetching={isFetching}
			isError={isError}
			error={error}
			searchKey="name"
			page={page}
			onPageChange={onPageChange}
			pageSize={pageSize}
			onPageSizeChange={onPageSizeChange}
			activeTab={activeTab}
			onTabChange={onTabChange}
		/>
	)
}

export default DashboardTable
