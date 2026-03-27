import PageLoadingShell from "../components/PageLoadingShell";
import { useDashboardData } from "../hooks/useDashboardData";
import DashboardLoadError from "../components/dashboard/DashboardLoadError";
import DashboardKpiCards from "../components/dashboard/DashboardKpiCards";
import DashboardLatestUploads from "../components/dashboard/DashboardLatestUploads";
import DashboardDocumentTypePie from "../components/dashboard/DashboardDocumentTypePie";
import DashboardDueDatesBar from "../components/dashboard/DashboardDueDatesBar";
import DashboardSpendingLine from "../components/dashboard/DashboardSpendingLine";
import DashboardUploadTrend from "../components/dashboard/DashboardUploadTrend";
import DashboardQuickActions from "../components/dashboard/DashboardQuickActions";
import {
  buildTypeChartData,
  buildDueDateChartData,
  buildSpendingChartData,
  buildUploadChartData,
} from "../utils/dashboardDerivedData";

const Dashboard = () => {
  const { overview, trends, latestDocuments, loading, error } = useDashboardData();

  if (loading) {
    return <PageLoadingShell />;
  }

  if (error) {
    return <DashboardLoadError message={error} />;
  }

  const typeData = buildTypeChartData(trends?.typeDistribution);
  const dueDateData = buildDueDateChartData(trends?.dueDateDistribution);
  const { spendingData, currencyKeys } = buildSpendingChartData(trends?.spendingTrend);
  const uploadData = buildUploadChartData(trends?.uploadTrend);

  return (
    <div className="pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-24 min-h-screen bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1 text-sm sm:text-base">
            Overview of your invoices and statistics
          </p>
        </div>

        <DashboardKpiCards overview={overview} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardLatestUploads latestDocuments={latestDocuments} />
          <DashboardDocumentTypePie typeData={typeData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardDueDatesBar dueDateData={dueDateData} />
          <DashboardSpendingLine spendingData={spendingData} currencyKeys={currencyKeys} />
        </div>

        <DashboardUploadTrend uploadData={uploadData} />

        <DashboardQuickActions />
      </div>
    </div>
  );
};

export default Dashboard;
