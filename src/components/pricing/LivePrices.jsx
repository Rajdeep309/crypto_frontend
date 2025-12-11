// src/components/pricing/LivePrices.jsx
import { useEffect, useState } from "react";

const COINS = [
  { id: "bitcoin", symbol: "BTC" },
  { id: "ethereum", symbol: "ETH" },
  { id: "solana", symbol: "SOL" },
];

export default function LivePrices() {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPrices() {
      try {
        setLoading(true);
        setError("");

        const ids = COINS.map(c => c.id).join(",");
        const url =
          `https://api.coingecko.com/api/v3/simple/price` +
          `?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Failed to fetch prices");
        }

        const data = await res.json();
        setPrices(data);
      } catch (err) {
        console.error(err);
        setError("Could not load live prices. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchPrices();
  }, []);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center">
        <h2 className="text-sm font-semibold">Live Prices (CoinGecko)</h2>
        {loading && (
          <span className="text-xs text-slate-500">Loading...</span>
        )}
      </div>

      {error && (
        <div className="px-4 py-3 text-xs text-red-400 border-b border-slate-800">
          {error}
        </div>
      )}

      <table className="w-full text-sm">
        <thead className="bg-slate-900/70 text-xs uppercase text-slate-400">
          <tr>
            <th className="px-4 py-2 text-left">Asset</th>
            <th className="px-4 py-2 text-right">Price (USD)</th>
            <th className="px-4 py-2 text-right">24h Change</th>
          </tr>
        </thead>
        <tbody>
          {COINS.map((coin) => {
            const info = prices[coin.id];
            const price = info?.usd;
            const change = info?.usd_24h_change;

            return (
              <tr key={coin.id} className="border-t border-slate-800">
                <td className="px-4 py-2 font-medium">{coin.symbol}</td>
                <td className="px-4 py-2 text-right">
                  {price
                    ? `$${price.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}`
                    : "-"}
                </td>
                <td className="px-4 py-2 text-right">
                  {typeof change === "number" ? (
                    <span
                      className={
                        change >= 0
                          ? "text-emerald-400 text-xs"
                          : "text-red-400 text-xs"
                      }
                    >
                      {change >= 0 ? "+" : ""}
                      {change.toFixed(2)}%
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
