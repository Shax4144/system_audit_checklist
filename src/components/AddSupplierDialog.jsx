import { React, useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLegend } from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Search, Loader2 } from "lucide-react"

import { useSelectedRow } from "../context/EditContext"
import { appToast } from "./Toast"

const initialForm = {
	name: "",
	contact_person: "",
	address: "",
	tin_no: "",
	contact_no: "",
	products_offered: "",
	email: "",
	remarks: "",
}

const AddSupplierDialog = ({ open, onClose, onConfirm, isLoading}) => {
  const [formData, setFormData] = useState(initialForm)
  const { selectedRow } = useSelectedRow()
  const isEditMode = Boolean(selectedRow)

  useEffect(() => {
    if (open) {
      if (selectedRow) {
        // editing — pre-fill
        setFormData({
					name: selectedRow.name,
					contact_person: (selectedRow.contact_person || []).join(", "),
					address: selectedRow.address,
					tin_no: selectedRow.tin_no,
					contact_no: (selectedRow.contact_no || []).join(", "),
					products_offered: (selectedRow.products_offered || []).join(", "),
					email: selectedRow.email,
					remarks: selectedRow.remarks,
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

  if (field === "contact_no") {
    value = value.replace(/[^0-9, ]/g, "");
  }

  setFormData((prev) => ({ ...prev, [field]: value }));
};
	const splitToArray = (str) => {
		return (str || "")
			.split(",")
			.map((s) => s.trim())
			.filter(Boolean)
	}

	const splitNumbersToArray = (str) => {
		return (str || "")
			.split(",")
			.map((s) => s.trim())
			.filter(Boolean)
			.map((num) => num.replace(/\D/g, "")) // remove non-numbers
			.filter((num) => num.length === 11) // enforce 11 digits only
	}

	const validateContactNo = () => {
		const numbers = (formData.contact_no || "")
			.split(",")
			.map((s) => s.trim())
			.filter(Boolean)

		return numbers.every((num) => num.replace(/\D/g, "").length === 11)
	}

	const handleSubmit = () => {
		if (!validateContactNo()) {
			appToast.warning(
				"Contact number is invalid.",
				"Each contact number must be exactly 11 digits.",
			)
			return
		}

    const payload = {
			name: formData.name,
			contact_person: splitToArray(formData.contact_person),
			address: formData.address,
			tin_no: formData.tin_no,
			contact_no: splitNumbersToArray(formData.contact_no),
			products_offered: splitToArray(formData.products_offered),
			email: formData.email,
			remarks: formData.remarks,
		}
		console.log("payload:", payload)
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
						<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							Supplier Information
						</p>

						<div className="grid grid-cols-12 gap-4 items-end">
							<div className="col-span-6 flex flex-col gap-1.5">
								<Label htmlFor="id-prefix">
									Name <span className="text-destructive">*</span>
								</Label>
								<Input
									id="id-prefix"
									value={formData.name}
									onChange={handleChange("name")}
									required
									disabled={isLoading}
								/>
							</div>

							<div className="col-span-6 flex flex-col gap-1.5">
								<Label htmlFor="contact-person">
									Contact Person <span className="text-destructive">*</span>
								</Label>
								<Input
									id="contact-person"
									placeholder="e.g. John Doe, Jane Smith"
									value={formData.contact_person}
									onChange={handleChange("contact_person")}
									required
									disabled={isLoading}
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 gap-1.5">
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="address">
									Address <span className="text-destructive">*</span>
								</Label>
								<Input
									id="address"
									value={formData.address}
									onChange={handleChange("address")}
									required
									disabled={isLoading}
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-1.5">
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="tin-no">
									TIN No. <span className="text-destructive">*</span>
								</Label>
								<Input
									id="tin-no"
									type="text"
									inputMode="numeric"
									pattern="[0-9]*"
									value={formData.tin_no}
									onChange={handleChange("tin_no")}
									required
									disabled={isLoading}
								/>
							</div>

							<div className="flex flex-col gap-1.5">
								<Label htmlFor="contact-no">
									Contact No. <span className="text-destructive">*</span>
								</Label>
								<Input
									id="contact-no"
									placeholder="e.g. 09171234567, 09281234567"
									value={formData.contact_no}
									onChange={handleChange("contact_no")}
									required
									disabled={isLoading}
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 gap-1.5">
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="products-offered">
									Products Offered <span className="text-destructive">*</span>
								</Label>
								<Input
									id="products-offered"
									placeholder="e.g. Rice, Corn, Wheat"
									value={formData.products_offered}
									onChange={handleChange("products_offered")}
									required
									disabled={isLoading}
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-1.5">
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									value={formData.email}
									onChange={handleChange("email")}
									disabled={isLoading}
								/>
							</div>
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="remarks">
									Remarks <span className="text-destructive">*</span>
								</Label>
								<Input
									id="remarks"
									value={formData.remarks}
									onChange={handleChange("remarks")}
									required
									disabled={isLoading}
								/>
							</div>
						</div>
					</div>
					{/* end of business information group */}

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

export default AddSupplierDialog
