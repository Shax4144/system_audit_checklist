import { React, useState} from 'react'
import { Switch } from "@/components/ui/switch"
import { Sun, Moon } from "lucide-react"

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const handleToggle = (checked) => {
    setIsDarkMode(checked)
    document.documentElement.classList.toggle("dark", checked)
  }

  return (
		<div className="relative flex items-center border rounded-xl">
			<Switch
				className="[&>span]:bg-primary"
				checked={isDarkMode}
				onCheckedChange={handleToggle}
			/>
			{isDarkMode ? (
				<div className="pointer-events-none absolute inset-0 flex items-center justify-end px-1">
					<Moon className="h-4 w-4 text-secondary" />
				</div>
			) : (
				<div className="pointer-events-none absolute inset-0 flex items-center justify-start px-1">
					<Sun className="h-4 w-4 text-white" />
				</div>
			)}
		</div>
	)
}

export default DarkModeToggle