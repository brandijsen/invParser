import { FiTrendingUp } from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function DashboardUploadTrend({ uploadData }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <FiTrendingUp className="w-5 h-5" />
        Upload trend (last 30 days)
      </h2>
      {uploadData.length > 0 ? (
        <ResponsiveContainer width="100%" height={280} className="[&_*]:outline-none">
          <LineChart data={uploadData} cursor={false}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip cursor={false} />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#10b981"
              strokeWidth={2}
              name="Invoices"
              activeDot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[280px] flex items-center justify-center text-slate-500">
          No uploads in the last 30 days
        </div>
      )}
    </div>
  );
}
