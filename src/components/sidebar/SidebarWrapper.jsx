import { useLocation, Link } from "react-router-dom"
import { useSelector } from "react-redux"
import SidebarMasterlistDropdown from "./SidebarMasterlistDropdown"
import SidebarWorkspaceDropdown from "./SidebarWorkspaceDropdown"
import logo from "../../assets/horiz_logo_system_audit_checklist.png"
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
	const user = useSelector((state) => state.user)
	const hasRole = (role) => {
		return user?.role === role
	}

	return (
		<div className="hidden lg:block">
			<Sidebar>
				<SidebarHeader className="flex flex-row h-16">
					<img src={logo} alt="System Audit Checklist" className="h-8 w-auto" />
				</SidebarHeader>

				<SidebarContent>
					{/* Workspace */}
					{(hasRole("Admin") || hasRole("Admin-Audit") || hasRole("Audit")) && (
						<SidebarWorkspaceDropdown />
					)}
					{/* end of workspace */}

					{hasRole("Admin") && <SidebarMasterlistDropdown />}

					{/* end of masterlist */}
				</SidebarContent>
			</Sidebar>
		</div>
	)
}

export default SidebarWrapper
