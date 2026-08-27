// FormsDashboard.jsx
import { useNavigate } from "react-router-dom"
import { Plus, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useFetchChecklistsQuery } from "../../features/checklist/checklist.api"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"


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
			<div className="flex flex-row justify-between items-center gap-2">
				<div>
					<h1 className="text-2xl font-semibold">Checklists</h1>
					<p className="text-sm text-muted-foreground">
						Create and manage your audit checklists.
					</p>
        </div>

				<Button
					variant="outline"
					size="icon"
					className="sm:hidden shrink-0 bg-primary shadow-sm"
					onClick={() => navigate("builder/new")}
					aria-label="Add New Form"
				>
					<Plus className="h-5 w-5" />
				</Button>
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
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-2">
					{/* Mobile loading state */}
					<div className="sm:hidden w-full rounded-xl border bg-card p-4 flex items-center gap-3">
						<div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
							<Skeleton className="h-5 w-5 rounded" />
						</div>
			
						<div className="flex-1 min-w-0 flex flex-col gap-2">
							<Skeleton className="h-4 w-3/4" />
							<Skeleton className="h-3 w-1/2" />
						</div>
			
						<Skeleton className="h-5 w-14 rounded-full" />
					</div>
			
					{/* Desktop/tablet Add New Form */}
					<button
						disabled
						onClick={() => navigate("builder/new")}
						className="hidden sm:flex w-full max-w-64 aspect-square rounded-xl border-2 border-dashed border-border flex-col items-center justify-center gap-2"
					>
						<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
							<Plus className="h-6 w-6 text-primary" />
						</div>
			
						<span className="text-sm font-medium text-muted-foreground">
							Add New Form
						</span>
					</button>
			
					{/* Desktop/tablet loading card */}
					<div className="hidden sm:flex w-full max-w-64 aspect-square rounded-xl border bg-linear-to-br from-orange-500/95 to-amber-500/35 p-4 flex-col justify-between">
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
				</div>
			) : isError ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-2">
					<button
						onClick={() => navigate("builder/new")}
						className="hidden sm:flex w-full max-w-64 aspect-square rounded-xl border-2 border-dashed border-border flex-col items-center justify-center gap-2 hover:border-primary hover:bg-accent/50 transition-colors"
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
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-2">
					<button
						onClick={() => navigate("builder/new")}
						className="hidden sm:flex w-full max-w-64 aspect-square rounded-xl border-2 border-dashed border-border flex-col items-center justify-center gap-2 hover:border-primary hover:bg-accent/50 transition-colors"
					>
						<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
							<Plus className="h-6 w-6 text-primary" />
						</div>
						<span className="text-sm font-medium text-muted-foreground">
							Add New Form
						</span>
					</button>

					{checklist.map((checklist, index) => (
						<div key={checklist.id}>
							{/* Mobile list item */}
							<button
								onClick={() => navigate(`builder/${checklist.id}`)}
								className={`sm:hidden w-full rounded-xl border bg-linear-to-br ${gradients[index % gradients.length]} p-4 flex items-center gap-3 text-left hover:border-primary hover:shadow-sm transition-all`}
							>
								<div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
									<FileText className="h-5 w-5 text-muted-foreground" />
								</div>
					
								<div className="flex-1 min-w-0">
								  <p className="font-medium text-sm line-clamp-2">
                    {checklist.title}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Created: <strong>{formatDate(checklist.created_at)}</strong>
                    </p>

                    <p className="text-[10px] text-muted-foreground mt-1">
                      Updated: <strong>{formatDate(checklist.updated_at)}</strong>
                    </p>
                  </div>
								</div>
					
								<Badge
									className={
										STATUS_STYLES[checklist.status] ?? STATUS_STYLES.draft
									}
								>
									{STATUS_LABEL[checklist.status] ?? STATUS_LABEL.draft}
								</Badge>
							</button>
					
							{/* Desktop / tablet square card */}
							<button
								onClick={() => navigate(`builder/${checklist.id}`)}
								className={`hidden sm:flex w-full max-w-64 aspect-square rounded-xl border bg-linear-to-br ${
									gradients[index % gradients.length]
								} p-4 flex-col justify-between gap-2 text-left hover:border-primary hover:shadow-sm transition-all`}
							>
								<div className="flex items-start justify-between gap-2">
									<div className="w-4 h-4 sm:w-10 sm:h-10 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-10 xl:h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
										<FileText className="h-6 w-6 xl:h-8 xl:w-8 lg:h-8 lg:w-8 text-muted-foreground" />
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
									<p className="font-medium text-[9px] sm:text-sm md:text-[16px] lg:text-[16px] xl:text-[14px] line-clamp-2">
										{checklist.title}
									</p>
					
									<p className="text-[10px] lg:text-sm xl:text-[10px] text-muted-foreground">
										Created: <strong>{formatDate(checklist.created_at)}</strong>
									</p>
					
									<p className="text-[10px] lg:text-sm xl:text-[10px] text-muted-foreground">
										Updated: <strong>{formatDate(checklist.updated_at)}</strong>
									</p>
								</div>
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default FormsDashboard
