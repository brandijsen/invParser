import { useParams } from "react-router-dom";
import PageLoadingShell from "../components/PageLoadingShell";
import DocumentHeader from "../components/DocumentHeader";
import PrimaryAmountCard from "../components/PrimaryAmountCard";
import FinancialBreakdown from "../components/FinancialBreakdown";
import RedFlagsAlert from "../components/RedFlagsAlert";
import TagSelector from "../components/TagSelector";
import { useDocumentDetail } from "../hooks/useDocumentDetail";
import DocumentDetailNotFound from "../components/documentDetail/DocumentDetailNotFound";
import DocumentDetailProcessingView from "../components/documentDetail/DocumentDetailProcessingView";
import DocumentDetailNoResultYet from "../components/documentDetail/DocumentDetailNoResultYet";
import WrongDocumentTypeAlert from "../components/documentDetail/WrongDocumentTypeAlert";
import DocumentSupplierCard from "../components/documentDetail/DocumentSupplierCard";
import DocumentStatusDefectiveCard from "../components/documentDetail/DocumentStatusDefectiveCard";
import DocumentPreviewTabs from "../components/documentDetail/DocumentPreviewTabs";

const DocumentDetail = () => {
  const { id } = useParams();
  const {
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
  } = useDocumentDetail(id);

  if (loading) {
    return <PageLoadingShell />;
  }

  if (error === "not_found") {
    return <DocumentDetailNotFound />;
  }

  if (error === "processing") {
    return <DocumentDetailProcessingView document={document} documentId={id} />;
  }

  if (!parsed && !raw) {
    return <DocumentDetailNoResultYet />;
  }

  return (
    <div className="pt-20 sm:pt-24 pb-16 sm:pb-24 min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        <DocumentHeader document={document} parsed={parsed} resultMetadata={resultMetadata} />

        {isNotInvoice && (
          <WrongDocumentTypeAlert parsed={parsed} wrongDocumentFlag={wrongDocumentFlag} />
        )}

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <TagSelector documentId={id} documentTags={documentTags} onTagsChange={setDocumentTags} />
        </div>

        <DocumentSupplierCard document={document} parsed={parsed} />

        {parsed && (
          <RedFlagsAlert parsed={parsed} validationFlags={validationFlags} />
        )}

        {parsed && (
          <>
            <PrimaryAmountCard amounts={amounts} documentSubtype={parsed.document_subtype} />
            <FinancialBreakdown amounts={amounts} documentSubtype={parsed.document_subtype} />
            <DocumentStatusDefectiveCard
              document={document}
              hasValidationIssues={hasValidationIssues}
              onMarkDefective={handleMarkDefective}
            />
          </>
        )}

        {!parsed && raw && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
            ⚠️ Parsing in progress. Raw text is available below.
          </div>
        )}

        <DocumentPreviewTabs
          documentId={id}
          tab={tab}
          setTab={setTab}
          parsed={parsed}
          raw={raw}
          document={document}
        />
      </div>
    </div>
  );
};

export default DocumentDetail;
