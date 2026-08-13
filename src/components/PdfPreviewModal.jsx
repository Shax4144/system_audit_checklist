import { useState, useRef, useEffect } from "react";
import { Printer, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { usePrintDetection } from "../hooks/usePrintDetection";
import PrintConfirmDialog from "./PrintConfirmDialog";
import ReportPdfContent from "./ReportPdfContent";
import { useLazyFetchReportByIdQuery } from "../features/report/checklistSummaryReport.api";
// import { useIncrementPrintCountMutation } from "../../features/report/report.api"
import { appToast } from "./Toast";

const PdfPreviewModal = ({ open, onClose, report }) => {
  const [openPrintConfirm, setOpenPrintConfirm] = useState(false);
  // const [incrementPrintCount, { isLoading: isUpdatingCount }] = useIncrementPrintCountMutation()
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  const [fetchReportById, { data: response, isFetching, isError }] =
    useLazyFetchReportByIdQuery();
  const reportData = response?.data;

  useEffect(() => {
    if (!open) return;
    fetchReportById(report);
  }, [open, report, fetchReportById]);

  useEffect(() => {
    if (!open) return;

    const updateScale = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const pageWidthPx = 8.5 * 96; // 8.5in at 96dpi = 816px
      const padding = 48; // account for p-6 (24px * 2)
      const availableWidth = containerWidth - padding;
      const newScale = Math.min(1, availableWidth / pageWidthPx);
      setScale(newScale);
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [open]);

  const { triggerPrint } = usePrintDetection(() => {
    setOpenPrintConfirm(true);
  });

  const handlePrintClick = () => {
    triggerPrint();
  };

  const handlePrintConfirm = async (wasSuccessful) => {
    setOpenPrintConfirm(false);

    if (!wasSuccessful) return;

    try {
      // await incrementPrintCount({ id: report.id }).unwrap()
      appToast.success("Print recorded", "Print count has been updated.");
    } catch (err) {
      appToast.error(
        "Error",
        err?.data?.message ?? "Failed to update print count.",
      );
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent
          showCloseButton={true}
          className="w-[95vw] sm:max-w-6xl h-[90vh] flex flex-col p-0 gap-0"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-5 border-b shrink-0">
            <p className="font-medium">Audit Report Preview</p>
          </div>

          {/* Body — scrollable PDF preview */}
          <div
            ref={containerRef}
            className="flex-1 overflow-y-auto bg-muted/30 p-6"
          >
            {isFetching ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
                <p className="text-sm">Loading report...</p>
              </div>
            ) : isError ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-destructive">
                  Failed to load report.
                </p>
              </div>
              ) : report ? (
                  <div className="print-area">
                    <div
                      style={{
                        width: "8.5in",
                        transform: `scale(${scale})`,
                        transformOrigin: "top center",
                        margin: "0 auto",
                        marginBottom: `${-(1 - scale) * 100}%`,
                      }}
                    >
                      <ReportPdfContent
                        report={reportData}
                        isCopy={(report.print_count ?? 0) >= 1}
                      />
                    </div>
                  </div>
            ) : null}
          </div>

          {/* Footer */}
          <div className="flex justify-end px-5 py-3 border-t shrink-0">
            <Button
              onClick={handlePrintClick}
              disabled={isFetching || !report}
            >
              <Printer className="h-4 w-4 mr-2" /> Print
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <PrintConfirmDialog
        open={openPrintConfirm}
        onClose={() => setOpenPrintConfirm(false)}
        onConfirm={handlePrintConfirm}
      />
    </>
  );
};

export default PdfPreviewModal;
