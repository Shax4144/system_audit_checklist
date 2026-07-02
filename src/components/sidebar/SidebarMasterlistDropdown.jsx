import { useLocation, Link } from "react-router-dom"
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
	UserRoundCog,
	ShieldUser,
	Truck,
	Tags,
	// MapPin
} from "lucide-react"

const masterlistItems = [
	{
		label: "User Accounts",
		to: "/masterlist/user-accounts",
		icon: UserRoundCog,
	},
	{ label: "Roles", to: "/masterlist/roles", icon: ShieldUser },
	{ label: "Supplier", to: "/masterlist/supplier", icon: Truck },
	{ label: "Category", to: "/masterlist/category", icon: Tags },
	// { label: "Address", to: "/masterlist/address", icon: MapPin },
]

const SidebarMasterlistDropdown = () => {
	const { pathname } = useLocation()

	return (
		<Collapsible defaultOpen className="group/collapsible">
			<SidebarGroup>
				<SidebarGroupLabel
					className="text-[12px] font-semibold hover:text-accent-foreground"
					asChild
				>
					<CollapsibleTrigger className="flex w-full items-center">
						Masterlist
						<ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
					</CollapsibleTrigger>
				</SidebarGroupLabel>

				<CollapsibleContent>
					<SidebarGroupContent>
						<SidebarMenu>
							{masterlistItems.map(({ label, to, icon: Icon }) => (
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

export default SidebarMasterlistDropdown
