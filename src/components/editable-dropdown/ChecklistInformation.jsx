// components/checklist-assignment/AuditInformation.jsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import DatePicker from "../DatePicker"
import LocationDropdown from "../dropdown/LocationDropdown"
import EditableDropdownField from "./EditableDropdownField"
import MultipleEditableDropdownField from "./MultipleEditableDropdownField"
import SuppliersDropdown from "../dropdown/SuppliersDropdown"

// Replace these with your actual masterlist hooks
import {
	auditCriteria,
	auditLanguage,
	auditObjectives,
	auditScope,
} from "../../constant/auditInformation-dropdown"
import { useFetchSuppliersQuery } from "../../features/supplier/supplier.api"


const initialChecklistInfo = {
	supplier: "",
	address: "",
	tin_no: "",
	auditDate: new Date(),
	contactPerson: "",
	contactNumber: "",
	email: "",
	products: [],
	location: "",
	remarks:"",
	auditScope: "",
	auditObjectives: "",
	auditCriteria: [],
	auditLanguage: "English and Filipino",
}

const ChecklistInformation = ({ value, onChange }) => {
	const info = value ?? initialChecklistInfo

	const { data: suppliersRes, isFetching: loadingSuppliers } =
		useFetchSuppliersQuery({ pagination: "none" })

	const suppliersData = suppliersRes?.data ?? []
	
  const formatOptions = (items) => 
    items.map((item) => ({
      id: item.key,
      label: item.value,
    }))
  
  const scopeOptions = formatOptions(auditScope)
  const objectiveOptions = formatOptions(auditObjectives)
  const criteriaOptions = formatOptions(auditCriteria)
  const languageOptions = formatOptions(auditLanguage)

	const updateField = (field, val) => {
		onChange({ ...info, [field]: val })
	}

	return (
		<div className="rounded-xl border bg-card p-5 flex flex-col gap-10">
			<div className="flex flex-col gap-10">
				<div className="grid grid-cols-2 gap-4">
					<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
						Supplier Information
					</p>
					<div className="flex flex-col col-span-2 gap-1.5">
						{/* <EditableDropdownField
							label="Name of Establishment/Supplier"
							required
							value={info.supplier}
							onChange={(val) => updateField("supplier", val)}
							options={suppliers}
							isLoading={loadingSuppliers}
							placeholder="Select or type supplier"
							onSelectOption={(opt) => {
								onChange({
									...info,
									supplier: opt.label,
									address: opt.address ?? info.address,
									contactPerson: opt.contactPerson ?? info.contactPerson,
									contactNumber: opt.contactNumber ?? info.contactNumber,
									products: opt.products ?? info.products,
								})
							}}
						/> */}
						<Label>Name of Supplier/Establishment</Label>
						<SuppliersDropdown
							data={suppliersData}
							value={info.supplier}
							onChange={(name, selectedSupplier) => {
								onChange({
									...info,
									supplier: name,
									address: selectedSupplier?.address ?? info.address,
									tin_no: selectedSupplier?.tin_no ?? "",
									contactPerson:
										selectedSupplier?.contact_person ?? info.contactPerson,
									contactNumber:
										selectedSupplier?.contact_no ?? info.contactNumber,
									email: selectedSupplier?.email ?? "",
									location: selectedSupplier?.location ?? info.location,
									products: selectedSupplier?.products_offered ?? info.products,
									remarks: selectedSupplier?.remarks ?? "",
								})
							}}
							isLoading={loadingSuppliers}
							triggerClassName="w-full h-8"
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label>Address</Label>
						<Input
							value={info.address}
							onChange={(e) => updateField("address", e.target.value)}
							placeholder="Auto-filled from supplier"
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label>
							Date of Audit <span className="text-destructive">*</span>
						</Label>
						<DatePicker
							value={info.auditDate}
							onChange={(date) => updateField("auditDate", date)}
							placeholder="Pick a Date"
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label>Contact Person / Authorized Representative</Label>
						<Input
							value={info.contactPerson}
							onChange={(e) => updateField("contactPerson", e.target.value)}
							placeholder="Auto-filled from chosen supplier"
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label>Contact Number</Label>
						<Input
							value={info.contactNumber}
							onChange={(e) => updateField("contactNumber", e.target.value)}
							placeholder="Auto-filled from  chosen supplier"
						/>
					</div>

					<div className="flex flex-col gap-1.5 col-span-2">
						<Label>Products / Supplied Items</Label>
						<Input
							value={info.products}
							onChange={(e) => updateField("products", e.target.value)}
							placeholder="Auto-filled from  chosen supplier"
						/>
					</div>

					<div className="flex flex-col gap-1.5 col-span-2">
						<Label>Location</Label>
						{/* <LocationDropdown
							value={info.location}
							onChange={(val) => updateField("location", val)}
							triggerClassName="shadow-none w-full h-8"
						/> */}
						<Input
							value={info.location}
							onChange={(e) => updateField("location", e.target.value)}
							placeholder="Auto-filled from  chosen supplier"
						/>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
						Audit Information
					</p>
					<div className="col-span-2">
						<EditableDropdownField
							label="Audit Scope"
							value={info.auditScope}
							onChange={(val) => updateField("auditScope", val)}
							options={scopeOptions}
							isLoading={false}
							placeholder="Select or type audit scope"
						/>
					</div>

					<div className="col-span-2">
						<EditableDropdownField
							label="Audit Objectives"
							value={info.auditObjectives}
							onChange={(val) => updateField("auditObjectives", val)}
							options={objectiveOptions}
							isLoading={false}
							placeholder="Select or type audit objectives"
						/>
					</div>

					<div className="col-span-2">
						<MultipleEditableDropdownField
							label="Audit Criteria"
							values={info.auditCriteria ?? []}
							onChange={(val) => updateField("auditCriteria", val)}
							options={criteriaOptions}
							isLoading={false}
							placeholder="Select or type audit criteria"
						/>
					</div>
					<div className="col-span-2">
						<EditableDropdownField
							label="Audit Language"
							value={info.auditLanguage}
							onChange={(val) => updateField("auditLanguage", val)}
							options={languageOptions}
							isLoading={false}
							placeholder="Select or type language"
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ChecklistInformation
