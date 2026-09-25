// components/CategoryDropdown.jsx
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { locationTypes } from "../../constant/location-type";

const LocationDropdown = ({ value, onChange, triggerClassName, disabled }) => {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        className={`
        ${triggerClassName ?? ""}
        [&>svg]:transition-transform
        [&>svg]:duration-200
        data-[state=open]:[&>svg]:rotate-180
      `}
      >
        <SelectValue placeholder={"Select location"} />
      </SelectTrigger>
      <SelectContent
        position="popper"
        className="w-(--radix-select-trigger-width)"
      >
        {locationTypes.map((location) => (
          <SelectItem key={location.key} value={location.value}>
            {location.key}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LocationDropdown;
