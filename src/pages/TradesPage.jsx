import { useEffect, useState, useMemo } from "react";
import {
  fetchAllTrades,
  fetchIncrementalTrades,
} from "../services/tradeService";

/* ================= COST BASIS + P/L ================= */
function calculateSummary(trades) {
  let totalBuy = 0;
  let totalSell = 0;

  trades.forEach((t) => {
    const value = t.price * t.quantity;

    if (t.side === "BUY") totalBuy += value;
    if (t.side === "SELL") totalSell += value;
  });

  return {
    invested: totalBuy,
    returned: totalSell,
    pnl: totalSell - totalBuy,
  };
}

/* ================= PAGE ================= */
export default function TradesPage() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");

  /* 🔹 INITIAL FULL LOAD (ONCE) */
  const loadTrades = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await fetchAllTrades();
      const data = res?.data?.data || [];

      setTrades(data);

      if (data.length === 0) {
        setMessage("No trades found");
      }
    } catch (e) {
      console.error("Failed to fetch trades", e);
      setMessage("Unable to load trades");
    } finally {
      setLoading(false);
    }
  };

  /* 🔹 MANUAL INCREMENTAL SYNC */
  const syncTrades = async () => {
    if (syncing) return; // 🚫 spam protection

    try {
      setSyncing(true);
      setMessage("");

      const res = await fetchIncrementalTrades();
      const newTrades = res?.data?.data || [];

      if (newTrades.length === 0) {
        setMessage("No new trades found");
        return;
      }

      // 🧠 Merge without duplicates (latest on top)
      setTrades((prev) => {
        const ids = new Set(prev.map((t) => t.tradeId));
        const filtered = newTrades.filter(
          (t) => !ids.has(t.tradeId)
        );
        return [...filtered, ...prev];
      });

      setMessage(`${newTrades.length} new trades synced`);
    } catch (e) {
      console.error("Failed to sync trades", e);

      if (e.response?.status === 503) {
        setMessage(
          "Trade sync temporarily unavailable. Please try again later."
        );
      } else if (e.response?.status === 401) {
        setMessage("Session expired. Please login again.");
      } else {
        setMessage("Failed to sync trades");
      }
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    loadTrades();
  }, []);

  /* 🔹 SUMMARY */
  const summary = useMemo(
    () => calculateSummary(trades),
    [trades]
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Trades</h1>

        <button
          onClick={syncTrades}
          disabled={syncing}
          className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded disabled:opacity-50"
        >
          {syncing ? "Syncing..." : "Sync Trades"}
        </button>
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 p-4 rounded">
          <p className="text-slate-400 text-sm">Invested</p>
          <p className="text-xl">
            ${summary.invested.toFixed(2)}
          </p>
        </div>

        <div className="bg-slate-900 p-4 rounded">
          <p className="text-slate-400 text-sm">Returned</p>
          <p className="text-xl">
            ${summary.returned.toFixed(2)}
          </p>
        </div>

        <div className="bg-slate-900 p-4 rounded">
          <p className="text-slate-400 text-sm">Profit / Loss</p>
          <p
            className={`text-xl ${
              summary.pnl >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            ${summary.pnl.toFixed(2)}
          </p>
        </div>
      </div>

      {/* ================= STATUS MESSAGE ================= */}
      {!loading && message && (
        <p className="mb-4 text-slate-400">{message}</p>
      )}

      {/* ================= TABLE ================= */}
      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : trades.length === 0 ? (
        <p className="text-slate-400">No trades found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-slate-700 rounded-lg">
            <thead className="bg-slate-800">
              <tr>
                <th className="p-3 text-left">Asset</th>
                <th className="p-3 text-left">Side</th>
                <th className="p-3 text-left">Qty</th>
                <th className="p-3 text-left">Price (USD)</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((t, i) => (
                <tr
                  key={i}
                  className="border-t border-slate-700 hover:bg-slate-800/50"
                >
                  <td className="p-3 font-medium">
                    {t.assetSymbol}
                  </td>
                  <td
                    className={`p-3 ${
                      t.side === "BUY"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {t.side}
                  </td>
                  <td className="p-3">{t.quantity}</td>
                  <td className="p-3">
                    ${t.price.toFixed(2)}
                  </td>
                  <td className="p-3 text-sm text-slate-400">
                    {new Date(t.tradeTime).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
