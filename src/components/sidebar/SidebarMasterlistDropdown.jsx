import { useLocation } from "react-router-dom"
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
import { ChevronDown } from "lucide-react"

const masterlistItemsConfig = [
	{ label: "User Accounts", to: "/masterlist/roles" },
	{ label: "Roles", to: "/masterlist/roles"},
]

const SidebarMasterlistDropdown = () => {
	const { pathname } = useLocation()
	return (
		<Sidebar>
			<SidebarContent>
				<SidebarMenu className="w-3xs">
					<Collapsible>
						<SidebarMenuItem>
							<CollapsibleTrigger asChild>
								<SidebarMenuButton>
									Masterlist
									<ChevronDown className="ml-auto h-4 w-4" />
								</SidebarMenuButton>
							</CollapsibleTrigger>
						</SidebarMenuItem>
						{/* CHILDREN (this is what you want) */}
						<CollapsibleContent className="pl-6 space-y-1">
							<SidebarMenuItem>
								<SidebarMenuButton asChild isActive={pathname === "/"}>
									<a href="">User Accounts</a>
								</SidebarMenuButton>
							</SidebarMenuItem>

							<SidebarMenuItem>
								<SidebarMenuButton asChild isActive={pathname === "/"}>
									<a href="">Roles</a>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</CollapsibleContent>
					</Collapsible>
				</SidebarMenu>
			</SidebarContent>
		</Sidebar>
	)
}

export default SidebarMasterlist
