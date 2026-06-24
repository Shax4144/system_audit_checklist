import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
	Alert,
	AlertAction,
	AlertDescription,
	AlertTitle,
} from "@/components/ui/alert"

import { users } from "../dummydata"
import { useNavigate } from "react-router-dom"
import { AlertCircleIcon } from "lucide-react"

export function Landing() {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const [showError, setShowError] = useState(false)
	const [error, setError] = useState("")
  
  const navigate = useNavigate()

	const handleSubmit = (e) => {
		e.preventDefault()
		setLoading(true)
    const match = users.find(
      (user) => user.username === username && user.password === password
    )

    if (match) {
			localStorage.setItem("user", JSON.stringify(match))
			navigate("/dashboard")
			setLoading(false)
		} else {
			setLoading(false)
			setShowError(true)
      setError("Invalid username or password")
    }
	}

	return (
		<div className="flex h-screen w-full">
			{/* ── Left panel: branding ── */}
			<div className="hidden lg:flex w-1/2 bg-slate-950 flex-col items-center justify-center gap-8 px-16 relative overflow-hidden">
				{/* Subtle background rings */}
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
					<div className="w-120 h-120 rounded-full border border-slate-800 opacity-40" />
					<div className="absolute w-80 h-80 rounded-full border border-slate-800 opacity-40" />
					<div className="absolute w-40 h-40 rounded-full border border-slate-700 opacity-40" />
				</div>

				{/* Logo mark */}
				<div className="relative z-10 flex flex-col items-center gap-6 text-center">
					<div className="flex items-center justify-center w-24 h-24 rounded-2xl bg-primary">
						<svg
							width="32"
							height="32"
							viewBox="0 0 32 32"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M6 16L16 6L26 16L16 26L6 16Z"
								fill="white"
								fillOpacity="0.2"
							/>
							<path
								d="M10 16L16 10L22 16L16 22L10 16Z"
								fill="white"
								fillOpacity="0.6"
							/>
							<circle cx="16" cy="16" r="3" fill="white" />
						</svg>
					</div>

					<div>
						<h1 className="text-3xl font-semibold tracking-tight text-white">
							System Audit Checklist
						</h1>
					</div>

					{/* Feature pills */}
					{/* <div className="flex flex-col gap-3 mt-4 w-full max-w-xs">
						{[
							{ icon: "✦", text: "Real-time collaboration" },
							{ icon: "✦", text: "End-to-end encrypted" },
							{ icon: "✦", text: "99.9% uptime SLA" },
						].map(({ icon, text }) => (
							<div
								key={text}
								className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800"
							>
								<span className="text-indigo-400 text-xs">{icon}</span>
								<span className="text-slate-300 text-sm">{text}</span>
							</div>
						))}
					</div> */}
				</div>
			</div>

			{/* ── Right panel: form ── */}
			<div className="flex w-full lg:w-1/2 items-center justify-center px-8">
				<div className="w-full max-w-sm">
					{/* Mobile logo (shown only on small screens) */}
					<div className="flex lg:hidden items-center gap-2 mb-8">
						<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
							<svg width="16" height="16" viewBox="0 0 32 32" fill="none">
								<circle cx="16" cy="16" r="3" fill="white" />
								<path
									d="M10 16L16 10L22 16L16 22L10 16Z"
									fill="white"
									fillOpacity="0.6"
								/>
							</svg>
						</div>
						<span className="font-semibold">
							System Audit Checklist
						</span>
					</div>

					{/* Heading */}
					<div className="flex justify-center mb-8">
						<h2 className="text-2xl font-semibold">LOGIN</h2>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit} className="flex flex-col gap-5">
						<div className="flex flex-col gap-1.5">
							<Label
								htmlFor="email"
								className="text-sm font-medium"
							>
								Username
							</Label>
							<Input
								id="email"
								type="text"
								placeholder="Enter your username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
								className="h-10"
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
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									className="h-10 border-slate-200 focus-visible:ring-indigo-500 pr-10"
								/>
								<button
									type="button"
									onClick={() => setShowPassword((v) => !v)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors text-xs"
									tabIndex={-1}
									aria-label={showPassword ? "Hide password" : "Show password"}
								>
									{showPassword ? "Hide" : "Show"}
								</button>
							</div>
						</div>

						{Boolean(showError) && (
							<Alert variant="destructive" className="max-w-md bg-chart-1">
								<AlertCircleIcon />
								<AlertTitle>Invalid Credentials</AlertTitle>
								<AlertDescription>
									Username and/or password is invalid.
								</AlertDescription>
							</Alert>
						)}
						<Button
							type="submit"
							disabled={loading}
							className="h-10 font-medium transition-colors"
						>
							{loading ? "Signing in…" : "Sign in"}
						</Button>
					</form>

					{/* Divider */}
					{/* <div className="flex items-center gap-3 my-6">
						<div className="flex-1 h-px bg-slate-100" />
						<span className="text-xs text-slate-400">or continue with</span>
						<div className="flex-1 h-px bg-slate-100" />
					</div> */}
				</div>
			</div>
		</div>
	)
}

export default Landing
