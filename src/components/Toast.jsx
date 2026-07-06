import { toast } from "sonner"
import { CheckCircle2, CircleAlert, Info, TriangleAlert } from "lucide-react"

export const appToast = {
	success(title, message) {
		toast.success(title, {
			description: message,
			icon: <CheckCircle2 className="h-5 w-5 text-success" />,
		})
	},

	error(title, message) {
		toast.error(title, {
			description: message,
			icon: <CircleAlert className="h-5 w-5 text-destructive" />,
		})
	},

	warning(title, message) {
		toast.warning(title, {
			description: message,
			icon: <TriangleAlert className="h-5 w-5 text-warning" />,
		})
	},

	info(title, message) {
		toast(title, {
			description: message,
			icon: <Info className="h-5 w-5 text-info" />,
		})
	},
}
