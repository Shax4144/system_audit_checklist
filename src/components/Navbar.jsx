import { useState } from "react";
import { Button } from "@/components/ui/button";
import DarkModeToggle from "./DarkModeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, LogOutIcon, LockIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import PopupSidebarWrapper from "./sidebar/PopupSidebarWrapper";
import { unauthenticate } from "../features/auth/auth.slice";
import { clearUserDetails } from "../features/users/users.slice";
import { useLogoutMutation } from "../features/auth/logout.api";

// const notifications = [
// 	{
// 		id: 1,
// 		title: "New user registered",
// 		message: "Alice Reyes joined the system.",
// 	},
// 	{ id: 2, title: "Role updated", message: "Ben Santos is now an Editor." },
// 	{ id: 3, title: "Report generated", message: "Q3 audit report is ready." },
// 	{ id: 4, title: "Login detected", message: "New login from 192.168.1.1." },
// ]

const Navbar = () => {
  // const user = JSON.parse(window.localStorage.getItem("user") || "{}")
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");

  const getInitials = (name) => {
    if (!name) return;
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 3);
  };

  const logoutHandler = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.log("error: ", error.response);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      dispatch(unauthenticate());
      dispatch(clearUserDetails());
      navigate("/", {
        replace: true,
      });
    }
  };

  return (
    <div className="flex h-16 items-center gap-3 px-4 sm:px-6 border">
      <PopupSidebarWrapper />

      <div className="ml-auto flex items-center gap-4">
        <div className="relative flex items-center">
          <DarkModeToggle />
        </div>

        {/* <DropdownMenu>
					<DropdownMenuTrigger className="border-2 rounded-2xl" asChild>
						<Button size="icon-lg" variant="outline">
							<Bell />
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent className="w-72 p-0 rounded-[0.35rem]" align="end">
						<ScrollArea className="h-52">
							<div>
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
						</ScrollArea>
					</DropdownMenuContent>
				</DropdownMenu>*/}

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="min-h-10 min-w-24 pl-0 pt-0 pb-0 pr-4 rounded-3xl justify-between border-0 bg-sidebar/95"
                variant="outline"
              >
                <span>
                  <Avatar size="lg">
                    <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
                  </Avatar>
                </span>
                <div>
                  <p className="text-[14px] font-semibold">
                    {getInitials(user.first_name)}. {user.last_name}
                  </p>
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
  );
};

export default Navbar;
