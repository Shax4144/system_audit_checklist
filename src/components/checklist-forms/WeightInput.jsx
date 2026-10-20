import { Input } from "@/components/ui/input"
import { sanitizePercentage } from "../../features/checklist/formBuilder.helpers"

const WeightInput = ({ value, onChange }) => (
  <div className="relative w-24">
    <Input
      type="text"
      inputMode="decimal"
      value={value}
      onChange={(e) => onChange(sanitizePercentage(e.target.value))}
      className="h-8 pr-6 text-sm"
      placeholder="0"
    />
    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
      %
    </span>
  </div>
)

export default WeightInput