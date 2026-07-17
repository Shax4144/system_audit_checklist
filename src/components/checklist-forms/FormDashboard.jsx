// FormsDashboard.jsx
import { useNavigate } from "react-router-dom"
import { Plus, FileText, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useFetchChecklistsQuery } from "../../features/checklist/checklist.api"

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

const gradients = [
	"from-orange-500/95 to-amber-500/35"
]

const formatDate = (dateStr) => {
	if (!dateStr) return "—"
	return new Date(dateStr).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	})
}

const FormsDashboard = () => {
	const navigate = useNavigate()

	const {
		data: checklistsResponse,
		isFetching,
		isError,
	} = useFetchChecklistsQuery({
		pagination: "none",
	})

	const checklist = checklistsResponse?.data ?? []

	return (
		<div className="flex flex-col gap-6 h-full">
			<div className="flex flex-row justify-between items-center">
				<div>
					<h1 className="text-2xl font-semibold">Checklists</h1>
					<p className="text-sm text-muted-foreground">
						Create and manage your audit checklists.
					</p>
				</div>
				{/* <div className="flex justify-between items-center gap-4">
					<p className="font-black text-sm">Legend:</p>
					<div className="flex flex-row gap-2 items-center">
						<p className="font-semibold text-xs">Draft</p>
						<Badge className={STATUS_STYLES.draft}></Badge>
					</div>
					<div className="flex flex-row gap-2 items-center">
						<p className="font-semibold text-xs">Published</p>
						<Badge className={STATUS_STYLES.published}></Badge>
					</div>
					<div className="flex flex-row gap-2 items-center">
						<p className="font-semibold text-xs">Archived</p>
						<Badge className={STATUS_STYLES.archived}></Badge>
					</div>
				</div> */}
			</div>

			{isFetching ? (
				<div className="flex items-center justify-center py-20">
					<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
				</div>
			) : isError ? (
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
					<button
						onClick={() => navigate("builder/new")}
						className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-accent/50 transition-colors"
					>
						<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
							<Plus className="h-6 w-6 text-primary" />
						</div>
						<span className="text-sm font-medium text-muted-foreground">
							Add New Form
						</span>
					</button>
				</div>
			) : (
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
					<button
						onClick={() => navigate("builder/new")}
						className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-accent/50 transition-colors"
					>
						<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
							<Plus className="h-6 w-6 text-primary" />
						</div>
						<span className="text-sm font-medium text-muted-foreground">
							Add New Form
						</span>
					</button>

					{checklist.map((checklist, index) => (
						<button
							key={checklist.id}
							onClick={() => navigate(`builder/${checklist.id}`)}
							className={`aspect-square rounded-xl border bg-linear-to-br ${gradients[index % gradients.length]} p-4 flex flex-col justify-between text-left hover:border-primary hover:shadow-sm transition-all`}
						>
							<div className="flex items-start justify-between gap-2">
								<div className="w-8 h-8 xl:w-15 xl:h-15 lg:w-8 lg:h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
									<FileText className="h-6 w-6 xl:h-8 xl:w-8 lg:h-4 lg:w-4 text-muted-foreground" />
								</div>
								<Badge
									className={
										STATUS_STYLES[checklist.status] ?? STATUS_STYLES.draft
									}
								>
									{STATUS_LABEL[checklist.status] ?? STATUS_LABEL.draft}
								</Badge>
							</div>

							<div className="flex flex-col gap-1">
								<p className="font-medium text-lg lg:text-xs xl:text-xl line-clamp-2">
									{checklist.title}
								</p>
								<p className="text-sm lg:text-xs xl:text-sm text-muted-foreground">
									Created {formatDate(checklist.created_at)}
								</p>
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

export default FormsDashboard
