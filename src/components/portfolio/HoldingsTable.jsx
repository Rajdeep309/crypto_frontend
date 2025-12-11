// src/components/portfolio/HoldingsTable.jsx

const MOCK_HOLDINGS = [
  { asset: "BTC",  exchange: "Binance",  qty: 0.15, price: 41000, value: 6150,  risk: "low" },
  { asset: "ETH",  exchange: "Coinbase", qty: 1.8,  price: 2200,  value: 3960,  risk: "medium" },
  { asset: "SOL",  exchange: "Binance",  qty: 20,   price: 120,   value: 2400,  risk: "medium" },
  { asset: "RUG",  exchange: "Wallet",   qty: 5000, price: 0.01,  value: 50,    risk: "high" },
];

function riskBadge(risk) {
  const base = "px-2 py-1 rounded-full text-xs font-semibold";
  if (risk === "high") return `${base} bg-red-500/10 text-red-400`;
  if (risk === "medium") return `${base} bg-amber-500/10 text-amber-400`;
  return `${base} bg-emerald-500/10 text-emerald-400`;
}

export default function HoldingsTable() {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center">
        <h2 className="text-sm font-semibold">Holdings</h2>
        <span className="text-xs text-slate-500">
          Mock data · across exchanges
        </span>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-slate-900/70 text-xs uppercase text-slate-400">
          <tr>
            <th className="px-4 py-2 text-left">Asset</th>
            <th className="px-4 py-2 text-left">Exchange</th>
            <th className="px-4 py-2 text-right">Qty</th>
            <th className="px-4 py-2 text-right">Price (USD)</th>
            <th className="px-4 py-2 text-right">Value (USD)</th>
            <th className="px-4 py-2 text-center">Risk</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_HOLDINGS.map((row) => (
            <tr key={row.asset + row.exchange} className="border-t border-slate-800">
              <td className="px-4 py-2 font-medium">{row.asset}</td>
              <td className="px-4 py-2 text-slate-400">{row.exchange}</td>
              <td className="px-4 py-2 text-right">{row.qty}</td>
              <td className="px-4 py-2 text-right">
                {row.price.toLocaleString()}
              </td>
              <td className="px-4 py-2 text-right">
                {row.value.toLocaleString()}
              </td>
              <td className="px-4 py-2 text-center">
                <span className={riskBadge(row.risk)}>{row.risk}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
