import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function DashboardDueDatesBar({ dueDateData }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Upcoming due dates</h2>
      {dueDateData.length > 0 ? (
        <ResponsiveContainer width="100%" height={280} className="[&_*]:outline-none">
          <BarChart
            data={dueDateData}
            layout="vertical"
            margin={{ left: 20, right: 8 }}
            cursor={false}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="name" width={28} tick={{ fontSize: 10 }} />
            <Tooltip cursor={false} />
            <Bar dataKey="count" name="Documenti" radius={[0, 4, 4, 0]} activeBar={false}>
              {dueDateData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[280px] flex items-center justify-center text-slate-500">
          No invoices with due dates in the next 60 days
        </div>
      )}
    </div>
  );
}
