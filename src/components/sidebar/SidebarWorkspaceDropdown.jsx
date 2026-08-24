import { useLocation, Link } from "react-router-dom"
import { useSelector } from "react-redux"
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
	ChevronDown,
	LayoutDashboard,
	ClipboardEdit,
	// ClipboardCheck,
	ChartNoAxesCombined,
	UserCheck,
} from "lucide-react"

const workspaceItems = [
	{
		label: "Dashboard",
		to: "/dashboard",
    icon: LayoutDashboard,
		permission: "Dashboard"
	},
	{
		label: "Checklist Form",
		to: "/workspace/checklist",
    icon: ClipboardEdit,
		permission: "Checklist"
	},
	{
		label: "Checklist Assignment",
		to: "/workspace/checklist-assignment",
    icon: UserCheck,
		permission: "Checklist-build"
	},
	// {
	// 	label: "My Submissions",
	// 	to: "/workspace/submission",
	// 	icon: ClipboardCheck,
	// },
	{
		label: "Reports",
		to: "/workspace/reports",
    icon: ChartNoAxesCombined,
    permission: "Report"
	},
]

const SidebarWorkspaceDropdown = () => {
  const { pathname } = useLocation()
  const user = useSelector((state) => state.user)

  const userPermissions = user?.permissions ?? []

  const visibleItems = workspaceItems.filter((item) => userPermissions.includes(item.permission))

	return (
		<Collapsible defaultOpen className="group/collapsible">
			<SidebarGroup>
				<SidebarGroupLabel
					className="text-[12px] font-semibold hover:text-accent-foreground"
					asChild
				>
					<CollapsibleTrigger className="flex w-full items-center">
						My Workspace
						<ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
					</CollapsibleTrigger>
				</SidebarGroupLabel>

				<CollapsibleContent>
					<SidebarGroupContent>
						<SidebarMenu>
							{visibleItems.map(({ label, to, icon: Icon }) => (
								<SidebarMenuItem key={to}>
									<SidebarMenuButton asChild isActive={pathname === to}>
										<Link to={to}>
											<Icon /> {label}
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</CollapsibleContent>
			</SidebarGroup>
		</Collapsible>
	)
}

export default SidebarWorkspaceDropdown
