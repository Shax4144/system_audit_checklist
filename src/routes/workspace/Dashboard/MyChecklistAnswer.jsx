import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  // Clock4,
  Loader2,
  OctagonAlert,
  Save,
  Send,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { useSubmitSectionMutation } from "../../../features/checklist/submitSectionChecklist.api";
import { useFetchReportByIdQuery } from "../../../features/report/checklistSummaryReport.api";
import AnsweredSectionForm from "../../../components/checklist-forms/AnsweredSectionForm";
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

const isSectionSubmitted = (section) =>
  section?.is_answered === 1 ||
  section?.is_answered === true ||
  section?.is_answered === "1";

const isChecklistClosed = (checklist) =>
  checklist?.is_closed === 1 ||
  checklist?.is_closed === true ||
  checklist?.is_closed === "1";

const getSectionQuestions = (section) => {
  const sectionIndex = section.originalIndex;

  const hasSubsections =
    Array.isArray(section["sub-sections"]) &&
    section["sub-sections"].length > 0;

  if (hasSubsections) {
    return section["sub-sections"].flatMap((sub, subIdx) =>
      (sub["sub-items"] ?? []).map((question, qIdx) => ({
        ...question,
        answerKey: `${sectionIndex}-${subIdx}-${qIdx}`,
        subSectionTitle: sub.item,
      })),
    );
  }

  return (section.item ?? []).map((question, qIdx) => ({
    ...question,
    answerKey: `${sectionIndex}-${qIdx}`,
  }));
};

const toRoman = (num) => {
  const roman = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];

  let result = "";

  for (const [value, symbol] of roman) {
    while (num >= value) {
      result += symbol;
      num -= value;
    }
  }

  return result;
};

