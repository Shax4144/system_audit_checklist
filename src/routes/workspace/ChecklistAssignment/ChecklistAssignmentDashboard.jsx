// routes/workspace/ChecklistAssignment/AssignmentDashboard.jsx
import { Badge } from "@/components/ui/badge"
import { FileText } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useFetchChecklistsQuery } from "../../../features/checklist/checklist.api"
import { Skeleton } from "@/components/ui/skeleton"

const STATUS_LABEL = {
	draft: "DRAFT",
	ready: "READY",
	published: "PUBLISHED",
	archived: "ARCHIVED",
}

const STATUS_STYLES = {
	draft:
		"text-xs xl:text-sm lg:text-xs bg-slate-300 text-slate-700 border-slate-200 dark:bg-slate-900/40 dark:text-slate-300 dark:border-slate-700",
	ready:
		"text-xs xl:text-sm lg:text-xs bg-blue-300 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700",
	published:
		"text-xs xl:text-sm lg:text-xs bg-green-300 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700",
	archived:
		"text-xs xl:text-sm lg:text-xs bg-amber-300 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700",
}

const gradients = ["from-orange-500/95 to-amber-500/35"]

const formatDate = (dateStr) => {
	if (!dateStr) return "—"
	return new Date(dateStr).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	})
}

const ChecklistAssignmentDashboard = () => {
	const navigate = useNavigate()

	const {
		data: checklistsResponse,
		error,
		isFetching,
		isError,
	} = useFetchChecklistsQuery({
		pagination: "none",
	})

	const allChecklists = checklistsResponse?.data ?? []

	// Only show DRAFT checklists — available for assignment
	const draftChecklists = allChecklists.filter(
		(c) => (c.status ?? "draft") === "draft",
	)

	const isNoChecklists = isError && error?.status === 404

	return (
		<div className="flex flex-col gap-6 h-full">
			<div>
				<h1 className="text-2xl font-semibold">Checklist Assignment</h1>
				<p className="text-sm text-muted-foreground">
					Assign users to checklist sections and publish for completion.
				</p>
			</div>

			{isFetching ? (
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
					{Array.from({ length: 1 }).map((_, index) => (
						<div
							key={index}
							className="aspect-square rounded-xl border bg-linear-to-br from-orange-500/95 to-amber-500/35 p-4 flex flex-col justify-between"
						>
							<div className="flex items-start justify-between gap-2">
								<div className="w-8 h-8 xl:w-15 xl:h-15 lg:w-8 lg:h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
									<FileText className="h-6 w-6 xl:h-8 xl:w-8 lg:h-4 lg:w-4 text-muted-foreground" />
								</div>
								<Skeleton className="h-5 w-14 bg-muted" />
							</div>

							<div className="flex flex-col gap-1">
								<Skeleton className="h-8 w-full bg-muted" />
								<Skeleton className="h-6 w-full bg-muted" />
							</div>
						</div>
					))}
				</div>
			) : isNoChecklists || draftChecklists.length === 0 ? (
				<div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
					No draft checklists available for assignment.
				</div>
			) : isError ? (
				<p className="text-sm text-destructive py-10 text-center">
					Failed to load checklists.
				</p>
			) : (
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
					{draftChecklists.map((checklist, index) => (
						<button
							key={checklist.id}
							onClick={() =>
								navigate(`/workspace/checklist-assignment/${checklist.id}`)
							}
							className={`aspect-square rounded-xl border bg-linear-to-br ${gradients[index % gradients.length]} p-4 flex flex-col justify-between text-left hover:border-primary hover:shadow-sm transition-all`}
						>
							<div className="flex items-start justify-between gap-2">
								<div className="w-8 h-8 xl:w-15 xl:h-15 lg:w-8 lg:h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
									<FileText className="h-6 w-6 xl:h-8 xl:w-8 lg:h-4 lg:w-4 text-muted-foreground" />
								</div>
								<Badge
									className={
										STATUS_STYLES[checklist.status] ?? STATUS_STYLES.ready
									}
								>
									{STATUS_LABEL[checklist.status] ?? STATUS_LABEL.ready}
								</Badge>
							</div>

							<div className="flex flex-col gap-1">
								<p className="font-medium text-lg lg:text-xs xl:text-xl line-clamp-2">
									{checklist.title}
								</p>
								{/* <p className="text-sm lg:text-xs xl:text-sm text-muted-foreground">
									Created {formatDate(checklist.created_at)}
								</p> */}
								<p className="text-sm lg:text-xs xl:text-sm text-muted-foreground">
									Updated {formatDate(checklist.updated_at)}
								</p>
							</div>
						</button>
					))}
				</div>
			)}
		</div>
	)
}

export default ChecklistAssignmentDashboard
