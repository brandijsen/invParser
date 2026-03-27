import DocumentHeader from "../DocumentHeader";
import PdfViewer from "../PdfViewer";

export default function DocumentDetailProcessingView({ document, documentId }) {
  return (
    <div className="pt-20 sm:pt-24 pb-16 sm:pb-24 min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        <DocumentHeader document={document} parsed={null} resultMetadata={null} />
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 sm:p-6 text-amber-800 text-sm sm:text-base">
          <p className="font-medium">Document is being processed</p>
          <p className="text-sm mt-1">Please wait a moment and refresh the page.</p>
        </div>
        <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
          <h3 className="px-6 py-4 border-b border-slate-200 font-medium text-slate-900">
            Document Preview
          </h3>
          <PdfViewer documentId={documentId} className="min-h-[500px]" />
        </div>
      </div>
    </div>
  );
}
