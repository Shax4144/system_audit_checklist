import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Label } from "@/components/ui/label"
import {
	GripVertical,
	Trash2,
	Plus,
	ChevronDown,
	FolderPlus,
} from "lucide-react"
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

import QuestionList from "./QuestionList"
import SubsectionList from "./SubsectionList"
import {
	createEmptyQuestion,
	createEmptySubsection,
	QUESTION_TYPES,
} from "../../features/checklist/formBuilder.helpers"

const SectionCard = ({ section, onUpdate, onDelete }) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: section.id })
	const [newQuestionType, setNewQuestionType] = useState("rating")
	const [expanded, setExpanded] = useState(true)

	const style = { transform: CSS.Transform.toString(transform), transition }

	const hasSubsections = section.subsections.length > 0

	// Direct questions on the section (only shown when no subsections exist)
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

	// Subsections
	const handleAddSubsection = () => {
		onUpdate({
			subsections: [
				...section.subsections,
				createEmptySubsection(section.subsections.length),
			],
		})
	}

	const handleUpdateSubsection = (subsectionId, updates) => {
		onUpdate({
			subsections: section.subsections.map((sub) =>
				sub.id === subsectionId ? { ...sub, ...updates } : sub,
			),
		})
	}

	const handleDeleteSubsection = (subsectionId) => {
		onUpdate({
			subsections: section.subsections.filter((sub) => sub.id !== subsectionId),
		})
	}

	const handleReorderSubsections = (reordered) => {
		onUpdate({
			subsections: reordered.map((sub, i) => ({ ...sub, display_order: i })),
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

          <div className="flex-1 flex flex-col gap-2 sm:hidden">
            <div className="flex flex-row gap-1">
              <Label className="text-xs text-muted-foreground shrink-0">
							Weight
						</Label>
						<div className="relative w-24">
							<Input
								type="number"
								min={0}
								max={100}
								value={section.percentage}
								onChange={(e) => onUpdate({ percentage: e.target.value })}
								className="h-8 pr-6 text-sm"
							/>
							<span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
								%
							</span>
						</div>
            </div>
              
            
						<Input
							value={section.title}
							onChange={(e) => onUpdate({ title: e.target.value })}
							className="font-medium"
							placeholder="Section title"
						/>
						{/* <Textarea
							value={section.description}
							onChange={(e) => onUpdate({ description: e.target.value })}
							placeholder="Section description (optional)"
							className="resize-none text-sm"
							rows={2}
						/>*/}
					</div>

					<div className="hidden sm:flex-1 sm:flex flex-col gap-2">
						<Input
							value={section.title}
							onChange={(e) => onUpdate({ title: e.target.value })}
							className="font-medium"
							placeholder="Section title"
						/>
						{/* <Textarea
							value={section.description}
							onChange={(e) => onUpdate({ description: e.target.value })}
							placeholder="Section description (optional)"
							className="resize-none text-sm"
							rows={2}
						/>*/}
					</div>

					<div className="hidden sm:flex items-center gap-2">
						<Label className="text-xs text-muted-foreground shrink-0">
							Weight
						</Label>
						<div className="relative w-24">
							<Input
								type="number"
								min={0}
								max={100}
								value={section.percentage}
								onChange={(e) => onUpdate({ percentage: e.target.value })}
								className="h-8 pr-6 text-sm"
							/>
							<span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
								%
							</span>
						</div>
					</div>

					<CollapsibleTrigger asChild>
						<Button variant="ghost" size="icon">
							<ChevronDown
								className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
							/>
						</Button>
					</CollapsibleTrigger>

					<Button
						variant="destructive"
						size="icon"
						className="group h-8 w-8 hover:border hover:border-destructive"
						onClick={onDelete}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>

				<CollapsibleContent className="flex flex-col gap-4 pl-6">
					{/* Subsections, if any */}
					{hasSubsections && (
						<SubsectionList
							subsections={section.subsections}
							onUpdateSubsection={handleUpdateSubsection}
							onDeleteSubsection={handleDeleteSubsection}
							onReorderSubsections={handleReorderSubsections}
						/>
					)}

					{/* Direct questions — only shown/addable when there are no subsections */}
					{!hasSubsections && (
						<>
							<QuestionList
								questions={section.questions}
								onUpdateQuestion={handleUpdateQuestion}
								onDeleteQuestion={handleDeleteQuestion}
								onReorderQuestions={handleReorderQuestions}
							/>

							<div className="flex gap-2 items-center pt-2 border-t">
								<Select
									value={newQuestionType}
									onValueChange={setNewQuestionType}
								>
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
						</>
					)}

					{/* Add Subsection — always available, converts section into a subsection-based one */}
					<Button
						variant="ghost"
						size="sm"
						onClick={handleAddSubsection}
						className="self-start text-muted-foreground"
					>
						<FolderPlus className="h-4 w-4" /> Add Subsection
					</Button>
				</CollapsibleContent>
			</Collapsible>
		</div>
	)
}

export default SectionCard
