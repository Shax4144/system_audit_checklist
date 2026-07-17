import { useParams, useNavigate } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSelector } from "react-redux"
import { useFetchPublishedQuery } from "../../features/checklist/publishedChecklist.api"
import AnsweredSectionForm from "../../components/checklist-answer/AnsweredSectionForm"

const getStoredUser = () => {
	try {
		const raw = localStorage.getItem("user")
		return raw ? JSON.parse(raw) : {}
	} catch {
		return {}
	}
}

const MyChecklistAnswer = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const currentUser = getStoredUser()

	const { data: response, isFetching } = useFetchPublishedQuery({ id })

	const checklistData = response?.data

	if (isFetching || !checklistData) {
		return (
			<p className="text-sm text-muted-foreground py-10 text-center">
				Loading checklist...
			</p>
		)
	}

	const info = checklistData.information ?? {}

	// Only sections assigned to the logged-in user
	const mySections = (checklistData.checklist ?? [])
		.map((section, index) => ({ ...section, originalIndex: index }))
		.filter((section) => String(section.user_id) === String(currentUser.id))

	return (
		<div className="flex flex-col gap-6 max-w-3xl mx-auto pb-20">
			<div className="flex items-center gap-3">
				<Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
					<ChevronLeft className="h-4 w-4" />
				</Button>
				<div>
					<h1 className="text-2xl font-semibold">{checklistData.title}</h1>
					<p className="text-sm text-muted-foreground">
						Supplier: {info.supplier}
					</p>
				</div>
			</div>

			{mySections.length === 0 ? (
				<p className="text-sm text-muted-foreground py-10 text-center">
					You have no sections assigned in this checklist.
				</p>
			) : (
				<div className="flex flex-col gap-4">
					{mySections.map((section) => (
						<AnsweredSectionForm
							key={section.originalIndex}
							checklistId={checklistData.id}
							section={section}
							sectionIndex={section.originalIndex}
						/>
					))}
				</div>
			)}
		</div>
	)
}

export default MyChecklistAnswer
