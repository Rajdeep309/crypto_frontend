import HoldingsTable from "../components/portfolio/HoldingsTable";

export default function PortfolioPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Portfolio</h1>
        <p className="text-slate-400">
          All your exchange and wallet holdings (mock data).
        </p>
      </div>

      <HoldingsTable />
    </div>
  );
}
