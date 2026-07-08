import { useSelector } from "react-redux"
import FormDashboard from "../../../components/checklist-forms/FormDashboard"
import FormBuilder from "../../../components/checklist-forms/FormBuilder"
import HeadAuditorFormView from "./HeadAuditorFormView"
import UserFormView from "./UserFormView"

const Checklist = () => {
	const user = useSelector((state) => state.user)

	const renderByRole = () => {
		switch (user?.role) {
			case "Admin":
				return <FormDashboard />
			case "Auditor":
				return <HeadAuditorFormView />
			case "User":
			default:
				return <UserFormView />
		}
	}

	return <div className="flex flex-col gap-6 h-full">{renderByRole()}</div>
}

export default Checklist
