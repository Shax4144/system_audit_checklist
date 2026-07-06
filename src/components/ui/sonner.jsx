import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner";
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme()

  return (
		<Sonner
			richColors
			theme={theme}
			className="toaster group"
			icons={{
				success: <CircleCheckIcon className="size-4 text-current" />,
				info: <InfoIcon className="size-4 text-current" />,
				warning: <TriangleAlertIcon className="size-4 text-current" />,
				error: <OctagonXIcon className="size-4 text-current" />,
				loading: <Loader2Icon className="size-4 animate-spin text-current" />,
      }}
      
			style={{
				"--normal-bg": "var(--card)",
				"--normal-text": "var(--card-foreground)",
				"--normal-border": "var(--border)",
				"--border-radius": "var(--radius)",
			}}
			toastOptions={{
				classNames: {
					toast: "cn-toast",
					title: "font-semibold",
					description: "text-muted-foreground",

					success: "cn-toast-success",
					error: "cn-toast-error",
					warning: "cn-toast-warning",
					info: "cn-toast-info",
				},
			}}
			{...props}
		/>
	)
}

export { Toaster }
