import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { appToast } from "./components/Toast"

import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { authenticate } from "./features/auth/auth.slice"
import { setUserDetails } from "./features/users/users.slice"

import { useLoginMutation } from "./api/authApi"
import { Loader2 } from "lucide-react"
import vert_logo from "../src/assets/vert_logo_system_audit_checklist.png"
import horiz_logo from "../src/assets/horiz_logo_system_audit_checklist.png"
import mis_logo from "../src/assets/MIS_logo.png"

export function Landing() {
	const [showPassword, setShowPassword] = useState(false)
	const [credential, setCredential] = useState({
		username: "",
		password: "",
	})
  
	const navigate = useNavigate()
	const dispatch = useDispatch()
	// const session = window.localStorage.getItem("token")

  const [login, { isLoading: isLoggingIn }] = useLoginMutation()

  const getDestination = (user) => {
    const permissions = user?.permissions ?? []

    if (permissions.includes("Masterlist")) {
      return "/masterlist/user-accounts"
    }
    
    if (permissions.includes("Report")) {
      return "/workspace/reports"
    }

    if (permissions.includes("Dashboard")) {
      return "/dashboard"
    }

    return "/accessdenied"
  }

	const handleChange = (field) => (e) => {
		setCredential((prev) => ({ ...prev, [field]: e.target.value }))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
    
		try {
			const response = await login(credential).unwrap()
			const { token, user } = response

			localStorage.setItem("token", token)
			localStorage.setItem("user", JSON.stringify(user))

			dispatch(setUserDetails(user))
      dispatch(authenticate())
 
      navigate(getDestination(user))
      
			appToast.success(
				response?.message ?? "Login successful!",
				""
			)
		} catch (error) {
			console.error("Login failed:", error)
			appToast.error(
				"Login Failed",
				error?.data?.message ?? "Invalid Credentials"
			)
		}
	}

	return (
		<div className="flex h-screen w-full">
			{/* ── Left panel: branding ── */}
			<div className="hidden lg:flex w-1/2 bg-slate-950 flex-col items-center justify-center gap-8 px-16 relative overflow-hidden">
				{/* Subtle background rings */}
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
					<div className="w-140 h-140 rounded-full border border-slate-800 opacity-40" />
					<div className="absolute w-100 h-100 rounded-full border border-slate-800 opacity-40" />
					<div className="absolute w-60 h-60 rounded-full border border-slate-700 opacity-40" />
				</div>

				{/* Logo mark */}
				<div className="relative z-10 flex flex-col items-center gap-5 text-center">
					<img
						src={vert_logo}
						alt="Logo"
						className="w-full h-full object-contain"
					/>
				</div>
			</div>

			{/* ── Right panel: form ── */}
			<div className="flex flex-col w-full lg:w-1/2 h-screen px-8">
				<div className="flex-1 flex items-center justify-center">
					<div className="w-full max-w-sm">
						{/* Mobile logo (shown only on small screens) */}
						<div className="flex lg:hidden items-center gap-2 mb-8">
							<img
								src={horiz_logo}
								alt="Logo"
								className="w-full h-full object-contain"
							/>
						</div>

						{/* Heading */}
						<div className="flex justify-center mb-8">
							<h2 className="text-2xl font-semibold">LOGIN</h2>
						</div>

						{/* Form */}
						<form onSubmit={handleSubmit} className="flex flex-col gap-5">
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="username" className="text-sm font-medium">
									Username
								</Label>
								<Input
									id="username"
									type="text"
									placeholder="Enter your username"
									value={credential.username}
									onChange={handleChange("username")}
									required
									className="h-10"
									disabled={isLoggingIn}
								/>
							</div>

							<div className="flex flex-col gap-1.5">
								<div className="flex items-center justify-between">
									<Label
										htmlFor="password"
										className="text-sm font-medium text-slate-700"
									>
										Password
									</Label>
								</div>
								<div className="relative">
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
										placeholder="Enter your password"
										value={credential.password}
										onChange={handleChange("password")}
										required
										className="h-10 pr-10"
										disabled={isLoggingIn}
									/>
									<button
										type="button"
										onClick={() => setShowPassword((v) => !v)}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors text-xs"
										tabIndex={-1}
										aria-label={
											showPassword ? "Hide password" : "Show password"
										}
										disabled={isLoggingIn}
									>
										{showPassword ? "Hide" : "Show"}
									</button>
								</div>
							</div>

							<Button
								type="submit"
								disabled={isLoggingIn}
								className="h-10 font-medium transition-colors"
							>
								{isLoggingIn ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Signing in…
									</>
								) : (
									"Sign in"
								)}
							</Button>
						</form>

						{/* Copyright */}
						<div className="flex flex-col pt-6 items-center">
							<img src={mis_logo} alt="MIS Logo" className="h-12 w-12" />
							<p className="text-center text-xs text-muted-foreground">
								© {new Date().getFullYear()} Powered by
							</p>
							<p className="text-center text-xs text-muted-foreground">
								Management Information System
							</p>
						</div>
					</div>
				</div>

				<div className="pb-1">
					<p className="text-center text-xs text-muted-foreground">
						Version 1.0.0 · Patched on: July 13, 2026
					</p>
				</div>
			</div>
		</div>
	)
}

export default Landing
