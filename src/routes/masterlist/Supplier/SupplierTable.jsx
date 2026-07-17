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

// dummy data — replace with useQuery/fetch
// const data = [
// 	{
// 		id: 1,
//     name: "Alternatives Food Corp.",
//     contact_person: ["Mikaela Beltran", "Kamill Bautista"],
//     address: "Unit 903 One Corporate Center, Dona Julia Vargas Ave.,Cor.Meralco Ave. Ortigas, Pasig City",
//     tin_no: "000-242-519-126",
//     contact_no: ["8631-7228", "09267501987"],
//     products_offered: ["chicken skin"],
//     email: "afc_sales@alternatives.ph",
// 		remarks: "Warehousing",
// 		created_at: "2026-03-18T01:59:34.000000Z",
// 		updated_at: "2026-05-15T08:36:52.000000Z",
// 		deleted_at: null,
// 	}
// ]

const tabs = [
	{ label: "Active", value: "active" },
	{ label: "Archived", value: "archived" },
]

const SupplierTable = ({
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
}) => {
	const columns = useMemo(
		() => [
			{
				accessorKey: "name",
				header: "Name",
			},
			{
				accessorKey: "contact_person",
				header: "Contact Person",
				cell: ({ row }) => {
					const data = row.original.contact_person

					return Array.isArray(data) && data.length ? data.join(", ") : "-"
				},
			},
			{
				accessorKey: "address",
				header: "Address",
				cell: ({ row }) => {
					const address = row.original.address

					return typeof address === "string" && address.trim() ? address : "-"
				},
			},
			{
				accessorKey: "tin_no",
				header: "TIN No.",
			},
			{
				accessorKey: "contact_no",
				header: "Contact No.",
				cell: ({ row }) => {
					const data = row.original.contact_no

					return Array.isArray(data) && data.length ? data.join(", ") : "-"
				},
			},
			{
				accessorKey: "products_offered",
				header: "Products Offered",
				cell: ({ row }) => {
					const data = row.original.products_offered

					return Array.isArray(data) && data.length ? data.join(", ") : "-"
				},
			},
			{
				accessorKey: "email",
				header: "Email",
			},
			{
				accessorKey: "remarks",
				header: "Remarks",
			},
			{
				accessorKey: "location",
				header: "Location",
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

export default SupplierTable
