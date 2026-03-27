import { FiDownload, FiTrash2 } from "react-icons/fi";

export default function ProfileDataPrivacySection({
  exportLoading,
  onExportData,
  onOpenDeleteModal,
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mt-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Data & Privacy</h2>
      <p className="text-sm text-slate-600 mb-4">
        Export your data or permanently delete your account (GDPR rights).
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onExportData}
          disabled={exportLoading}
          className="px-4 py-2 rounded-lg bg-slate-100 text-slate-800 font-medium hover:bg-slate-200 disabled:opacity-50 flex items-center gap-2"
        >
          <FiDownload size={16} />
          {exportLoading ? "Exporting…" : "Export my data"}
        </button>
        <button
          type="button"
          onClick={onOpenDeleteModal}
          className="px-4 py-2 rounded-lg bg-red-50 text-red-700 font-medium hover:bg-red-100 flex items-center gap-2"
        >
          <FiTrash2 size={16} />
          Delete account
        </button>
      </div>
    </div>
  );
}
