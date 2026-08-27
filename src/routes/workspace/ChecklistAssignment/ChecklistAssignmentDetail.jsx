// routes/workspace/ChecklistAssignment/AssignmentDetail.jsx
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import UsersDropdown from "../../../components/dropdown/UserAccountsDropdown"
import ChecklistInformation from "../../../components/editable-dropdown/ChecklistInformation"
import { appToast } from "../../../components/Toast"
import {
	useFetchChecklistsQuery,
	usePublishChecklistMutation,
} from "../../../features/checklist/checklist.api"

const ChecklistAssignmentDetail = () => {
	const { id } = useParams()
	const navigate = useNavigate()

	const { data: checklistsResponse, isFetching } = useFetchChecklistsQuery({
		pagination: "none",
	})
	const checklistData = checklistsResponse?.data?.find(
		(c) => String(c.id) === String(id),
	)

	const [publishAssignment, { isLoading: isPublishing }] =
		usePublishChecklistMutation()

	const [sectionAssignments, setSectionAssignments] = useState({})
	const [checklistInfo, setChecklistInfo] = useState(null)

	useEffect(() => {
		if (checklistData) {
			const initial = {}
			;(checklistData.checklist ?? []).forEach((_, index) => {
				initial[index] = ""
			})
			setSectionAssignments(initial)
		}
	}, [checklistData])

	const handleAssignUser = (sectionIndex, userId) => {
		setSectionAssignments((prev) => ({ ...prev, [sectionIndex]: userId }))
	}

	const allRequiredChecklistInfoFilled =
		checklistInfo?.supplier &&
		checklistInfo?.auditDate &&
		checklistInfo?.contactPerson &&
		(checklistInfo?.products?.length > 0) &&
		checklistInfo?.location &&
		checklistInfo?.auditScope &&
		checklistInfo?.auditObjectives &&
		(checklistInfo?.auditCriteria?.length > 0) &&
		checklistInfo?.auditLanguage

	const allSectionsAssigned =
		checklistData &&
		checklistData.checklist.length > 0 &&
		checklistData.checklist.every((_, index) => sectionAssignments[index])

	const canPublish = allRequiredChecklistInfoFilled && allSectionsAssigned

	const buildAssignmentPayload = () => ({
		checklist_id: Number(id),
		title: checklistData.title,
		information: checklistInfo,
		checklist: checklistData.checklist.map((section, index) => {
			const hasSubsections = Boolean(section["sub-sections"])
			const user_id = Number(sectionAssignments[index])

			if (hasSubsections) {
				return {
					section: section.section,
					"sub-sections": section["sub-sections"],
					user_id,
					is_answered: 0,
				}
			}

			return {
				section: section.section,
				item: section.item,
				user_id,
				is_answered: 0,
			}
		}),
	})

	const handlePublish = async () => {
		try {
			const payload = buildAssignmentPayload()
			const response = await publishAssignment(payload).unwrap()
			appToast.success(
				"Checklist published",
				response?.message ?? "Assignments have been created for each section.",
			)
			navigate("/workspace/checklist-assignment")
		} catch (err) {
			appToast.error(
				"Error",
				err?.data?.message ?? "Failed to publish checklist.",
			)
			console.error(err)
		}
	}

	if (isFetching || !checklistData) {
		return (
			<p className="text-sm text-muted-foreground py-10 text-center">
				Loading checklist...
			</p>
		)
	}

	return (
		<div className="flex flex-col gap-6 max-w-3xl mx-auto pb-20">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Button variant="ghost" size="xl" onClick={() => navigate(-1)}>
						<ChevronLeft className="size-full" />
					</Button>
					<div>
						<h1 className="text-sm sm:text-2xl font-semibold">{checklistData.title}</h1>
						<p className="text-xs sm:text-sm text-muted-foreground">
							Assign a user to each section before publishing.
						</p>
					</div>
				</div>

        <div className="hidden sm:block">
          <Button
            onClick={handlePublish}
            disabled={!canPublish || isPublishing}
          >
            {isPublishing && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Publish
          </Button>
        </div>
      </div>

      <div className="flex justify-end sm:hidden">
        <Button
          onClick={handlePublish}
          disabled={!canPublish || isPublishing}
        >
          {isPublishing && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Publish
        </Button>
      </div>

			<div>
				<ChecklistInformation
					value={checklistInfo}
					onChange={setChecklistInfo}
				/>
			</div>

			<div className="flex flex-col gap-4">
				{checklistData.checklist.map((section, sIndex) => {
					const hasSubsections = Boolean(section["sub-sections"])

					return (
						<div key={sIndex} className="rounded-xl border bg-card p-5">
							<div className="flex items-center justify-between gap-4 mb-4">
								<h2 className="font-medium text-lg">
									{/* {sIndex + 1}. */}
									{section.section}
								</h2>
								{sectionAssignments[sIndex] && (
									<Badge className="bg-green-100 text-green-700">
										Assigned
									</Badge>
								)}
							</div>

							{/* Read-only structure — subsections/questions */}
							{hasSubsections ? (
								<div className="flex flex-col gap-4 pl-4 mb-5">
									{section["sub-sections"].map((sub, subIndex) => (
										<div key={subIndex} className="border-l-2 pl-4">
											<h3 className="font-medium text-sm mb-3 text-muted-foreground">
												{/* {sIndex + 1}.{String.fromCharCode(97 + subIndex)}{" "} */}
												{sub.item}
											</h3>
											<div className="flex flex-col gap-2">
												{(sub["sub-items"] ?? []).map((q, qIndex) => (
													<PreviewQuestion key={qIndex} question={q} />
												))}
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="flex flex-col gap-2 mb-5">
									{(section.item ?? []).map((q, qIndex) => (
										<PreviewQuestion key={qIndex} question={q} />
									))}
								</div>
							)}

							{/* Assignment control */}
							<div className="flex flex-col gap-1.5 max-w-xs pt-3 border-t">
								<label className="text-sm font-medium">Assigned User</label>
								<UsersDropdown
									value={sectionAssignments[sIndex] ?? ""}
									onChange={(val) => handleAssignUser(sIndex, val)}
									open={true}
									triggerClassName="w-full"
								/>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}

const PreviewQuestion = ({ question }) => {
	const gradeOptions = ["1", "2", "3", "4", "5", "N/A"]

	return (
		<div className="flex flex-col gap-2 py-2 border-b last:border-0">
			<div className="flex items-start justify-between gap-4">
				<p className="text-sm font-medium flex-1">{question.name}</p>
				{question.category && (
					<Badge variant="outline" className="shrink-0">
						{question.category}
					</Badge>
				)}
			</div>

			<div className="flex gap-1">
				{gradeOptions.map((opt) => (
					<div
						key={opt}
						className="h-7 min-w-7 px-1.5 rounded-md text-xs font-medium border bg-muted/50 text-muted-foreground flex items-center justify-center"
					>
						{opt}
					</div>
				))}
			</div>
		</div>
	)
}

export default ChecklistAssignmentDetail
