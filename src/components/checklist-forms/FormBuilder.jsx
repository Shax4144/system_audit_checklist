import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Eye, Save, Loader2 } from "lucide-react"
import {
	useFetchChecklistsQuery,
	useLazyFetchChecklistsQuery,
	usePostChecklistMutation,
	useUpdateChecklistMutation,
	useArchiveChecklistMutation,
} from "../../features/checklist/checklist.api"
import { createEmptySection } from "../../features/checklist/formBuilder.helpers"
import SectionList from "./SectionList"
import { appToast } from "@/components/Toast"

const initialFormState = {
	title: "Untitled Form",
	description: "",
	status: "draft",
	sections: [],
}

const FormBuilder = () => {
	const { formId } = useParams()
	const navigate = useNavigate()
	const isNew = !formId

	const [form, setForm] = useState(initialFormState)

	const { data: checklistResponse, isFetching } = useFetchChecklistsQuery(
		formId,
		{
			skip: isNew,
		},
	)

	const [postChecklist, { isLoading: isCreating }] = usePostChecklistMutation()
	const [updateChecklist, { isLoading: isUpdating }] =
		useUpdateChecklistMutation()
	const [archiveChecklist, { isLoading: isArchiving}] = useArchiveChecklistMutation()

	const isSaving = isCreating || isUpdating || isArchiving

	useEffect(() => {
		if (checklistResponse) {
			const data = checklistResponse.data ?? checklistResponse
			setForm({
				title: data.title ?? "Untitled Form",
				description: data.description ?? "",
				status: data.status ?? "draft",
				sections: data.sections ?? [],
			})
		}
	}, [checklistResponse])

	const handleFieldChange = (field) => (e) => {
		setForm((prev) => ({ ...prev, [field]: e.target.value }))
	}

	const handleAddSection = () => {
		setForm((prev) => ({
			...prev,
			sections: [...prev.sections, createEmptySection(prev.sections.length)],
		}))
	}

	const handleUpdateSection = (sectionId, updates) => {
		setForm((prev) => ({
			...prev,
			sections: prev.sections.map((s) =>
				s.id === sectionId ? { ...s, ...updates } : s,
			),
		}))
	}

	const handleDeleteSection = (sectionId) => {
		setForm((prev) => ({
			...prev,
			sections: prev.sections.filter((s) => s.id !== sectionId),
		}))
	}

	const handleReorderSections = (reordered) => {
		setForm((prev) => ({
			...prev,
			sections: reordered.map((s, i) => ({ ...s, display_order: i })),
		}))
	}

	const handleSave = async () => {
		try {
			if (isNew) {
				const created = await postChecklist(form).unwrap()
				appToast.success("Form created", "Your form has been saved as a draft.")
				const newId = created.data?.id ?? created.id
				navigate(`/forms/builder/${newId}`, { replace: true })
			} else {
				await updateChecklist({ id: formId, ...form }).unwrap()
				appToast.success("Form saved", "Your changes have been saved.")
			}
		} catch (err) {
			appToast.error("Error", err?.data?.message ?? "Failed to save form.")
			console.error(err)
		}
	}

	const handlePublish = async () => {
		try {
			await publishChecklist({ id: formId, status: "published" }).unwrap()
			setForm((prev) => ({ ...prev, status: "published" }))
			appToast.success(
				"Form published",
				"The form is now live for respondents.",
			)
		} catch (err) {
			appToast.error("Error", err?.data?.message ?? "Failed to publish form.")
		}
	}

	if (isFetching) {
		return (
			<p className="text-sm text-muted-foreground py-10 text-center">
				Loading form...
			</p>
		)
	}

	return (
		<div className="flex flex-col gap-6 max-w-4xl mx-auto pb-20">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold">Form Builder</h1>
					<p className="text-sm text-muted-foreground">
						Status:{" "}
						<span className="capitalize font-medium">{form.status}</span>
					</p>
				</div>
				<div className="flex gap-2">
					<Button
						variant="outline"
						onClick={() => navigate(`/forms/${formId}/preview`)}
						disabled={isNew}
					>
						<Eye className="h-4 w-4" /> Preview
					</Button>
					<Button variant="outline" onClick={handleSave} disabled={isSaving}>
						{isSaving ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Save className="h-4 w-4" />
						)}
						Save Draft
					</Button>
					<Button onClick={handlePublish} disabled={isSaving || isNew}>
						Publish
					</Button>
				</div>
			</div>

			<div className="rounded-xl border bg-card p-5 flex flex-col gap-3">
				<Input
					value={form.title}
					onChange={handleFieldChange("title")}
					className="text-lg font-medium h-11"
					placeholder="Form title"
				/>
				<Textarea
					value={form.description}
					onChange={handleFieldChange("description")}
					placeholder="Form description (optional)"
					className="resize-none"
				/>
			</div>

			<SectionList
				sections={form.sections}
				onUpdateSection={handleUpdateSection}
				onDeleteSection={handleDeleteSection}
				onReorderSections={handleReorderSections}
			/>

			<Button
				variant="outline"
				onClick={handleAddSection}
				className="self-start"
			>
				<Plus className="h-4 w-4" /> Add Section
			</Button>
		</div>
	)
}

export default FormBuilder
