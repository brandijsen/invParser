import { useRef, useState } from "react";
import api from "../api/axios";
import { FiUploadCloud, FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";

const DocumentUpload = ({ onUploaded }) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [error, setError] = useState("");

  const handleFiles = async (files) => {
    const pdfFiles = Array.from(files).filter(
      (file) => file.type === "application/pdf"
    );

    if (pdfFiles.length === 0) {
      setError("Only invoice PDFs are allowed");
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (pdfFiles.length !== files.length) {
      setError(`${files.length - pdfFiles.length} non-PDF file(s) skipped`);
      setTimeout(() => setError(""), 3000);
    }

    // Create queue items with initial state
    const queueItems = pdfFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: "pending", // pending | uploading | success | error
      progress: 0,
      error: null,
    }));

    setUploadQueue((prev) => [...prev, ...queueItems]);

    // 🎯 BATCH UPLOAD: invia tutti i file insieme se multipli
    if (pdfFiles.length > 1) {
      await uploadBatchFiles(queueItems);
    } else {
      // Single upload (backward compatibility)
      await uploadSingleFile(queueItems[0]);
    }

    // Refresh lista documenti dopo tutti gli upload
    onUploaded?.();

    // Clear queue after 3 seconds
    setTimeout(() => {
      setUploadQueue((prev) =>
        prev.filter((q) => !queueItems.find((i) => i.id === q.id))
      );
    }, 3000);
  };

  // 🎯 NEW: Upload batch of files in a single request
  const uploadBatchFiles = async (queueItems) => {
    // Mark all as "uploading"
    setUploadQueue((prev) =>
      prev.map((q) =>
        queueItems.find((i) => i.id === q.id)
          ? { ...q, status: "uploading" }
          : q
      )
    );

    try {
      const formData = new FormData();
      
      // Add all files to FormData
      queueItems.forEach((item) => {
        formData.append("files", item.file);
      });

      const response = await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          // Update progress for all files in batch
          setUploadQueue((prev) =>
            prev.map((q) =>
              queueItems.find((i) => i.id === q.id)
                ? { ...q, progress }
                : q
            )
          );
        },
      });

      // All files uploaded successfully
      setUploadQueue((prev) =>
        prev.map((q) =>
          queueItems.find((i) => i.id === q.id)
            ? { ...q, status: "success", progress: 100 }
            : q
        )
      );
    } catch (err) {
      // 🛡️ Rate Limit handling (429)
      if (err.response?.status === 429) {
        const errorData = err.response?.data;
        const retryAfter = errorData?.retryAfter || 30;
        const errorMsg = errorData?.message || `Upload limit reached. Please wait ${retryAfter} seconds.`;
        
        setError(errorMsg);
        
        // Mark all as error with specific message
        setUploadQueue((prev) =>
          prev.map((q) =>
            queueItems.find((i) => i.id === q.id)
              ? { ...q, status: "error", error: `Rate limit: Wait ${retryAfter}s` }
              : q
          )
        );
        
        // Keep error visible for 5 seconds
        setTimeout(() => setError(""), 5000);
        
        console.error("🛡️ Rate limit exceeded:", errorMsg);
        return;
      }
      
      // Generic batch error
      setUploadQueue((prev) =>
        prev.map((q) =>
          queueItems.find((i) => i.id === q.id)
            ? { ...q, status: "error", error: "Batch upload failed" }
            : q
        )
      );
      console.error("❌ Batch upload failed:", err);
    }
  };

  const uploadSingleFile = async (queueItem) => {
    // Aggiorna stato a "uploading"
    setUploadQueue((prev) =>
      prev.map((q) =>
        q.id === queueItem.id ? { ...q, status: "uploading" } : q
      )
    );

    try {
      const formData = new FormData();
      formData.append("files", queueItem.file); // Use "files" for batch consistency

      await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadQueue((prev) =>
            prev.map((q) => (q.id === queueItem.id ? { ...q, progress } : q))
          );
        },
      });

      // Successo
      setUploadQueue((prev) =>
        prev.map((q) =>
          q.id === queueItem.id
            ? { ...q, status: "success", progress: 100 }
            : q
        )
      );
    } catch (err) {
      // 🛡️ Rate Limit handling (429)
      if (err.response?.status === 429) {
        const errorData = err.response?.data;
        const retryAfter = errorData?.retryAfter || 30;
        const errorMsg = errorData?.message || `Upload limit reached. Please wait ${retryAfter} seconds.`;
        
        setError(errorMsg);
        
        setUploadQueue((prev) =>
          prev.map((q) =>
            q.id === queueItem.id
              ? { ...q, status: "error", error: `Rate limit: Wait ${retryAfter}s` }
              : q
          )
        );
        
        // Keep error visible for 5 seconds
        setTimeout(() => setError(""), 5000);
        
        console.error("🛡️ Rate limit exceeded:", errorMsg);
        return;
      }
      
      // Generic error
      setUploadQueue((prev) =>
        prev.map((q) =>
          q.id === queueItem.id
            ? { ...q, status: "error", error: "Upload failed" }
            : q
        )
      );
    }
  };

  const onInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const isUploading = uploadQueue.some((q) => q.status === "uploading");

  const successCount = uploadQueue.filter((q) => q.status === "success").length;
  const totalQueue = uploadQueue.length;

  return (
    <div className="space-y-5">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed py-12 px-6 sm:px-10 text-center transition-all duration-200 bg-white shadow-sm ring-1 ring-slate-200/60 ${
          isDragging
            ? "border-emerald-500 bg-gradient-to-b from-emerald-50/90 to-white ring-emerald-200/50 scale-[1.01]"
            : "border-slate-300/90 hover:border-emerald-400/60"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          multiple
          hidden
          onChange={onInputChange}
        />

        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 mb-5">
          <FiUploadCloud className="w-7 h-7" strokeWidth={1.5} />
        </div>

        <p className="text-slate-800 text-base font-semibold mb-1">
          {isDragging ? "Release to upload" : "Add invoice PDFs"}
        </p>
        <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
          Drag and drop here, or choose files. Multiple PDFs in one go are supported.
        </p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold shadow-sm hover:bg-emerald-700 disabled:opacity-55 disabled:cursor-not-allowed transition-colors"
        >
          {isUploading ? (
            <>
              <FiLoader className="w-4 h-4 mr-2 animate-spin" />
              Uploading…
            </>
          ) : (
            "Browse files"
          )}
        </button>

        <p className="text-xs text-slate-400 mt-5">
          Only PDF invoices. You can add several files in one go (maximum 20 at a time).
        </p>

        {error && (
          <p className="mt-5 text-sm text-red-700 font-medium bg-red-50 border border-red-100 rounded-lg px-4 py-2 inline-block max-w-md">
            {error}
          </p>
        )}
      </div>

      {uploadQueue.length > 0 && (
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
                    {item.status === "uploading" && <FiLoader className="w-4 h-4 animate-spin" />}
                    {item.status === "success" && <FiCheckCircle className="w-4 h-4" />}
                    {item.status === "error" && <FiXCircle className="w-4 h-4" />}
                  </span>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium text-slate-800 truncate" title={item.file.name}>
                        {item.file.name}
                      </p>
                      <span className="text-xs font-medium text-slate-500 shrink-0 tabular-nums">
                        {item.status === "success" && (
                          <span className="text-emerald-600">Done</span>
                        )}
                        {item.status === "error" && <span className="text-red-600">Failed</span>}
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
      )}
    </div>
  );
};

export default DocumentUpload;
