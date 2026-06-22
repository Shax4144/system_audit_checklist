import { lazy } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ProtectedRoute } from "./components/ProtectedRoute"
import SuspenseWrapper from "./components/SuspenseWrapper"

const Landing = lazy(() => import("./Landing"))
const Dashboard = lazy(() => import("./routes/Dashboard"))

const queryClient = new QueryClient()
export default function App() {
  return (
		<QueryClientProvider client={queryClient}>
			<Router>
				<Routes>
					<Route exact path="/" element={<Landing />} />
					<Route path="/dashboard" element={<ProtectedRoute />}>
						<Route
							index
							exac
							element={
								<SuspenseWrapper>
									<Dashboard />
								</SuspenseWrapper>
							}
						/>
					</Route>
				</Routes>
			</Router>
		</QueryClientProvider>
	)
}
