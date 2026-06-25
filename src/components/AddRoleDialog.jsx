import { useState, useEffect} from "react"
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
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover"
import { ChevronDown, X } from "lucide-react"

const dummyPermissionData = [
	{
		id: 1,
		name: "masterlist",
		created_at: "2026-03-18T01:59:34.000000Z",
		updated_at: "2026-05-15T08:36:52.000000Z",
		deleted_at: null,
	},
	{
		id: 2,
		name: "checklist",
		permissions: ["checklist", "checklist-build"],
		created_at: "2026-04-13T04:00:17.000000Z",
		updated_at: "2026-04-21T02:25:38.000000Z",
		deleted_at: null,
	},
	{
		id: 3,
		name: "checklist-build",
		created_at: "2026-04-13T04:00:23.000000Z",
		updated_at: "2026-04-21T02:25:31.000000Z",
		deleted_at: null,
	},
]

const AddRoleDialog = ({ open, onClose, onConfirm }) => {
	const [selectedPermissions, setSelectedPermissions] = useState([])
	const [popoverOpen, setPopoverOpen] = useState(false)

	const togglePermission = (name) => {
		setSelectedPermissions((prev) =>
			prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name],
		)
	}

	const removePermission = (name) => {
		setSelectedPermissions((prev) => prev.filter((p) => p !== name))
  }
  
  useEffect(() => {
		if (!open) {
			setSelectedPermissions([])
			setPopoverOpen(false)
		}
	}, [open])

	const handleClose = () => {
		setSelectedPermissions([])
		setPopoverOpen(false)
		onClose()
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) handleClose()
			}}
		>
			<DialogContent
				className="min-w-[35%]"
				onPointerDownOutside={(e) => {
					if (popoverOpen) e.preventDefault()
				}}
				onInteractOutside={(e) => {
					if (popoverOpen) e.preventDefault()
				}}
			>
				<DialogHeader>
					<DialogTitle className="font-semibold text-xl">
						Create Form
					</DialogTitle>
				</DialogHeader>
				<Separator />
				<form className="flex flex-col gap-4">
					<div className="flex flex-col gap-4">
						<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							Role
						</p>

						<div className="grid grid-cols-1  gap-4">
							<div className="flex flex-col gap-1.5">
								<Label className="font-semibold" htmlFor="role-name">
									Role Name <span className="text-destructive">*</span>
								</Label>
								<Input className="min-h-9.5" id="role-name" required />
							</div>
						</div>
						<div className="">
							<div className="flex flex-col gap-1.5">
								<Label className="font-semibold" htmlFor="permission">
									Permission
								</Label>

								{/* Multi-select via Popover + Checkboxes */}
								<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
									<PopoverTrigger className="rounded-[0.35rem]" asChild>
										<Button
											variant="outline"
											className="w-full justify-between items-center font-normal h-auto"
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

									<PopoverContent className="w-full p-2" align="start">
										{dummyPermissionData.map((permission) => (
											<div
												key={permission.id}
												className="flex items-center gap-2 px-2 py-1.5 rounded-[0.35rem] hover:bg-muted cursor-pointer"
												onClick={() => togglePermission(permission.name)}
											>
												<Checkbox
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
								onClick={handleClose}
							>
								cancel
							</Button>
						</DialogClose>
						<Button
							type="button"
							onClick={() => onConfirm(selectedPermissions)}
							className="uppercase font-bold"
						>
							create
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}

export default AddRoleDialog