// features/respond/components/QuestionAnswer.jsx
import { useState, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Camera, X } from "lucide-react"

const GRADE_OPTIONS = ["1", "2", "3", "4", "5", "N/A"]

const QuestionAnswer = ({ question, value, onChange }) => {
	const fileInputRef = useRef(null)
	const [preview, setPreview] = useState(
		value?.photo ? URL.createObjectURL(value.photo) : null,
	)

	const grade = value?.grade ?? ""
	const note = value?.note ?? ""

	const updateAnswer = (patch) => {
		onChange({ ...value, ...patch })
	}

	const handlePhotoChange = (e) => {
		const file = e.target.files?.[0]
		if (file) {
			setPreview(URL.createObjectURL(file))
			updateAnswer({ photo: file })
		}
	}

	const handleRemovePhoto = () => {
		setPreview(null)
		updateAnswer({ photo: null })
		if (fileInputRef.current) fileInputRef.current.value = ""
	}

	return (
		<div className="flex flex-col gap-2 py-3 border-b last:border-0">
			{/* Question label + grading buttons */}
			<div className="flex items-start justify-between gap-4">
				<p className="text-sm font-medium flex-1">{question.label}</p>

				<div className="flex gap-1 shrink-0">
					{GRADE_OPTIONS.map((opt) => (
						<button
							key={opt}
							type="button"
							onClick={() => updateAnswer({ grade: opt })}
							className={`h-7 min-w-7 px-1.5 rounded-md text-xs font-medium border transition-colors ${
								grade === opt
									? "bg-primary text-primary-foreground border-primary"
									: "bg-background text-muted-foreground border-border hover:bg-muted"
							}`}
						>
							{opt}
						</button>
					))}
				</div>
			</div>

			{/* Note + camera/upload button */}
			<div className="flex items-start gap-2">
				<Textarea
					value={note}
					onChange={(e) => updateAnswer({ note: e.target.value })}
					placeholder="Add a note..."
					className="resize-none text-sm flex-1"
					rows={2}
				/>

				<div className="flex flex-col items-center gap-1 shrink-0">
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						capture="environment"
						className="hidden"
						onChange={handlePhotoChange}
					/>
					<Button
						type="button"
						variant="outline"
						size="icon"
						onClick={() => fileInputRef.current?.click()}
					>
						<Camera className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* Photo preview */}
			{preview && (
				<div className="relative w-24 h-24 rounded-md overflow-hidden border">
					<img
						src={preview}
						alt="Documentation"
						className="w-full h-full object-cover"
					/>
					<button
						type="button"
						onClick={handleRemovePhoto}
						className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5"
					>
						<X className="h-3 w-3 text-white" />
					</button>
				</div>
			)}
		</div>
	)
}

export default QuestionAnswer
