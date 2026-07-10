// components/CategoryDropdown.jsx
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { supplierTypes } from "../../constant/supplier-type"

const LocationDropdown = ({ value, onChange, open }) => {

  return (
		<Select value={value} onValueChange={onChange}>
			<SelectTrigger className="w-full h-24 shadow-sm text-sm">
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

export default LocationDropdown
