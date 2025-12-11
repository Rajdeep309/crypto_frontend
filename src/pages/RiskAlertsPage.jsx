import RiskAlertsList from "../components/risk/RiskAlertsList";

export default function RiskAlertsPage() {
  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Risk & Alerts</h1>
          <p className="text-slate-400">
            Scam and risk insights based on your holdings (mock data).
          </p>
        </div>

        <RiskAlertsList />
      </div>
  );
}
