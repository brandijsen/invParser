import { useState } from "react";
import { FiRefreshCw, FiWifiOff } from "react-icons/fi";

const ServiceUnavailable = ({ onRetry }) => {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    setRetrying(true);
    await onRetry?.();
    setRetrying(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-600 mb-6">
          <FiWifiOff className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-semibold text-slate-900">Service unavailable</h1>
        <p className="mt-3 text-slate-600">
          The server is not responding. Please check your connection and try again in a few minutes.
        </p>
        <button
          onClick={handleRetry}
          disabled={retrying}
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 transition"
        >
          <FiRefreshCw className={`w-5 h-5 ${retrying ? "animate-spin" : ""}`} />
          {retrying ? "Checking…" : "Retry"}
        </button>
      </div>
    </div>
  );
};

export default ServiceUnavailable;
