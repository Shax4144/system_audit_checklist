import { useSelector } from "react-redux"
import SidebarMasterlistDropdown from "./SidebarMasterlistDropdown"
import SidebarWorkspaceDropdown from "./SidebarWorkspaceDropdown"
import logo from "../../assets/horizontal.png"
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	// SidebarMenu,
	// SidebarMenuButton,
	// SidebarMenuItem,
} from "../ui/sidebar"
// import {
// 	LayoutDashboard,
// } from "lucide-react"

const SidebarWrapper = () => {
 //  const { pathname } = useLocation()
	// const navigate = useNavigate()
	const user = useSelector((state) => state.user)
	const hasRole = (role) => {
		return user?.role === role
	}

	return (
		<div className="hidden lg:block">
			<Sidebar>
				<SidebarHeader className="flex flex-row items-center h-16 px-4">
					<img src={logo} alt="System Audit Checklist" className="h-10 w-auto" />
				</SidebarHeader>

        <SidebarContent>
          {/* Dashboard */}
          {/* {(hasRole("Admin") || hasRole("Admin-Audit") || hasRole("Audit")) && (
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate("/dashboard")}
                  isActive={pathname === "/dashboard"}
                  tooltip="Dashboard"
                >
                  <LayoutDashboard />
                  <span>
                    Dashboard
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          )}*/}
          
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
