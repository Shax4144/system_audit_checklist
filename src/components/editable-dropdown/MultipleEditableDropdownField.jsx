// components/EditableMultiMasterlistField.jsx
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover"
import { ChevronDown, X } from "lucide-react"

const MultipleEditableDropdownField = ({
	label,
	required,
	values,
	onChange,
	options,
	isLoading,
}) => {
	const [open, setOpen] = useState(false)

	const toggleValue = (optLabel) => {
		onChange(
			values.includes(optLabel)
				? values.filter((v) => v !== optLabel)
				: [...values, optLabel],
		)
	}

	const removeValue = (optLabel) => {
		onChange(values.filter((v) => v !== optLabel))
	}

	return (
		<div className="flex flex-col gap-1.5">
			<Label>
				{label} {required && <span className="text-destructive">*</span>}
			</Label>

			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						type="button"
						className="w-full justify-between font-normal h-auto min-h-8 p-1.5 rounded-[0.35rem]"
						disabled={isLoading}
					>
						<div className="flex flex-wrap gap-1 flex-1 text-left px-1 overflow-hidden">
							{values.length > 0 ? (
								values.map((v) => (
									<Badge
										key={v}
										variant="secondary"
										className="flex items-center gap-1"
										onClick={(e) => {
											e.stopPropagation()
											removeValue(v)
										}}
									>
										{v}
										<X className="h-3 w-3" />
									</Badge>
								))
							) : (
								<span className="text-muted-foreground px-1">
									{isLoading ? "Loading..." : "Select products"}
								</span>
							)}
						</div>
						<ChevronDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
					</Button>
				</PopoverTrigger>

				<PopoverContent
					className="w-full p-2 max-h-60 overflow-y-auto"
					align="start"
				>
					{options.map((opt) => (
						<div
							key={opt.id}
							className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer"
							onClick={() => toggleValue(opt.label)}
						>
							<Checkbox
								checked={values.includes(opt.label)}
								onClick={(e) => e.stopPropagation()}
								onCheckedChange={() => toggleValue(opt.label)}
							/>
							<span className="text-sm">{opt.label}</span>
						</div>
					))}
				</PopoverContent>
			</Popover>
		</div>
	)
}

export default MultipleEditableDropdownField
