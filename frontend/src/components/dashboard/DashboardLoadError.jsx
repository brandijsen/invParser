export default function DashboardLoadError({ message }) {
  return (
    <div className="pt-24 sm:pt-32 pb-24 min-h-screen bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-amber-800">
          <p className="font-medium">Unable to load dashboard</p>
          <p className="text-sm mt-1">{message}</p>
          <p className="text-xs mt-3 text-amber-600">
            Ensure the backend is running (port 5000) and MySQL is active.
          </p>
        </div>
      </div>
    </div>
  );
}
