import { Badge } from "@/components/ui/badge";

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

const RATING_STYLES = {
  5: "bg-green-100 text-green-700 border border-green-200",
  4: "bg-blue-100 text-blue-700 border border-blue-200",
  3: "bg-amber-100 text-amber-700 border border-amber-200",
  2: "bg-orange-100 text-orange-700 border border-orange-200",
  1: "bg-red-100 text-red-700 border border-red-200",
};

const getRatingBadgeStyle = (avg) => {
  if (avg == null) return "bg-slate-100 text-slate-500 border border-slate-200";
  const rounded = Math.min(5, Math.max(1, Math.round(avg)));
  return RATING_STYLES[rounded];
};

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

const ChecklistResultsTab = ({ report }) => {
  const info = report.information ?? {};
  const sections = report.checklist ?? [];

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

  return (
    <div className="flex flex-col gap-6 pt-4">
      {/* Supplier Details */}
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

      {/* Per-section results */}
      <div className="flex flex-col gap-4">
        {sections.map((section, sIndex) => {
          // const hasSubsections = Boolean(section["sub-sections"]);
          const hasSubsections =
            Array.isArray(section["sub-sections"]) &&
            section["sub-sections"].length > 0;
          const isAnswered = section.is_answered === 1;

          return (
            <div key={sIndex} className="rounded-xl border bg-card p-5">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="font-medium text-lg">
                  <span className="mr-2 font-semibold text-primary">
                    {toRoman(sIndex + 1)}.
                  </span>
                  {section.section}
                </h2>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Badge className="border border-slate-200 dark:bg-primary/10 dark:border-primary/20 dark:text-primary">
                      <h3>Assigned to:</h3>
                      <p>{section.assigned_user?.name}</p>
                    </Badge>
                  </div>
                  {!isAnswered && (
                    <Badge className="bg-slate-100 text-slate-500 border border-slate-200">
                      Not yet submitted
                    </Badge>
                  )}
                  {section.average_rating != null && (
                    <Badge
                      className={getRatingBadgeStyle(section.average_rating)}
                    >
                      Avg. {section.average_rating.toFixed(2)}
                    </Badge>
                  )}
                </div>
              </div>

              {hasSubsections ? (
                <div className="flex flex-col">
                  {section["sub-sections"].map((sub, subIdx) => (
                    <div
                      key={subIdx}
                      className={`py-5 ${
                        subIdx > 0 ? "border-t border-border/70" : ""
                      }`}
                    >
                      {/* Sub-section header */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="shrink-0 text-sm font-semibold text-primary">
                          {sIndex + 1}.{String.fromCharCode(97 + subIdx)}
                        </span>

                        <h3 className="text-sm font-semibold text-foreground">
                          {sub.item}
                        </h3>
                      </div>

                      {/* Questions */}
                      <div className="pl-6">
                        <ItemsTable items={sub["sub-items"] ?? []} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ItemsTable items={section.item ?? []} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ItemsTable = ({ items }) => {
  return (
    <div className="flex flex-col">
      {items.map((item, i) => {
        const answer = item.answer;
        return (
          <div
            key={i}
            className="flex items-center justify-between gap-4 py-2 border-b last:border-0 text-sm"
          >
            <div className="flex-1">
              <p>
                <span className="mr-2 font-semibold text-primary">
                  {i + 1}.
                </span>
                {item.name}
              </p>

              {answer?.remarks && (
                <span className="text-xs text-muted-foreground whitespace-normal wrap-break-words">
                  {answer.remarks}
                </span>
              )}

              {answer?.images?.length > 0 && (
                <div className="flex gap-1.5 mt-1.5">
                  {answer.images.map((imageUrl, index) => (
                    <a
                      key={index}
                      href={imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-12 h-12 rounded-md overflow-hidden border shrink-0 hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={imageUrl}
                        alt={`${item.name} documentation ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {item.category && (
                <span className="text-xs text-muted-foreground">
                  {item.category}
                </span>
              )}
              {answer?.rating != null ? (
                <Badge className={getRatingBadgeStyle(Number(answer.rating))}>
                  {answer.rating}
                </Badge>
              ) : (
                <Badge className="bg-slate-100 text-slate-400 border border-slate-200">
                  N/A
                </Badge>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChecklistResultsTab;
