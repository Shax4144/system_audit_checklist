import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useMemo } from "react"
import DashboardTableWrapper from "../../../components/tables/DashboardTableWrapper"
import { useNavigate } from "react-router-dom"



const STATUS_STYLES = {
	pending:
		"bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700",

	ongoing:
		"bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-900/40 dark:text-slate-300 dark:border-slate-700",

	done: "bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700",
}

const STATUS_LABELS = {
	pending: "Pending",
	ongoing: "On going",
	for_consolidate: "Done",
}

const DashboardTable = ({
	data,
	isFetching,
	isError,
	error,
	page,
	onPageChange,
	pageSize,
	onPageSizeChange,
	activeTab,
	onTabChange,
}) => {
	const navigate = useNavigate()

	const tableData = useMemo(() => {
		const checklists = data?.data ?? []

		return checklists.map((checklist) => {
			const information = checklist.information ?? {}

			return {
				...information,
				id: checklist.id,
				title: checklist.title,
				status: checklist.status ?? "pending",
				products_offered: information.products ?? [],
				contactPerson: Array.isArray(information.contactPerson)
					? information.contactPerson.join(", ")
					: information.contactPerson,
				contactNumber: Array.isArray(information.contactNumber)
					? information.contactNumber.join(", ")
					: information.contactNumber,
			}
		})
	}, [data])

	const deriveStatus = (checklistSections = []) => {
		if (checklistSections.length === 0) return "open"

		const allAnswered = checklistSections.every((s) => s.is_answered === 1)
		if (allAnswered) return "done"

		// Check if ANY question across ANY section has a non-null answer (partial progress)
		const hasAnyAnswer = checklistSections.some((section) => {
			const questions = section["sub-sections"]
				? section["sub-sections"].flatMap((sub) => sub["sub-items"] ?? [])
				: (section.item ?? [])

			return questions.some((q) => q.answer != null)
		})

		return hasAnyAnswer ? "ongoing" : "pending"
	}

	const columns = useMemo(
		() => [
			{
				accessorKey: "supplier",
				header: "Supplier's Name",
			},
			{
				accessorKey: "address",
				header: "Business address",
			},
			{
				accessorKey: "tin_no",
				header: "TIN #",
			},
			{
				accessorKey: "contactPerson",
				header: "Contact Person",
			},
			{
				accessorKey: "contactNumber",
				header: "Contact #",
			},
			{
				accessorKey: "email",
				header: "Email",
			},
			{
				accessorKey: "products",
				header: "Products Offered",
			},
			{
				accessorKey: "location",
				header: "Location",
			},
			{
				accessorKey: "status",
				header: "Status",
				cell: ({ row }) => {
					const status = deriveStatus(row.original.checklist)

					return (
						<Badge className={STATUS_STYLES[status] ?? STATUS_STYLES.pending}>
							{STATUS_LABELS[status] ?? "Pending"}
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
				cell: ({ row }) => {
					const status = row.original.status
					const id = row.original.id

					return ["pending", "ongoing"].includes(status) ? (
						<Button onClick={() => navigate(`/dashboard/my-checklist/${id}`)}>
							Open
						</Button>
					) : (
						<Button onClick={() => navigate(`/dashboard/my-checklist/${id}`)}>
							Show
						</Button>
					)
				},
			},
		],
		[navigate],
	)

	const tabs = [
		{ value: "pending", label: "Pending" },
		{ value: "for_consolidate", label: "For Consolidate" },
	]

	return (
		<DashboardTableWrapper
			columns={columns}
			data={tableData || []}
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
			tabs={tabs}
		/>
	)
}

export default DashboardTable
