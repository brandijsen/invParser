import { FiDownload, FiFileText } from "react-icons/fi";
import DocumentUpload from "../components/DocumentUpload";
import DocumentFilters from "../components/DocumentFilters";
import DocumentsBulkBar from "../components/documents/DocumentsBulkBar";
import DocumentsTable from "../components/documents/DocumentsTable";
import DocumentsPagination from "../components/documents/DocumentsPagination";
import DocumentsListSkeleton from "../components/documents/DocumentsListSkeleton";
import { useToast } from "../context/ToastContext";
import { useDocumentsPage } from "../hooks/useDocumentsPage";

const Documents = () => {
  const { showToast } = useToast();
  const p = useDocumentsPage(showToast);

  return (
    <div className="pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-24 min-h-screen bg-[#F5F7FA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold">Your invoices</h1>
            <p className="text-slate-600 mt-1 text-sm sm:text-base">
              Upload invoice PDFs, view parsed data and export to CSV or Excel
            </p>
          </div>

          {p.documents.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => p.handleExport("csv")}
                disabled={p.exporting}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiDownload className="w-4 h-4" />
                {p.exporting ? "Exporting..." : "Export CSV"}
              </button>
              <button
                type="button"
                onClick={() => p.handleExport("excel")}
                disabled={p.exporting}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiDownload className="w-4 h-4" />
                {p.exporting ? "Exporting..." : "Export Excel"}
              </button>
            </div>
          )}
        </div>

        <DocumentUpload onUploaded={() => p.fetchDocuments(p.pagination.page, p.filters)} />

        <DocumentFilters
          filters={p.filters}
          onFilterChange={p.handleFilterChange}
          onReset={p.handleResetFilters}
        />

        {p.loading ? (
          <DocumentsListSkeleton />
        ) : p.documents.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-10 sm:p-14 text-center max-w-xl mx-auto">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mb-5">
              <FiFileText className="w-7 h-7" strokeWidth={1.5} />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">No invoices yet</h2>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
              Upload PDF invoices above. We&apos;ll parse them and list them here with status and
              supplier details.
            </p>
          </div>
        ) : (
          <>
            {p.isRefreshing && (
              <div
                className="h-1 rounded-full bg-slate-200/80 overflow-hidden mb-2"
                role="status"
                aria-live="polite"
                aria-label="Refreshing invoice list"
              >
                <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400 documents-refresh-bar" />
              </div>
            )}
            {p.hasSelection && (
              <DocumentsBulkBar
                selectedIds={p.selectedIds}
                documents={p.documents}
                confirmingBulkDelete={p.confirmingBulkDelete}
                bulkProcessing={p.bulkProcessing}
                onCancelBulkConfirm={() => p.setConfirmingBulkDelete(false)}
                onConfirmBulkDelete={p.performBulkDelete}
                onBulkUnmarkDefective={p.bulkUnmarkDefective}
                onBulkRetry={p.bulkRetry}
                onStartBulkDeleteConfirm={() => p.setConfirmingBulkDelete(true)}
                onClearSelection={p.clearSelection}
              />
            )}

            <DocumentsTable
              documents={p.documents}
              selectedIds={p.selectedIds}
              confirmingDeleteId={p.confirmingDeleteId}
              bulkProcessing={p.bulkProcessing}
              retryingId={p.retryingId}
              onToggleSelect={p.toggleSelect}
              onToggleSelectAll={p.toggleSelectAll}
              onRetry={p.retryDocument}
              onConfirmDelete={p.confirmDeleteSingle}
              onCancelDelete={p.cancelDeleteSingle}
              onPerformDelete={p.performDeleteSingle}
            />

            <DocumentsPagination pagination={p.pagination} onGoToPage={p.goToPage} />
          </>
        )}
      </div>
    </div>
  );
};

export default Documents;
