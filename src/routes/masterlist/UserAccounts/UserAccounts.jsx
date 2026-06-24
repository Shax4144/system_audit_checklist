import UserAccountsTable from "./UserAccountsTable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const UserAccounts = () => {
	return (
		<div className="flex flex-col gap-6 p-6">
			<div className="flex flex-row justify-between items-center">
				<div className="">
					<h1 className="text-2xl font-semibold">User Accounts</h1>
					<p className="text-sm text-muted-foreground">
						Manage system users and their roles.
					</p>
        </div>
        <div>
          <Button className="w-32">
            <Plus />
            Create
          </Button>
        </div>
			</div>
			<div>
				<UserAccountsTable />
			</div>
		</div>
	)
}

export default UserAccounts
