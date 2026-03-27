import { Link } from "react-router-dom";
import { FiClock } from "react-icons/fi";
import { STATUS_META } from "../../utils/dashboardDerivedData";

export default function DashboardLatestUploads({ latestDocuments }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <FiClock className="w-5 h-5" />
        Latest uploads
      </h2>
      {latestDocuments.length > 0 ? (
        <ul className="space-y-2">
          {latestDocuments.map((doc) => {
            const meta = STATUS_META[doc.status] || STATUS_META.pending;
            return (
              <li key={doc.id}>
                <Link
                  to={`/documents/${doc.id}`}
                  className="flex items-center justify-between gap-3 py-2 px-3 rounded-md hover:bg-slate-50 text-slate-800"
                >
                  <span className="truncate font-medium text-emerald-600 hover:underline">
                    {doc.original_name}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded ${meta.className}`}>{meta.label}</span>
                    <span className="text-xs text-slate-500">
                      {new Date(doc.uploaded_at).toLocaleDateString("en-US")}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="h-[200px] flex items-center justify-center text-slate-500">No invoices uploaded yet</div>
      )}
    </div>
  );
}
