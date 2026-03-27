import { FiUploadCloud, FiLoader } from "react-icons/fi";

const DocumentUploadDropZone = ({
  inputRef,
  isDragging,
  isUploading,
  error,
  onInputChange,
  onDrop,
  onDragOver,
  onDragLeave,
  onBrowseClick,
}) => (
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
      onClick={onBrowseClick}
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
);

export default DocumentUploadDropZone;
