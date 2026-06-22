import React from 'react'

const Navbar = () => {
	const user = JSON.parse(window.localStorage.getItem("user") || "{}")

  return (
		<div className="flex h-16 items-center gap-3 px-4 sm:px-6">
			<div className="ml-auto flex items-center gap-2">
				<button></button>
				<div className="hidden lg:block">
					<button className="flex items-center gap-3 rounded-full p-1 pr-3 transition-colors hover:bg-muted">
						<span>/</span>
						<div>
							<p className="text-xs font-semibold">{user.username}</p>
							<p className="text-[10px] text-muted-foreground">{user.role}</p>
						</div>
					</button>
				</div>
			</div>
		</div>
	)
}

export default Navbar