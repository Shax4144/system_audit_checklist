import { React, useState } from "react"
import UserAccountsTable from "./UserAccountsTable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import AddUserDialog from "../../../components/AddUserDialog"

const UserAccounts = () => {
	const [openAdd, setOpenAdd] = useState(false)

	const handleOpenAdd = () => {
		setOpenAdd(true)
	}

	return (
		<div className="flex flex-col gap-6 h-full xl:mr-50 xl:ml-50">
			<div className="flex flex-row justify-between items-center">
				<div className="">
					<h1 className="text-2xl font-semibold">User Accounts</h1>
					<p className="text-sm text-muted-foreground">
						Manage system users and their roles.
					</p>
				</div>
				<div>
					<Button className="w-32" onClick={handleOpenAdd}>
						<Plus />
						Create
					</Button>
				</div>
			</div>
			<div>
				<UserAccountsTable />
			</div>
			<AddUserDialog
				open={openAdd}
				onClose={() => {
					setOpenAdd(false)
				}}
				onConfirm={() => {
					setOpenAdd(false)
				}}
			/>
		</div>
	)
}

export default UserAccounts
