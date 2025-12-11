// src/components/risk/RiskAlertsList.jsx

const MOCK_ALERTS = [
  {
    id: 1,
    level: "high",
    title: "Potential Rug Pull Detected",
    token: "RUG",
    exchange: "Wallet",
    reason: "Token appears in CryptoScamDB; suspicious holder distribution.",
    time: "5 min ago",
  },
  {
    id: 2,
    level: "medium",
    title: "High Volatility Token",
    token: "NEWCOIN",
    exchange: "Binance",
    reason: "Price changed more than 25% in last 24 hours.",
    time: "1 hour ago",
  },
  {
    id: 3,
    level: "low",
    title: "Low Liquidity",
    token: "ALT123",
    exchange: "Metamask",
    reason: "Daily volume under $10k; may be hard to exit.",
    time: "Yesterday",
  },
];

function levelBadge(level) {
  const base = "px-2 py-1 rounded-full text-xs font-semibold";
  if (level === "high") return `${base} bg-red-500/10 text-red-400`;
  if (level === "medium") return `${base} bg-amber-500/10 text-amber-400`;
  return `${base} bg-emerald-500/10 text-emerald-400`;
}

export default function RiskAlertsList() {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Active Risk & Scam Alerts</h2>
        <span className="text-xs text-slate-500">
          {MOCK_ALERTS.length} alerts
        </span>
      </div>

      <div className="space-y-2">
        {MOCK_ALERTS.map((alert) => (
          <div
            key={alert.id}
            className="border border-slate-800 rounded-lg px-3 py-2 text-sm bg-slate-900/40"
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{alert.title}</div>
                <div className="text-xs text-slate-400">
                  Token <span className="font-mono">{alert.token}</span> ·{" "}
                  {alert.exchange} · {alert.time}
                </div>
              </div>
              <span className={levelBadge(alert.level)}>
                {alert.level.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">{alert.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
