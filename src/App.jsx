import { lazy } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ProtectedRoute } from "./components/ProtectedRoute"
import SuspenseWrapper from "./components/SuspenseWrapper"

import masterlistConfig from "./config/masterlist-routes.config"

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
					<Route exact path="/masterlist" element={<ProtectedRoute />}>
						{masterlistConfig.map(
							({ path, component: Component }) => (
								<Route
									key={path}
									exact
									path={path}
									element={
										<SuspenseWrapper>
											<Component />
										</SuspenseWrapper>
									}
								>

								</Route>
						))}
					</Route>
					
				</Routes>
			</Router>
		</QueryClientProvider>
	)
}
