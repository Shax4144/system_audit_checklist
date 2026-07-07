export const createEmptySection = (order) => ({
	id: `temp-section-${crypto.randomUUID()}`,
	title: "Untitled Section",
	description: "",
	assigned_roles: [],
	assigned_users: [],
	display_order: order,
	questions: [],
})

export const createEmptyQuestion = (type, order) => ({
	id: `temp-question-${crypto.randomUUID()}`,
	type,
	label: "Untitled Question",
	description: "",
	placeholder: "",
	help_text: "",
	required: false,
	display_order: order,
	options: ["dropdown", "radio", "checkbox"].includes(type)
		? [{ id: crypto.randomUUID(), label: "Option 1", value: "option_1" }]
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
