// src/components/reports/ReportsTable.jsx

const MOCK_REPORTS = [
  {
    id: 1,
    period: "Jan–Mar 2025",
    realized: 450,
    unrealized: 1200,
    exported: true,
  },
  {
    id: 2,
    period: "FY 2024",
    realized: 2100,
    unrealized: 800,
    exported: false,
  },
];

export default function ReportsTable() {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center">
        <h2 className="text-sm font-semibold">P&amp;L / Tax Periods</h2>
        <button className="text-xs px-3 py-1 rounded-lg bg-emerald-500 text-black font-semibold">
          Export CSV
        </button>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-slate-900/70 text-xs uppercase text-slate-400">
          <tr>
            <th className="px-4 py-2 text-left">Period</th>
            <th className="px-4 py-2 text-right">Realized P&amp;L</th>
            <th className="px-4 py-2 text-right">Unrealized P&amp;L</th>
            <th className="px-4 py-2 text-center">Exported</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_REPORTS.map((row) => (
            <tr key={row.id} className="border-t border-slate-800">
              <td className="px-4 py-2">{row.period}</td>
              <td className="px-4 py-2 text-right">
                {row.realized >= 0 ? "+" : "-"}$
                {Math.abs(row.realized).toLocaleString()}
              </td>
              <td className="px-4 py-2 text-right">
                {row.unrealized >= 0 ? "+" : "-"}$
                {Math.abs(row.unrealized).toLocaleString()}
              </td>
              <td className="px-4 py-2 text-center">
                {row.exported ? (
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
                    Ready
                  </span>
                ) : (
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-200">
                    Pending
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
