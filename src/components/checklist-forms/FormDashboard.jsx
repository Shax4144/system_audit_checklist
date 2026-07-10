// FormsDashboard.jsx
import { useNavigate } from "react-router-dom"
import { Plus, FileText, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useFetchChecklistsQuery } from "../../features/checklist/checklist.api"

const STATUS_STYLES = {
	draft: "bg-slate-400 text-slate-600 h-5 w-5",
	published: "bg-green-500 text-green-700 h-5 w-5",
	archived: "bg-amber-500 text-amber-700 h-5 w-5",
}

const gradients = [
	"from-sky-300/50 to-cyan-300/20",
	"from-violet-300/50 to-fuchsia-300/20",
	"from-emerald-300/50 to-teal-300/20",
	"from-amber-300/50 to-orange-300/20",
	"from-rose-300/50 to-pink-300/20",
	"from-indigo-300/50 to-sky-300/20",
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

	const forms = checklistsResponse?.data ?? []

	return (
		<div className="flex flex-col gap-6 h-full">
			<div className="flex flex-row justify-between items-center">
				<div>
					<h1 className="text-2xl font-semibold">Forms & Checklists</h1>
					<p className="text-sm text-muted-foreground">
						Create and manage your audit forms and checklists.
					</p>
				</div>
				<div className="flex justify-between items-center gap-4">
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
				</div>
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

					{forms.map((form, index) => (
						<button
							key={form.id}
							onClick={() => navigate(`builder/${form.id}`)}
							className={`aspect-square rounded-xl border bg-linear-to-br ${gradients[index % gradients.length]} p-4 flex flex-col justify-between text-left hover:border-primary hover:shadow-sm transition-all`}
						>
							<div className="flex items-start justify-between gap-2">
								<div className="w-15 h-15 rounded-lg bg-muted flex items-center justify-center shrink-0">
									<FileText className="h-8 w-8 text-muted-foreground" />
								</div>
								<Badge
									className={STATUS_STYLES[form.status] ?? STATUS_STYLES.draft}
								>
									{form.status}
								</Badge>
							</div>

							<div className="flex flex-col gap-1">
								<p className="font-medium text-lg line-clamp-2">{form.title}</p>
								<p className="text-sm text-muted-foreground">
									Created {formatDate(form.created_at)}
								</p>
								<p className="text-sm text-muted-foreground">
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
