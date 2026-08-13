import { useState, useRef } from "react";
// import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, X } from "lucide-react";
import DatePicker from "../../../components/DatePicker";
import UsersDropdown from "../../../components/dropdown/UserAccountsDropdown";
import Confirm from "../../../components/Confirm";
import { appToast } from "../../../components/Toast";
import {
  stripSectionNumbering,
  buildFindingsByRating,
  computeOverallPercentage,
  getAssignedAuditors,
} from "../../../features/report/reportHelper";
import { usePostFindingMutation } from "../../../features/report/findings.api";


const RATING_LABELS = {
  5: "Fully Compliant, Demonstrate Best Practices",
  4: "Mostly Compliant, Minor Observations Only",
  3: "Minor Deficiencies, Needs Correction",
  2: "Major Deficiencies, Needs Corrective Action",
  1: "Non-Compliant, Unacceptable Risk",
};

const DEFAULT_CORRECTIVE_ACTION_TEXT =
  "Kindly submit corrective action report to those deficiencies mentioned above 15 days after receiving the final report.";

const displayValue = (value, type = "text") => {
  if (value == null || value === "") return "-";

  if (type === "date" && value) {
    return new Date(value).toLocaleDateString("en-PH", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
  }

  if (type === "time" && value) {
    return new Date(value).toLocaleDateString("en-PH", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  if (type === "dateAndTime" && value) {
    return new Date(value).toLocaleDateString("en-PH", {
      month: "long",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  if (type === "bullet") {
    if (!Array.isArray(value) || value.length === 0) return "-";

    return (
      <ul className="list-disc list-inside space-y-1">
        {value.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  }

  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : "-";
  }

  return value ?? "-";
};

const AuditReportTab = ({ report }) => {
  const info = report.information ?? {};
  const sections = report.checklist ?? [];
  const [postFinding] = usePostFindingMutation();
  
  const supplierInfoFields = [
    {
      label: "Supplier",
      value: info.supplier,
    },
    {
      label: "Date of Audit",
      value: info.auditDate,
      type: "date",
    },
    {
      label: "Address",
      value: info.address,
    },
    {
      label: "TIN #",
      value: info.tin_no,
    },
    {
      label: "Contact Person",
      value: info.contactPerson,
    },
    {
      label: "Contact Number",
      value: info.contactNumber,
    },
    {
      label: "Email",
      value: info.email,
    },
    {
      label: "Products",
      value: info.products,
    },
    {
      label: "Remarks",
      value: info.remarks,
    },
    {
      label: "Location",
      value: info.location,
    },
  ];

  const auditInfoFields = [
    {
      label: "Audit Scope",
      value: info.auditScope,
    },
    {
      label: "Audit Language",
      value: info.auditLanguage,
    },
    {
      label: "Audit Objectives",
      value: info.auditObjectives,
      full: true,
    },
    {
      label: "Audit Criteria",
      value: info.auditCriteria,
      type: "bullet",
      full: true,
    },
  ];

  // ── Editable fields (head auditor fills these) ──
  const [conductedThrough, setConductedThrough] = useState("");
  const conductedThroughRef = useRef(null);
  const [auditSummary, setAuditSummary] = useState("");
  const auditSummaryRef = useRef(null);
  const [conclusion, setConclusion] = useState("");
  const conclusionRef = useRef(null);
  const [correctiveActions, setCorrectiveActions] = useState(
    DEFAULT_CORRECTIVE_ACTION_TEXT,
  );
  const correctiveActionsRef = useRef(null);
  const [followUpAudit, setFollowUpAudit] = useState("");
  const followUpAuditRef = useRef(null);
  const [observers, setObservers] = useState([null]); // array of user ids
  const observersRef = useRef(null);
  const [submissionDate, setSubmissionDate] = useState(new Date());
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // ── Derived / auto-filled data ──
  const overallPercentage = computeOverallPercentage(sections);
  const findingsByRating = buildFindingsByRating(sections);
  const auditors = getAssignedAuditors(sections);

  const updateObserver = (index, userId) => {
    setObservers((prev) => prev.map((id, i) => (i === index ? userId : id)));
  };

  const addObserverSlot = () => {
    setObservers((prev) => [...prev, null]);
  };

  const removeObserverSlot = (index) => {
    setObservers((prev) => prev.filter((_, i) => i !== index));
  };

  const getFirstMissingField = () => {
    const fields = [
      { value: conductedThrough, label: "The audit was conducted through", ref: conductedThroughRef },
      { value: auditSummary, label: "Audit Summary", ref: auditSummaryRef },
      { value: conclusion, label: "Conclusion", ref: conclusionRef },
      { value: correctiveActions, label: "Supplier's Corrective Actions", ref: correctiveActionsRef },
      { value: followUpAudit, label: "Follow up Audit", ref: followUpAuditRef },
      { value: submissionDate, label: "Audit Report Submission Date", ref: null },
      {
        value: observers.some((id) => id != null && id !== "") ? "has-observer/s" : "",
        label: "Observers",
        ref: observersRef,
      }
    ]
  
    return fields.find((field) => {
      if (field.value == null) return true
      if (typeof field.value === "string" && field.value.trim() === "") return true
      return false
    })
  }
  
  const scrollToField = (ref) => {
    if (!ref?.current) return
    ref.current.scrollIntoView({ behavior: "smooth", block: "center" })
    ref.current.focus()
  }

  const buildAuditReportPayload = () => ({
    copy_id: report.id,
    context: {
      conducted_through: conductedThrough,
      audit_summary: auditSummary,
      conclusion,
      corrective_actions: correctiveActions,
      follow_up_audit: followUpAudit,
      submission_date: submissionDate,
    },
    observers: observers
      .filter((id) => id != null && id !== "")
      .map((id) => Number(id)),
  });

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    try {
      const payload = buildAuditReportPayload();
      console.log("Saving draft with payload:", payload);
      // await saveAuditReportDraft({ id: report.id, ...payload }).unwrap()
      appToast.success("Draft saved successfully.");
    } catch (error) {
      console.error("Error saving draft:", error);
      appToast.error("Error", error?.data?.message ?? "Failed to save draft.");
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleGenerateReport = () => {
    const missingField = getFirstMissingField()
    
    if (missingField) {
      appToast.warning(
        "Missing information",
        `Please fill out "${missingField.label}" before generating the report.`
      )
      scrollToField(missingField.ref)
      return
    }
    
    setOpenConfirm(true);
  };

  const handleConfirm = async () => {
    setIsGeneratingReport(true);
    try {
      const payload = buildAuditReportPayload();
      console.log("generate report payload:", payload);
      await postFinding({...payload }).unwrap()
      appToast.success(
        "Report Generated",
        "The audit report has been generated successfully.",
      );
    } catch (error) {
      appToast.error(
        "Error",
        error?.data?.message ?? "Failed to generate report.",
      );
    } finally {
      setIsGeneratingReport(false);
      setOpenConfirm(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pt-4">
      {/* ── Supplier Details ── */}
      <div className="rounded-xl border bg-card p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Supplier Details
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {supplierInfoFields.map(({ label, value, type }) => (
            <div key={label}>
              <p className="text-muted-foreground text-xs mb-1">{label}</p>
              <p className="font-medium">{displayValue(value, type)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Audit Details ── */}
      <div className="rounded-xl border bg-card p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Audit Details
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {auditInfoFields.map(({ label, value, type, full }) => (
            <div key={label} className={full ? "col-span-2" : ""}>
              <p className="text-muted-foreground text-xs mb-1">{label}</p>
              <div className="font-medium">{displayValue(value, type)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Sections Evaluated ── */}
      <div className="rounded-xl border bg-card p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          The audit aimed to evaluate the following
        </p>
        <ul className="list-disc list-inside text-sm flex flex-col gap-1">
          {sections.map((section, i) => (
            <li key={i}>{stripSectionNumbering(section.section)}</li>
          ))}
        </ul>
      </div>

      {/* ── Audit Conducted Through + Summary (editable) ── */}
      <div className="rounded-xl border bg-card p-5 flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Audit Details
        </p>

        <div className="flex flex-col gap-1.5">
          <Label>The audit was conducted through</Label>
          <Textarea
            ref={conductedThroughRef}
            value={conductedThrough}
            onChange={(e) => setConductedThrough(e.target.value)}
            placeholder="e.g. On-site inspection, document review, staff interviews"
            rows={3}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Audit Summary</Label>
          <Textarea
            ref={auditSummaryRef}
            value={auditSummary}
            onChange={(e) => setAuditSummary(e.target.value)}
            placeholder="Provide a summary of the audit"
            rows={4}
          />
        </div>
      </div>

      {/* ── Audit Findings and Observation ── */}
      <div className="rounded-xl border bg-card p-5 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Audit Findings and Observation
          </p>
          <Badge className="bg-primary/10 text-primary border border-primary/20">
            Overall Rating: {overallPercentage}%
          </Badge>
        </div>

        {[5, 4, 3, 2, 1].map((rating) => {
          const group = findingsByRating[rating];
          if (!group || group.length === 0) return null;

          return (
            <div key={rating} className="flex flex-col gap-2">
              <p className="text-sm font-semibold">{RATING_LABELS[rating]}:</p>
              <div className="flex flex-col gap-2 pl-2">
                {group.map((entry, i) => (
                  <div key={i}>
                    <p className="text-sm font-medium">
                      {i + 1}. {entry.sectionName}
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground pl-4">
                      {entry.items.map((item, j) => (
                        <li key={j}>{item.remarks ?? item.name}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* ── Conclusion (editable) ── */}
        <div className="flex flex-col gap-1.5">
          <Label>Conclusion</Label>
          <Textarea
            ref={conclusionRef}
            value={conclusion}
            onChange={(e) => setConclusion(e.target.value)}
            placeholder="Provide the audit conclusion"
            rows={4}
          />
        </div>

        {/* ── Supplier's Corrective Actions (default, editable) ── */}
        <div className="flex flex-col gap-1.5">
          <Label>Supplier's Corrective Actions</Label>
          <Textarea
            ref={correctiveActionsRef}
            value={correctiveActions}
            onChange={(e) => setCorrectiveActions(e.target.value)}
            rows={3}
          />
        </div>
      </div>

      {/* ── Other Details ── */}
      <div className="rounded-xl border bg-card p-5 flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Other Details
        </p>

        <div className="flex flex-col gap-1.5">
          <Label>Follow up Audit</Label>
          <Textarea
            ref={followUpAuditRef}
            value={followUpAudit}
            onChange={(e) => setFollowUpAudit(e.target.value)}
            placeholder="Provide follow-up audit details, if any"
            rows={3}
          />
        </div>
      </div>

      {/* ── Auditors / Observers ── */}
      <div ref={observersRef} className="rounded-xl border bg-card p-5 flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Auditors / Observers
        </p>

        <div className="flex flex-col gap-2">
          {auditors.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No auditors assigned.
            </p>
          ) : (
            auditors.map((auditor, i) => (
              <p key={auditor.id} className="text-sm">
                <span className="text-muted-foreground">Auditor {i + 1}:</span>{" "}
                {auditor.name}
              </p>
            ))
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            {observers.map((userId, index) => (
              <div key={index} className="flex items-center gap-2 max-w-sm">
                <span className="text-sm text-muted-foreground">
                  Observer {index + 1}:
                </span>
                <UsersDropdown
                  value={userId ?? ""}
                  onChange={(val) => updateObserver(index, val)}
                  open={true}
                  triggerClassName="flex-1"
                />
                {observers.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeObserverSlot(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addObserverSlot}
            className="self-start mt-1"
          >
            <Plus className="h-4 w-4" /> Add Observer
          </Button>
        </div>
      </div>

      {/* ── Submission Date ── */}
      <div className="flex w-full items-end justify-between gap-4">
        <div className="rounded-xl border bg-card p-5 flex flex-col gap-1.5 min-w-sm">
          <Label>Audit Report Submission Date</Label>
          <DatePicker
            value={submissionDate}
            onChange={setSubmissionDate}
            placeholder="Pick a date"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isSavingDraft || isGeneratingReport}
          >
            {isSavingDraft && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Save as Draft
          </Button>
          <Button
            variant="default"
            onClick={handleGenerateReport}
            disabled={isSavingDraft || isGeneratingReport}
          >
            {isGeneratingReport && (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            )}
            Generate Report
          </Button>
        </div>
      </div>

      <Confirm
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirm}
        isLoading={isGeneratingReport}
      />
    </div>
  );
};

export default AuditReportTab;
