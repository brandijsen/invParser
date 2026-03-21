/**
 * Skeleton for the invoices table — matches layout to limit CLS vs full-page spinner.
 */
const Row = () => (
  <tr className="border-b border-slate-100 last:border-0">
    <td className="px-6 py-4 w-10">
      <div className="h-4 w-4 rounded bg-slate-200/90 animate-pulse" />
    </td>
    <td className="px-6 py-4">
      <div className="h-4 max-w-[200px] rounded-md bg-slate-200/90 animate-pulse" />
    </td>
    <td className="px-6 py-4">
      <div className="h-4 w-28 rounded-md bg-slate-200/80 animate-pulse" />
    </td>
    <td className="px-6 py-4">
      <div className="h-7 w-24 rounded-full bg-slate-200/80 animate-pulse" />
    </td>
    <td className="px-6 py-4">
      <div className="h-4 w-32 rounded-md bg-slate-200/80 animate-pulse" />
    </td>
    <td className="px-6 py-4">
      <div className="h-6 w-16 rounded-md bg-slate-200/80 animate-pulse" />
    </td>
    <td className="px-6 py-4">
      <div className="h-8 w-20 rounded-md bg-slate-200/80 animate-pulse" />
    </td>
  </tr>
);

const DocumentsListSkeleton = ({ rows = 8 }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/80 flex items-center gap-2">
      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden />
      <p className="text-sm text-slate-600 font-medium">Loading your invoices…</p>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[640px]">
        <thead className="bg-slate-50/90 border-b border-slate-100">
          <tr>
            {["", "File", "Uploaded", "Status", "Supplier", "Badges", "Actions"].map((h, i) => (
              <th
                key={i}
                className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {Array.from({ length: rows }, (_, i) => (
            <Row key={i} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default DocumentsListSkeleton;
