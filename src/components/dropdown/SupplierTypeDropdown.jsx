// components/CategoryDropdown.jsx
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { supplierTypes } from "../../constant/supplier-type"

const SupplierDropdown = ({ value, onChange, open, triggerClassName, disabled }) => {

  return (
		<Select value={value} onValueChange={onChange} disabled={disabled}>
			<SelectTrigger className={triggerClassName}>
				<SelectValue placeholder={"Select Type"} />
			</SelectTrigger>
			<SelectContent
				position="popper"
				className="w-(--radix-select-trigger-width)"
			>
				{supplierTypes.map((supplier) => (
					<SelectItem key={supplier.key} value={supplier.value}>
						{supplier.key}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}

export default SupplierDropdown
