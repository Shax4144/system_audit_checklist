import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ChevronLeft, Clock4 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSelector } from "react-redux"
import { useFetchPublishedQuery } from "../../../features/checklist/publishedChecklist.api"
import AnsweredSectionForm from "../../../components/checklist-forms/AnsweredSectionForm"

const getStoredUser = () => {
	try {
		const raw = localStorage.getItem("user")
		return raw ? JSON.parse(raw) : {}
	} catch {
		return {}
	}
}

const MyChecklistAnswer = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const currentUser = getStoredUser()

	const { data: response, isFetching } = useFetchPublishedQuery({ id })

	const checklistData = response?.data

	const [allAnswers, setAllAnswers] = useState({});

  	const handleSectionAnswersChange = (sectionIndex) => (questionKey, value) => {
  	  setAllAnswers((prev) => ({
  	    ...prev,
  	    [`${sectionIndex}-${questionKey}`]: value,
  	  }));
  	};

	if (isFetching || !checklistData) {
		return (
			<p className="text-sm text-muted-foreground py-10 text-center">
				Loading checklist...
			</p>
		)
	}

	const info = checklistData.information ?? {}

	// Only sections assigned to the logged-in user
	const mySections = (checklistData.checklist ?? [])
		.map((section, index) => ({ ...section, originalIndex: index }))
		.filter((section) => String(section.user_id) === String(currentUser.id))


	const allMyQuestions = mySections.flatMap((section) => {
    	const hasSubsections = Boolean(section["sub-sections"]);
      	if (hasSubsections) {
        	return section["sub-sections"].flatMap((sub, subIdx) =>
          	(sub["sub-items"] ?? []).map((q, qIdx) => ({
            ...q,
            answerKey: `${section.originalIndex}-${subIdx}-${qIdx}`,
          })),
        );
      }
      return (section.item ?? []).map((q, qIdx) => ({
        ...q,
        answerKey: `${section.originalIndex}-${qIdx}`,
      }));
    });

    const gradedQuestions = allMyQuestions.filter(
      (q) => allAnswers[q.answerKey]?.grade,
    );

    const numericGrades = gradedQuestions
      .map((q) => allAnswers[q.answerKey].grade)
      .filter((g) => g !== "N/A")
      .map(Number);

    const averageScore = numericGrades.length
      ? (
          numericGrades.reduce((sum, g) => sum + g, 0) / numericGrades.length
        ).toFixed(1)
      : "0.0";

    const totalItems = allMyQuestions.length;
    const ratedItems = gradedQuestions.length;
    const progressPercent = totalItems
      ? Math.round((ratedItems / totalItems) * 100)
      : 0;

	return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto pb-20">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <div className="flex flex-row gap-2">
              <Badge variant="outline">
                <Clock4 /> Time in: 10:30
              </Badge>
              <Badge variant="outline" className="border border-dashed">
                <Clock4 /> Time out: 10:30
              </Badge>
          </div>
          <h1 className="text-2xl font-semibold">{checklistData.title}</h1>
          <p className="text-sm text-muted-foreground">
            Supplier: {info.supplier}
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm">
        <div className="flex flex-col p-7 gap-1">
          <div className="flex flex-row justify-between items-center">
            <p className="text-md font-medium text-muted-foreground">
              Average Score
            </p>
            <p className="text-lg font-semibold">{averageScore}/5</p>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-xs text-muted-foreground">
            {ratedItems} of {totalItems} items rated
          </p>
        </div>
      </div>

      {mySections.length === 0 ? (
        <p className="text-sm text-muted-foreground py-10 text-center">
          You have no sections assigned in this checklist.
        </p>
      ) : (
        <div className="flex flex-col gap-4 shadow-sm rounded-xl">
          {mySections.map((section) => (
            <AnsweredSectionForm
              key={section.originalIndex}
              checklistId={checklistData.id}
              section={section}
              sectionIndex={section.originalIndex}
              onAnswersChange={handleSectionAnswersChange(
                section.originalIndex,
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyChecklistAnswer
