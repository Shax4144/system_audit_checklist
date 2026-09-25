import { useRef } from "react";
import {
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  ChevronLeft,
  Camera,
  EyeOff,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useFetchChecklistsQuery } from "../../features/checklist/checklist.api";

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

const FormPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  /*
   * This comes from FormBuilder's navigate state.
   *
   * It represents the CURRENT unsaved builder state.
   */
  const previewChecklist =
    location.state?.checklist ?? null;

  const builderForm =
    location.state?.builderForm ?? null;

  /*
   * Only fetch from the backend when there is
   * no current checklist passed through navigation.
   *
   * This prevents the backend version from
   * overwriting the user's unsaved changes.
   */
  const {
    data: checklistsResponse,
    isFetching,
  } = useFetchChecklistsQuery(
    {
      pagination: "none",
    },
    {
      skip: Boolean(previewChecklist),
    },
  );

  /*
   * Priority:
   *
   * 1. Current unsaved builder data
   * 2. Backend data
   */
  const checklistData =
    previewChecklist ??
    checklistsResponse?.data?.find(
      (c) =>
        String(c.id) === String(id),
    );

  /*
   * Only show loading when we actually
   * need the backend.
   */
  if (
    !previewChecklist &&
    isFetching
  ) {
    return (
      <p className="text-sm text-muted-foreground py-10 text-center">
        Loading preview...
      </p>
    );
  }

  if (!checklistData) {
    return (
      <p className="text-sm text-destructive py-10 text-center">
        Checklist not found.
      </p>
    );
  }

  /*
   * Remove /preview from the current URL
   * and return to the builder.
   */
  const handleGoBack = () => {
    const builderPath =
      location.pathname.replace(
        "/preview",
        "",
      );
  
    navigate(builderPath, {
      state: {
        restoredForm: builderForm,
      },
    });
  };

  const handleBack = () => {
    navigate("/workspace/checklist");
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto pb-20">
      {/* Header */}
      <div className="flex w-full items-center gap-3">
        <Button
          variant="ghost"
          size="xl"
          onClick={handleBack}
        >
          <ChevronLeft className="size-full" />
        </Button>

        <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
          <div className="min-w-0">
            <h1 className="text-sm sm:text-2xl font-semibold">
              {checklistData.title}
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground">
              Preview mode — read only
            </p>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                asChild
              >
                <Button
                  variant="outline"
                  className="shrink-0"
                  onClick={
                    handleGoBack
                  }
                >
                  <EyeOff className="h-4 w-4" />

                  <span className="hidden sm:inline">
                    Close Preview
                  </span>
                </Button>
              </TooltipTrigger>

              <TooltipContent className="sm:hidden">
                Close Preview
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-5">
        {(checklistData.checklist ??
          []).map(
          (section, sIndex) => {
            const hasSubsections =
              Array.isArray(
                section[
                  "sub-sections"
                ],
              ) &&
              section[
                "sub-sections"
              ].length > 0;

            const sectionNumber =
              sIndex + 1;

            return (
              <div
                key={sIndex}
                className="rounded-xl border bg-card p-5 shadow-sm"
              >
                {/* Section title */}
                <h2 className="text-lg font-semibold">
                  <span className="mr-2 font-bold text-primary">
                    {toRoman(
                      sectionNumber,
                    )}
                    .
                  </span>

                  {section.section}
                </h2>

                {/* With subsections */}
                {hasSubsections ? (
                  <div className="flex flex-col gap-4 mt-4">
                    {section[
                      "sub-sections"
                    ].map(
                      (
                        sub,
                        subIdx,
                      ) => (
                        <div
                          key={
                            subIdx
                          }
                          className="
                            rounded-lg
                            border
                            border-border
                            bg-background/30
                            p-4
                            shadow-sm
                          "
                        >
                          {/* Sub-section header */}
                          <div className="flex items-center gap-2 mb-4">
                            <span className="h-5 w-1 rounded-full bg-primary shrink-0" />

                            <span className="text-sm font-semibold text-primary">
                              {
                                sectionNumber
                              }
                              .
                              {String.fromCharCode(
                                97 +
                                  subIdx,
                              )}
                            </span>

                            <h3 className="text-sm font-semibold text-foreground">
                              {
                                sub.item
                              }
                            </h3>
                          </div>

                          {/* Questions */}
                          <div className="pl-3 flex flex-col">
                            {(
                              sub[
                                "sub-items"
                              ] ??
                              []
                            ).map(
                              (
                                q,
                                qIndex,
                              ) => (
                                <PreviewQuestion
                                  key={
                                    qIndex
                                  }
                                  question={
                                    q
                                  }
                                  questionNumber={
                                    qIndex +
                                    1
                                  }
                                />
                              ),
                            )}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  /* No subsections */
                  <div className="mt-4 rounded-lg border border-border bg-background/30 p-4 shadow-sm">
                    <div className="flex flex-col">
                      {(
                        section.item ??
                        []
                      ).map(
                        (
                          q,
                          qIndex,
                        ) => (
                          <PreviewQuestion
                            key={
                              qIndex
                            }
                            question={
                              q
                            }
                            questionNumber={
                              qIndex +
                              1
                            }
                          />
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          },
        )}
      </div>
    </div>
  );
};

const PreviewQuestion = ({
  question,
  questionNumber,
}) => {
  const fileInputRef =
    useRef(null);

  const gradeOptions = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "N/A",
  ];

  return (
    <div className="flex flex-col gap-2 py-4 border-b last:border-0">
      {/* Question */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <span className="shrink-0 text-sm font-semibold text-primary">
            {questionNumber}.
          </span>

          <p className="text-sm font-medium leading-relaxed">
            {question.name}
          </p>
        </div>

        {/* Category + rating preview */}
        <div className="flex items-center gap-2 shrink-0">
          {question.category && (
            <Badge
              variant="outline"
              className="text-xs"
            >
              {question.category}
            </Badge>
          )}

          <div className="flex gap-1">
            {gradeOptions.map(
              (opt) => (
                <div
                  key={opt}
                  className="
                    h-10
                    min-w-10
                    px-1.5
                    rounded-full
                    text-xs
                    font-medium
                    border
                    bg-muted/50
                    text-muted-foreground
                    flex
                    items-center
                    justify-center
                  "
                >
                  {opt}
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Remarks + camera */}
      <div className="flex items-start gap-2">
        <Textarea
          placeholder="Remarks"
          className="resize-none text-sm flex-1"
          rows={2}
          disabled
        />

        <div className="flex flex-col items-center gap-1 shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            disabled
          />

          <Button
            type="button"
            variant="outline"
            size="xl"
            onClick={() =>
              fileInputRef.current?.click()
            }
            disabled
          >
            <Camera className="h-8 w-8" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormPreview;
