import React from 'react'
import { Separator } from "../components/ui/separator"
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "../components/ui/card"

const Dashboard = () => {
	const user = JSON.parse(window.localStorage.getItem("user") || {})
  return (
		<div className="">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div className="">
					<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
						Welcome back, {user.name}
					</h3>
					<p className="text-sm text-muted-foreground">
						Here's what waiting for you.
					</p>
				</div>

				<Card className="min-w-3xl flex flex-col gap-6 rounded-xl bg-card py-6 text-card-foreground shadow-sm shrink-0 overflow-hidden">
					<CardContent className="grid grid-cols-3 divide-x p-0">
						<div className="flex flex-col justify-center pl-8 pr-8">
							<h4 className="text-muted-foreground font-semibold">
								AVAILABLE
							</h4>
							<p className='font-bold'>Sample Number</p>
						</div>
						<div className="flex flex-col justify-center pl-8 pr-8">
							<h4 className="text-muted-foreground font-semibold">
								COMPLETED
							</h4>
							<p className='font-bold'>Sample Number</p>
						</div>
						<div className="flex flex-col justify-center pl-8 pr-8">
							<h4 className="text-muted-foreground font-semibold">
								DEPARTMENT
							</h4>
							<p className="font-bold">Sample Department</p>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="flex flex-col py-4 gap-2">
				<h4>Header sample</h4>
				<Card className="min-h-54 shadow-sm">
					<CardContent>Sample Content</CardContent>
				</Card>
			</div>
		</div>
	)
}

export default Dashboard