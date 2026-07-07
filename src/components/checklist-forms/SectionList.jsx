// features/forms/components/SectionList.jsx
import { DndContext, closestCenter } from "@dnd-kit/core"
import {
	SortableContext,
	verticalListSortingStrategy,
	arrayMove,
} from "@dnd-kit/sortable"
import SectionCard from "./SectionCard"

const SectionList = ({
	sections,
	onUpdateSection,
	onDeleteSection,
	onReorderSections,
}) => {
	const handleDragEnd = (event) => {
		const { active, over } = event
		if (over && active.id !== over.id) {
			const oldIndex = sections.findIndex((s) => s.id === active.id)
			const newIndex = sections.findIndex((s) => s.id === over.id)
			onReorderSections(arrayMove(sections, oldIndex, newIndex))
		}
	}

	if (sections.length === 0) {
		return (
			<div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
				No sections yet. Click "Add Section" to get started.
			</div>
		)
	}

	return (
		<DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
			<SortableContext
				items={sections.map((s) => s.id)}
				strategy={verticalListSortingStrategy}
			>
				<div className="flex flex-col gap-4">
					{sections.map((section) => (
						<SectionCard
							key={section.id}
							section={section}
							onUpdate={(updates) => onUpdateSection(section.id, updates)}
							onDelete={() => onDeleteSection(section.id)}
						/>
					))}
				</div>
			</SortableContext>
		</DndContext>
	)
}

export default SectionList
