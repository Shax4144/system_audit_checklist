import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import DashboardTableWrapper from "../../../components/tables/DashboardTableWrapper";
import {
  useFetchReportsQuery,
  useLazyFetchReportByIdQuery,
  useCloseReportByIdMutation,
} from "../../../features/report/checklistSummaryReport.api";
// import PdfPreviewModal from "../../../components/PdfPreviewModal"
import ReportPdfContent from "../../../components/ReportPdfContent";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Printer, MoreHorizontal, X } from "lucide-react";
import { appToast } from "../../../components/Toast";
import CloseConfirm from "../../../components/CloseConfirm";


const TABS = [
  { value: "ongoing", label: "Ongoing" },
  { value: "consolidated", label: "Consolidated" },
  { value: "generated", label: "Generated" },
  { value: "closed", label: "Closed" },
];

// The browser owns pagination; @page margins reserve a safe content area for
// the fixed elements that react-to-print repeats on each physical page.
const PRINT_PAGE_STYLE = `
  @page {
    size: letter;
    margin: 1.35in 0.75in 0.75in;
  }

  html, body {
    margin: 0 !important;
    padding: 0 !important;
  }
`;

const ReportsDashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  // const [activeTab, setActiveTab] = useState("consolidated");
  const activeTab = searchParams.get("tab") || "ongoing";
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [reportToPrint, setReportToPrint] = useState(null);
  const printContentRef = useRef(null);
  const [closeReportId, setCloseReportId] = useState(null);

  const [fetchReportById, { isLoading: isFetchingReportById }] =
    useLazyFetchReportByIdQuery();

  const [closeReportById, { isLoading: isClosingReportById }] = useCloseReportByIdMutation();

  const printReport = useReactToPrint({
    contentRef: printContentRef,
    pageStyle: PRINT_PAGE_STYLE,
    documentTitle: () =>
      `Audit_Report_${reportToPrint?.information?.reference_no ?? "report"}`,
    onAfterPrint: () => setReportToPrint(null),
    onPrintError: (_errorLocation, printError) => {
      setReportToPrint(null);
      appToast.error(
        "Print error",
        printError.message ?? "Failed to print report.",
      );
    },
  });

  const { data, isFetching, isError, error } = useFetchReportsQuery({
    status: activeTab,
    page,
    per_page: pageSize,
  });

  const handleCloseReport = useCallback((reportId) => {
    setCloseReportId(reportId);
  }, []);

  const handleConfirmClose = useCallback(async () => {
    if (!closeReportId) return;
    try {

      //close mutation
      const response = await closeReportById(closeReportId).unwrap();

      appToast.success(
        "Checklist closed!",
        response?.message ?? "The checklist has beenclosed successfully."
      )
      setCloseReportId(null);
      
    } catch (error) {
      console.log("Failed to close report", error);

      appToast.error(
        "Error",
        error?.message ?? "Failed to close checklist.",
      )
    }
  }, [closeReportId, closeReportById]);

  const handleOpenDetail = useCallback(
    (reportId) => navigate(`/workspace/reports/${reportId}`),
    [navigate],
  );

  const handlePrintPdf = useCallback(
    async (reportId) => {
      try {
        const response = await fetchReportById(reportId).unwrap();
        setReportToPrint(response?.data ?? response);
      } catch (err) {
        appToast.error(
          "Error",
          err?.data?.message ?? "Failed to load report for printing.",
        );
      }
    },
    [fetchReportById],
  );

  useEffect(() => {
    if (!reportToPrint || !printContentRef.current) return;

    const startPrint = async () => {
      await document.fonts?.ready;
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
      printReport();
    };

    startPrint().catch((printError) => {
      setReportToPrint(null);
      appToast.error(
        "Print error",
        printError.message ?? "Failed to print report.",
      );
    });
  }, [printReport, reportToPrint]);

  // useEffect(() => {
  //   if (!reportToPrint || !printContentRef.current) return

  //   const startPrint = async () => {
  //     await document.fonts?.ready
  //     await new Promise(requestAnimationFrame)
  //     await new Promise(requestAnimationFrame)

  //     console.log("PRINT REPORT:", reportToPrint)
  //     console.log("PRINT NODE:", printContentRef.current)

  //     printReport()
  //   }

  //   startPrint().catch((printError) => {
  //     console.error("PRINT ERROR:", printError)
  //     setReportToPrint(null)

  //     appToast.error(
  //       "Print error",
  //       printError.message ?? "Failed to print report.",
  //     )
  //   })
  // }, [reportToPrint, printReport])

  // const handleTabChange = useCallback((tab) => {
  //   setActiveTab(tab);
  //   setPage(1);
  // }, []);

  const handleTabChange = useCallback(
    (tab) => {
      setSearchParams({ tab });
      setPage(1);
    },
    [setSearchParams],
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "reference_number",
        header: "Reference No.",
      },
      {
        accessorKey: "title",
        header: "Checklist",
      },
      {
        accessorKey: "supplier",
        header: "Supplier",
        cell: ({ row }) => row.original.information?.supplier ?? "-",
      },
      {
        accessorKey: "progress",
        header: "Progress",
        cell: ({ row }) => {
          const summary = row.original.checklist_summary;
          if (!summary) return "-";
          return (
            <span className="text-sm">
              {summary.answered} / {summary.total} sections ({summary.percent}%)
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const report = row.original;

          switch (activeTab) {
            case "closed":
              return (
                <Button size="sm" onClick={() => handleOpenDetail(report.id)}>
                  View
                </Button>
              );

            case "ongoing":
              return (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-40 rounded-xl">
                    <DropdownMenuItem
                      onSelect={() => handleOpenDetail(report.id)}
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={() => handleCloseReport(report.id)}
                    >
                      <X className="h-4 w-4" />
                      Close
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              );

            case "generated":
              return (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-40 rounded-xl">
                    <DropdownMenuItem
                      onSelect={() => handleOpenDetail(report.id)}
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      disabled={isFetchingReportById}
                      onSelect={() => handlePrintPdf(report.id)}
                    >
                      <Printer className="h-4 w-4" />
                      Print
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              );

            default:
              return (
                <Button size="sm" onClick={() => handleOpenDetail(report.id)}>
                  Open
                </Button>
              );
          }
        },
      },
    ],
    [activeTab, handleOpenDetail, handlePrintPdf, isFetchingReportById, handleCloseReport],
  );

  return (
    <div className="flex flex-col gap-5 h-full">
      <div>
        <h1 className="text-2xl font-semibold">Reports</h1>
        <p className="text-sm text-muted-foreground">
          Review submitted checklists and generate audit reports.
        </p>
      </div>

      <DashboardTableWrapper
        columns={columns}
        data={data?.data ?? []}
        paginationData={data}
        isFetching={isFetching}
        isError={isError}
        error={error}
        searchKey="title"
        page={page}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={TABS}
      />

      {reportToPrint && (
        <div ref={printContentRef} className="print-area hidden print:block">
          <ReportPdfContent
            report={reportToPrint}
            isCopy={(reportToPrint.print_count ?? 0) >= 1}
          />
        </div>
      )}

      <CloseConfirm
        open={Boolean(closeReportId)}
        onClose={() => setCloseReportId(null)}
        onConfirm={handleConfirmClose}
        isLoading={isClosingReportById}
      />
    </div>
  );
};

export default ReportsDashboard;
