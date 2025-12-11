import StatCard from "../components/ui/StatCard";
import ReportsTable from "../components/reports/ReportsTable";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-slate-400">
          Performance and tax-ready P&amp;L summaries (mock data).
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Realized P&L (YTD)"
          value="+$2,100"
          subtitle="Closed positions this year"
        />
        <StatCard
          title="Unrealized P&L"
          value="+$1,800"
          subtitle="Open positions"
        />
        <StatCard
          title="Last Exported"
          value="FY 2024"
          subtitle="Exported 3 days ago"
        />
      </div>

      {/* Table */}
      <ReportsTable />
    </div>
  );
}