const MyChecklistAnswer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const currentUser = getStoredUser();

  const [allAnswers, setAllAnswers] = useState({});
  const [sectionActionState, setSectionActionState] = useState({});

  const [submitSection] = useSubmitSectionMutation();

  const {
    data: response,
    isFetching,
    isError,
    refetch,
  } = useFetchReportByIdQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  const checklistData = response?.data;

  /*
   * Load answers from the backend.
   *
   * Important:
   * We merge the backend answers into the existing local answers.
   *
   * Existing local answers win, which means:
   * - Section 1 can be saved
   * - Section 2 can contain unsaved answers
   * - Section 1 submission can refetch the report
   * - Section 2's unsaved answers remain in the UI
   */
  useEffect(() => {
    if (!checklistData?.checklist) return;

    const initialAnswers = {};

    checklistData.checklist.forEach((section, sectionIndex) => {
      const hasSubsections =
        Array.isArray(section["sub-sections"]) &&
        section["sub-sections"].length > 0;

      if (hasSubsections) {
        section["sub-sections"].forEach((sub, subIdx) => {
          (sub["sub-items"] ?? []).forEach((question, qIdx) => {
            if (question.answer) {
              initialAnswers[`${sectionIndex}-${subIdx}-${qIdx}`] = {
                grade: question.answer.rating?.toString() ?? "",
                note: question.answer.remarks ?? "",
                photo: question.answer.images?.[0] ?? null,
              };
            }
          });
        });
      } else {
        (section.item ?? []).forEach((question, qIdx) => {
          if (question.answer) {
            initialAnswers[`${sectionIndex}-${qIdx}`] = {
              grade: question.answer.rating?.toString() ?? "",
              note: question.answer.remarks ?? "",
              photo: question.answer.images?.[0] ?? null,
            };
          }
        });
      }
    });

    setAllAnswers((prev) => ({
      ...initialAnswers,
      ...prev,
    }));
  }, [checklistData]);

  const handleSectionAnswersChange =
    (sectionIndex) => (questionKey, value) => {
      setAllAnswers((prev) => ({
        ...prev,
        [`${sectionIndex}-${questionKey}`]: value,
      }));
    };

  /*
   * Build the payload for one section.
   *
   * isCompleted = false → Save Draft
   * isCompleted = true  → Submit
   */
  const buildSectionPayload = (section, isCompleted) => {
    const sectionIndex = section.originalIndex;
    const questions = getSectionQuestions(section);

    const content = questions.map((question) => {
      const answer = allAnswers[question.answerKey];
      const gradeValue = answer?.grade;

      const rating =
        gradeValue && gradeValue !== "N/A" ? Number(gradeValue) : null;

      const entry = {
        section: section.section,
        name: question.name,
        category: question.category,
        rating,
        remarks: answer?.note ?? "",
      };

      if (question.subSectionTitle) {
        entry["sub-sections"] = question.subSectionTitle;
      }

      return entry;
    });

    const image = questions.map((question) => {
      const photo = allAnswers[question.answerKey]?.photo;
      return photo ? [photo] : [];
    });

    let batchNo = "";

    questions.forEach((question) => {
      if (question.answer?.batch_no) {
        batchNo = question.answer.batch_no;
      }
    });

    return {
      copy_id: String(checklistData.id),
      content,
      image,
      is_completed: isCompleted ? 1 : 0,
      batch_no: batchNo,
    };
  };

  /*
   * Check whether every question in this section has a grade.
   *
   * N/A is also considered answered because it is a valid grade.
   */
  const isSectionFullyGraded = (section) => {
    const questions = getSectionQuestions(section);

    return (
      questions.length > 0 &&
      questions.every((question) => {
        const grade = allAnswers[question.answerKey]?.grade;
        return Boolean(grade);
      })
    );
  };
  
  const isSectionRemarksValid = (section, answers) => {
    const questions = getSectionQuestions(section);
  
    return questions.every((question) => {
      const answer = answers[question.answerKey];
      const grade = answer?.grade;
      const remarks = answer?.note?.trim() ?? "";
  
      // Ratings 1–4 require remarks
      if (["1", "2", "3", "4"].includes(String(grade))) {
        return remarks.length > 0;
      }
  
      // Rating 5 and N/A do not require remarks
      return true;
    });
  };

  /*
   * Save one section as draft.
   *
   * No refetch is performed here because the local state already contains
   * the latest answers. This also avoids unnecessarily refreshing other
   * sections while the user is working on them.
   */
  const handleSaveDraft = async (section) => {
    const sectionIndex = section.originalIndex;

    setSectionActionState((prev) => ({
      ...prev,
      [sectionIndex]: "saving",
    }));

    try {
      const payload = buildSectionPayload(section, false);

      const formData = new FormData();
      appendFormData(formData, payload);

      const response = await submitSection(formData).unwrap();

      setSectionActionState((prev) => ({
        ...prev,
        [sectionIndex]: "saved",
      }));

      appToast.success(
        "Draft saved",
        response?.message ?? `${section.section} has been saved as a draft.`,
      );
    } catch (error) {
      setSectionActionState((prev) => ({
        ...prev,
        [sectionIndex]: "error",
      }));

      appToast.error(
        "Save failed",
        error?.data?.message ??
          `Failed to save ${section.section} as a draft.`,
      );
    }
  };

  /*
   * Submit one section.
   *
   * The section must be completely graded before submission.
   */
  const handleSubmitSection = async (section) => {
    const sectionIndex = section.originalIndex;

    // Check all questions are graded first
    if (!isSectionFullyGraded(section)) {
      appToast.warning(
        "Incomplete section",
        "Please answer all items in this section before submitting.",
      );
      return;
    }

    // Ratings 1 - 4 require remarks
    if (!isSectionRemarksValid(section, allAnswers)) {
      appToast.warning(
        "Remarks required",
        "Please add remarks for all questions rated 4 or below before submitting this section.",
      );
      return;
    }

    setSectionActionState((prev) => ({
      ...prev,
      [sectionIndex]: "submitting",
    }));

    try {
      const payload = buildSectionPayload(section, true);

      const formData = new FormData();
      appendFormData(formData, payload);

      const response = await submitSection(formData).unwrap();

      setSectionActionState((prev) => ({
        ...prev,
        [sectionIndex]: "submitted",
      }));

      appToast.success(
        "Section submitted",
        response?.message ?? `${section.section} has been submitted.`,
      );

      /*
       * Refetch so:
       * - is_answered updates from the backend
       * - the submitted state is reflected by the server
       * - other sections remain intact because allAnswers is merged
       */
      await refetch();
    } catch (error) {
      setSectionActionState((prev) => ({
        ...prev,
        [sectionIndex]: "error",
      }));

      appToast.error(
        "Submission failed",
        error?.data?.message ??
          `Failed to submit ${section.section}.`,
      );
    }
  };

  /*
   * Loading state
   */
  if (isFetching || !checklistData) {
    return (
      <div className="flex flex-col gap-6 max-w-3xl mx-auto pb-20">
        {/* Header */}
        <div className="flex items-center w-full">
          <Button
            variant="ghost"
            size="xl"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="size-full" />
          </Button>

          <div className="flex-1">
            <div className="flex flex-row gap-2 mb-2">
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>

            <div className="flex flex-row justify-between gap-4">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-8 w-96" />
                <Skeleton className="h-5 w-56" />
              </div>

              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        </div>

        {/* Score */}
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

        {/* Section skeletons */}
        <div className="flex flex-col gap-5">
          {[0, 1, 2].map((sectionIndex) => (
            <div
              key={sectionIndex}
              className="rounded-xl border bg-card p-5"
            >
              <div className="flex items-center justify-between gap-4 mb-6">
                <Skeleton className="h-7 w-64" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>

              <div className="flex flex-col gap-5">
                {[0, 1, 2].map((questionIndex) => (
                  <div
                    key={questionIndex}
                    className="border-l-2 pl-4"
                  >
                    <Skeleton className="h-5 w-4/5 mb-3" />

                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-10 w-full rounded-md" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                <Skeleton className="h-10 w-28 rounded-md" />
                <Skeleton className="h-10 w-24 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /*
   * Error state
   */
  if (isError) {
    return (
      <p className="text-center text-destructive py-10">
        Failed to load checklist data.
      </p>
    );
  }

  const info = checklistData.information ?? {};

  /*
   * Only sections assigned to the logged-in user.
   */
  const mySections = (checklistData.checklist ?? [])
    .map((section, index) => ({
      ...section,
      originalIndex: index,
    }))
    .filter(
      (section) =>
        String(section.user_id) === String(currentUser.id),
    );

  /*
   * Questions for score/progress calculation.
   */
  const allMyQuestions = mySections.flatMap((section) =>
    getSectionQuestions(section),
  );

  const gradedQuestions = allMyQuestions.filter(
    (question) => allAnswers[question.answerKey]?.grade,
  );

  const numericGrades = gradedQuestions
    .map((question) => allAnswers[question.answerKey].grade)
    .filter((grade) => grade !== "N/A")
    .map(Number);

  const averageScore = numericGrades.length
    ? (
        numericGrades.reduce((sum, grade) => sum + grade, 0) /
        numericGrades.length
      ).toFixed(1)
    : "0.0";

  const totalItems = allMyQuestions.length;
  const ratedItems = gradedQuestions.length;

  const progressPercent = totalItems
    ? Math.round((ratedItems / totalItems) * 100)
    : 0;

  const submittedSections = mySections.filter((section) =>
    isSectionSubmitted(section),
  ).length;

  const checklistClosed = isChecklistClosed(checklistData);

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center w-full gap-2">
        <Button
          variant="ghost"
          size="xl"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="size-full" />
        </Button>

        <div className="flex-1">
          {/* <div className="flex flex-row gap-2 mb-2">
            <Badge variant="outline">
              <Clock4 />
              Time in: 10:30
            </Badge>

            <Badge
              variant="outline"
              className="border border-dashed"
            >
              <Clock4 />
              Time out: 10:30
            </Badge>
          </div>  */}

          <div className="flex flex-row justify-between gap-4">
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold">
                {checklistData.title}
              </h1>

              <p className="text-sm text-muted-foreground capitalize">
                Supplier: {info.supplier}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <p className="text-xl text-muted-foreground">
                {info.reference_no}
              </p>

              {checklistClosed && (
                <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                  <OctagonAlert />
                  <span>Closed</span>
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overall progress */}
      <div className="bg-card border border-border rounded-xl shadow-sm">
        <div className="flex flex-col p-7 gap-2">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col">
              <p className="text-md font-medium text-muted-foreground">
                Average Score
              </p>

              <p className="text-xs text-muted-foreground">
                {submittedSections} of {mySections.length} sections submitted
              </p>
            </div>

            <p className="text-lg font-semibold">
              {averageScore}/5
            </p>
          </div>

          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            {ratedItems} of {totalItems} items rated
          </p>
        </div>
      </div>

      {/* Assigned sections */}
      {mySections.length === 0 ? (
        <p className="text-sm text-muted-foreground py-10 text-center">
          You have no sections assigned in this checklist.
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {mySections.map((section) => {
            const sectionIndex = section.originalIndex;

            const actionState =
              sectionActionState[sectionIndex];

            const submitted = isSectionSubmitted(section);

            const fullyGraded = isSectionFullyGraded(section);

            /*
             * Give each section only its own answers.
             *
             * Example:
             * allAnswers:
             *
             * 0-0
             * 0-1
             * 1-0
             * 1-1
             *
             * Section 1 receives:
             * 0-0
             * 0-1
             */
            const sectionAnswers = Object.fromEntries(
              Object.entries(allAnswers)
                .filter(([key]) =>
                  key.startsWith(`${sectionIndex}-`),
                )
                .map(([key, value]) => [
                  key.replace(`${sectionIndex}-`, ""),
                  value,
                ]),
            );

            return (
              <div
                key={sectionIndex}
                className="rounded-xl border bg-card p-5 shadow-sm"
              >
                {/* Section header */}
                <div className="flex items-center justify-between gap-4 mb-5">
                  <h2 className="text-lg font-semibold">
                    <span className="mr-2 font-bold text-primary">
                      {toRoman(sectionIndex + 1)}.
                    </span>
                    {section.section}
                  </h2>

                  <div>
                    {submitted ? (
                      <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Submitted
                      </Badge>
                    ) : actionState === "saved" ? (
                      <Badge variant="outline">
                        Draft Saved
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-muted-foreground"
                      >
                        Draft
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Section form */}
                <AnsweredSectionForm
                  checklistId={checklistData.id}
                  section={section}
                  sectionIndex={sectionIndex}
                  onAnswersChange={handleSectionAnswersChange(
                    sectionIndex,
                  )}
                  answers={sectionAnswers}
                  isClosed={checklistClosed || submitted}
                />

                {/* Section actions */}
                {!submitted ? (
                  <>
                    <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                      {/* Save Draft */}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSaveDraft(section)}
                        disabled={
                          checklistClosed ||
                          actionState === "saving" ||
                          actionState === "submitting"
                        }
                      >
                        {actionState === "saving" ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Draft
                          </>
                        )}
                      </Button>

                      {/* Submit */}
                      <Button
                        type="button"
                        onClick={() => handleSubmitSection(section)}
                        disabled={
                          checklistClosed ||
                          !fullyGraded ||
                          actionState === "saving" ||
                          actionState === "submitting"
                        }
                      >
                        {actionState === "submitting" ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Submit
                          </>
                        )}
                      </Button>
                    </div>

                    {!fullyGraded && (
                      <p className="text-xs text-muted-foreground text-right mt-2">
                        Complete all items in this section before
                        submitting.
                      </p>
                    )}
                  </>
                ) : (
                  <div className="flex justify-end mt-6 pt-4 border-t">
                    <Badge
                      variant="outline"
                      className="px-3 py-2"
                    >
                      Section submitted
                    </Badge>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyChecklistAnswer;
