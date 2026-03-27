import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function DashboardDocumentTypePie({ typeData }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Document type</h2>
      {typeData.length > 0 ? (
        <ResponsiveContainer width="100%" height={280} className="[&_*]:outline-none">
          <PieChart>
            <Pie
              data={typeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={90}
              dataKey="value"
              activeShape={false}
            >
              {typeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[280px] flex items-center justify-center text-slate-500">No data available</div>
      )}
    </div>
  );
}
