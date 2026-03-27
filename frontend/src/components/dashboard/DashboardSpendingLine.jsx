import { FiDollarSign } from "react-icons/fi";
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

export default function DashboardSpendingLine({ spendingData, currencyKeys }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-1 flex items-center gap-2">
        <FiDollarSign className="w-5 h-5" />
        Spending over time (last 90 days)
      </h2>
      <p className="text-sm text-slate-500 mb-4">
        Total amount per month. Each point = one month (e.g. Feb 2026). Each line = one currency (EUR, GBP,
        USD).
      </p>
      {spendingData.length > 0 && currencyKeys.length > 0 ? (
        <ResponsiveContainer width="100%" height={280} className="[&_*]:outline-none">
          <LineChart
            data={spendingData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            cursor={false}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis
              tickFormatter={(v) => (typeof v === "number" ? v.toLocaleString("en-US") : v)}
              domain={["auto", "auto"]}
            />
            <Tooltip
              cursor={false}
              formatter={(value) =>
                typeof value === "number"
                  ? value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : value
              }
            />
            <Legend />
            {currencyKeys.map((key, i) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={["#10b981", "#3b82f6", "#f59e0b"][i % 3]}
                strokeWidth={2}
                name={key}
                dot={{ r: 4 }}
                activeDot={false}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[280px] flex items-center justify-center text-slate-500">No spending data</div>
      )}
    </div>
  );
}
