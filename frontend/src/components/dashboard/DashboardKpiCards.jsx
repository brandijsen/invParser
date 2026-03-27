import { FiFileText, FiCheckCircle, FiXCircle, FiAlertTriangle } from "react-icons/fi";

export default function DashboardKpiCards({ overview }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 mb-1">Total Documents</p>
            <p className="text-3xl font-bold text-slate-900">{overview?.documents?.total ?? 0}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
            <FiFileText className="w-6 h-6 text-slate-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 mb-1">Processed</p>
            <p className="text-3xl font-bold text-emerald-600">{overview?.documents?.done ?? 0}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
            <FiCheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 mb-1">Failed</p>
            <p className="text-3xl font-bold text-amber-600">{overview?.documents?.failed ?? 0}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <FiXCircle className="w-6 h-6 text-amber-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 mb-1">Defective</p>
            <p className="text-3xl font-bold text-red-600">{overview?.defective ?? 0}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <FiAlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
