import { useDocumentUpload } from "../hooks/useDocumentUpload";
import DocumentUploadDropZone from "./documentUpload/DocumentUploadDropZone";
import DocumentUploadQueue from "./documentUpload/DocumentUploadQueue";

const DocumentUpload = ({ onUploaded }) => {
  const {
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
  } = useDocumentUpload({ onUploaded });

  return (
    <div className="space-y-5">
      <DocumentUploadDropZone
        inputRef={inputRef}
        isDragging={isDragging}
        isUploading={isUploading}
        error={error}
        onInputChange={onInputChange}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onBrowseClick={onBrowseClick}
      />
      <DocumentUploadQueue
        uploadQueue={uploadQueue}
        successCount={successCount}
        totalQueue={totalQueue}
      />
    </div>
  );
};

export default DocumentUpload;
