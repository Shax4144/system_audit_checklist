import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, OctagonAlert, FilePlus2 } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useFetchReportByIdQuery } from "../../../features/report/checklistSummaryReport.api";
import AuditReportTab from "./AuditReportTab";
import ChecklistResultsTab from "./ChecklistResultsTab";

const isChecklistFullyAnswered = (sections = []) =>
  sections.length > 0 && sections.every((s) => s.is_answered === 1);

const isChecklistClosed = (report) => report?.is_closed === true;

const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const reportTab = searchParams.get("tab") ?? "ongoing";

  const isConsolidated = reportTab === "consolidated";
  const isGenerated = reportTab === "generated";

  const [reportDetailTab, setReportDetailTab] = useState("results");
  const { data: response, isFetching, isError } = useFetchReportByIdQuery(id);
  const report = response?.data;

  if (isFetching || !report) {
    return (
      <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-20">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="xl" onClick={() => navigate(-1)}>
            <ChevronLeft className="size-xl" />
          </Button>
          <div className="w-full">
            <Skeleton className="w-md h-8 mb-2" />
            <Skeleton className="w-xs h-4" />
          </div>
        </div>

        <Tabs value={reportDetailTab} onValueChange={setReportDetailTab}>
          <div className="flex sticky top-0 z-10 bg-transparent pb-2 justify-end items-center">
            <TabsList className="gap-1">
              <TabsTrigger disabled value="results">
                Checklist Results
              </TabsTrigger>
              <TabsTrigger disabled value="audit-report">
                Audit Report
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Supplier / audit info skeleton (matches ChecklistResultsTab container) */}
          <TabsContent value="results">
            <div className="rounded-xl border bg-card p-5 grid grid-cols-2 gap-4 text-sm">
              <div>
                <Skeleton className="h-3 w-28 mb-2" />
                <Skeleton className="h-5 w-48" />
              </div>
              <div>
                <Skeleton className="h-3 w-28 mb-2" />
                <Skeleton className="h-5 w-48" />
              </div>
              <div>
                <Skeleton className="h-3 w-28 mb-2" />
                <Skeleton className="h-5 w-48" />
              </div>
              <div>
                <Skeleton className="h-3 w-28 mb-2" />
                <Skeleton className="h-5 w-48" />
              </div>
              <div>
                <Skeleton className="h-3 w-28 mb-2" />
                <Skeleton className="h-5 w-48" />
              </div>
              <div>
                <Skeleton className="h-3 w-28 mb-2" />
                <Skeleton className="h-5 w-48" />
              </div>
            </div>

            {/* Per-section skeleton cards */}
            <div className="flex flex-col gap-4 mt-4">
              {[0, 1, 2].map((s) => (
                <div key={s} className="rounded-xl border bg-card p-5">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <Skeleton className="h-6 w-1/3" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </div>
                  {/* subsection / items skeleton */}
                  {[0, 1].map((sub) => (
                    <div key={sub} className="border-l-2 pl-4 mb-4">
                      <Skeleton className="h-5 w-1/2 mb-3" />
                      {[0, 1, 2].map((r) => (
                        <div
                          key={r}
                          className="flex items-center justify-between gap-4 py-2 border-b last:border-0 text-sm"
                        >
                          <div className="flex-1">
                            <Skeleton className="h-4 w-3/4" />
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <Skeleton className="h-4 w-12" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="audit-report">
            <Skeleton className="w-full h-64" />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-destructive py-10">
        Failed to load the data.
      </p>
    );
  }

  const info = report.information ?? {};
  const allAnswered = isChecklistFullyAnswered(report.checklist);
  const isClosed = isChecklistClosed(report);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-20">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="xl" onClick={() => navigate(-1)}>
          <ChevronLeft className="size-xl" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">{report.title}</h1>
          {/* <p className="text-sm text-muted-foreground">{info.supplier}</p>*/}
          <p className="text-sm text-muted-foreground">
            Reference Number: {info.reference_no}
          </p>
          {isClosed && (
            <Badge className="bg-red-100  text-red-700  dark:bg-red-900  dark:text-red-300">
              <OctagonAlert /> <p className="text-sm">Closed</p>
            </Badge>
          )}
        </div>
      </div>

      <Tabs value={reportDetailTab} onValueChange={setReportDetailTab}>
        <div className="flex flex-col sticky top-0 z-10 bg-transparent pb-2 items-end">
          <div className="flex items-center justify-between gap-3">
            <TabsList className="gap-1">
              <TabsTrigger
                value="results"
                className="
                  border
                  border-border
                  transition-colors

                  data-[state=active]:bg-primary
                  data-[state=active]:text-primary-foreground
                  data-[state=active]:border-primary

                  data-[state=inactive]:bg-transparent
                  data-[state=inactive]:text-muted-foreground

                  data-[state=inactive]:hover:bg-muted
                  data-[state=inactive]:hover:text-foreground
                  data-[state=inactive]:hover:border-primary/50

                  dark:data-[state=inactive]:hover:bg-muted/60
                  dark:data-[state=inactive]:hover:text-foreground
                  dark:data-[state=inactive]:hover:border-primary/60
                "
              >
                Checklist Results
              </TabsTrigger>

              {isGenerated && (
                <TabsTrigger
                  disabled={!allAnswered || isClosed}
                  value="audit-report"
                  className="
                    border
                    border-border
                    transition-colors
                  
                    data-[state=active]:bg-primary
                    data-[state=active]:text-primary-foreground
                    data-[state=active]:border-primary
                  
                    data-[state=inactive]:bg-transparent
                    data-[state=inactive]:text-muted-foreground
                  
                    data-[state=inactive]:hover:bg-muted
                    data-[state=inactive]:hover:text-foreground
                    data-[state=inactive]:hover:border-primary/50
                  
                    dark:data-[state=inactive]:hover:bg-muted/60
                    dark:data-[state=inactive]:hover:text-foreground
                    dark:data-[state=inactive]:hover:border-primary/60
                  "
                >
                  Audit Report
                </TabsTrigger>
              )}
            </TabsList>

            {isConsolidated && (
              <Button
                disabled={!allAnswered || isClosed}
                onClick={() => setReportDetailTab("audit-report")}
                className={
                  reportDetailTab === "audit-report"
                    ? `
                        bg-primary
                        text-primary-foreground
                        border-primary
                        hover:bg-primary/90
                      `
                    : `
                        bg-transparent
                        text-muted-foreground
                        border-border
                        hover:bg-muted
                        hover:text-foreground
                      `
                }
              >
                <FilePlus2 className="h-4 w-4" />
                Create Report
              </Button>
            )}
          </div>
          {!allAnswered && (
            <p className="text-xs text-muted-foreground mt-2">
              All sections must be submitted before the Audit Report can be
              filled out.
            </p>
          )}
        </div>

        <TabsContent
          className="data-[state=inactive]:hidden"
          value="results"
          forceMount
        >
          <ChecklistResultsTab report={report} />
        </TabsContent>

        <TabsContent
          className="data-[state=inactive]:hidden"
          value="audit-report"
          forceMount
        >
          <AuditReportTab report={report} mode={reportTab} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportDetail;
