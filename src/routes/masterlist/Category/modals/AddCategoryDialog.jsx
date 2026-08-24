import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"

import { useSelectedRow } from "../../../../context/EditContext"

const initialForm = {
	name: "",
}

const AddCategoryDialog = ({ open, onClose, onConfirm, isLoading}) => {
  const [formData, setFormData] = useState(initialForm)
  const { selectedRow } = useSelectedRow()
  const isEditMode = Boolean(selectedRow)

  useEffect(() => {
    if (open) {
      if (selectedRow) {
        // editing — pre-fill
        setFormData({
					name: selectedRow.name,
				})
      } else {
        // creating — reset
        setFormData(initialForm)
      }
    }
  }, [open, selectedRow])

  const handleSearch = () => {
    return
  }

  const handleChange = (field) => (e) => {
  let value = e.target.value;
  setFormData((prev) => ({ ...prev, [field]: value }));
};


	const handleSubmit = () => {
    const payload = {
			name: formData.name,
		}
		// console.log("payload:", payload)
    onConfirm(payload);
  }

  return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				if (isLoading) return
				
				if (!isOpen) {
					onClose()
				}
			}}
		>
			<DialogContent className="min-w-[35%]">
				<DialogHeader>
					<DialogTitle className="font-semibold text-xl">
						{isEditMode ? "Edit Form" : "Create Form"}
					</DialogTitle>
				</DialogHeader>
				<Separator />
				<form className="flex flex-col gap-4">
					<div className="flex flex-col gap-3">
						<p className="text-lg font-semibold uppercase tracking-wider text-muted-foreground">
							Category
						</p>

						<div className="grid grid-cols-12 gap-4 items-end">
							<div className="col-span-12 flex flex-col gap-1.5">
								<Label htmlFor="category-name">
									Category Name<span className="text-destructive">*</span>
								</Label>
								<Input
									id="category-name"
                  value={formData.name}
									onChange={handleChange("name")}
									required
									disabled={isLoading}
								/>
							</div>
						</div>
					</div>
					{/* end of category type */}

					<DialogFooter className="pt-4">
						<DialogClose asChild>
							<Button
								className="uppercase font-semibold"
								type="button"
								variant="outline"
								onClick={onClose}
								size="lg"
								disabled={isLoading}
							>
								cancel
							</Button>
						</DialogClose>
						<Button
							className="uppercase font-semibold"
							type="button"
							onClick={handleSubmit}
							size="lg"
							disabled={isLoading}
						>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							{isLoading
								? isEditMode
									? "Updating..."
									: "Creating..."
								: isEditMode
									? "Update"
									: "Create"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}

export default AddCategoryDialog
