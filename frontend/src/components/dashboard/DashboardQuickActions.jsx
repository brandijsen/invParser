import { Link } from "react-router-dom";

export default function DashboardQuickActions() {
  return (
    <div className="bg-linear-to-r from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200 p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-semibold text-emerald-900 mb-2">Quick Actions</h2>
      <p className="text-sm text-emerald-700 mb-4">Ready to manage your documents?</p>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <Link
          to="/documents"
          className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          Upload new invoice
        </Link>
      </div>
    </div>
  );
}
