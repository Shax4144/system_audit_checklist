// routes/workspace/Reports/ReportsDashboard.jsx
import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import DashboardTableWrapper from "../../../components/tables/DashboardTableWrapper"
import { useFetchReportsQuery } from "../../../features/report/checklistSummaryReport.api"

const ReportsDashboard = () => {
	const navigate = useNavigate()
	const [activeTab, setActiveTab] = useState("for_reporting")
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)

	const { data, isFetching, isError, error } = useFetchReportsQuery({
		status: activeTab, // "for_reporting" | "generated" — confirm exact param with backend
		page,
		per_page: pageSize,
	})

	const columns = useMemo(
		() => [
			{
				accessorKey: "reference_number",
				header: "Reference No.",
			},
			{
				accessorKey: "title",
				header: "Checklist",
			},
			{
				accessorKey: "supplier",
				header: "Supplier",
				cell: ({ row }) => row.original.information?.supplier ?? "-",
			},
			{
				accessorKey: "progress",
				header: "Progress",
				cell: ({ row }) => {
					const summary = row.original.checklist_summary
					if (!summary) return "-"
					return (
						<span className="text-sm">
							{summary.answered} / {summary.total} sections ({summary.percent}%)
						</span>
					)
				},
			},
			{
				id: "actions",
				header: "Actions",
				cell: ({ row }) => (
					<Button
						size="sm"
						onClick={() => navigate(`/workspace/reports/${row.original.id}`)}
					>
						{activeTab === "generated" ? "View / Print" : "Open"}
					</Button>
				),
			},
		],
		[navigate, activeTab],
  )
  
  const tabs = [
		// { value: "pending", label: "Pending" },
		// { value: "for_consolidate", label: "For Consolidate" },
	]

	return (
		<div className="flex flex-col gap-0 h-full">
			<div>
				<h1 className="text-2xl font-semibold">Reports</h1>
				<p className="text-sm text-muted-foreground">
					Review submitted checklists and generate audit reports.
				</p>
			</div>

			<DashboardTableWrapper
        columns={columns}
        data={data?.data ?? []}
        paginationData={data}
        isFetching={isFetching}
        isError={isError}
        error={error}
        searchKey="title"
        page={page}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab)
          setPage(1)
        }}
        tabs={tabs}
			/>
		</div>
	)
}

export default ReportsDashboard
