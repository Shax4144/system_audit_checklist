import { useLocation, Link } from "react-router-dom"

import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "../ui/sidebar"

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible"

import {
	ChevronDown,
	LayoutDashboard,
	ClipboardList,
	UserRoundCog,
	ShieldUser,
} from "lucide-react"

const SidebarWrapper = () => {
	const { pathname } = useLocation()
	return (
		<Sidebar>
			<SidebarHeader className="flex flex-row h-16">
				<div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary">
					<svg
						width="32"
						height="32"
						viewBox="0 0 32 32"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M6 16L16 6L26 16L16 26L6 16Z"
							fill="white"
							fillOpacity="0.2"
						/>
						<path
							d="M10 16L16 10L22 16L16 22L10 16Z"
							fill="white"
							fillOpacity="0.6"
						/>
						<circle cx="16" cy="16" r="3" fill="white" />
					</svg>
				</div>

				<div className="py-2.5">
					<h1 className="text-3 font-semibold tracking-tight text-foreground">
						System Audit Checklist
					</h1>
				</div>
			</SidebarHeader>

			<SidebarContent>
				<SidebarMenu className="w-3xs">
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							isActive={pathname === "/dashboard"}
						>
							<Link to="/dashboard">
								<LayoutDashboard />
								Dashboard
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>

					<Collapsible>
						<SidebarMenuItem>
							<CollapsibleTrigger asChild>
								<SidebarMenuButton>
									<ClipboardList />
									Masterlist
									<ChevronDown className="ml-auto h-4 w-4" />
								</SidebarMenuButton>
							</CollapsibleTrigger>
						</SidebarMenuItem>
						{/* CHILDREN (this is what you want) */}
						<CollapsibleContent className="pl-6 space-y-1">
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={pathname === "/masterlist/user-accounts"}
								>
									<Link to="/masterlist/user-accounts">
										<UserRoundCog />
										User Accounts
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>

							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={pathname === "/masterlist/roles"}
								>
									<Link to="/masterlist/roles">
										<ShieldUser />
										Roles
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</CollapsibleContent>
					</Collapsible>
				</SidebarMenu>
			</SidebarContent>
		</Sidebar>
	)
}

export default SidebarWrapper
