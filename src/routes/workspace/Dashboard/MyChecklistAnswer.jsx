import { useState, useRef } from "react";
import { useSubmitSectionMutation } from "../../../features/checklist/submitSectionChecklist.api";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Clock4, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { useSelector } from "react-redux"
// import { useFetchPublishedQuery } from "../../../features/checklist/publishedChecklist.api"
import { useFetchReportByIdQuery } from "../../../features/report/checklistSummaryReport.api";
import AnsweredSectionForm from "../../../components/checklist-forms/AnsweredSectionForm";
import { Skeleton } from "@/components/ui/skeleton";
import { appendFormData } from "../../../features/checklist/formBuilder.helpers";
import { appToast } from "../../../components/Toast";

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const MyChecklistAnswer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getStoredUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitSection] = useSubmitSectionMutation();
  const sectionRefs = useRef({});

  const [submissionStatus, setSubmissionStatus] = useState({});
  const [isSubmittingAll, setIsSubmittingAll] = useState(false);
  const [failedSectionIndex, setFailedSectionIndex] = useState(null);

  const [allAnswers, setAllAnswers] = useState({});

  const {
    data: response,
    isFetching,
    refetch,
  } = useFetchReportByIdQuery(id, { refetchOnMountOrArgChange: true });

  const checklistData = response?.data;
  // ?.find((c) => String(c.id) === String(id))

  const handleSectionAnswersChange = (sectionIndex) => (questionKey, value) => {
    setAllAnswers((prev) => ({
      ...prev,
      [`${sectionIndex}-${questionKey}`]: value,
    }));
  };

  if (isFetching || !checklistData) {
    return (
      <div className="flex flex-col gap-6 max-w-3xl mx-auto pb-20">
        {/* Header */}
        <div className="flex items-center w-full">
          <Button variant="ghost" size="xl" onClick={() => navigate(-1)}>
            <ChevronLeft className="size-full" />
          </Button>

          <div className="flex-1">
            {/* Time badges */}
            <div className="flex flex-row gap-2 mb-2">
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>

            {/* Title + reference */}
            <div className="flex flex-row justify-between gap-4">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-8 w-96" />
                <Skeleton className="h-5 w-56" />
              </div>

              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        </div>

        {/* Score / Progress */}
        <div className="bg-card border border-border rounded-xl shadow-sm">
          <div className="flex flex-col p-7 gap-2">
            <div className="flex flex-row justify-between items-center">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-6 w-16" />
            </div>

            <Skeleton className="h-2 w-full rounded-full" />

            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        {/* Current section */}
        <div className="rounded-xl border bg-card p-5">
          {/* Section title */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>

          {/* Questions */}
          <div className="flex flex-col gap-5">
            {[...Array(5)].map((_, questionIndex) => (
              <div key={questionIndex} className="border-l-2 pl-4">
                {/* Question text */}
                <Skeleton className="h-5 w-4/5 mb-3" />

                {/* Question answer controls */}
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-10 w-full rounded-md" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-start gap-4 mt-1">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      </div>
    );
  }

  const info = checklistData.information ?? {};

  // Only sections assigned to the logged-in user
  const mySections = (checklistData.checklist ?? [])
    .map((section, index) => ({ ...section, originalIndex: index }))
    .filter((section) => String(section.user_id) === String(currentUser.id));

  const currentSection = mySections[currentStep];
  const isLastStep = currentStep === mySections.length - 1;
  const handleNext = () =>
    setCurrentStep((s) => Math.min(s + 1, mySections.length - 1));
  const handlePrevious = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const allMyQuestions = mySections.flatMap((section) => {
    const hasSubsections = Boolean(section["sub-sections"]);
    if (hasSubsections) {
      return section["sub-sections"].flatMap((sub, subIdx) =>
        (sub["sub-items"] ?? []).map((q, qIdx) => ({
          ...q,
          answerKey: `${section.originalIndex}-${subIdx}-${qIdx}`,
          subSectionTitle: sub.item,
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

  const buildSectionPayload = (section) => {
    const sectionIndex = section.originalIndex;

    const hasSubsections =
      Array.isArray(section["sub-sections"]) &&
      section["sub-sections"].length > 0;

    let allQuestions = [];

    if (hasSubsections) {
      allQuestions = section["sub-sections"].flatMap((sub, subIdx) =>
        (sub["sub-items"] ?? []).map((q, qIdx) => ({
          ...q,
          key: `${sectionIndex}-${subIdx}-${qIdx}`,
          subSectionTitle: sub.item,
        })),
      );
    } else {
      allQuestions = (section.item ?? []).map((q, qIdx) => ({
        ...q,
        key: `${sectionIndex}-${qIdx}`,
      }));
    }

    const content = allQuestions.map((q) => {
      const answer = allAnswers[q.key];
      const gradeValue = answer?.grade;

      const rating =
        gradeValue && gradeValue !== "N/A" ? Number(gradeValue) : null;

      const entry = {
        section: section.section,
        name: q.name,
        category: q.category,
        rating,
        remarks: answer?.note ?? "",
      };

      if (q.subSectionTitle) {
        entry["sub-sections"] = q.subSectionTitle;
      }

      return entry;
    });

    const image = allQuestions.map((q) => {
      const photo = allAnswers[q.key]?.photo;
      return photo ? [photo] : [];
    });

    // Get existing batch number from the section data
    let batchNo = "";

    allQuestions.forEach((q) => {
      if (q.answer?.batch_no) {
        batchNo = q.answer.batch_no;
      }
    });

    return {
      copy_id: String(checklistData.id),
      content,
      image,
      is_completed: 1,
      batch_no: batchNo,
    };
  };

  const submitOneSection = async (section, index) => {
    setSubmissionStatus((prev) => ({
      ...prev,
      [section.originalIndex]: "submitting",
    }));

    try {
      const payload = buildSectionPayload(section);

      const formData = new FormData();
      appendFormData(formData, payload);

      await submitSection(formData).unwrap();

      setSubmissionStatus((prev) => ({
        ...prev,
        [section.originalIndex]: "success",
      }));

      return { success: true };
    } catch (error) {
      setSubmissionStatus((prev) => ({
        ...prev,
        [section.originalIndex]: "error",
      }));

      return {
        success: false,
        error: error?.data?.message ?? "Failed to submit section.",
      };
    }
  };

  const handleSubmitAll = async () => {
    setIsSubmittingAll(true);
    setFailedSectionIndex(null);

    const sectionsToSubmit = [...mySections];
    try {
      for (let i = 0; i < sectionsToSubmit.length; i++) {
        const section = sectionsToSubmit[i];

        if (
          section.is_answered === 1 ||
          section.is_answered === true ||
          section.is_answered === "1" ||
          submissionStatus[section.originalIndex] === "success"
        ) {
          continue;
        }

        const result = await submitOneSection(section, i);

        if (!result.success) {
          appToast.error(
            "Submission Failed",
            `${section.section}: ${result.error}. Please review and try again.`,
          );
          setFailedSectionIndex(i);
          setCurrentStep(i);
          return;
        }
      }

      // await refetch();
      appToast.success(
        "Checklist Submitted",
        "All assigned sections have been submitted successfully.",
      );
      navigate(-1);
    } catch (error) {
      appToast.error(
        "Submission Failed",
        error?.data?.message ||
          "An unexpected error occurred while submitting the checklist.",
      );
    } finally {
      setIsSubmittingAll(false);
    }
  };

  const handleRetryFromFailed = () => {
    if (failedSectionIndex !== null) {
      handleSubmitAll();
    }
  };

  const allSectionsGraded = mySections.every((section) => {
    const sectionIndex = section.originalIndex;

    const hasSubsections =
      Array.isArray(section["sub-sections"]) &&
      section["sub-sections"].length > 0;

    const questions = hasSubsections
      ? section["sub-sections"].flatMap((sub, subIdx) =>
          (sub["sub-items"] ?? []).map((q, qIdx) => ({
            key: `${sectionIndex}-${subIdx}-${qIdx}`,
          })),
        )
      : (section.item ?? []).map((q, qIdx) => ({
          key: `${sectionIndex}-${qIdx}`,
        }));

    return questions.every((q) => Boolean(allAnswers[q.key]?.grade));
  });

  const currentSectionAnswers = Object.fromEntries(
    Object.entries(allAnswers)
      .filter(([key]) => key.startsWith(`${currentSection.originalIndex}-`))
      .map(([key, value]) => [
        key.replace(`${currentSection.originalIndex}-`, ""),
        value,
      ]),
  );

  // const allAnswered = response?.data?.checklist?.every(
  //   (section) => section.is_answered === 1 || section.is_answered === true,
  // );
  //
  const allAnswered =
    mySections.length > 0 &&
    mySections.every(
      (section) =>
        section.is_answered === 1 ||
        section.is_answered === true ||
        section.is_answered === "1",
    );

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto pb-20">
      <div className="flex items-center w-full gap-2">
        <Button variant="ghost" size="xl" onClick={() => navigate(-1)}>
          <ChevronLeft className="size-full" />
        </Button>
        <div className="flex-1">
          <div className="flex flex-row gap-2">
            <Badge variant="outline">
              <Clock4 /> Time in: 10:30
            </Badge>
            <Badge variant="outline" className="border border-dashed">
              <Clock4 /> Time out: 10:30
            </Badge>
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold">{checklistData.title}</h1>
              <p className="text-sm text-muted-foreground capitalize">
                Supplier: {info.supplier}
              </p>
            </div>
            <div>
              <p className="text-xl text-muted-foreground">
                {checklistData?.information?.reference_no}
              </p>
            </div>
          </div>
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
        <div>
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="flex items-center justify-center gap-2">
              {mySections.map((section, i) => {
                const status = submissionStatus[section.originalIndex];

                return (
                  <div
                    key={section.originalIndex}
                    className={`
                      h-2 w-2 rounded-full
                      ${status === "success"
                        ? "bg-green-500"
                        : status === "error"
                          ? "bg-destructive"
                          : i === currentStep
                            ? "bg-primary"
                            : "bg-muted"
                      }
                    `}
                  />
                );
              })}
            </div>

            {/* <p className="text-sm text-muted-foreground">
              Section {currentStep + 1} of {mySections.length}
            </p>*/}
          </div>

          <AnsweredSectionForm
            // key={currentSection.originalIndex}
            ref={(el) => {
              sectionRefs.current[currentSection.originalIndex] = el;
            }}
            checklistId={checklistData.id}
            section={currentSection}
            sectionIndex={currentSection.originalIndex}
            onAnswersChange={handleSectionAnswersChange(
              currentSection.originalIndex,
            )}
            answers={currentSectionAnswers}
          />

          <div className="flex justify-start gap-4 mt-4">
              <Button
              className="shadow-sm"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0 || isSubmittingAll}
            >
              Previous
            </Button>
            {!isLastStep ? (
                <Button
                  className="shadow-sm"
                  onClick={handleNext}
                >
                  Next
                </Button>
            ) : failedSectionIndex !== null ? (
              <Button
                className="shadow-sm"
                onClick={handleRetryFromFailed}
                disabled={isSubmittingAll}
                variant="destructive"
              >
                {isSubmittingAll && (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                )}
                {isSubmittingAll ? "Retrying..." : "Retry Submission"}
              </Button>
            ) : (
              !allAnswered && (
                <Button
                  onClick={handleSubmitAll}
                  disabled={!allSectionsGraded || isSubmittingAll}
                >
                  {isSubmittingAll && (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  )}
                  {isSubmittingAll ? "Submitting..." : "Submit"}
                </Button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyChecklistAnswer;
