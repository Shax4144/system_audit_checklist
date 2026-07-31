// formBuilder.helpers.js
export const generateId = () => {
	if (
		typeof crypto !== "undefined" &&
		typeof crypto.randomUUID === "function"
	) {
		return crypto.randomUUID()
	}
	return (
		"id-" +
		Date.now().toString(36) +
		"-" +
		Math.random().toString(36).slice(2, 10)
	)
}

export const createEmptySection = (order) => ({
	id: `temp-section-${generateId()}`,
	title: "Untitled Section",
	description: "",
	assigned_roles: [],
	assigned_users: [],
	percentage: 0,
	display_order: order,
	questions: [], // direct questions live here
	subsections: [], // optional nested subsections
})

export const createEmptySubsection = (order) => ({
	id: `temp-subsection-${generateId()}`,
	title: "Untitled Subsection",
	description: "",
	display_order: order,
	questions: [],
})

export const createEmptyQuestion = (type, order) => ({
	id: `temp-question-${generateId()}`,
	type,
	label: "Untitled Question",
	description: "",
	placeholder: "",
	help_text: "",
	required: false,
	category: "",
	display_order: order,
	options: ["dropdown", "radio", "checkbox"].includes(type)
		? [{ id: generateId(), label: "Option 1", value: "option_1" }]
		: [],
	validation: {},
	conditional_visibility: null,
})

export const QUESTION_TYPES = [
	{ value: "short_text", label: "Short Text" },
	{ value: "long_text", label: "Long Text" },
	{ value: "number", label: "Number" },
	{ value: "email", label: "Email" },
	{ value: "date", label: "Date" },
	{ value: "time", label: "Time" },
	{ value: "dropdown", label: "Dropdown" },
	{ value: "radio", label: "Radio Group" },
	{ value: "checkbox", label: "Checkbox Group" },
	{ value: "file", label: "File Upload" },
	{ value: "rating", label: "Rating" },
]

export const appendFormData = (formData, data, parentKey) => {
	if (data === null || data === undefined) {
		return
	}

	if (data instanceof File || data instanceof Blob) {
		formData.append(parentKey, data)
		return
	}

	if (Array.isArray(data)) {
		data.forEach((item, index) => {
			appendFormData(formData, item, `${parentKey}[${index}]`)
		})
		return
	}

	if (typeof data === "object") {
		Object.keys(data).forEach((key) => {
			const value = data[key]
			const nextKey = parentKey ? `${parentKey}[${key}]` : key
			appendFormData(formData, value, nextKey)
		})
		return
	}

	formData.append(parentKey, data)
}
