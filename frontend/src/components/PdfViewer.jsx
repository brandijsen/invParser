import { useEffect, useState } from "react";
import api from "../api/axios";

/**
 * Visualizzatore PDF in-app.
 * Scarica il PDF con auth e lo mostra tramite iframe.
 */
const PdfViewer = ({ documentId, className = "" }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!documentId) return;

    let objectUrl = null;

    const loadPdf = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/documents/${documentId}/download`, {
          responseType: "blob",
        });
        objectUrl = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
        setPdfUrl(objectUrl);
      } catch (err) {
        setError("Unable to load PDF");
        console.error("PDF load failed:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPdf();

    return () => {
      if (objectUrl) {
        window.URL.revokeObjectURL(objectUrl);
      }
    };
  }, [documentId]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 rounded-lg ${className}`} style={{ minHeight: 500 }}>
        <p className="text-slate-500">Loading PDF…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-red-50 rounded-lg border border-red-200 ${className}`} style={{ minHeight: 200 }}>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!pdfUrl) return null;

  return (
    <iframe
      src={`${pdfUrl}#toolbar=1`}
      title="Document PDF"
      className={`w-full rounded-lg border border-slate-200 bg-white ${className}`}
      style={{ minHeight: 600 }}
    />
  );
};

export default PdfViewer;
