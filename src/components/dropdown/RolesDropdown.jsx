import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select"

const RolesDropdown = ({ rolesData, value, onChange, open, isLoading }) => {

	return (
		<Select
			value={value}
			onValueChange={(val) => {
				// console.log("Role Selected: ", val)
				onChange(val)
			}}
			disabled={isLoading}
		>
			<SelectTrigger className="h-8 w-auto">
				<SelectValue placeholder={isLoading ? "Loading..." : "Select Role"} />
			</SelectTrigger>
			<SelectContent position="popper">
				{rolesData.map((role) => (
					<SelectItem key={role.id} value={String(role.name)}>
						{role.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}

export default RolesDropdown
