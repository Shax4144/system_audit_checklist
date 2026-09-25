// components/EditableMasterlistField.jsx
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const EditableDropdownField = ({
	label,
	required,
	value,
	onChange,
	options, 
	isLoading,
	onSelectOption, 
	placeholder,
	readOnly = false,
}) => {
	const [open, setOpen] = useState(false)

	const handleSelect = (option) => {
		onChange(option.label)
		onSelectOption?.(option)
		setOpen(false)
	}

	return (
		<div className="flex flex-col gap-1.5">
			<Label>
				{label} {required && <span className="text-destructive">*</span>}
			</Label>

			<div className="relative flex gap-1">
				<Input
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={isLoading ? "Loading..." : placeholder}
					disabled={isLoading}
					className="flex-1"
					readOnly={readOnly}
				/>

				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							type="button"
							disabled={isLoading}
						>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  open && "rotate-180"
                )}
              />
						</Button>
					</PopoverTrigger>

					<PopoverContent
						className="w-64 p-1 max-h-60 overflow-y-auto"
						align="end"
					>
						{options.length === 0 ? (
							<p className="text-sm text-muted-foreground px-3 py-2">
								No options found.
							</p>
						) : (
							options.map((opt) => (
								<div
									key={opt.id}
									className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted cursor-pointer"
									onClick={() => handleSelect(opt)}
								>
									<Check
										className={cn(
											"h-4 w-4",
											value === opt.label ? "opacity-100" : "opacity-0",
										)}
									/>
									{opt.label}
								</div>
							))
						)}
					</PopoverContent>
				</Popover>
			</div>
		</div>
	)
}

export default EditableDropdownField
