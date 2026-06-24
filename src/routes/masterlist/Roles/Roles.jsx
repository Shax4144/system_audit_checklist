import React from 'react'
import RolesTable from './RolesTable'
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
const Roles = () => {
  return (
		<div className="flex flex-col gap-6 p-6">
			<div className="flex flex-row justify-between items-center">
				<div className="">
					<h1 className="text-2xl font-semibold">Roles</h1>
					<p className="text-sm text-muted-foreground">
						Manage system user roles.
					</p>
				</div>
				<div>
					<Button className="w-32">
						<Plus />
						Create
					</Button>
				</div>
			</div>
			<div className="">
				<RolesTable />
			</div>
		</div>
	)
}

export default Roles