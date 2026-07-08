// components/SubsectionList.jsx
import { DndContext, closestCenter } from "@dnd-kit/core"
import {
	SortableContext,
	verticalListSortingStrategy,
	arrayMove,
} from "@dnd-kit/sortable"
import SubsectionCard from "./SubsectionCard"

const SubsectionList = ({
	subsections,
	onUpdateSubsection,
	onDeleteSubsection,
	onReorderSubsections,
}) => {
	const handleDragEnd = (event) => {
		const { active, over } = event
		if (over && active.id !== over.id) {
			const oldIndex = subsections.findIndex((s) => s.id === active.id)
			const newIndex = subsections.findIndex((s) => s.id === over.id)
			onReorderSubsections(arrayMove(subsections, oldIndex, newIndex))
		}
	}

	return (
		<DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
			<SortableContext
				items={subsections.map((s) => s.id)}
				strategy={verticalListSortingStrategy}
			>
				<div className="flex flex-col gap-3">
					{subsections.map((subsection) => (
						<SubsectionCard
							key={subsection.id}
							subsection={subsection}
							onUpdate={(updates) => onUpdateSubsection(subsection.id, updates)}
							onDelete={() => onDeleteSubsection(subsection.id)}
						/>
					))}
				</div>
			</SortableContext>
		</DndContext>
	)
}

export default SubsectionList
