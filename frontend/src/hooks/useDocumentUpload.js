import { useRef, useState, useCallback } from "react";
import api from "../api/axios";

/**
 * Upload queue item: { id, file, status, progress, error }
 */
export function useDocumentUpload({ onUploaded } = {}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [error, setError] = useState("");

  const uploadBatchFiles = useCallback(async (queueItems) => {
    setUploadQueue((prev) =>
      prev.map((q) =>
        queueItems.find((i) => i.id === q.id) ? { ...q, status: "uploading" } : q
      )
    );

    try {
      const formData = new FormData();
      queueItems.forEach((item) => {
        formData.append("files", item.file);
      });

      await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadQueue((prev) =>
            prev.map((q) =>
              queueItems.find((i) => i.id === q.id) ? { ...q, progress } : q
            )
          );
        },
      });

      setUploadQueue((prev) =>
        prev.map((q) =>
          queueItems.find((i) => i.id === q.id)
            ? { ...q, status: "success", progress: 100 }
            : q
        )
      );
    } catch (err) {
      if (err.response?.status === 429) {
        const errorData = err.response?.data;
        const retryAfter = errorData?.retryAfter || 30;
        const errorMsg =
          errorData?.message ||
          `Upload limit reached. Please wait ${retryAfter} seconds.`;

        setError(errorMsg);

        setUploadQueue((prev) =>
          prev.map((q) =>
            queueItems.find((i) => i.id === q.id)
              ? { ...q, status: "error", error: `Rate limit: Wait ${retryAfter}s` }
              : q
          )
        );

        setTimeout(() => setError(""), 5000);

        console.error("🛡️ Rate limit exceeded:", errorMsg);
        return;
      }

      setUploadQueue((prev) =>
        prev.map((q) =>
          queueItems.find((i) => i.id === q.id)
            ? { ...q, status: "error", error: "Batch upload failed" }
            : q
        )
      );
      console.error("❌ Batch upload failed:", err);
    }
  }, []);

  const uploadSingleFile = useCallback(async (queueItem) => {
    setUploadQueue((prev) =>
      prev.map((q) =>
        q.id === queueItem.id ? { ...q, status: "uploading" } : q
      )
    );

    try {
      const formData = new FormData();
      formData.append("files", queueItem.file);

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

      setUploadQueue((prev) =>
        prev.map((q) =>
          q.id === queueItem.id
            ? { ...q, status: "success", progress: 100 }
            : q
        )
      );
    } catch (err) {
      if (err.response?.status === 429) {
        const errorData = err.response?.data;
        const retryAfter = errorData?.retryAfter || 30;
        const errorMsg =
          errorData?.message ||
          `Upload limit reached. Please wait ${retryAfter} seconds.`;

        setError(errorMsg);

        setUploadQueue((prev) =>
          prev.map((q) =>
            q.id === queueItem.id
              ? { ...q, status: "error", error: `Rate limit: Wait ${retryAfter}s` }
              : q
          )
        );

        setTimeout(() => setError(""), 5000);

        console.error("🛡️ Rate limit exceeded:", errorMsg);
        return;
      }

      setUploadQueue((prev) =>
        prev.map((q) =>
          q.id === queueItem.id
            ? { ...q, status: "error", error: "Upload failed" }
            : q
        )
      );
    }
  }, []);

  const handleFiles = useCallback(
    async (files) => {
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

      const queueItems = pdfFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        status: "pending",
        progress: 0,
        error: null,
      }));

      setUploadQueue((prev) => [...prev, ...queueItems]);

      if (pdfFiles.length > 1) {
        await uploadBatchFiles(queueItems);
      } else {
        await uploadSingleFile(queueItems[0]);
      }

      onUploaded?.();

      setTimeout(() => {
        setUploadQueue((prev) =>
          prev.filter((q) => !queueItems.find((i) => i.id === q.id))
        );
      }, 3000);
    },
    [onUploaded, uploadBatchFiles, uploadSingleFile]
  );

  const onInputChange = useCallback(
    (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files);
      }
    },
    [handleFiles]
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onBrowseClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const isUploading = uploadQueue.some((q) => q.status === "uploading");
  const successCount = uploadQueue.filter((q) => q.status === "success").length;
  const totalQueue = uploadQueue.length;

  return {
    inputRef,
    isDragging,
    uploadQueue,
    error,
    isUploading,
    successCount,
    totalQueue,
    onInputChange,
    onDrop,
    onDragOver,
    onDragLeave,
    onBrowseClick,
  };
}
