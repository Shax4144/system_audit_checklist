
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"



const DatePicker = ({ value, onChange, placeholder, disabled, minDate, maxDate }) => {

  const disabledDates = [
    ...(minDate ? [{ before: minDate }] : []),
    ...(maxDate ? [{ after: maxDate }] : [])
  ];
  
  return (
		<Field className="mx-auto">
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						id="date-picker-simple"
            className="justify-start font-normal rounded-[0.35rem] overflow-hidden"
            disabled={disabled}
					>
						{value ? format(value, "PPP") : <span className='text-muted-foreground'>{placeholder}</span>}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="middle">
					<Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            defaultMonth={value}
            disabled={disabledDates}
            startMonth={minDate}
            endMonth={maxDate}
					/>
				</PopoverContent>
			</Popover>
		</Field>
	)
}

export default DatePicker