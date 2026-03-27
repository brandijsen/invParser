import { FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";

const DocumentUploadQueue = ({ uploadQueue, successCount, totalQueue }) => {
  if (uploadQueue.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm ring-1 ring-slate-100 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/80 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-800">Upload status</h3>
        <span className="text-xs font-medium tabular-nums text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200/80">
          {successCount} / {totalQueue} complete
        </span>
      </div>
      <ul className="divide-y divide-slate-100 p-2 sm:p-3 space-y-0">
        {uploadQueue.map((item) => (
          <li key={item.id} className="px-3 py-3 sm:px-4 rounded-xl sm:rounded-lg">
            <div className="flex items-start gap-3">
              <span
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                  item.status === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                    : item.status === "error"
                      ? "border-red-200 bg-red-50 text-red-600"
                      : item.status === "uploading"
                        ? "border-emerald-200 bg-white text-emerald-600"
                        : "border-slate-200 bg-slate-50 text-slate-400"
                }`}
              >
                {item.status === "pending" && <FiLoader className="w-4 h-4" />}
                {item.status === "uploading" && (
                  <FiLoader className="w-4 h-4 animate-spin" />
                )}
                {item.status === "success" && <FiCheckCircle className="w-4 h-4" />}
                {item.status === "error" && <FiXCircle className="w-4 h-4" />}
              </span>
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <p
                    className="text-sm font-medium text-slate-800 truncate"
                    title={item.file.name}
                  >
                    {item.file.name}
                  </p>
                  <span className="text-xs font-medium text-slate-500 shrink-0 tabular-nums">
                    {item.status === "success" && (
                      <span className="text-emerald-600">Done</span>
                    )}
                    {item.status === "error" && (
                      <span className="text-red-600">Failed</span>
                    )}
                    {item.status === "uploading" && `${item.progress}%`}
                    {item.status === "pending" && "Queued"}
                  </span>
                </div>
                {item.status === "uploading" && (
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full transition-all duration-300 upload-progress-inner max-w-full rounded-full"
                      style={{ "--upload-progress": `${item.progress}%` }}
                    />
                  </div>
                )}
                {item.status === "error" && item.error && (
                  <p className="text-xs text-red-600 leading-snug">{item.error}</p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentUploadQueue;
