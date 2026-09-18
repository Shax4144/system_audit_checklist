// components/SubsectionCard.jsx
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

const SubsectionCard = ({ subsection, onUpdate, onDelete }) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: subsection.id })
	const [newQuestionType, setNewQuestionType] = useState("rating")
	const [expanded, setExpanded] = useState(true)

	const style = { transform: CSS.Transform.toString(transform), transition }

	const handleAddQuestion = () => {
		const newQuestion = createEmptyQuestion(
			newQuestionType,
			subsection.questions.length,
		)
		onUpdate({ questions: [...subsection.questions, newQuestion] })
	}

	const handleUpdateQuestion = (questionId, updates) => {
		onUpdate({
			questions: subsection.questions.map((q) =>
				q.id === questionId ? { ...q, ...updates } : q,
			),
		})
	}

	const handleDeleteQuestion = (questionId) => {
		onUpdate({
			questions: subsection.questions.filter((q) => q.id !== questionId),
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
			className="rounded-lg border border-dashed bg-background p-3"
		>
			<Collapsible open={expanded} onOpenChange={setExpanded}>
				<div className="flex items-start gap-2 mb-2">
					<button
						{...attributes}
						{...listeners}
						className="cursor-grab text-muted-foreground mt-2"
					>
						<GripVertical className="h-3.5 w-3.5" />
					</button>

					<div className="flex-1 flex flex-col gap-2">
						<Input
							value={subsection.title}
							onChange={(e) => onUpdate({ title: e.target.value })}
							className="text-sm h-8"
							placeholder="Subsection title"
						/>
						{/* <Textarea
							value={subsection.description}
							onChange={(e) => onUpdate({ description: e.target.value })}
							placeholder="Subsection description (optional)"
							className="resize-none text-xs"
							rows={1}
						/>*/}
					</div>

					<CollapsibleTrigger asChild>
						<Button variant="ghost" size="icon" className="h-8 w-8">
							<ChevronDown
								className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
							/>
						</Button>
					</CollapsibleTrigger>

					<Button
						variant="destructive"
						size="icon"
						className="group h-8 w-8 hover:border hover:border-destructive"
						onClick={onDelete}
					>
						<Trash2 className="h-3.5 w-3.5" />
					</Button>
				</div>

				<CollapsibleContent className="flex flex-col gap-2 pl-5">
					<QuestionList
						questions={subsection.questions}
						onUpdateQuestion={handleUpdateQuestion}
						onDeleteQuestion={handleDeleteQuestion}
						onReorderQuestions={handleReorderQuestions}
					/>

					<div className="flex gap-2 items-center pt-2 border-t">
						<Select value={newQuestionType} onValueChange={setNewQuestionType}>
							<SelectTrigger className="w-44 h-8 text-sm">
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
							<Plus className="h-3.5 w-3.5" /> Add Question
						</Button>
					</div>
				</CollapsibleContent>
			</Collapsible>
		</div>
	)
}

export default SubsectionCard
