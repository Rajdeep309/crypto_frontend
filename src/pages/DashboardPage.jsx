// src/pages/DashboardPage.jsx
import StatCard from "../components/ui/StatCard";
import PortfolioValueChart from "../components/charts/PortfolioValueChart";
import LivePrices from "../components/pricing/LivePrices";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-slate-400">
          {/* Welcome to your Crypto Portfolio Tracker frontend 👋 */}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Portfolio Value"
          value="$12,450"
          subtitle="Across 3 exchanges"
        />
        <StatCard
          title="24h P&L"
          value="+$320 (2.6%)"
          subtitle="Since yesterday"
        />
        <StatCard
          title="Open Risk Alerts"
          value="2"
          subtitle="1 high · 1 medium"
        />
        <StatCard
          title="Tax Reports"
          value="Ready"
          subtitle="Last export 3 days ago"
        />
      </div>

      {/* Chart + Live Prices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PortfolioValueChart />
        <LivePrices />
      </div>
    </div>
  );
}
