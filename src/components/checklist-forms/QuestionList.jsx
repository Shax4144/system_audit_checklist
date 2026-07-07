// features/forms/components/QuestionList.jsx
import { DndContext, closestCenter } from "@dnd-kit/core"
import {
	SortableContext,
	verticalListSortingStrategy,
	arrayMove,
} from "@dnd-kit/sortable"
import QuestionCard from "./QuestionCard"

const QuestionList = ({
	questions,
	onUpdateQuestion,
	onDeleteQuestion,
	onReorderQuestions,
}) => {
	const handleDragEnd = (event) => {
		const { active, over } = event
		if (over && active.id !== over.id) {
			const oldIndex = questions.findIndex((q) => q.id === active.id)
			const newIndex = questions.findIndex((q) => q.id === over.id)
			onReorderQuestions(arrayMove(questions, oldIndex, newIndex))
		}
	}

	if (questions.length === 0) {
		return (
			<p className="text-xs text-muted-foreground py-2">
				No questions in this section yet.
			</p>
		)
	}

	return (
		<DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
			<SortableContext
				items={questions.map((q) => q.id)}
				strategy={verticalListSortingStrategy}
			>
				<div className="flex flex-col gap-2">
					{questions.map((question) => (
						<QuestionCard
							key={question.id}
							question={question}
							onUpdate={(updates) => onUpdateQuestion(question.id, updates)}
							onDelete={() => onDeleteQuestion(question.id)}
						/>
					))}
				</div>
			</SortableContext>
		</DndContext>
	)
}

export default QuestionList
