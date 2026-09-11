import { useState, useEffect} from "react"
import {
	Dialog,
	DialogContent,
	// DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover"
import { ChevronDown, X, Loader2} from "lucide-react"

import { useSelectedRow } from "../../../../context/EditContext"

import { appToast } from "../../../../components/Toast"

const permissionConstant = [
	{
		id: 1,
		name: "Masterlist",
	},
	{
		id: 2,
		name: "Checklist",
	},
	{
		id: 3,
		name: "Checklist-build",
	},
	{
		id: 4,
		name: "Report",
  },
  {
		id: 5,
		name: "Dashboard",
	},
]

const initialForm = {
	name: "",
	permissions: [],
}

const AddRoleDialog = ({ open, onClose, onConfirm, isLoading}) => {
	const [selectedPermissions, setSelectedPermissions] = useState([])
	const [popoverOpen, setPopoverOpen] = useState(false)
	const [formData, setFormData] = useState(initialForm)
	const { selectedRow } = useSelectedRow()
	const isEditMode = Boolean(selectedRow)

	useEffect(() => {
		if (open) {
			if (selectedRow) {
				setFormData({
					name: selectedRow.name,
				})
				setSelectedPermissions(selectedRow.permissions || [])
			} else {
				setFormData(initialForm)
				setSelectedPermissions([])
			}
		}
	}, [open, selectedRow])

	useEffect(() => {
		if (!open) {
			setSelectedPermissions([])
			setPopoverOpen(false)
		}
	}, [open])

	const togglePermission = (name) => {
		setSelectedPermissions((prev) =>
			prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name],
		)
	}

	const removePermission = (name) => {
		setSelectedPermissions((prev) => prev.filter((p) => p !== name))
  }
  
	const handleChange = (field) => (e) => {
		setFormData((prev) => ({
			...prev,
			[field]: e.target.value,
		}))
	}

	const handleSubmit = () => {
		if (!selectedPermissions.length) {
			appToast.warning(
				"No selected permission",
				"Please select at least one permission"
			)
			return
		}

		const payload = {
			name: formData.name,
			permissions: selectedPermissions,
		}
		onConfirm(payload)
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
			<DialogContent
				className="min-w-[35%]"
				onPointerDownOutside={(e) => {
					if (isLoading || popoverOpen) {
						e.preventDefault()
					}
				}}
				onInteractOutside={(e) => {
					if (isLoading || popoverOpen) {
						e.preventDefault()
					}
				}}
				onEscapeKeyDown={(e) => {
					if (isLoading) {
						e.preventDefault()
					}
				}}
			>
				<DialogHeader>
					<DialogTitle className="font-semibold text-xl">
						{isEditMode ? "Edit Form" : "Create Form"}
					</DialogTitle>
				</DialogHeader>
				<Separator />
				<form className="flex flex-col gap-4">
					<div className="flex flex-col gap-4">
						<p className="text-lg font-semibold uppercase tracking-wider text-muted-foreground">
							Role
						</p>

						<div className="grid grid-cols-1  gap-4">
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="role-name">
									Role Name <span className="text-destructive">*</span>
								</Label>
								<Input
									className="min-h-9.5"
									id="role-name"
									required
									value={formData.name}
									onChange={handleChange("name")}
									disabled={isLoading}
								/>
							</div>
						</div>
						<div className="">
							<div className="flex flex-col gap-1.5">
								{/* <Label htmlFor="permission">
									Permission
								</Label>*/}
								<p className="text-sm font-medium">
									Permission
								</p>

								{/* Multi-select via Popover + Checkboxes */}
								<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
									<PopoverTrigger className="rounded-[0.35rem]" asChild>
										<Button
											variant="outline"
											className="w-full justify-between items-center font-normal h-auto"
											disabled={isLoading}
										>
											<div className="flex flex-wrap gap-1 flex-1 text-left p-2">
												{selectedPermissions.length > 0 ? (
													selectedPermissions.map((p) => (
														<Badge
															key={p}
															variant="secondary"
															className="flex items-center gap-1"
															onClick={(e) => {
																e.stopPropagation()
																removePermission(p)
															}}
														>
															{p}
															<X className="h-3 w-3" />
														</Badge>
													))
												) : (
													<span className="text-muted-foreground">
														Select Permissions
													</span>
												)}
											</div>

											{/* Chevron stays pinned to the right */}
											<ChevronDown className="h-4 w-4 shrink-0 opacity-50 self-center ml-2" />
										</Button>
									</PopoverTrigger>

									<PopoverContent
										side="bottom" // Preferred side
										align="start" // start | center | end
										sideOffset={4} // Gap between trigger and content
										avoidCollisions // true by default
										collisionPadding={0}
										className="w-(--radix-popover-trigger-width) p-1"
									>
										{permissionConstant.map((permission) => (
											<div
												key={permission.id}
												className="group flex items-center gap-2 px-2 py-1.5 rounded-[0.35rem] hover:bg-muted cursor-pointer"
												onClick={() => togglePermission(permission.name)}
											>
												<Checkbox
													className="data-[state=unchecked]:bg-muted
  													data-[state=unchecked]:group-hover:bg-background"
													checked={selectedPermissions.includes(
														permission.name,
													)}
													onCheckedChange={() =>
														togglePermission(permission.name)
													}
													onClick={(e) => e.stopPropagation()}
												/>
												<span className="text-sm">{permission.name}</span>
											</div>
										))}
									</PopoverContent>
								</Popover>
							</div>
						</div>
					</div>

					<DialogFooter>
						<DialogClose asChild>
							<Button
								className="uppercase font-bold"
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
							type="button"
							onClick={handleSubmit}
							className="uppercase font-bold"
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

export default AddRoleDialog