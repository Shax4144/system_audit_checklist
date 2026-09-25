
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import UsersDropdown from "../../../components/dropdown/UserAccountsDropdown";
import ChecklistInformation from "../../../components/editable-dropdown/ChecklistInformation";
import { appToast } from "../../../components/Toast";

import {
  useFetchChecklistsQuery,
  usePublishChecklistMutation,
} from "../../../features/checklist/checklist.api";

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

const ChecklistAssignmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showBackToTop, setShowBacktoTop] = useState(false);
  const [sectionAssignments, setSectionAssignments] = useState({});
  const [checklistInfo, setChecklistInfo] = useState(null);

  const { data: checklistsResponse, isFetching } =
    useFetchChecklistsQuery({
      pagination: "none",
    });

  const checklistData = checklistsResponse?.data?.find(
    (c) => String(c.id) === String(id),
  );

  const [publishAssignment, { isLoading: isPublishing }] =
    usePublishChecklistMutation();

  /*
   * Initialize assignment state
   */
  useEffect(() => {
    if (!checklistData) return;

    const initial = {};

    (checklistData.checklist ?? []).forEach((_, index) => {
      initial[index] = "";
    });

    setSectionAssignments(initial);
  }, [checklistData]);

  /*
   * Back-to-top visibility
   */
  useEffect(() => {
    const scrollContainer = document.querySelector("main");

    if (!scrollContainer) return;

    const handleScroll = () => {
      setShowBacktoTop(scrollContainer.scrollTop > 300);
    };

    handleScroll();

    scrollContainer.addEventListener("scroll", handleScroll);

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleAssignUser = (sectionIndex, userId) => {
    setSectionAssignments((prev) => ({
      ...prev,
      [sectionIndex]: userId,
    }));
  };

  const handleBackToTop = () => {
    const scrollContainer = document.querySelector("main");

    scrollContainer?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
   * Required checklist information
   */
  const allRequiredChecklistInfoFilled =
    checklistInfo?.supplier &&
    checklistInfo?.auditDate &&
    checklistInfo?.contactPerson &&
    checklistInfo?.products?.length > 0 &&
    checklistInfo?.location &&
    checklistInfo?.auditScope &&
    checklistInfo?.auditObjectives &&
    checklistInfo?.auditCriteria?.length > 0 &&
    checklistInfo?.auditLanguage;

  /*
   * Every section must have an assigned user
   */
  const allSectionsAssigned =
    checklistData &&
    checklistData.checklist.length > 0 &&
    checklistData.checklist.every(
      (_, index) => sectionAssignments[index],
    );

  const canPublish =
    allRequiredChecklistInfoFilled && allSectionsAssigned;

  /*
   * Build assignment payload
   */
  const buildAssignmentPayload = () => ({
    id: Number(id),
    checklist_id: Number(id),
    title: checklistData.title,
    information: checklistInfo,

    checklist: checklistData.checklist.map((section, index) => {
      const hasSubsections =
        Array.isArray(section["sub-sections"]) &&
        section["sub-sections"].length > 0;

      const user_id = Number(sectionAssignments[index]);

      if (hasSubsections) {
        return {
          section: section.section,
          "sub-sections": section["sub-sections"],
          user_id,
          is_answered: 0,
        };
      }

      return {
        section: section.section,
        item: section.item,
        user_id,
        is_answered: 0,
      };
    }),
  });

  /*
   * Publish checklist
   */
  const handlePublish = async () => {
    try {
      const payload = buildAssignmentPayload();

      const response = await publishAssignment(payload).unwrap();

      appToast.success(
        "Checklist published",
        response?.message ??
          "Assignments have been created for each section.",
      );

      navigate("/workspace/checklist-assignment");
    } catch (err) {
      appToast.error(
        "Error",
        err?.data?.message ?? "Failed to publish checklist.",
      );

      console.error(err);
    }
  };

  /*
   * Loading
   */
  if (isFetching || !checklistData) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Loading checklist...
      </p>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 pb-20">
      {/* Header */}
      <div className="flex w-full items-center gap-3">
        <Button
          variant="ghost"
          size="xl"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="size-full" />
        </Button>

        <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-sm font-semibold sm:text-2xl">
              {checklistData.title}
            </h1>

            <p className="text-xs text-muted-foreground sm:text-sm">
              Review the checklist and assign a user to each section.
            </p>
          </div>

          {/* Desktop publish */}
          <div className="hidden shrink-0 sm:block">
            <Button
              onClick={handlePublish}
              disabled={!canPublish || isPublishing}
            >
              {isPublishing && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile publish */}
      <div className="flex justify-end sm:hidden">
        <Button
          onClick={handlePublish}
          disabled={!canPublish || isPublishing}
        >
          {isPublishing && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Publish
        </Button>
      </div>

      {/* Checklist information */}
      <ChecklistInformation
        value={checklistInfo}
        onChange={setChecklistInfo}
      />

      {/* Sections */}
      <div className="flex flex-col gap-5">
        {(checklistData.checklist ?? []).map(
          (section, sIndex) => {
            const hasSubsections =
              Array.isArray(section["sub-sections"]) &&
              section["sub-sections"].length > 0;

            const sectionNumber = sIndex + 1;

            return (
              <div
                key={sIndex}
                className="rounded-xl border bg-card p-5 shadow-sm"
              >
                {/* Section title */}
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-lg font-semibold">
                    <span className="mr-2 font-bold text-primary">
                      {toRoman(sectionNumber)}.
                    </span>

                    {section.section}
                  </h2>

                  {sectionAssignments[sIndex] && (
                    <Badge className="flex shrink-0 items-center gap-1 bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                      Assigned
                    </Badge>
                  )}
                </div>

                {/* Checklist content */}
                {hasSubsections ? (
                  <div className="mt-4 flex flex-col gap-4">
                    {section["sub-sections"].map(
                      (sub, subIndex) => (
                        <div
                          key={subIndex}
                          className="
                            rounded-lg
                            border
                            border-border
                            bg-background/30
                            p-4
                            shadow-sm
                          "
                        >
                          {/* Sub-section title */}
                          <div className="mb-4 flex items-center gap-2">
                            <span className="h-5 w-1 shrink-0 rounded-full bg-primary" />

                            <span className="text-sm font-semibold text-primary">
                              {toRoman(sectionNumber)}
                              .
                              {String.fromCharCode(
                                97 + subIndex,
                              )}
                            </span>

                            <h3 className="text-sm font-semibold text-foreground">
                              {sub.item}
                            </h3>
                          </div>

                          {/* Questions */}
                          <div className="pl-3">
                            {(sub["sub-items"] ?? []).map(
                              (question, qIndex) => (
                                <PreviewQuestion
                                  key={qIndex}
                                  question={question}
                                  questionNumber={qIndex + 1}
                                />
                              ),
                            )}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  /* Questions without subsection */
                  <div
                    className="
                      mt-4
                      rounded-lg
                      border
                      border-border
                      bg-background/30
                      p-4
                      shadow-sm
                    "
                  >
                    <div className="flex flex-col">
                      {(section.item ?? []).map(
                        (question, qIndex) => (
                          <PreviewQuestion
                            key={qIndex}
                            question={question}
                            questionNumber={qIndex + 1}
                          />
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Assignment control */}
                <div className="mt-5 border-t pt-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">
                        Assigned User
                      </label>

                      {sectionAssignments[sIndex] && (
                        <span className="text-xs text-muted-foreground">
                          Ready to publish
                        </span>
                      )}
                    </div>

                    <UsersDropdown
                      value={sectionAssignments[sIndex] ?? ""}
                      onChange={(value) =>
                        handleAssignUser(sIndex, value)
                      }
                      open={true}
                      triggerClassName="w-full"
                    />
                  </div>
                </div>
              </div>
            );
          },
        )}
      </div>

      {/* Back to top */}
      {showBackToTop && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            onClick={handleBackToTop}
            className="
              group
              rounded-full
              border
              border-background
              bg-primary
              shadow-lg
              transition-colors
              hover:bg-[#0F4C81]
              dark:bg-primary
              dark:hover:bg-[#0F4C81]
            "
            title="Back to top"
          >
            <ArrowUp
              className="
                h-4 w-4
                text-accent
                transition-colors
                group-hover:text-white
                dark:text-foreground
              "
            />
          </Button>
        </div>
      )}

      {/* Bottom publish */}
      <div className="flex justify-end border-t pt-4">
        <Button
          onClick={handlePublish}
          disabled={!canPublish || isPublishing}
        >
          {isPublishing && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Publish
        </Button>
      </div>
    </div>
  );
};

/*
 * Read-only question preview
 *
 * This intentionally does NOT contain:
 * - Remarks
 * - Camera
 * - File upload
 * - Answer selection
 */
const PreviewQuestion = ({
  question,
  questionNumber,
}) => {
  const gradeOptions = ["1", "2", "3", "4", "5", "N/A"];

  return (
    <div className="flex flex-col gap-2 border-b py-3 last:border-0">
      {/* Question + category + rating */}
      <div className="flex items-start justify-between gap-4">
        {/* Question number + text */}
        <div className="flex min-w-0 flex-1 items-start gap-2">
          <span className="shrink-0 text-sm font-semibold text-primary">
            {questionNumber}.
          </span>

          <p className="text-sm font-medium leading-relaxed">
            {question.name}
          </p>
        </div>

        {/* Category + ratings */}
        <div className="hidden shrink-0 items-center gap-2 md:flex">
          {question.category && (
            <Badge
              variant="outline"
              className="text-xs"
            >
              {question.category}
            </Badge>
          )}

          <div className="flex gap-1">
            {gradeOptions.map((opt) => (
              <div
                key={opt}
                className="
                  flex
                  h-10
                  min-w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  bg-muted/50
                  px-1.5
                  text-xs
                  font-medium
                  text-muted-foreground
                "
              >
                {opt}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile category + rating */}
      <div className="flex items-center justify-end gap-2 md:hidden">
        {question.category && (
          <Badge
            variant="outline"
            className="text-xs"
          >
            {question.category}
          </Badge>
        )}

        <div className="flex gap-1">
          {gradeOptions.map((opt) => (
            <div
              key={opt}
              className="
                flex
                h-8
                min-w-8
                items-center
                justify-center
                rounded-full
                border
                bg-muted/50
                px-1.5
                text-[11px]
                font-medium
                text-muted-foreground
              "
            >
              {opt}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChecklistAssignmentDetail;
