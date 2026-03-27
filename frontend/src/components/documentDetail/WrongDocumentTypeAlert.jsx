import { FiAlertTriangle } from "react-icons/fi";

export default function WrongDocumentTypeAlert({ parsed, wrongDocumentFlag }) {
  return (
    <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-12 h-12 rounded-full bg-red-200 flex items-center justify-center">
          <FiAlertTriangle className="w-6 h-6 text-red-700" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-900 mb-2">⚠️ Wrong Document Type</h3>
          <p className="text-sm text-red-800 mb-3">
            {wrongDocumentFlag?.message ||
              `This document is not an invoice. Detected type: "${parsed.document_type}".`}
          </p>
          <p className="text-sm text-red-700 font-medium">
            📌 Please upload only invoices. This document should be removed or marked as defective.
          </p>
        </div>
      </div>
    </div>
  );
}
