import { React, useState } from "react"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLegend } from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

const dummyUserData = [
	{
    id: 5,
    employee_id: "O+FO-3309",
    name: "JANINE MAMANGUN ZABLAN",
    position: "TEAM LEADER",
    roles: [
        {
            id: 2,
            name: "Requestor"
        }
    ],
    charge: {
        id: 398,
        code: "0398",
        name: "FOX173 - MAGLIMAN",
        company_code: "01",
        business_unit_code: "31",
        business_unit_name: "Fresh Options",
        department_code: "3100",
        department_name: "Sales and Marketing",
        unit_code: "3120",
        unit_name: "Region B",
        sub_unit_code: "0326",
        sub_unit_name: "Area 6",
        location_code: "2173",
        location_name: "FOX173 - Magliman"
    },
    first_name: "JANINE",
    middle_name: "MAMANGUN",
    last_name: "ZABLAN",
    suffix: null,
    username: "jzablan",
    role_id: 2,
    charge_id: 398,
    charge_name: "FOX173 - MAGLIMAN",
    transaction_type: [
        "arcana"
    ],
    category: [],
    created_at: "2026-05-21T03:29:41.000000Z",
    updated_at: "2026-05-25T05:02:37.000000Z",
    deleted_at: null
  },
]

const dummyRoleData = [
	{
		id: 1,
		name: "admin-mis",
		permissions: ["checklist", "checklist-build", "masterlist"],
		created_at: "2026-03-18T01:59:34.000000Z",
		updated_at: "2026-05-15T08:36:52.000000Z",
		deleted_at: null,
	},
	{
		id: 3,
		name: "admin-audit",
		permissions: ["checklist", "checklist-build"],
		created_at: "2026-04-13T04:00:17.000000Z",
		updated_at: "2026-04-21T02:25:38.000000Z",
		deleted_at: null,
	},
	{
		id: 4,
		name: "audit",
		permissions: ["checklist-build"],
		created_at: "2026-04-13T04:00:23.000000Z",
		updated_at: "2026-04-21T02:25:31.000000Z",
		deleted_at: null,
	},
]

const AddUserDialog = ({ open, onClose, onConfirm }) => {
	const [selectedRole, setSelectedRole] = useState("")

	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) {
					onClose()
				}
			}}
		>
			<DialogContent className="min-w-[35%]">
				<DialogHeader>
					<DialogTitle className="font-semibold text-xl">
						Create Form
					</DialogTitle>
				</DialogHeader>
				<Separator />
				<form className="flex flex-col gap-4">
					{/* identity group */}
					<div className="flex flex-col gap-4">
						<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							Information
						</p>

						<div className="grid grid-cols-2 gap-4">
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="id-prefix">
									ID Prefix <span className="text-destructive">*</span>
								</Label>
								<Input id="id-prefix" defaultValue="RDFFLFI" required />
							</div>

							<div className="flex flex-col gap-1.5">
								<Label htmlFor="id-number">
									ID Number <span className="text-destructive">*</span>
								</Label>
								<Input id="id-number" required />
							</div>
						</div>

						<div className="grid grid-cols-4 gap-1.5">
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="firstName">
									First Name <span className="text-destructive">*</span>
								</Label>
								<Input id="firstName" required />
							</div>

							<div className="flex flex-col gap-1.5">
								<Label htmlFor="middleName">Middle Name</Label>
								<Input id="middleName" />
							</div>

							<div className="flex flex-col gap-1.5">
								<Label htmlFor="lastName">
									Last Name <span className="text-destructive">*</span>
								</Label>
								<Input id="lastName" required />
							</div>

							<div className="flex flex-col gap-1.5">
								<Label htmlFor="suffix">Suffix</Label>
								<Input id="suffix" />
							</div>
						</div>
					</div>
					{/* end of identity group */}

					{/*  */}
					{/* <div className="flex flex-col gap-4">
						<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							asdasd
						</p>
					</div> */}
					{/*  end of */}

					{/* account group */}
					<div className="flex flex-col gap-4">
						<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							ACCOUNT
						</p>

						<div className="grid grid-cols-2 gap-4">
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="username">Username</Label>
								<Input id="username" defaultValue="" />
							</div>

							<div className="flex flex-col gap-1.5">
								<Label htmlFor="role">Role</Label>
								<Select
									value={selectedRole}
									onValueChange={setSelectedRole}
									defaultValue="Select Role"
								>
									<SelectTrigger className="w-auto" id="role">
										<SelectValue />
									</SelectTrigger>
									<SelectContent position="popper">
										{dummyRoleData.map((role) => (
											<SelectItem key={role.id} value={String(role.name)}>
												{role.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="grid grid-cols-1 gap-4">
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="one-charging">
									One Charging <span className="text-destructive">*</span>
								</Label>
								<Input id="one-charging" defaultValue="" required />
							</div>
						</div>
					</div>
					{/* end of account group */}

					<DialogFooter>
						<DialogClose asChild>
							<Button
								className="uppercase font-semibold"
								type="button"
								variant="outline"
								onClick={onClose}
								size="lg"
							>
								cancel
							</Button>
						</DialogClose>
						<Button
							className="uppercase font-semibold"
							type="button"
							onClick={onConfirm}
							size="lg"
						>
							create
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}

export default AddUserDialog
