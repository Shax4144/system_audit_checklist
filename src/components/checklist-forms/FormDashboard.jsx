// FormsDashboard.jsx
import { useNavigate } from "react-router-dom"
import { Plus, FileText, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useFetchChecklistsQuery } from "../../features/checklist/checklist.api"

const STATUS_STYLES = {
	draft: "bg-slate-100 text-slate-600",
	published: "bg-green-100 text-green-700",
	archived: "bg-amber-100 text-amber-700",
}

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

	const forms = checklistsResponse?.data ?? []

	return (
		<div className="flex flex-col gap-6 h-full">
			<div>
				<h1 className="text-2xl font-semibold">Forms & Checklists</h1>
				<p className="text-sm text-muted-foreground">
					Create and manage your audit forms and checklists.
				</p>
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

					{forms.map((form) => (
						<button
							key={form.id}
							onClick={() => navigate(`builder/${form.id}`)}
							className="aspect-square rounded-xl border bg-card p-4 flex flex-col justify-between text-left hover:border-primary hover:shadow-sm transition-all"
						>
							<div className="flex items-start justify-between gap-2">
								<div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
									<FileText className="h-5 w-5 text-muted-foreground" />
								</div>
								<Badge
									className={STATUS_STYLES[form.status] ?? STATUS_STYLES.draft}
								>
									{form.status}
								</Badge>
							</div>

							<div className="flex flex-col gap-1">
								<p className="font-medium text-sm line-clamp-2">{form.title}</p>
								<p className="text-xs text-muted-foreground">
									Updated {formatDate(form.updated_at)}
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
