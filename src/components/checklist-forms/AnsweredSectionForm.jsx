// components/checklist-answer/AnsweredSectionForm.jsx
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Check } from "lucide-react"
import QuestionAnswer from "./QuestionAnswer"
// import { useSubmitSectionAnswerMutation } from "../../features/checklist/publishedChecklist.api"
import { appToast } from "../Toast"

const AnsweredSectionForm = ({ checklistId, section, sectionIndex, onAnswersChange}) => {
	const hasSubsections = Boolean(section["sub-sections"])
	const [isAnswered, setIsAnswered] = useState(Boolean(section.is_answered))
	const [answers, setAnswers] = useState({}) // { [questionKey]: { grade, note, photo } }

	// const [submitSection, { isLoading }] = useSubmitSectionAnswerMutation()

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

	const handleSubmit = async () => {
		try {
			const payload = {
				checklistId,
				sectionIndex,
				answers: allQuestions.map((q) => ({
					name: q.name,
					category: q.category,
					grade: answers[q.key]?.grade ?? null,
					note: answers[q.key]?.note ?? "",
					// photo upload handling depends on backend (multipart vs base64) — adjust once confirmed
				})),
			}

			// await submitSection(payload).unwrap()
			setIsAnswered(true)
			appToast.success(
				"Section submitted",
				`${section.section} has been submitted.`,
			)
		} catch (err) {
			appToast.error("Error", err?.data?.message ?? "Failed to submit section.")
			console.error(err)
		}
	}

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
					<Button className="bg-background text-foreground border border-border hover:text-primary-foreground">
						Save draft
					</Button>
					<Button 
					// onClick={handleSubmit} 
					// disabled={!allGraded || isLoading}
					disabled={!allGraded}
					>
						{/* {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />} */}
						Submit Section
					</Button>
				</div>
			)}
		</div>
	)
}

export default AnsweredSectionForm
