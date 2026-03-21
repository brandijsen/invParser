import { FiAlertTriangle, FiAlertCircle } from "react-icons/fi";

/**
 * Validation flags (backend) + low-confidence fields (model), grouped by category.
 */

const SECTION_COPY = {
  document_kind: {
    title: "Document type",
    description:
      "This file may not match what the app expects as an invoice, or classification disagrees with the content.",
  },
  arithmetic: {
    title: "Amount consistency",
    description:
      "Totals, VAT, withholding, or subtotals do not match the implied arithmetic (within tolerance).",
  },
  document_context: {
    title: "Subtype context",
    description:
      "Unusual for the invoice subtype (e.g. reverse charge / exempt); may still be valid in your jurisdiction.",
  },
  data_quality: {
    title: "Data completeness & scale",
    description: "Missing currency or unusually large amounts—often worth a quick PDF check.",
  },
  extraction: {
    title: "Uncertain extraction",
    description:
      "The model reported low confidence on one or more fields; compare with the original document.",
  },
};

const SECTION_ORDER = [
  "document_kind",
  "arithmetic",
  "document_context",
  "data_quality",
  "extraction",
];

const RedFlagsAlert = ({ parsed, validationFlags }) => {
  if (!parsed) return null;

  const confidenceRedFlags = identifyRedFlags(parsed);
  const combinedFlags = mergeFlags(confidenceRedFlags, validationFlags || []);

  if (combinedFlags.length === 0) return null;

  const sections = groupFlagsIntoSections(combinedFlags);

  return (
    <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center">
          <FiAlertTriangle className="w-6 h-6 text-amber-700" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-amber-900 mb-2">
            Verification Needed
          </h3>
          <p className="text-sm text-amber-800 mb-4">
            {combinedFlags.length} issue{combinedFlags.length > 1 ? "s" : ""} detected. Review by
            category below; mark the invoice as defective if it is incorrect.
          </p>

          <div className="space-y-8">
            {sections.map(({ id, flags: sectionFlags }) => {
              const meta = SECTION_COPY[id] || {
                title: id.replace(/_/g, " "),
                description: "",
              };
              return (
                <div key={id}>
                  <h4 className="text-sm font-semibold text-amber-950">{meta.title}</h4>
                  {meta.description && (
                    <p className="text-xs text-amber-800/90 mt-0.5 mb-3">{meta.description}</p>
                  )}
                  <div className="space-y-3">
                    {sectionFlags.map((field, idx) => (
                      <div
                        key={`${id}-${idx}`}
                        className="bg-white rounded-lg border border-amber-200 p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <FiAlertCircle
                                className={`w-4 h-4 shrink-0 ${getSeverityColor(field.severity).text}`}
                              />
                              <span className="text-sm font-medium text-slate-900">
                                {field.label}
                              </span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${getSeverityColor(field.severity).badge}`}
                              >
                                {field.type === "confidence" ? (
                                  `${field.confidence}% confident`
                                ) : (
                                  field.severity.toUpperCase()
                                )}
                              </span>
                            </div>

                            {field.message && (
                              <div className="text-sm text-slate-700 mb-2">{field.message}</div>
                            )}

                            {field.expected && field.actual && (
                              <div className="text-xs text-slate-600 mb-2 space-y-1">
                                <div>
                                  <span className="font-medium">Expected:</span> €{field.expected}
                                </div>
                                <div>
                                  <span className="font-medium">Actual:</span> €{field.actual}
                                </div>
                              </div>
                            )}

                            {field.value !== undefined && field.type === "confidence" && (
                              <div className="text-sm text-slate-700 font-mono bg-slate-50 px-3 py-2 rounded border border-slate-200">
                                {formatValue(field.value)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

function extractFieldsWithConfidence(obj, path = "") {
  const fields = [];

  function traverse(current, currentPath) {
    if (!current || typeof current !== "object") return;

    if ("value" in current && "confidence" in current) {
      fields.push({
        path: currentPath,
        value: current.value,
        confidence: current.confidence,
      });
      return;
    }

    for (const [key, value] of Object.entries(current)) {
      if (key === "validation_flags" || key === "validation") continue;
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      traverse(value, newPath);
    }
  }

  traverse(obj, path);
  return fields;
}

function identifyRedFlags(parsedJson, threshold = 70) {
  if (!parsedJson) return [];

  const allFields = extractFieldsWithConfidence(parsedJson);

  return allFields
    .filter((field) => field.confidence < threshold)
    .map((field) => ({
      ...field,
      severity: getSeverity(field.confidence),
      label: formatFieldLabel(field.path),
      type: "confidence",
      category: "extraction",
    }));
}

function inferValidationCategory(flag) {
  if (flag.category) return flag.category;
  const t = flag.type;
  if (t === "wrong_document_type") return "document_kind";
  if (t === "calculation_error") return "arithmetic";
  if (t === "missing_value") return "data_quality";
  if (t === "logic_error") return "arithmetic";
  if (t === "unusual_value") {
    const f = flag.field || "";
    if (f === "net_payable" || f === "vat.amount") return "document_context";
    return "data_quality";
  }
  if (t === "low_text_content" || t === "extraction_failed") return "data_quality";
  return "arithmetic";
}

function mergeFlags(confidenceFlags, validationFlags) {
  const merged = confidenceFlags.map((f) => ({
    ...f,
    category: f.category || "extraction",
  }));

  validationFlags.forEach((vFlag) => {
    merged.push({
      path: vFlag.field,
      label: vFlag.field ? formatFieldLabel(vFlag.field) : "Unknown Field",
      severity: vFlag.severity || "medium",
      confidence: null,
      message: vFlag.message,
      type: "validation",
      category: inferValidationCategory(vFlag),
      expected: vFlag.expected,
      actual: vFlag.actual,
    });
  });

  return merged;
}

function groupFlagsIntoSections(flags) {
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const byCat = {};
  for (const f of flags) {
    const c = f.category || "arithmetic";
    if (!byCat[c]) byCat[c] = [];
    byCat[c].push(f);
  }
  for (const c of Object.keys(byCat)) {
    byCat[c].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
  }
  return SECTION_ORDER.filter((id) => byCat[id]?.length).map((id) => ({
    id,
    flags: byCat[id],
  }));
}

function getSeverity(confidence) {
  if (confidence < 50) return "critical";
  if (confidence < 60) return "high";
  if (confidence < 70) return "medium";
  return "low";
}

function getSeverityColor(severity) {
  const colors = {
    critical: {
      badge: "bg-red-100 text-red-700 border border-red-200",
      text: "text-red-600",
    },
    high: {
      badge: "bg-orange-100 text-orange-700 border border-orange-200",
      text: "text-orange-600",
    },
    medium: {
      badge: "bg-amber-100 text-amber-700 border border-amber-200",
      text: "text-amber-600",
    },
    low: {
      badge: "bg-slate-100 text-slate-700 border border-slate-200",
      text: "text-slate-600",
    },
  };

  return colors[severity] || colors.low;
}

function formatFieldLabel(path) {
  return path
    .split(".")
    .map((part) => {
      return part
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
    })
    .join(" > ");
}

function formatValue(value) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export default RedFlagsAlert;
