// components/reports/ReportPdfContent.jsx
import {
  stripSectionNumbering,
  buildFindingsByRating,
  computeOverallPercentage,
  getAssignedAuditors,
} from "../features/report/reportHelper";
import logo from "../assets/rdf_logo.png";

const RATING_LABELS = {
  5: "Fully Compliant, Demonstrate Best Practices",
  4: "Mostly Compliant, Minor Observations Only",
  3: "Minor Deficiencies, Needs Correction",
  2: "Major Deficiencies, Needs Corrective Action",
  1: "Non-Compliant, Unacceptable Risk",
};

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-PH", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
};

const joinOrDash = (value) => {
  if (value == null) return "-";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "-";
  return value;
};

const ReportPdfContent = ({ report, isCopy }) => {
  const info = report.information ?? {};
  const sections = report.checklist ?? [];
  const overallPercentage = computeOverallPercentage(sections);
  const findingsByRating = buildFindingsByRating(sections);

  const finding = report?.findings?.[0] ?? {};
  const context = finding?.context ?? {};
  const observers = finding?.observers ?? [];
  const auditors = getAssignedAuditors(sections);

  return (
    <div className="report-pdf-content">
      {/* Repeats on every printed page via CSS position: fixed */}
      <header className="pdf-header">
        <div className="flex flex-col items-end justify-end gap-1.5">
          <img src={logo} alt="Logo" className="h-14 w-auto" />
          <span className="text-sm font-medium">
            REF. NO.: {info.reference_no ?? "-"}
          </span>
        </div>
      </header>

      <footer className="pdf-footer">
        <div className="text-[14px] text-muted-foreground text-left leading-relaxed">
          <p>Purok 6, Barangay Lara, City of San Fernando, Pampanga</p>
          <p>COR-FRM-25-001, Eff. Date: January 20, 2025</p>
        </div>
      </footer>

      {isCopy && (
        <div className="copy-watermark">
          <span>COPY</span>
        </div>
      )}

      {/* Single flowing content column — browser handles pagination/overflow automatically */}
      <main className="pdf-content">
        {/* ── Section 1: Cover ── */}
        <div className="pdf-section">
          <h1 className="text-center text-xl font-bold tracking-wide">
            AUDIT REPORT
          </h1>

          <table className="w-full text-sm mt-6">
            <tbody>
              <InfoRow
                label="Name of Establishment/Supplier"
                value={info.supplier}
              />
              <InfoRow label="Address" value={info.address} />
              <InfoRow
                label="Date of Audit"
                value={formatDate(info.auditDate)}
              />
              <InfoRow
                label="Contact Person/Authorized Representative"
                value={joinOrDash(info.contactPerson)}
              />
              <InfoRow
                label="Contact Number"
                value={joinOrDash(info.contactNumber)}
              />
              <InfoRow
                label="Products/Supplied"
                value={joinOrDash(info.products)}
              />
              <InfoRow label="Audit Scope" value={info.auditScope} />
              <InfoRow label="Audit Objectives" value={info.auditObjectives} />
              <InfoRow
                label="Audit Criteria"
                value={
                  Array.isArray(info.auditCriteria) &&
                  info.auditCriteria.length ? (
                    <ul className="list-disc list-inside">
                      {info.auditCriteria.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  ) : (
                    "-"
                  )
                }
              />
              <InfoRow label="Audit Language" value={info.auditLanguage} />
            </tbody>
          </table>

          <div className="mt-4">
            <p className="text-sm font-medium mb-2">
              <strong>The audit aimed to evaluate the following:</strong>
            </p>
            <ul className="list-disc list-inside text-sm flex flex-col gap-0.5">
              {sections.map((section, i) => (
                <li key={i}>{stripSectionNumbering(section.section)}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Force a new page before Audit Details, but content within flows/overflows naturally */}
        <div className="pdf-section pdf-section--break-before">
          <p className="font-semibold mb-2">The audit was conducted through:</p>
          <p className="pl-4 whitespace-pre-wrap">
            {context.conducted_through || "-"}
          </p>

          <p className="font-semibold mb-1 mt-4">Audit summary</p>
          <p className="pl-4 whitespace-pre-wrap">
            {context.audit_summary || "-"}
          </p>

          <p className="font-semibold mb-3 mt-4">
            Audit Findings and observation:
          </p>
          <p className="mb-4">
            Overall Rating:{" "}
            <span className="font-semibold">{overallPercentage}%</span>
          </p>

          {[5, 4, 3, 2, 1].map((rating) => {
            const group = findingsByRating[rating];
            if (!group || group.length === 0) return null;

            return (
              <div key={rating} className="mb-4 pdf-section--rating-group">
                <p className="font-semibold italic mb-1.5">
                  {RATING_LABELS[rating]}:
                </p>
                <div className="pl-4 flex flex-col gap-2">
                  {group.map((entry, i) => {
                    const remarks = entry.items
                      .filter((item) => item.remarks)
                      .map((item) => item.remarks);
                    return (
                      <div key={i} className="finding-entry">
                        <p>
                          {i + 1}. {entry.sectionName}
                        </p>
                        <ul className="list-disc list-inside pl-4">
                          {remarks.map((remark, j) => (
                            <li key={j}>{remark}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Force a new page before Conclusion */}
        <div className="pdf-section pdf-section--break-before">
          <p className="font-semibold mb-1">Conclusion:</p>
          <p className="whitespace-pre-wrap">{context.conclusion || "-"}</p>

          <p className="font-semibold mb-1 mt-4">
            Supplier's Corrective Actions:
          </p>
          <p className="whitespace-pre-wrap">
            {context.corrective_actions || "-"}
          </p>

          <p className="font-semibold mb-1 mt-4">Follow up Audit:</p>
          <p className="whitespace-pre-wrap">
            {context.follow_up_audit || "-"}
          </p>

          <p className="font-semibold mb-2 mt-4">Auditors/Observers:</p>
          <div className="flex flex-col gap-4 pl-1">
            {auditors.map((auditor, i) => (
              <div key={auditor.id ?? i}>
                <p>Auditor {i + 1}:</p>
                <p className="pl-4">Name and signature: {auditor.name}</p>
              </div>
            ))}
            {observers.map((observer, i) => (
              <div key={observer.id ?? i}>
                <p>Observer {i + 1}:</p>
                <p className="pl-4">
                  Name and signature: {observer?.full_name ?? "-"}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-4">
            Audit Report Submission Date:{" "}
            <span className="font-medium">
              {formatDate(context.submission_date)}
            </span>
          </p>

          <div className="signature-block mt-6 pt-6 border-t">
            <p className="font-semibold mb-4">Supplier's Signature:</p>
            <div className="flex flex-col gap-4 text-sm">
              <SignatureLine label="Name" />
              <SignatureLine label="Position" />
              <SignatureLine label="Date Signed" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <tr className="info-row border border-black">
    <td className="pl-1.5 py-1.5 pr-4 font-medium align-top whitespace-nowrap w-1/3 border-r border-black">
      {label}:
    </td>
    <td className="pl-1.5 pr-1.5 py-1.5 align-top">{value ?? "-"}</td>
  </tr>
);

const SignatureLine = ({ label }) => (
  <div className="flex items-baseline gap-2">
    <span className="w-28 shrink-0">{label}:</span>
    <span className="w-xs border-b border-double border-foreground h-5" />
  </div>
);

export default ReportPdfContent;
