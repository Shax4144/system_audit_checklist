import React from 'react'
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from "./ui/sidebar"

import {
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
} from "./ui/collapsible"

import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "./ui/dropdown-menu"

import { ChevronDown } from 'lucide-react'

const SidebarWrapper = () => {
  return (
		<SidebarMenu className="w-3xs">
			<SidebarMenuItem>
				<SidebarMenuButton>Dashboard</SidebarMenuButton>
			</SidebarMenuItem>
			{/* Parent item */}
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
						<SidebarMenuButton asChild>
							<a href="">User Accounts</a>
						</SidebarMenuButton>
					</SidebarMenuItem>

					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<a href="">Roles</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</CollapsibleContent>
			</Collapsible>
		</SidebarMenu>
	)
}

export default SidebarWrapper