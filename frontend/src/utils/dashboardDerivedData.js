export const STATUS_META = {
  done: { label: "Processed", className: "bg-emerald-100 text-emerald-700" },
  processing: { label: "Processing", className: "bg-amber-100 text-amber-700" },
  pending: { label: "Pending", className: "bg-slate-100 text-slate-700" },
  failed: { label: "Failed", className: "bg-red-100 text-red-700" },
};

const TYPE_SUBTYPE_LABELS = {
  invoice_standard: "Standard invoice",
  invoice_professional_fee: "Professional fee",
  invoice_tax_exempt: "Tax exempt",
  invoice_reverse_charge: "Reverse charge",
  invoice: "Invoice",
  receipt: "Receipt",
  credit_note: "Credit note",
  other: "Other",
};

const TYPE_COLORS = [
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
  "#f59e0b",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
  "#94a3b8",
];

const DUE_DATE_LABELS = {
  "60 days": "60 days",
  "30 days": "30 days",
  "10 days": "10 days",
  "1 day": "1 day",
  "Due today": "Due today",
  Overdue: "Overdue",
};

export function buildTypeChartData(typeDistribution) {
  const rows = typeDistribution || [];
  return rows
    .filter((r) => Number(r.count) > 0)
    .map((r, i) => {
      const key = r.doc_subtype
        ? `${r.doc_type || "other"}_${r.doc_subtype}`
        : r.doc_type || "other";
      return {
        name:
          TYPE_SUBTYPE_LABELS[key] ||
          TYPE_SUBTYPE_LABELS[r.doc_type] ||
          r.doc_subtype ||
          r.doc_type ||
          "Other",
        value: Number(r.count),
        color: TYPE_COLORS[i % TYPE_COLORS.length],
      };
    });
}

export function buildDueDateChartData(dueDateDistribution) {
  const rows = dueDateDistribution || [];
  return rows
    .filter((r) => Number(r.count) > 0)
    .map((r) => ({
      name: DUE_DATE_LABELS[r.name] || r.name,
      count: Number(r.count),
      fill: r.color || "#94a3b8",
    }));
}

export function buildSpendingChartData(spendingTrend) {
  const trend = spendingTrend || [];
  const spendingData = trend
    .filter((row) => row?.month)
    .map((row) => {
      const { month, ...amounts } = row;
      const monthLabel =
        month && month.length >= 7
          ? new Date(`${month}-01`).toLocaleDateString("en-US", { month: "short", year: "numeric" })
          : month || "";
      const numericAmounts = {};
      for (const [k, v] of Object.entries(amounts)) {
        if (k && v != null) numericAmounts[k] = Number(v) || 0;
      }
      return { month: monthLabel, ...numericAmounts };
    });
  const currencyKeys =
    spendingData.length > 0
      ? Object.keys(spendingData[0]).filter((k) => k !== "month" && k !== "")
      : [];
  return { spendingData, currencyKeys };
}

export function buildUploadChartData(uploadTrend) {
  if (!uploadTrend?.length) return [];
  return uploadTrend.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    count: item.count,
  }));
}
