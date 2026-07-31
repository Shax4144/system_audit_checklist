// routes/workspace/Reports/ChecklistResultsTab.jsx
import { Badge } from "@/components/ui/badge"

const RATING_STYLES = {
	5: "bg-green-100 text-green-700 border border-green-200",
	4: "bg-blue-100 text-blue-700 border border-blue-200",
	3: "bg-amber-100 text-amber-700 border border-amber-200",
	2: "bg-orange-100 text-orange-700 border border-orange-200",
	1: "bg-red-100 text-red-700 border border-red-200",
}

const getRatingBadgeStyle = (avg) => {
	if (avg == null) return "bg-slate-100 text-slate-500 border border-slate-200"
	const rounded = Math.min(5, Math.max(1, Math.round(avg)))
	return RATING_STYLES[rounded]
}

const ChecklistResultsTab = ({ report }) => {
	const info = report.information ?? {}
	const sections = report.checklist ?? []

	return (
		<div className="flex flex-col gap-6 pt-4">
			{/* Supplier / audit info summary */}
			<div className="rounded-xl border bg-card p-5 grid grid-cols-2 gap-4 text-sm">
				<div>
					<p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">
						Supplier
					</p>
					<p className="font-medium">{info.supplier ?? "-"}</p>
				</div>
				<div>
					<p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">
						Address
					</p>
					<p className="font-medium">{info.address ?? "-"}</p>
				</div>
				<div>
					<p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">
						Contact Person
					</p>
					<p className="font-medium">
						{Array.isArray(info.contactPerson)
							? info.contactPerson.join(", ")
							: (info.contactPerson ?? "-")}
					</p>
				</div>
				<div>
					<p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">
						Contact Number
					</p>
					<p className="font-medium">
						{Array.isArray(info.contactNumber)
							? info.contactNumber.join(", ")
							: (info.contactNumber ?? "-")}
					</p>
				</div>
				<div>
					<p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">
						Audit Scope
					</p>
					<p className="font-medium">{info.auditScope ?? "-"}</p>
				</div>
				<div>
					<p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">
						Products
					</p>
					<p className="font-medium">
						{Array.isArray(info.products)
							? info.products.join(", ")
							: (info.products ?? "-")}
					</p>
				</div>
				<div>
					<p className="text-muted-foreground text-xs uppercase tracking-wide">
						Location
					</p>
					<p className="font-medium">{info.location ?? "-"}</p>
				</div>
			</div>

			{/* Per-section results */}
			<div className="flex flex-col gap-4">
				{sections.map((section, sIndex) => {
					const hasSubsections = Boolean(section["sub-sections"])
					const isAnswered = section.is_answered === 1

					return (
						<div key={sIndex} className="rounded-xl border bg-card p-5">
							<div className="flex items-center justify-between gap-4 mb-4">
								<h2 className="font-medium text-lg">{section.section}</h2>

								<div className="flex items-center gap-2">
									<div className="flex items-center gap-2">
										<Badge className="border border-slate-200">
											<h3>Assigned to:</h3>
											<p>{section.assigned_user?.name}</p>
										</Badge>
									</div>
									{!isAnswered && (
										<Badge className="bg-slate-100 text-slate-500 border border-slate-200">
											Not yet submitted
										</Badge>
									)}
									{section.average_rating != null && (
										<Badge
											className={getRatingBadgeStyle(section.average_rating)}
										>
											Avg. {section.average_rating.toFixed(2)}
										</Badge>
									)}
								</div>
							</div>

							{hasSubsections ? (
								<div className="flex flex-col gap-4">
									{section["sub-sections"].map((sub, subIdx) => (
										<div key={subIdx} className="border-l-2 pl-4">
											<h3 className="font-medium text-sm mb-2 text-muted-foreground">
												{sub.item}
											</h3>
											<ItemsTable items={sub["sub-items"] ?? []} />
										</div>
									))}
								</div>
							) : (
								<ItemsTable items={section.item ?? []} />
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}

const ItemsTable = ({ items }) => {
	return (
		<div className="flex flex-col">
			{items.map((item, i) => {
				const answer = item.answer
				return (
					<div
						key={i}
						className="flex items-center justify-between gap-4 py-2 border-b last:border-0 text-sm"
					>
						<div className="flex-1">
							<p>{item.name}</p>
							{item.category && (
								<span className="text-xs text-muted-foreground">
									{item.category}
								</span>
							)}
						</div>
						<div className="flex items-center gap-3 shrink-0">
							{answer?.remarks && (
								<span className="text-xs text-muted-foreground max-w-40 truncate">
									{answer.remarks}
								</span>
							)}
							{answer?.rating != null ? (
								<Badge className={getRatingBadgeStyle(Number(answer.rating))}>
									{answer.rating}
								</Badge>
							) : (
								<Badge className="bg-slate-100 text-slate-400 border border-slate-200">
									N/A
								</Badge>
							)}
						</div>
					</div>
				)
			})}
		</div>
	)
}

export default ChecklistResultsTab
