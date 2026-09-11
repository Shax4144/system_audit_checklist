// routes/workspace/ChecklistAssignment/AssignmentDashboard.jsx
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFetchChecklistsQuery } from "../../../features/checklist/checklist.api";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_LABEL = {
  draft: "DRAFT",
  ready: "READY",
  published: "PUBLISHED",
  archived: "ARCHIVED",
};

const STATUS_STYLES = {
  draft:
    "text-xs xl:text-sm lg:text-xs bg-slate-300 text-slate-700 border-slate-200 dark:bg-slate-900/40 dark:text-slate-300 dark:border-slate-700",
  ready:
    "text-xs xl:text-sm lg:text-xs bg-blue-300 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700",
  published:
    "text-xs xl:text-sm lg:text-xs bg-green-300 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700",
  archived:
    "text-xs xl:text-sm lg:text-xs bg-amber-300 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700",
};

const gradients = ["from-orange-500/95 to-amber-500/35"];

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const ChecklistAssignmentDashboard = () => {
  const navigate = useNavigate();

  const {
    data: checklistsResponse,
    error,
    isFetching,
    isError,
  } = useFetchChecklistsQuery({
    pagination: "none",
  });

  const allChecklists = checklistsResponse?.data ?? [];

  // Only show DRAFT checklists — available for assignment
  const draftChecklists = allChecklists.filter(
    (c) => (c.status ?? "draft") === "draft",
  );

  const isNoChecklists = isError && error?.status === 404;

  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h1 className="text-2xl font-semibold">Checklist Assignment</h1>
        <p className="text-sm text-muted-foreground">
          Assign users to checklist sections and publish for completion.
        </p>
      </div>

      {isFetching ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-2">
          {/* Mobile loading state */}
          <div className="sm:hidden w-full rounded-xl border bg-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Skeleton className="h-5 w-5 rounded" />
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>

            <Skeleton className="h-5 w-14 rounded-full" />
          </div>

          {Array.from({ length: 1 }).map((_, index) => (
            <div
              key={index}
              className="hidden sm:flex max-w-64 aspect-square rounded-xl border bg-card p-4 flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="w-8 h-8 xl:w-15 xl:h-15 lg:w-8 lg:h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <FileText className="h-6 w-6 xl:h-8 xl:w-8 lg:h-4 lg:w-4 text-muted-foreground" />
                </div>
                <Skeleton className="h-5 w-14 bg-muted" />
              </div>

              <div className="flex flex-col gap-1">
                <Skeleton className="h-8 w-full bg-muted" />
                <Skeleton className="h-6 w-full bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : isError && error?.status !== 404 ? (
        <p className="text-sm text-destructive py-10 text-center">
          Failed to load checklists.
        </p>
      ) : draftChecklists.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          No draft checklists available for assignment.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-2">
          {draftChecklists.map((checklist, index) => (
            <div key={checklist.id}>
              {/* Mobile list item */}
              <button
                onClick={() => navigate(`${checklist.id}`)}
                className={`sm:hidden w-full rounded-xl border bg-linear-to-br ${gradients[index % gradients.length]} p-4 flex items-center gap-3 text-left hover:border-primary hover:shadow-sm transition-all`}
              >
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm line-clamp-2">
                    {checklist.title}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Created:{" "}
                      <strong>{formatDate(checklist.created_at)}</strong>
                    </p>

                    <p className="text-[10px] text-muted-foreground mt-1">
                      Updated:{" "}
                      <strong>{formatDate(checklist.updated_at)}</strong>
                    </p>
                  </div>
                </div>

                <Badge
                  className={
                    STATUS_STYLES[checklist.status] ?? STATUS_STYLES.ready
                  }
                >
                  {STATUS_LABEL[checklist.status] ?? STATUS_LABEL.ready}
                </Badge>
              </button>

              {/* Desktop / tablet square card */}
              <button
                onClick={() => navigate(`${checklist.id}`)}
                className={`hidden sm:flex w-full max-w-64 aspect-square rounded-xl border bg-linear-to-br ${
                  gradients[index % gradients.length]
                } p-4 flex-col justify-between gap-2 text-left hover:border-primary hover:shadow-sm transition-all`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="w-4 h-4 sm:w-10 sm:h-10 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-10 xl:h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <FileText className="h-6 w-6 xl:h-8 xl:w-8 lg:h-8 lg:w-8 text-muted-foreground" />
                  </div>

                  <Badge
                    className={
                      STATUS_STYLES[checklist.status] ?? STATUS_STYLES.ready
                    }
                  >
                    {STATUS_LABEL[checklist.status] ?? STATUS_LABEL.ready}
                  </Badge>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="font-medium text-[9px] sm:text-sm md:text-sm lg:text-[16px] xl:text-sm line-clamp-2">
                    {checklist.title}
                  </p>

                  <p className="text-[10px] lg:text-xs xl:text-[10px] text-muted-foreground">
                    Created: <strong>{formatDate(checklist.created_at)}</strong>
                  </p>

                  <p className="text-[10px] lg:text-xs xl:text-[10px] text-muted-foreground">
                    Updated: <strong>{formatDate(checklist.updated_at)}</strong>
                  </p>
                </div>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChecklistAssignmentDashboard;
