import { React, useState } from 'react'
import RolesTable from './RolesTable'
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import AddRoleDialog from '../../../components/AddRoleDialog'
const Roles = () => {
	const [openAddRoleDialog, setOpenAddRoleDialog] = useState(false)

	const handleOpenRoleDialog = () => {
		setOpenAddRoleDialog(true)
	}
  return (
		<div className="flex flex-col gap-6 h-full xl:mr-50 xl:ml-50">
			<div className="flex flex-row justify-between items-center">
				<div className="">
					<h1 className="text-2xl font-semibold">Roles</h1>
					<p className="text-sm text-muted-foreground">
						Manage system user roles.
					</p>
				</div>
				<div>
					<Button className="w-32" onClick={handleOpenRoleDialog}>
						<Plus />
						Create
					</Button>
				</div>
			</div>
			<div className="">
				<RolesTable />
			</div>
			<AddRoleDialog
				open={openAddRoleDialog}
				onClose={() => {
					setOpenAddRoleDialog(false)
				}}
				onConfirm={() => {
					setOpenAddRoleDialog(false)
				}}
			/>
		</div>
	)
}

export default Roles