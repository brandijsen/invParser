import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";

export function useDocumentDetail(id) {
  const { showToast } = useToast();

  const [document, setDocument] = useState(null);
  const [parsed, setParsed] = useState(null);
  const [resultMetadata, setResultMetadata] = useState(null);
  const [validationFlags, setValidationFlags] = useState([]);
  const [raw, setRaw] = useState("");
  const [tab, setTab] = useState("pdf");
  const [documentTags, setDocumentTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const resDoc = await api.get(`/documents/${id}`);
        setDocument(resDoc.data);

        const [resParsed, resRaw, resTags] = await Promise.allSettled([
          api.get(`/documents/${id}/result`),
          api.get(`/documents/${id}/raw`),
          api.get(`/documents/${id}/tags`),
        ]);

        if (resParsed.status === "fulfilled") {
          setParsed(resParsed.value.data.parsed_json || resParsed.value.data);
          setResultMetadata({
            manually_edited: resParsed.value.data.manually_edited,
            edited_at: resParsed.value.data.edited_at,
          });
          const parsedData = resParsed.value.data.parsed_json || resParsed.value.data;
          setValidationFlags(parsedData?.validation_flags || []);
        }
        if (resRaw.status === "fulfilled") setRaw(resRaw.value.data.raw_text);
        if (resTags.status === "fulfilled") setDocumentTags(resTags.value.data.tags || []);

        if (resParsed.status === "rejected" && resRaw.status === "rejected") {
          const status = resDoc.data?.status;
          if (status === "pending" || status === "processing") {
            setError("processing");
          } else if (resParsed.reason?.response?.status === 404) {
            setError("not_found");
          }
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setError("not_found");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  const refreshDocument = useCallback(async () => {
    const resDoc = await api.get(`/documents/${id}`);
    setDocument(resDoc.data);
  }, [id]);

  const handleMarkDefective = useCallback(async () => {
    try {
      if (document.is_defective) {
        await api.post(`/documents/${id}/unmark-defective`);
      } else {
        await api.post(`/documents/${id}/mark-defective`);
      }
      await refreshDocument();
    } catch (err) {
      console.error("Failed to mark/unmark defective:", err);
      showToast("Operation failed");
    }
  }, [document, id, refreshDocument, showToast]);

  const hasValidationIssues = validationFlags.length > 0;
  const amounts = parsed?.semantic?.amounts;
  const isNotInvoice = parsed?.document_type && parsed.document_type !== "invoice";
  const wrongDocumentFlag = validationFlags.find((f) => f.type === "wrong_document_type");

  return {
    document,
    parsed,
    resultMetadata,
    validationFlags,
    raw,
    tab,
    setTab,
    documentTags,
    setDocumentTags,
    loading,
    error,
    hasValidationIssues,
    amounts,
    isNotInvoice,
    wrongDocumentFlag,
    handleMarkDefective,
    refreshDocument,
  };
}
