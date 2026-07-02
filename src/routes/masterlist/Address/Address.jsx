import React from "react"
import AddressTable from "./AddressTable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const Address = () => {
	return (
		<div className="flex flex-col gap-6 h-full xl:mr-50 xl:ml-50">
			<div className="flex flex-row justify-between items-center">
				<div className="">
					<h1 className="text-2xl font-semibold">Address</h1>
					<p className="text-sm text-muted-foreground">
						Manage supplier addresses.
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
				<AddressTable />
			</div>
		</div>
	)
}

export default Address
