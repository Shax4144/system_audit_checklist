// features/forms/components/SectionCard.jsx
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Trash2, Plus, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select"
import {
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
} from "@/components/ui/collapsible"
import { useState } from "react"
import QuestionList from "./QuestionList"
import { createEmptyQuestion, QUESTION_TYPES } from "../../features/checklist/formBuilder.helpers"

const SectionCard = ({ section, onUpdate, onDelete }) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: section.id })
	const [newQuestionType, setNewQuestionType] = useState("short_text")
	const [expanded, setExpanded] = useState(true)

	const style = { transform: CSS.Transform.toString(transform), transition }

	const handleAddQuestion = () => {
		const newQuestion = createEmptyQuestion(
			newQuestionType,
			section.questions.length,
		)
		onUpdate({ questions: [...section.questions, newQuestion] })
	}

	const handleUpdateQuestion = (questionId, updates) => {
		onUpdate({
			questions: section.questions.map((q) =>
				q.id === questionId ? { ...q, ...updates } : q,
			),
		})
	}

	const handleDeleteQuestion = (questionId) => {
		onUpdate({
			questions: section.questions.filter((q) => q.id !== questionId),
		})
	}

	const handleReorderQuestions = (reordered) => {
		onUpdate({
			questions: reordered.map((q, i) => ({ ...q, display_order: i })),
		})
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			className="rounded-xl border bg-card p-4"
		>
			<Collapsible open={expanded} onOpenChange={setExpanded}>
				<div className="flex items-start gap-2 mb-3">
					<button
						{...attributes}
						{...listeners}
						className="cursor-grab text-muted-foreground mt-2"
					>
						<GripVertical className="h-4 w-4" />
					</button>

					<div className="flex-1 flex flex-col gap-2">
						<Input
							value={section.title}
							onChange={(e) => onUpdate({ title: e.target.value })}
							className="font-medium"
							placeholder="Section title"
						/>
						<Textarea
							value={section.description}
							onChange={(e) => onUpdate({ description: e.target.value })}
							placeholder="Section description (optional)"
							className="resize-none text-sm"
							rows={2}
						/>
					</div>

					<CollapsibleTrigger asChild>
						<Button variant="ghost" size="icon">
							<ChevronDown
								className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
							/>
						</Button>
					</CollapsibleTrigger>

					<Button
						variant="ghost"
						size="icon"
						className="text-destructive"
						onClick={onDelete}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>

				<CollapsibleContent className="flex flex-col gap-3 pl-6">
					<QuestionList
						questions={section.questions}
						onUpdateQuestion={handleUpdateQuestion}
						onDeleteQuestion={handleDeleteQuestion}
						onReorderQuestions={handleReorderQuestions}
					/>

					<div className="flex gap-2 items-center pt-2 border-t">
						<Select value={newQuestionType} onValueChange={setNewQuestionType}>
							<SelectTrigger className="w-48">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{QUESTION_TYPES.map((t) => (
									<SelectItem key={t.value} value={t.value}>
										{t.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Button variant="outline" size="sm" onClick={handleAddQuestion}>
							<Plus className="h-4 w-4" /> Add Question
						</Button>
					</div>
				</CollapsibleContent>
			</Collapsible>
		</div>
	)
}

export default SectionCard
