import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Eye, Save, Loader2, ChevronLeft } from "lucide-react"
import {
	useFetchChecklistsQuery,
	usePostChecklistMutation,
	useUpdateChecklistMutation,
	useArchiveChecklistMutation,
} from "../../features/checklist/checklist.api"
import { createEmptySection } from "../../features/checklist/formBuilder.helpers"
import SectionList from "./SectionList"
import { appToast } from "../Toast"

const initialFormState = {
	title: "Untitled Form",
	status: "draft",
	sections: [],
}

const FormBuilder = () => {
	const { id: formId } = useParams()
	const navigate = useNavigate()
	const isNew = !formId

	const [form, setForm] = useState(isNew ? initialFormState : null)

	// fetch the whole list (no single-item endpoint yet), skip entirely when creating new
	const { data: checklistsResponse, isFetching } = useFetchChecklistsQuery(
		{ pagination: "none" },
		{ skip: isNew },
	)

	// console.log("formId from URL:", formId)
	// console.log("checklistsResponse:", checklistsResponse)

	// find the matching checklist by id from the fetched list
	const checklistData = checklistsResponse?.data?.find(
		(c) => String(c.id) === String(formId),
	)

	// console.log("checklistData found:", checklistData)

	const [postChecklist, { isLoading: isCreating }] = usePostChecklistMutation()
	const [updateChecklist, { isLoading: isUpdating }] =
		useUpdateChecklistMutation()
	const [archiveChecklist, { isLoading: isArchive }] =
		useArchiveChecklistMutation()

	const isSaving = isCreating || isUpdating || isArchive

	useEffect(() => {
		if (!isNew && checklistData) {
			const sections = (checklistData.checklist ?? []).map((s, sIndex) => {
				const hasSubsections = Boolean(s["sub-sections"])

				return {
					id: `section-${sIndex}`,
					title: s.section,
					description: "",
					assigned_roles: [],
					assigned_users: [],
					display_order: sIndex,
					questions: hasSubsections
						? []
						: (s.item ?? []).map((q, qIndex) => ({
								id: `question-${sIndex}-${qIndex}`,
								type: "rating",
								label: q.name,
								description: "",
								placeholder: "",
								help_text: "",
								required: false,
								category: q.category ?? "",
								display_order: qIndex,
								options: [],
								validation: {},
								conditional_visibility: null,
							})),
					subsections: hasSubsections
						? s["sub-sections"].map((sub, subIndex) => ({
								id: `subsection-${sIndex}-${subIndex}`,
								title: sub.item,
								description: "",
								display_order: subIndex,
								questions: (sub["sub-items"] ?? []).map((q, qIndex) => ({
									id: `question-${sIndex}-${subIndex}-${qIndex}`,
									type: "rating",
									label: q.name,
									description: "",
									placeholder: "",
									help_text: "",
									required: false,
									category: q.category ?? "",
									display_order: qIndex,
									options: [],
									validation: {},
									conditional_visibility: null,
								})),
							}))
						: [],
				}
			})

			setForm({
				title: checklistData.title ?? "Untitled Form",
				status: checklistData.status ?? "draft",
				sections,
			})
		}
	}, [checklistData, isNew])

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

	const buildPayload = () => ({
		title: form.title,
		checklist: form.sections.map((section) => {
			const hasSubsections = section.subsections.length > 0

			if (hasSubsections) {
				return {
					section: section.title,
					"sub-sections": section.subsections.map((sub) => ({
						item: sub.title,
						"sub-items": sub.questions.map((q) => ({
							name: q.label,
							category: q.category,
						})),
					})),
				}
			}

			return {
				section: section.title,
				item: section.questions.map((q) => ({
					name: q.label,
					category: q.category,
				})),
			}
		}),
	})

	const handleSave = async () => {
		try {
			const payload = buildPayload()

			if (isNew) {
				const created = await postChecklist(payload).unwrap()
				const newId = created.data?.id ?? created.id
				appToast.success("Form created", "Your form has been saved as a draft.")
				navigate(`/workspace/checklist/builder/${newId}`, { replace: true })
			} else {
				await updateChecklist({ id: formId, ...payload }).unwrap()
				appToast.success("Form saved", "Your changes have been saved.")
			}
		} catch (err) {
			appToast.error("Error", err?.data?.message ?? "Failed to save form.")
			console.error(err)
		}
	}

	if (!isNew && (isFetching || !form)) {
		return (
			<p className="text-sm text-muted-foreground py-10 text-center">
				Loading form...
			</p>
		)
	}

	return (
		<div className="flex flex-col gap-6 max-w-4xl mx-auto pb-20">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Button
						variant="ghost" size="xl" onClick={() => navigate(-1)}>
						<ChevronLeft className="size-full" />
					</Button>
					<div>
						<h1 className="text-2xl font-semibold">Form Builder</h1>
						<p className="text-sm text-muted-foreground">
							Status:{" "}
							<span className="capitalize font-medium">{form.status}</span>
						</p>
					</div>
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
				</div>
			</div>

			<div className="rounded-xl border bg-card p-5 flex flex-col gap-3">
				<Input
					value={form.title}
					onChange={handleFieldChange("title")}
					className="text-lg font-medium h-11"
					placeholder="Form title"
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
