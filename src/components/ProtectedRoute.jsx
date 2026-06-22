import { useSelector } from "react-redux"
import Layout from "./Layout"
import { Navigate } from "react-router-dom"

export const ProtectedRoute = ({ permission }) => {
	// const authenticated = window.localStorage.getItem("token")
	// const user = useSelector((state) => state.user)

	// if (!authenticated) return <Navigate to="/" />

	// if (permission === undefined) return <Layouts />

	// const hasPermission = Array.isArray(permission)
	// 	? permission.some((p) => user?.permissions?.includes(p))
	// 	: user?.permissions?.includes(permission)

	// return hasPermission ? <Layouts /> : <AccessDenied />
	// return hasPermission ? <Layouts /> : <Navigate to="/" />
	return <Layout />
}
