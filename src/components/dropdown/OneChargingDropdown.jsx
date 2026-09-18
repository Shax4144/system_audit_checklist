import { useState } from "react"
import { Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { useFetchOneChargingQuery } from "../../features/dropdown/one-charging-option"

const OneChargingDropdown = ({ value, onChange, open, isLoading }) => {
	const [comboOpen, setComboOpen] = useState(false)

	const { data: chargingData, isFetching } = useFetchOneChargingQuery(
		{ pagination: "none" },
		{ skip: !open },
	)

	const selectedCharge = chargingData?.find((c) => String(c.code) === value)

	return (
		<Popover modal={false} open={comboOpen} onOpenChange={setComboOpen}>
			<PopoverAnchor asChild>
				<Input
					readOnly
					autoComplete="off"
					placeholder={isFetching ? "Loading..." : "Select Charging"}
					value={selectedCharge?.name ?? ""}
					onClick={() => setComboOpen(true)}
					disabled={isLoading}
				/>
			</PopoverAnchor>

			<PopoverContent
				className="w-(--radix-popover-trigger-width) p-0"
				sideOffset={4}
				align="start"
				avoidCollisions={true}
				collisionPadding={10}
			>
				<Command shouldFilter>
					<CommandInput placeholder="Search charging..." />

					<CommandList className="custom-scrollbar max-h-70 overflow-y-auto">
						<CommandEmpty>No charging found.</CommandEmpty>

						<CommandGroup>
							{chargingData?.map((charge) => (
								<CommandItem
									key={charge.id}
									value={[
										charge.code,
										charge.name,
									].join(" ")}
									onSelect={() => {
										onChange(charge)
										setComboOpen(false)
									}}
								>
									<Check
										className={cn(
											"mr-2 h-4 w-4 shrink-0",
											value === String(charge.code) ? "opacity-100" : "opacity-0",
										)}
									/>

									<div className="flex flex-col">
										<span className="font-medium">{charge.name}</span>

										<span className="text-xs text-muted-foreground">
											{charge.code} • {charge.company_name} •{" "}
											{charge.department_name}
										</span>

										<span className="text-xs text-muted-foreground">
											{charge.location_name}
										</span>
									</div>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}

export default OneChargingDropdown
