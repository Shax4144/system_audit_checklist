const LoadingFallback = () => {
  return (
		<div className="w-full">
			<div className="h-1 w-full bg-muted overflow-hidden">
				<div className="h-full bg-indigo-600 animate-progress" />
			</div>
		</div>
	)
}

export default LoadingFallback