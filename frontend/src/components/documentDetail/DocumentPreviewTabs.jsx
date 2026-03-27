import { useMemo } from "react";
import PdfViewer from "../PdfViewer";
import { buildDocumentDebugJson } from "../../utils/documentDetailDebugJson";

const TABS = ["pdf", "raw", "json"];

export default function DocumentPreviewTabs({
  documentId,
  tab,
  setTab,
  parsed,
  raw,
  document,
}) {
  const debugJsonText = useMemo(() => {
    const payload = buildDocumentDebugJson(parsed, document);
    if (payload == null) return "No parsed data available";
    return JSON.stringify(payload, null, 2);
  }, [parsed, document]);

  return (
    <div className="pt-4">
      <div className="flex gap-2 mb-4">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t
                ? "bg-slate-800 text-white"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {t === "pdf" ? "PDF" : t === "raw" ? "Raw Text" : "Debug JSON"}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
        {tab === "pdf" && <PdfViewer documentId={documentId} className="min-h-[600px]" />}

        {tab === "json" && (
          <div className="p-6">
            <pre className="text-xs text-slate-600 whitespace-pre-wrap font-mono overflow-x-auto">
              {parsed || document?.supplier ? debugJsonText : "No parsed data available"}
            </pre>
          </div>
        )}

        {tab === "raw" && (
          <div className="p-6">
            <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono overflow-x-auto max-h-96 overflow-y-auto">
              {raw || "No raw text available"}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
