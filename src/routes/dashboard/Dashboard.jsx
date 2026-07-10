import React, { useState } from 'react'
import { Separator } from "../../components/ui/separator"
import { useSelector} from 'react-redux'
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "../../components/ui/card"
import DashboardTable from './DashboardTable'
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select"
import CategoryDropdown from "../../components/dropdown/CategoryDropdown"
import LocationDropdown from '../../components/dropdown/LocationDropddown'

const Dashboard = () => {
	const [activeTab, setActiveTab] = useState("pending")
	const user = useSelector((state) => state.user)
  return (
		<div>
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div className="">
					<h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
						Welcome back, {user.last_name}
					</h3>
					<p className="text-sm text-muted-foreground">
						Here's what waiting for you.
					</p>
					<h1 className="text-4xl">Select your supplier.</h1>
				</div>
			</div>

			<div className="grid grid-cols-4 gap-5 py-8">
				<Card className="flex flex-col gap-6 rounded-xl bg-card py-6 text-card-foreground shadow-lg shrink-0 overflow-hidden">
					<CardContent>
						<div className="flex flex-col justify-center gap-2">
							<h4 className="text-muted-foreground font-semibold text-xs">
								ENROLLED SUPPLIERS
							</h4>
							<p className="font-bold text-4xl">100</p>
						</div>
					</CardContent>
				</Card>

				<Card className="flex flex-col gap-6 rounded-xl bg-card py-6 text-card-foreground shadow-lg shrink-0 overflow-hidden">
					<CardContent>
						<div className="flex flex-col justify-center gap-2">
							<h4 className="text-muted-foreground font-semibold text-xs">
								PENDING
							</h4>
							<p className="font-bold text-4xl">99</p>
						</div>
					</CardContent>
				</Card>

				<Card className="flex flex-col gap-6 rounded-xl bg-card py-6 text-card-foreground shadow-lg shrink-0 overflow-hidden">
					<CardContent>
						<div className="flex flex-col justify-center gap-2">
							<h4 className="text-muted-foreground font-semibold text-xs">
								COMPLETED
							</h4>
							<p className="font-bold text-4xl">1</p>
						</div>
					</CardContent>
				</Card>

				<Card className="flex flex-col gap-6 rounded-xl bg-card py-6 text-card-foreground shadow-lg shrink-0 overflow-hidden">
					<CardContent>
						<div className="flex flex-col justify-center gap-2">
							<h4 className="text-muted-foreground font-semibold text-xs">
								AVG. GRADE
							</h4>
							<p className="font-bold text-4xl">3</p>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid grid-cols-12 gap-5 items-center">
				<div className="col-span-8 shadow-lg rounded-xl">
					<div className="relative ml-auto">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search supplier's name or business address etc.,"
							// value={table.getColumn(searchKey)?.getFilterValue() ?? ""}
							// onChange={(e) =>
							// 	table.getColumn(searchKey)?.setFilterValue(e.target.value)
							// }
							className="pl-9 shadow-sm py-6 rounded-xl"
						/>
					</div>
				</div>

				<div className="col-span-2">
					<LocationDropdown
						triggerClassName="w-full h-12 rounded-xl shadow-lg"
					/>
				</div>

				<div className="col-span-2">
					<CategoryDropdown
						triggerClassName="w-full h-12 rounded-xl shadow-lg"
						open={true}
					/>
				</div>
			</div>

			<div className="py-4">
				<DashboardTable
					activeTab={activeTab}
					onTabChange={setActiveTab}
				/>
			</div>
		</div>
	)
}

export default Dashboard