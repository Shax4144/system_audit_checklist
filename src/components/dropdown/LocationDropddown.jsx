// components/CategoryDropdown.jsx
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { locationTypes } from "../../constant/location-type"

const LocationDropdown = ({ value, onChange, triggerClassName }) => {

  return (
		<Select value={value} onValueChange={onChange}>
      <SelectTrigger className={triggerClassName}>
				<SelectValue placeholder={"Select Location"} />
			</SelectTrigger>
			<SelectContent position="popper" className="w-(--radix-select-trigger-width)">
				{locationTypes.map((location) => (
					<SelectItem key={location.key} value={location.value}>
						{location.key}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}

export default LocationDropdown
