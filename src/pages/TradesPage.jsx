import { useEffect, useState, useMemo, useRef } from "react";
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

  // 🔥 STRICT MODE GUARD
  const hasLoadedRef = useRef(false);

  /* ================= PAGE LOAD → INCREMENTAL ONLY ================= */
  const loadIncrementalTrades = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await fetchIncrementalTrades();
      const data = res?.data?.data || [];

      setTrades(data);

      if (data.length === 0) {
        setMessage("No trades found");
      }
    } catch (e) {
      console.error(e);
      setMessage("Unable to load trades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // ✅ Prevent double call in React 18 StrictMode
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    loadIncrementalTrades();
  }, []);

  /* ================= MANUAL INCREMENTAL SYNC ================= */
  const syncTrades = async () => {
    if (syncing) return;

    try {
      setSyncing(true);
      setMessage("");

      const res = await fetchIncrementalTrades();
      const newTrades = res?.data?.data || [];

      if (newTrades.length === 0) {
        setMessage("No new trades found");
        return;
      }

      setTrades((prev) => {
        const ids = new Set(prev.map((t) => t.tradeId));
        const filtered = newTrades.filter(
          (t) => !ids.has(t.tradeId)
        );
        return [...filtered, ...prev];
      });

      setMessage(`${newTrades.length} new trades synced`);
    } catch (e) {
      if (e.response?.status === 503) {
        setMessage(
          "Trade sync temporarily unavailable. Please try later."
        );
      } else {
        setMessage("Failed to sync trades");
      }
    } finally {
      setSyncing(false);
    }
  };

  /* ================= FETCH ALL (WARNING) ================= */
  const fetchAllWithWarning = async () => {
    const ok = window.confirm(
      "⚠️ Fetching ALL previous trades may take 20–30 minutes and may hit exchange rate limits.\n\nDo you want to continue?"
    );

    if (!ok) return;

    try {
      setLoading(true);
      setMessage("");

      const res = await fetchAllTrades();
      const data = res?.data?.data || [];

      setTrades(data);
      setMessage("All historical trades loaded");
    } catch (e) {
      setMessage("Failed to fetch all trades");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SUMMARY ================= */
  const summary = useMemo(
    () => calculateSummary(trades),
    [trades]
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Trades</h1>

        <div className="flex gap-3">
          <button
            onClick={syncTrades}
            disabled={syncing}
            className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded disabled:opacity-50"
          >
            {syncing ? "Syncing..." : "Sync Trades"}
          </button>

          <button
            onClick={fetchAllWithWarning}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          >
            Fetch All Previous Trades
          </button>
        </div>
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 p-4 rounded">
          <p className="text-slate-400 text-sm">Invested</p>
          <p className="text-xl">${summary.invested.toFixed(2)}</p>
        </div>

        <div className="bg-slate-900 p-4 rounded">
          <p className="text-slate-400 text-sm">Returned</p>
          <p className="text-xl">${summary.returned.toFixed(2)}</p>
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

      {/* ================= MESSAGE ================= */}
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
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((t, i) => (
                <tr
                  key={i}
                  className="border-t border-slate-700 hover:bg-slate-800/50"
                >
                  <td className="p-3">{t.assetSymbol}</td>
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
