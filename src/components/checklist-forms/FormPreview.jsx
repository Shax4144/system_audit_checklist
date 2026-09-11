import { useRef } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Camera, EyeOff } from "lucide-react"
import { useFetchChecklistsQuery } from "../../features/checklist/checklist.api"

const FormPreview = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const location = useLocation()

	const { data: checklistsResponse, isFetching } = useFetchChecklistsQuery({
		pagination: "none",
	})

	const checklistData = checklistsResponse?.data?.find(
		(c) => String(c.id) === String(id),
	)

	if (isFetching) {
		return (
			<p className="text-sm text-muted-foreground py-10 text-center">
				Loading preview...
			</p>
		)
	}

	if (!checklistData) {
		return (
			<p className="text-sm text-destructive py-10 text-center">
				Checklist not found.
			</p>
		)
  }

	const handleGoBack = () => {
    navigate(location.pathname.replace("/preview", ""));
  };

	const handleBack = () => {
    navigate("/workspace/checklist");
	};

	return (
		<div className="flex flex-col gap-6 max-w-3xl mx-auto pb-20">
			<div className="flex w-full items-center gap-3">
				<Button variant="ghost" size="xl" onClick={handleBack}>
					<ChevronLeft className="size-full" />
				</Button>
        <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
          <div className="min-w-0">
            <h1 className="text-sm sm:text-2xl font-semibold">{checklistData.title}</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Preview mode — read only
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="shrink-0"
                  onClick={handleGoBack}
                >
                  <EyeOff className="h-4 w-4" />
                  <span className="hidden sm:inline">Close Preview</span>
                </Button>
              </TooltipTrigger>
              
              <TooltipContent className="sm:hidden">
                Close Preview
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
			</div>

			<div className="flex flex-col gap-5">
				{(checklistData.checklist ?? []).map((section, sIndex) => {
					const hasSubsections = Boolean(section["sub-sections"])

					return (
						<div key={sIndex} className="rounded-xl border bg-card p-5">
							<h2 className="font-medium text-lg mb-1">
                {/* {sIndex + 1}.*/}
                {section.section}
							</h2>

							{hasSubsections ? (
								<div className="flex flex-col gap-4 mt-4 pl-4">
									{section["sub-sections"].map((sub, subIndex) => (
										<div key={subIndex} className="border-l-2 pl-4">
											<h3 className="font-medium text-sm mb-3 text-muted-foreground">
												{/* {sIndex + 1}.{String.fromCharCode(97 + subIndex)}{" "}*/}
												{sub.item}
											</h3>
											<div className="flex flex-col gap-3">
												{(sub["sub-items"] ?? []).map((q, qIndex) => (
													<PreviewQuestion key={qIndex} question={q} />
												))}
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="flex flex-col gap-3 mt-4">
									{(section.item ?? []).map((q, qIndex) => (
										<PreviewQuestion key={qIndex} question={q} />
									))}
								</div>
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}

const PreviewQuestion = ({ question }) => {
	const fileInputRef = useRef(null)
	const gradeOptions = ["1", "2", "3", "4", "5", "N/A"]
	// const note = value?.note ?? ""

	return (
		<div className="flex flex-col gap-2 py-2 border-b last:border-0">
			<div className="flex items-start justify-between gap-4">
				<p className="text-sm font-medium flex-1">{question.name}</p>
				{question.remarks && (
					<Badge variant="outline" className="shrink-0">
						{question.remarks}
					</Badge>
				)}

				<div className="flex gap-1">
					{gradeOptions.map((opt) => (
						<div
							key={opt}
							className="h-10 min-w-10 px-1.5 rounded-full text-xs font-medium border bg-muted/50 text-muted-foreground flex items-center justify-center"
						>
							{opt}
						</div>
					))}
				</div>
			</div>

			<div className="flex items-start gap-2">
				<Textarea
					// value={note}
					// onChange={(e) => updateAnswer({ note: e.target.value })}
					placeholder="Remarks"
					className="resize-none text-sm flex-1"
					rows={2}
					disabled
				/>

				<div className="flex flex-col items-center gap-1 shrink-0">
					<input
						// ref={fileInputRef}
						type="file"
						accept="image/*"
						capture="environment"
						className="hidden"
						// onChange={handlePhotoChange}
					/>
					<Button
						type="button"
						variant="outline"
						size="xl"
						onClick={() => fileInputRef.current?.click()}
						disabled
					>
						<Camera className="h-8 w-8" />
					</Button>
				</div>
			</div>
		</div>
	)
}

export default FormPreview
