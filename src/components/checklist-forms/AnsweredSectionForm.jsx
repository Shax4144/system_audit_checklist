// components/checklist-answer/AnsweredSectionForm.jsx
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Check } from "lucide-react"
import QuestionAnswer from "./QuestionAnswer"
import { useSubmitSectionMutation } from "../../features/checklist/submitSectionChecklist.api"
import { appToast } from "../Toast"
import { appendFormData } from "../../features/checklist/formBuilder.helpers"

const AnsweredSectionForm = ({ checklistId, section, sectionIndex, onAnswersChange}) => {
	const hasSubsections = Boolean(section["sub-sections"])
	const [isAnswered, setIsAnswered] = useState(Boolean(section?.is_answered))
	const [batchNo, setBatchNo] = useState("") 
	const [answers, setAnswers] = useState({}) // { [questionKey]: { grade, note, photo } }
	const [initializedFor, setInitializedFor] = useState(null)
	const [submittingAction, setSubmittingAction] = useState(null)  

	const [submitSection] = useSubmitSectionMutation()

	useEffect(() => {
		if (!section) return
		if (initializedFor === sectionIndex) return

		const initialAnswers = {}
		let existingBatchNo = ""
		if (hasSubsections) {
			section["sub-sections"].forEach((sub, subIdx) => {
				;(sub["sub-items"] ?? []).forEach((q, qIdx) => {
					initialAnswers[`${subIdx}-${qIdx}`] = {
						grade: q.answer?.rating ?? "",
						note: q.answer?.remarks ?? "",
						photo: q.answer?.images?.[0] ?? null,
					}
					if (q.answer?.batch_no) existingBatchNo = q.answer.batch_no
				})
			})
		} else {
			;(section.item ?? []).forEach((q, qIdx) => {
				initialAnswers[`${qIdx}`] = {
					grade: q.answer?.rating ?? "",
					note: q.answer?.remarks ?? "",
					photo: q.answer?.images?.[0] ?? null,
				}
				if (q.answer?.batch_no) existingBatchNo = q.answer.batch_no
			})
		}

		setAnswers(initialAnswers)
		setBatchNo(existingBatchNo)

		if (onAnswersChange) {
			Object.entries(initialAnswers).forEach(([key, val]) => {
				onAnswersChange(key, val)
			})
		}
		setInitializedFor(sectionIndex)
	}, [section, sectionIndex, initializedFor, hasSubsections, onAnswersChange])

	useEffect(() => {
		setIsAnswered(Boolean(section?.is_answered))
	}, [section?.is_answered])

	

	const handleAnswerChange = (questionKey) => (value) => {
		setAnswers((prev) => ({ ...prev, [questionKey]: value }))
		onAnswersChange?.(questionKey, value)
	}

	// Flatten all questions in this section (direct or nested in subsections) to check completeness
	const allQuestions = hasSubsections
		? section["sub-sections"].flatMap((sub, subIdx) =>
				(sub["sub-items"] ?? []).map((q, qIdx) => ({
					...q,
					key: `${subIdx}-${qIdx}`,
				})),
			)
		: (section.item ?? []).map((q, qIdx) => ({ ...q, key: `${qIdx}` }))

	const allGraded = allQuestions.every((q) => answers[q.key]?.grade)

	const buildPayload = (isCompleted) => {
		const content = allQuestions.map((q) => {
			const gradeValue = answers[q.key]?.grade
			const rating =
				gradeValue && gradeValue !== "N/A" ? Number(gradeValue) : null

			const entry = {
				section: section.section,
				name: q.name,
				category: q.category,
				rating,
				remarks: answers[q.key]?.note ?? "",
			}

			// Only questions that belong to a subsection get this key
			if (q.subSectionTitle) {
				entry["sub-sections"] = q.subSectionTitle
			}

			return entry
		})

		// image[i] = array of files for question i (currently max 1 photo per question,
		// but shaped as an array so multiple uploads per question work without changes later)
		const image = allQuestions.map((q) => {
			const photo = answers[q.key]?.photo
			return photo ? [photo] : []
		})

		return {
			copy_id: String(checklistId),
			content,
			image,
			is_completed: isCompleted ? 1 : 0,
			batch_no: batchNo,
		}
	}

	// const handleSubmit = async () => {
	// 	try {
	// 		const payload = {
	// 			checklistId,
	// 			sectionIndex,
	// 			answers: allQuestions.map((q) => ({
	// 				name: q.name,
	// 				category: q.category,
	// 				rating: answers[q.key]?.grade ?? null,
	// 				remarks: answers[q.key]?.note ?? "",
	// 				// photo upload handling depends on backend (multipart vs base64) — adjust once confirmed
	// 			})),
	// 		}

	// 		// await submitSection(payload).unwrap()
	// 		setIsAnswered(true)
	// 		appToast.success(
	// 			"Section submitted",
	// 			`${section.section} has been submitted.`,
	// 		)
	// 	} catch (err) {
	// 		appToast.error("Error", err?.data?.message ?? "Failed to submit section.")
	// 		console.error(err)
	// 	}
	// }

	const submit = async (isCompleted) => {
		const action = isCompleted ? "submit" : "draft"
		setSubmittingAction(action)
		try {
			const payload = buildPayload(isCompleted)

			const formData = new FormData()
			appendFormData(formData, payload)

			await submitSection(formData).unwrap()

			if (isCompleted) {
				setIsAnswered(true)
				appToast.success(
					"Section submitted",
					`${section.section} has been submitted.`,
				)
			} else {
				appToast.success(
					"Draft saved",
					`${section.section} has been saved as draft.`,
				)
			}
		} catch (err) {
			appToast.error("Error", err?.data?.message ?? "Failed to submit section.")
			console.error(err)
		} finally {
			setSubmittingAction(null)
		}
	}

	const handleSubmit = () => submit(true)
	const handleSaveDraft = () => submit(false)

	const isSavingDraft = submittingAction === "draft"
	const isSubmitting = submittingAction === "submit"

	return (
		<div className="rounded-xl border bg-card p-5">
			<div className="flex items-center justify-between gap-4 mb-4">
				<h2 className="font-medium text-lg">{section.section}</h2>
				{isAnswered && (
					<Badge className="bg-green-100 text-green-700 flex items-center gap-1">
						<Check className="h-3 w-3" /> Submitted
					</Badge>
				)}
			</div>

			{hasSubsections ? (
				<div className="flex flex-col gap-5">
					{section["sub-sections"].map((sub, subIdx) => (
						<div key={subIdx} className="border-l-2 pl-4">
							<h3 className="font-medium text-sm mb-2 text-muted-foreground">
								{sub.item}
							</h3>
							<div className="flex flex-col">
								{(sub["sub-items"] ?? []).map((q, qIdx) => (
									<QuestionAnswer
										key={`${subIdx}-${qIdx}`}
										question={q}
										value={answers[`${subIdx}-${qIdx}`]}
										onChange={handleAnswerChange(`${subIdx}-${qIdx}`)}
										disabled={isAnswered}
									/>
								))}
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="flex flex-col">
					{(section.item ?? []).map((q, qIdx) => (
						<QuestionAnswer
							key={qIdx}
							question={q}
							value={answers[`${qIdx}`]}
							onChange={handleAnswerChange(`${qIdx}`)}
							disabled={isAnswered}
						/>
					))}
				</div>
			)}

			{!isAnswered && (
				<div className="flex justify-end pt-4 mt-4 border-t gap-1.5">
					<Button
						className="bg-background text-foreground border border-border hover:text-primary-foreground"
						onClick={handleSaveDraft}
						disabled={isSavingDraft || isSubmitting}
					>
						{isSavingDraft && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Save as draft
					</Button>

					<Button
						onClick={handleSubmit}
						disabled={!allGraded || isSubmitting || isSavingDraft}
					>
						{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Submit Section
					</Button>
				</div>
			)}
		</div>
	)
}

export default AnsweredSectionForm
