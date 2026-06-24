const StatusToggle = ({ checked, onCheckedChange }) => {
	return (
		// <div className="relative flex items-center">
		// 	<Switch
		// 		checked={checked}
		// 		onCheckedChange={onCheckedChange}
		// 		className="scale-150
		//       data-[state=checked]:bg-slate-500
		//       data-[state=unchecked]:bg-emerald-500
		//       [&>span]:w-50"
		// 	/>
		// 	<div className="pointer-events-none absolute inset-0 flex items-center px-2">
		// 		{checked ? (
		// 			// thumb is on right → text on left
		// 			<span className="text-[11px] font-medium text-white pr-5">
		// 				Archived
		// 			</span>
		// 		) : (
		// 			// thumb is on left → text on right
		// 			<span className="text-[11px] font-medium text-white pl-5 ml-auto">
		// 				Active
		// 			</span>
		// 		)}
		// 	</div>
		// </div>
		<button
			onClick={() => onCheckedChange(!checked)}
			className={`top-1 relative w-22.5 h-6 rounded-full transition-colors ${checked ? "bg-slate-500" : "bg-emerald-500"}`}
		>
			<div
				className={`absolute top-0.5 h-5 w-15.5 flex items-center justify-center rounded-full bg-background text-[11px] font-bold text-foreground transition-all duration-300 ${checked ? "left-0.5" : "left-6.5"}`}
			>
				<div className="relative h-4 w-full overflow-hidden">
					<span
						className={`
        absolute inset-0 flex items-center justify-center
        transition-all duration-300
        ${checked ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"}
      `}
					>
						Archived
					</span>

					<span
						className={`
            absolute inset-0 flex items-center justify-center
            transition-all duration-300
            ${checked ? "translate-x-3 opacity-0" : "translate-x-0 opacity-100"}
          `}
					>
						Active
					</span>
				</div>
			</div>
		</button>
	)
}

export default StatusToggle
