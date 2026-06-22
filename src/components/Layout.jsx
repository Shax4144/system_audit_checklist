import React from 'react'
import { Outlet } from 'react-router-dom'
import { SidebarProvider } from './ui/sidebar'
import SidebarWrapper from './SidebarWrapper'
import { TooltipProvider } from "@/components/ui/tooltip"
import Navbar from './Navbar'

const Layout = () => {
  return (
		<TooltipProvider>
			<SidebarProvider>
				<SidebarWrapper />
				<div className="flex min-h-0 min-w-0 flex-1 flex-col">
					<header className="sticky top-0 z-30 border-b border-sidebar-border bg-sidebar/95 backdrop-blur-md pt-safe">
						<Navbar />
					</header>
					<main className="min-h-0 flex-1 overflow-y-auto p-6 lg:p-8 lg:pb-safe pb-safe">
						<Outlet />
					</main>
				</div>
			</SidebarProvider>
		</TooltipProvider>
	)
}

export default Layout