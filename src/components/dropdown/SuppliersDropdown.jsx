// components/CategoryDropdown.jsx
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

const SuppliersDropdown = ({ data, value, onChange, open, isLoading, triggerClassName }) => {

  const handleChange = (name) => {
		const selected = data.find((s) => s.name === name)
		onChange(name, selected)
  }
  
  return (
		<Select value={value} onValueChange={handleChange} disabled={isLoading}>
			<SelectTrigger className={triggerClassName}>
				<SelectValue
					placeholder={isLoading ? "Loading..." : "Select a supplier"}
				/>
			</SelectTrigger>
			<SelectContent position="popper" className="max-h-[30vh] overflow-y-auto">
				{data.map((supplier) => (
					<SelectItem key={supplier.id} value={String(supplier.name)}>
						{supplier.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}

export default SuppliersDropdown
