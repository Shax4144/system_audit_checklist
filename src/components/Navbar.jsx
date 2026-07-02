import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import DarkModeToggle from './DarkModeToggle'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
	DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
 } from "@/components/ui/dropdown-menu"
import { Bell, LogOutIcon, LockIcon } from "lucide-react"
import { useNavigate, } from 'react-router-dom'

const notifications = [
	{
		id: 1,
		title: "New user registered",
		message: "Alice Reyes joined the system.",
	},
	{ id: 2, title: "Role updated", message: "Ben Santos is now an Editor." },
	{ id: 3, title: "Report generated", message: "Q3 audit report is ready." },
	{ id: 4, title: "Login detected", message: "New login from 192.168.1.1." },
]

const Navbar = () => {
	const user = JSON.parse(window.localStorage.getItem("user") || "{}")
	const navigate = useNavigate()
	const [isDarkMode, setIsDarkMode] = useState(false)

	const fullName = [user.last_name, user.first_name, user.middle_name ]
		.filter(Boolean)
		.join(" ")
	
	const getInitials = (name) => {
		if (!name) return
		return name
			.split(" ")
			.map((word) => word[0])
			.join("")
			.toUpperCase()
			.slice(0, 2)
	}

	const logoutHandler = () => {
		try {
			localStorage.removeItem("user")
			localStorage.removeItem("token")
			navigate("/")
		} catch (error) {
			console.log("error: ", error.response)
		}
	}

  return (
		<div className="flex h-16 items-center gap-3 px-4 sm:px-6 border">
			<div className="ml-auto flex items-center gap-4">
				<div className="relative flex items-center">
					<DarkModeToggle />
				</div>

				<DropdownMenu>
					<DropdownMenuTrigger className="border-2 rounded-2xl" asChild>
						<Button size="icon-lg" variant="outline">
							<Bell />
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent className="w-72 rounded-[0.35rem]" align="end">
						<div className="max-h-50">
							{notifications.map((notif, index) => (
								<React.Fragment key={notif.id}>
									<div className="p-3">
										<h5 className="text-sm font-medium">{notif.title}</h5>
										<p className="text-xs text-muted-foreground">
											{notif.message}
										</p>
									</div>
									{index < notifications.length - 1 && (
										<DropdownMenuSeparator />
									)}
								</React.Fragment>
							))}
						</div>
					</DropdownMenuContent>
				</DropdownMenu>

				<div className="hidden lg:block">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								className="min-h-8.5 min-w-24 pl-0 pt-0 pb-0 pr-2  justify-between border-0 bg-sidebar/95"
								variant="outline"
							>
								<span>
									<Avatar>
										<AvatarFallback>
											{getInitials(user.username)}
										</AvatarFallback>
									</Avatar>
								</span>
								<div>
									<p className="text-[14px] font-semibold">{fullName}</p>
									<p className="text-[12px] text-muted-foreground">
										{user.role}
									</p>
								</div>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-45" align="end">
							<DropdownMenuGroup>
								<DropdownMenuLabel>My account</DropdownMenuLabel>
								<DropdownMenuItem>
									<LockIcon />
									Change Password
								</DropdownMenuItem>
							</DropdownMenuGroup>

							{/* <DropdownMenuSeparator /> */}

							{/* <DropdownMenuGroup>
								<DropdownMenuLabel>Preference</DropdownMenuLabel>
								<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
									Dark Mode
									<DarkModeToggle />
								</DropdownMenuItem>
							</DropdownMenuGroup> */}

							<DropdownMenuSeparator />

							<DropdownMenuGroup>
								<DropdownMenuItem variant="destructive" onClick={logoutHandler}>
									<LogOutIcon />
									Log out
								</DropdownMenuItem>
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>
	)
}

export default Navbar