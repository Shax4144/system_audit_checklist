// components/sidebar/MobileSidebar.jsx
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { Menu } from "lucide-react"
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "../ui/sheet"
import { Button } from "../ui/button"
import logo from "../../assets/horiz_logo_system_audit_checklist.png"
import SidebarMasterlistDropdown from "./SidebarMasterlistDropdown"
import SidebarWorkspaceDropdown from "./SidebarWorkspaceDropdown"

const PopupSidebarWrapper = () => {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  
  const user = useSelector((state) => state.user)
  const hasRole = (role) => user?.role === role

	// Close the sheet automatically whenever the route changes (i.e. a nav link was clicked)
	useEffect(() => {
		setOpen(false)
	}, [pathname])

	return (
		<div className="lg:hidden">
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<Button variant="ghost" size="icon" aria-label="Open menu">
						<Menu className="h-5 w-5" />
					</Button>
				</SheetTrigger>

				<SheetContent
					side="left"
					className="w-70 sm:w-75 p-0 flex flex-col"
				>
					<SheetHeader className="flex flex-row items-center h-16 px-4 border-b">
						<SheetTitle asChild>
							<img
								src={logo}
								alt="System Audit Checklist"
								className="h-8 w-auto"
							/>
						</SheetTitle>
					</SheetHeader>

					<div className="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-1">
						{(hasRole("Admin") ||
							hasRole("Admin-Audit") ||
							hasRole("Audit")) && <SidebarWorkspaceDropdown />}

						{hasRole("Admin") && <SidebarMasterlistDropdown />}
					</div>
				</SheetContent>
			</Sheet>
		</div>
	)
}

export default PopupSidebarWrapper
