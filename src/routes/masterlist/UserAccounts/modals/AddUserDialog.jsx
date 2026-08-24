import { React, useState, useEffect } from "react"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog"
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLegend } from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Search, Loader2 } from "lucide-react"

import OneChargingDropdown from "../../../../components/dropdown/OneChargingDropdown"
import RolesDropdown from "../../../../components/dropdown/RolesDropdown"
import { useFetchRolesQuery } from "../../../../features/roles/roles.api"
import { useSelectedRow } from "../../../../context/EditContext"
import { appToast } from "../../../../components/Toast"

// const dummyRoleData = [
// 	{
// 		id: 1,
// 		name: "Admin",
// 		permissions: ["checklist", "checklist-build", "masterlist"],
// 		created_at: "2026-03-18T01:59:34.000000Z",
// 		updated_at: "2026-05-15T08:36:52.000000Z",
// 		deleted_at: null,
// 	},
// ]

const initialForm = {
	idPrefix: "RDFFLFI",
	idNumber: "",
	firstName: "",
	middleName: "",
	lastName: "",
	suffix: "",
	position: "",
	username: "",
}

const AddUserDialog = ({ open, onClose, onConfirm, isLoading }) => {
	const [selectedRole, setSelectedRole] = useState("")
	const [selectedCharging, setSelectedCharging] = useState("")
	const [formData, setFormData] = useState(initialForm)
	const { selectedRow } = useSelectedRow()
	const isEditMode = Boolean(selectedRow)

	const { data: rolesResponse, isFetching: isRolesFetching } =
		useFetchRolesQuery(
			{ pagination: "none", refetchOnMountOrArgChange: true },
			{ skip: !open },
		)

	const rolesData = rolesResponse?.data ?? []
	
	useEffect(() => {
		if (open) {
			if (selectedRow) {
				// editing — pre-fill
				setFormData({
					idPrefix: selectedRow.employee_id?.split(" - ")[0] ?? "RDFFLFI",
					idNumber: selectedRow.employee_id?.split(" - ")[1] ?? "",
					firstName: selectedRow.first_name ?? "",
					middleName: selectedRow.middle_name ?? "",
					lastName: selectedRow.last_name ?? "",
					suffix: selectedRow.suffix ?? "",
					position: selectedRow.position ?? "",
					username: selectedRow.username ?? "",
				})
				setSelectedRole(selectedRow.role ?? "")
				setSelectedCharging({
					code: selectedRow.charging_code,
					name: selectedRow.charging_name,
					company_code: selectedRow.company_code,
					company_name: selectedRow.company_name,
					business_unit_code: selectedRow.business_unit_code,
					business_unit_name: selectedRow.business_unit_name,
					department_code: selectedRow.department_code,
					department_name: selectedRow.department_name,
					unit_code: selectedRow.unit_code,
					unit_name: selectedRow.unit_name,
					sub_unit_code: selectedRow.sub_unit_code,
					sub_unit_name: selectedRow.sub_unit_name,
					location_code: selectedRow.location_code,
					location_name: selectedRow.location_name,
				})
			} else {
				// creating — reset
				setFormData(initialForm)
				setSelectedRole("")
				setSelectedCharging("")
			}
		}
	}, [open, selectedRow])

	useEffect(() => {
		if (formData.firstName && formData.lastName) {
			const initials = formData.firstName
				.trim()
				.split(/\s+/)
				.map((name) => name[0])
				.join("")

			const generated = (initials + formData.lastName)
				.toLowerCase()
				.replace(/\s+/g, "")

			setFormData((prev) => ({
				...prev,
				username: generated,
			}))
		}
	}, [formData.firstName, formData.lastName])

	const handleSearch = () => {
		return
	}

	const handleChange = (field) => (e) => {
		setFormData((prev) => ({ ...prev, [field]: e.target.value }))
	}

	const handleSubmit = () => {
		// console.log("selected role on submit: ", selectedRole)
		if (!selectedRole) {
			appToast.warning(
				"No role Selected",
				"Please select a Role"
			)
			return
		} else if (!selectedCharging) {
			appToast.warning(
				"No one charging selected",
				"Please select a one charging"
			)
			return
		}

		const matchedRole = rolesData.find((r) => r.name === selectedRole)

		const payload = {
			employee_id: `${formData.idPrefix} - ${formData.idNumber}`,
			first_name: formData.firstName,
			last_name: formData.lastName,
			middle_name: formData.middleName,
			suffix: formData.suffix,
			position: formData.position,

			charging_code: selectedCharging.code,
			charging_name: selectedCharging.name,
			company_code: selectedCharging.company_code,
			company_name: selectedCharging.company_name,
			business_unit_code: selectedCharging.business_unit_code,
			business_unit_name: selectedCharging.business_unit_name,
			department_code: selectedCharging.department_code,
			department_name: selectedCharging.department_name,
			unit_code: selectedCharging.unit_code,
			unit_name: selectedCharging.unit_name,
			sub_unit_code: selectedCharging.sub_unit_code,
			sub_unit_name: selectedCharging.sub_unit_name,
			location_code: selectedCharging.location_code,
			location_name: selectedCharging.location_name,

			username: formData.username,
			role_id: matchedRole?.id,
		}

		onConfirm(payload);
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				if (isLoading) return

				if (!isOpen) {
					onClose()
				}
			}}
		>
			<DialogContent className="min-w-[35%]">
				<DialogHeader>
					<DialogTitle className="font-semibold text-xl">
						{isEditMode ? "Edit Form" : "Create Form"}
					</DialogTitle>
				</DialogHeader>
				<Separator />
				<form className="flex flex-col gap-4">
					{/* identity group */}
					<div className="flex flex-col gap-3">
						<p className="text-lg font-semibold uppercase tracking-wider text-muted-foreground">
							Information
						</p>

						<div className="grid grid-cols-12 gap-4 items-end">
							{/* ID Prefix */}
							<div className="col-span-6 flex flex-col gap-1.5">
								<Label htmlFor="id-prefix">
									ID Prefix <span className="text-destructive">*</span>
								</Label>
								<Input
									id="id-prefix"
									value={formData.idPrefix}
									onChange={handleChange("idPrefix")}
									required
									disabled={isLoading}
								/>
							</div>

							{/* ID Number */}
							<div className="col-span-6 flex flex-col gap-1.5">
								<Label htmlFor="id-number">
									ID Number <span className="text-destructive">*</span>
								</Label>
								<Input
									id="id-number"
									value={formData.idNumber}
									onChange={handleChange("idNumber")}
									required
									disabled={isLoading}
								/>
							</div>

							{/* Button (auto width ONLY) */}
							{/* <div className="col-span-2 flex items-end justify-start">
								<Button
									onClick={handleSearch}
									size="icon"
									className="h-9 w-9 shrink-0"
								>
									<Search className="h-4 w-4" />
								</Button>
							</div> */}
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-1.5">
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="firstName">
									First Name <span className="text-destructive">*</span>
								</Label>
								<Input
									id="firstName"
									value={formData.firstName}
									onChange={handleChange("firstName")}
									required
									disabled={isLoading}
								/>
							</div>

							<div className="flex flex-col gap-1.5">
								<Label htmlFor="middleName">Middle Name</Label>
								<Input
									id="middleName"
									value={formData.middleName}
									onChange={handleChange("middleName")}
									disabled={isLoading}
								/>
							</div>

							<div className="flex flex-col gap-1.5">
								<Label htmlFor="lastName">
									Last Name <span className="text-destructive">*</span>
								</Label>
								<Input
									id="lastName"
									value={formData.lastName}
									onChange={handleChange("lastName")}
									required
									disabled={isLoading}
								/>
							</div>

							<div className="flex flex-col gap-1.5">
								<Label htmlFor="suffix">Suffix</Label>
								<Input
									id="suffix"
									value={formData.suffix}
									onChange={handleChange("suffix")}
									disabled={isLoading}
								/>
							</div>
						</div>
						<div className="grid grid-cols-1 gap-1.5">
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="position">
									Position <span className="text-destructive">*</span>
								</Label>
								<Input
									id="position"
									value={formData.position}
									onChange={handleChange("position")}
									required
									disabled={isLoading}
								/>
							</div>
						</div>
					</div>
					{/* end of identity group */}

					{/*  */}
					{/* <div className="flex flex-col gap-3">
						<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							Contact
						</p>
						<div className="grid grid-cols-2 gap-2">
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="contactNumber">
									Contact Number
									<span className="text-destructive">*</span>
								</Label>
								<Input id="contactNumber" />
							</div>

							<div className="flex flex-col gap-1.5">
								<Label htmlFor="email">
									Email
									<span className="text-destructive">*</span>
								</Label>
								<Input id="email" required />
							</div>
						</div>
					</div> */}
					{/*  end of */}

					{/* account group */}
					<div className="flex flex-col gap-3">
						<p className="text-lg font-semibold uppercase tracking-wider text-muted-foreground">
							ACCOUNT
						</p>

						<div className="grid grid-cols-2 gap-2">
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="username">Username</Label>
								<Input
									id="username"
									readOnly
									value={formData.username}
									disabled={isLoading}
								/>
							</div>

							<div className="flex flex-col gap-1.5">
								<Label htmlFor="role">Role</Label>
								{/* <Select
									value={selectedRole}
									onValueChange={setSelectedRole}
									defaultValue="Select Role"
									disabled={isLoading}
								>
									<SelectTrigger className="w-auto" id="role">
										<SelectValue />
									</SelectTrigger>
									<SelectContent position="popper">
										{dummyRoleData.map((role) => (
											<SelectItem key={role.id} value={String(role.id)}>
												{role.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select> */}
								<RolesDropdown
									rolesData={rolesData}
									value={selectedRole}
									onChange={setSelectedRole}
									open={open}
									isLoading={isLoading || isRolesFetching}
								/>	
							</div>
						</div>

						<div className="grid grid-cols-1 gap-4">
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="one-charging">
									One Charging <span className="text-destructive">*</span>
								</Label>
								<OneChargingDropdown
									value={
										selectedCharging?.code ?? ""
									}
									onChange={setSelectedCharging}
									open={open}
									isLoading={isLoading}
								/>
							</div>
						</div>
					</div>
					{/* end of account group */}

					<DialogFooter className="pt-4">
						<DialogClose asChild>
							<Button
								className="uppercase font-semibold"
								type="button"
								variant="outline"
								onClick={onClose}
								size="lg"
								disabled={isLoading}
							>
								cancel
							</Button>
						</DialogClose>
						<Button
							className="uppercase font-semibold"
							type="button"
							onClick={handleSubmit}
							size="lg"
							disabled={isLoading}
						>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							{isLoading
								? isEditMode
									? "Updating..."
									: "Creating..."
								: isEditMode
									? "Update"
									: "Create"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}

export default AddUserDialog
