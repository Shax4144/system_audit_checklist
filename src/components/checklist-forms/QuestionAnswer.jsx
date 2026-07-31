// components/checklist-answer/QuestionAnswer.jsx
import { useState, useRef, useMemo, useEffect} from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, X } from "lucide-react"

const GRADE_OPTIONS = ["1", "2", "3", "4", "5", "N/A"]

const GRADE_STYLES = {
  1: "bg-red-500 text-white border-red-600",
  2: "bg-orange-400 text-white border-orange-400",
  3: "bg-blue-500 text-white border-blue-300",
  4: "bg-blue-500 text-white border-blue-300",
  5: "bg-green-700 text-white border-green-600",
  "N/A": "bg-slate-400 text-white border-slate-500",
};

const QuestionAnswer = ({ question, value, onChange, disabled }) => {
	const fileInputRef = useRef(null)
	// const [preview, setPreview] = useState(
	// 	value?.photo ? URL.createObjectURL(value.photo) : null,
	// )

	const preview = useMemo(() => {
		if (!value?.photo) return null

		if (value.photo instanceof File) {
			return URL.createObjectURL(value.photo)
		}

		return value.photo // existing image URL
	}, [value?.photo])

	useEffect(() => {
		return () => {
			if (preview?.startsWith("blob:")) {
				URL.revokeObjectURL(preview)
			}
		}
	}, [preview])

	const grade = value?.grade ?? ""
	const note = value?.note ?? ""

	const updateAnswer = (patch) => onChange({ ...value, ...patch })

	const handlePhotoChange = (e) => {
		const file = e.target.files?.[0]
		if (file) {
			// setPreview(URL.createObjectURL(file))
			updateAnswer({ photo: file })
		}
	}

	const handleRemovePhoto = () => {
		// setPreview(null)
		updateAnswer({ photo: null })
		if (fileInputRef.current) fileInputRef.current.value = ""
	}

	return (
		<div className="flex flex-col gap-2 py-3 border-b last:border-0">
			<div className="flex items-start justify-between gap-4">
				<p className="text-sm font-medium flex-1">{question.name}</p>
				<div className="flex items-center gap-2 shrink-0">
					{question.category && (
						<Badge variant="outline">{question.category}</Badge>
					)}
					<div className="hidden md:flex gap-1">
						{GRADE_OPTIONS.map((opt) => (
							<Button
								key={opt}
								disabled={disabled}
								onClick={() => updateAnswer({ grade: opt })}
								variant="ghost"
								className={`h-10 min-w-10 px-1.5 rounded-full text-sm font-medium border transition-colors ${
									grade === opt
										? // "bg-primary text-primary-foreground border-primary"
											GRADE_STYLES[opt]
										: "bg-background text-muted-foreground border-border hover:bg-muted"
								} disabled:opacity-50 disabled:pointer-events-none`}
							>
								{opt}
							</Button>
						))}
					</div>
				</div>
			</div>

			<div className="md:hidden flex gap-1 justify-end">
				{GRADE_OPTIONS.map((opt) => (
					<Button
						key={opt}
						disabled={disabled}
						onClick={() => updateAnswer({ grade: opt })}
						variant="ghost"
						className={`h-10 min-w-10 px-1.5 rounded-full text-sm font-medium border transition-colors ${
							grade === opt
								? // "bg-primary text-primary-foreground border-primary"
									GRADE_STYLES[opt]
								: "bg-background text-muted-foreground border-border hover:bg-muted"
						} disabled:opacity-50 disabled:pointer-events-none`}
					>
						{opt}
					</Button>
				))}
			</div>

			<div className="flex items-start gap-2">
				<Textarea
					value={note}
					onChange={(e) => updateAnswer({ note: e.target.value })}
					placeholder="Remarks"
					className="resize-none text-sm flex-1"
					rows={2}
					disabled={disabled}
				/>

				<div className="flex flex-col items-center gap-1 shrink-0">
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						capture="environment"
						className="hidden"
						onChange={handlePhotoChange}
						disabled={disabled}
					/>
					<Button
						type="button"
						variant="outline"
						size="lg"
						onClick={() => fileInputRef.current?.click()}
						disabled={disabled}
					>
						<Camera className="h-8 w-8" />
					</Button>
				</div>
			</div>

			{preview && (
				<div className="relative w-24 h-24 rounded-md overflow-hidden border">
					<img
						src={preview}
						alt="Documentation"
						className="w-full h-full object-cover"
					/>
					{!disabled && (
						<button
							type="button"
							onClick={handleRemovePhoto}
							className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5"
						>
							<X className="h-3 w-3 text-white" />
						</button>
					)}
				</div>
			)}
		</div>
	)
}

export default QuestionAnswer
