import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArchiveX, MoreHorizontal, Pencil, ArchiveRestore} from "lucide-react"
import { useMemo, useState } from "react"
import StatusToggle from "../../../components/StatusToggle"
import TableWrapper from "../../../components/TableWrapper"

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

const SupplierTable = ({ data, isFetching, isError, error, onArchive, onRestore, onEdit, showArchived, onToggleArchived }) => {
	
	const columns = useMemo(
		() => [
			{
				accessorKey: "name",
				header: "Name",
			},
			{
				accessorKey: "contact_person",
				header: "Contact Person",
				cell: ({ row }) => row.original.contact_person?.join(", ") || "-",
			},
			{
				accessorKey: "address",
				header: "Address",
				cell: ({ row }) => row.original.contact_person?.join(", "),
			},
			{
				accessorKey: "tin_no",
				header: "TIN No.",
			},
			{
				accessorKey: "contact_no",
				header: "Contact No.",
				cell: ({ row }) => row.original.contact_person?.join(", "),
			},
			{
				accessorKey: "products_offered",
				header: "Products Offered",
				cell: ({ row }) => row.original.contact_person?.join(", "),
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
				accessorKey: "status",
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
			data={data?.data?.data || []}
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

export default SupplierTable
