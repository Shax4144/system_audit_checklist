// features/forms/components/QuestionCard.jsx
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Trash2, Plus, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { QUESTION_TYPES, generateId } from "../../features/checklist/formBuilder.helpers"

const OPTION_TYPES = ["dropdown", "radio", "checkbox"]
import CategoryDropdown from "../dropdown/CategoryDropdown"

const QuestionCard = ({ question, onUpdate, onDelete }) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: question.id })
	const style = { transform: CSS.Transform.toString(transform), transition }

  const typeLabel = QUESTION_TYPES.find((t) => t.value === question.type)?.label
  
	const handleAddOption = () => {
		const newOption = {
			id: generateId(),
			label: `Option ${question.options.length + 1}`,
			value: `option_${question.options.length + 1}`,
		}
		onUpdate({ options: [...question.options, newOption] })
	}

	const handleUpdateOption = (optionId, label) => {
		onUpdate({
			options: question.options.map((o) =>
				o.id === optionId
					? { ...o, label, value: label.toLowerCase().replace(/\s+/g, "_") }
					: o,
			),
		})
	}

	const handleDeleteOption = (optionId) => {
		onUpdate({ options: question.options.filter((o) => o.id !== optionId) })
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			className="rounded-lg border bg-background p-3"
		>
			<div className="flex items-start gap-2">
				<button
					{...attributes}
					{...listeners}
					className="cursor-grab text-muted-foreground mt-2"
				>
					<GripVertical className="h-4 w-4" />
				</button>

				<div className="flex-1 flex flex-col gap-2">
					<div className="flex items-center gap-2">
						<span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
							{typeLabel}
						</span>
					</div>

					<div className="flex items-center gap-2 mt-1">
						<Label className="text-xs text-muted-foreground shrink-0">
							Category
						</Label>
						<CategoryDropdown
							triggerClassName="sm:w-48 h-8 text-sm"
							value={question.category}
							onChange={(val) => onUpdate({ category: val })}
							open={true} // always allow fetching once builder is mounted
						/>
					</div>

					<Input
						value={question.label}
						onChange={(e) => onUpdate({ label: e.target.value })}
						placeholder="Question label"
					/>

					{/* <Input
						value={question.description}
						onChange={(e) => onUpdate({ description: e.target.value })}
						placeholder="Description (optional)"
						className="text-sm"
					/>*/}

					{["short_text", "long_text", "number", "email"].includes(
						question.type,
					) && (
						<Input
							value={question.placeholder}
							onChange={(e) => onUpdate({ placeholder: e.target.value })}
							placeholder="Placeholder text (optional)"
							className="text-sm"
						/>
					)}

					{OPTION_TYPES.includes(question.type) && (
						<div className="flex flex-col gap-1.5 mt-1">
							<Label className="text-xs text-muted-foreground">Options</Label>
							{question.options.map((opt) => (
								<div key={opt.id} className="flex items-center gap-2">
									<Input
										value={opt.label}
										onChange={(e) => handleUpdateOption(opt.id, e.target.value)}
										className="h-8 text-sm"
									/>
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 shrink-0"
										onClick={() => handleDeleteOption(opt.id)}
									>
										<X className="h-3.5 w-3.5" />
									</Button>
								</div>
							))}
							<Button
								variant="outline"
								size="sm"
								className="self-start mt-1"
								onClick={handleAddOption}
							>
								<Plus className="h-3.5 w-3.5" /> Add Option
							</Button>
						</div>
					)}

					{/* <div className="flex items-center gap-2 mt-1">
						<Checkbox
							checked={question.required}
							onCheckedChange={(checked) => onUpdate({ required: checked })}
						/>
						<Label className="text-sm">Required</Label>
					</div>*/}
				</div>

				<Button
					variant="destructive"
					size="icon"
					className="group h-8 w-8 hover:border hover:border-destructive"
					onClick={onDelete}
				>
					<Trash2 className="h-4 w-4" />
				</Button>
			</div>
		</div>
	)
}

export default QuestionCard
