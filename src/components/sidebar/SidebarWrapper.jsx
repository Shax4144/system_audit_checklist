import { useLocation, Link } from "react-router-dom"
import SidebarMasterlistDropdown from "./SidebarMasterlistDropdown"
import SidebarWorkspaceDropdown from "./SidebarWorkspaceDropdown"
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarGroupContent,
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
	Truck,
	Tags,
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
					<h1 className="text-sm font-semibold tracking-tight text-foreground">
						System Audit Checklist
					</h1>
				</div>
			</SidebarHeader>

			<SidebarContent>
				{/* Workspace */}
				<SidebarWorkspaceDropdown />
				{/* end of workspace */}

				{/* Masterlist — collapsible */}
				<SidebarMasterlistDropdown />
				{/* end of masterlist */}
			</SidebarContent>
		</Sidebar>
	)
}

export default SidebarWrapper
