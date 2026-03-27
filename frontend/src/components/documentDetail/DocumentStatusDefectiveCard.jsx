import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

export default function DocumentStatusDefectiveCard({
  document,
  hasValidationIssues,
  onMarkDefective,
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Document Status</h3>
          <p className="text-sm text-slate-600">
            {hasValidationIssues
              ? "This document has validation issues. Mark as defective if incorrect."
              : "No validation issues detected. Mark as defective if you find errors manually."}
          </p>
        </div>
        <button
          type="button"
          onClick={onMarkDefective}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm ${
            document?.is_defective
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          {document?.is_defective ? (
            <>
              <FiCheckCircle className="w-4 h-4" />
              Mark as OK
            </>
          ) : (
            <>
              <FiAlertTriangle className="w-4 h-4" />
              Mark as Defective
            </>
          )}
        </button>
      </div>

      {document?.is_defective && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
          ⚠️ This invoice is marked as defective. Contact the issuer for a corrected version.
        </div>
      )}
    </div>
  );
}
