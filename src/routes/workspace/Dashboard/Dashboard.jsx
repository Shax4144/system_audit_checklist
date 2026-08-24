import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
// import CategoryDropdown from "../../../components/dropdown/CategoryDropdown"
import LocationDropdown from "../../../components/dropdown/LocationDropdown"
import { Card, CardContent } from "../../../components/ui/card"
import DashboardTable from "./DashboardTable"
import { useFetchPublishedQuery } from "../../../features/checklist/publishedChecklist.api"
import { useFetchDashboardCountQuery } from "../../../features/count/dashboardCount.api"
import { Skeleton } from "@/components/ui/skeleton"

const Dashboard = () => {
	const user = useSelector((state) => state.user)

	const [activeTab, setActiveTab] = useState("pending")
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10);
	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("")
	const [location, setLocation] = useState("")
  // const [category, setCategory] = useState("")

  
	
	useEffect(() => {
		const timeout = setTimeout(() => {
			setDebouncedSearch(search)
			setPage(1)
		}, 500)
		return () => clearTimeout(timeout)
	}, [search])

	const isAnsweredParam = activeTab === "pending" ? 0 : 1;

	const { data: publishedResponse,
		isFetching: isFetchingPublished,
		isError,
		error,
	} = useFetchPublishedQuery(
		{
			page,
			per_page: pageSize,
			search: debouncedSearch,
			location: location, 
			// category: category,
			is_answered: isAnsweredParam,
		},
		{
			refetchOnMountOrArgChange: true,
		}
    )

	const { data: dashboardCountResponse,
    isFetching: isFetchingDashboardCount,
    // isError: isErrorDashboardCount,
    // error: errorDashboardCount,
  } = useFetchDashboardCountQuery({ refetchOnMountOrArgChange: true })

	const summaryCards = [
		{
			label: "ENROLLED SUPPLIERS",
			value: dashboardCountResponse?.total_suppliers ?? 0,
		},
		{
			label: "PENDING",
			value: (dashboardCountResponse?.total_pending ?? 0),
		},
		{
			label: "COMPLETED",
			value: dashboardCountResponse?.total_completed ?? 0,
		},
		// {
		// 	label: "AVG",
		// 	value: dashboardCountResponse?.total_average ?? 0,
		// },
  ]
	
	return (
		<div>
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div className="">
					<h3 className="scroll-m-20 text-md xl:text-xl font-semibold tracking-tight">
						Welcome back, {user.last_name}
					</h3>
					<p className="text-xs xl:text-sm text-muted-foreground">
						Here's what waiting for you.
					</p>
					<h1 className="text-2xl xl:text-4xl">Select your supplier.</h1>
				</div>
			</div>

			{/* <div className="grid grid-cols-4 gap-5 py-4 lg:py-6 xl:py-8">
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
			</div>*/}

			<div className="grid grid-cols-3 gap-5 py-4 lg:py-6 xl:py-8">
				{summaryCards.map(({ label, value }) => (
					<Card
						key={label}
						className="flex flex-col gap-6 rounded-xl bg-card py-6 text-card-foreground shadow-lg shrink-0 overflow-hidden"
					>
						<CardContent>
							<div className="flex flex-col justify-center gap-2">
								<h4 className="text-muted-foreground font-semibold text-xs">
									{label}
                </h4>
                {isFetchingDashboardCount
                  ? <Skeleton className="h-10 w-16 rounded-xl" />
                  : <p className="font-bold text-4xl">{value}</p>
                }
              </div>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="grid grid-cols-12 gap-5 items-center">
				<div className="xl:col-span-6 col-span-6 shadow-lg rounded-xl">
					<div className="relative ml-auto">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search supplier's name or business address etc.,"
							value={search}
							onChange={
								(e) => setSearch?.(e.target.value)
							}
							className="pl-9 shadow-sm py-6 rounded-xl"
						/>
					</div>
				</div>

				<div className=" col-span-3 xl:col-span-3">
					<LocationDropdown
						triggerClassName="w-full h-13 rounded-xl shadow-lg"
						value={location}
						onChange={setLocation}
					/>
				</div>

				{/* <div className=" col-span-3 xl:col-span-3">
					<CategoryDropdown
						triggerClassName="w-full h-13 rounded-xl shadow-lg"
						open={true}
						value={category}
						onChange={setCategory}
					/>
				</div>*/}
			</div>

			<div className="py-4">
				<DashboardTable
					data={publishedResponse}
					isFetching={isFetchingPublished}
					isError={isError}
					error={error}
					page={page}
					pageSize={pageSize}
					onPageSizeChange={setPageSize}
					activeTab={activeTab}
					onTabChange={setActiveTab}
				/>
			</div>
		</div>
	)
}

export default Dashboard
