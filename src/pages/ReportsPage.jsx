import { useEffect, useState } from "react";
import {
  fetchPortfolioPnL,
  fetchRealizedPnL,
  fetchAssetPnL,
  exportPnLCsv,
} from "../services/pnlService";

export default function ReportsPage() {
  /* ================= STATE ================= */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [portfolioPnL, setPortfolioPnL] = useState(null);
  const [realizedPnL, setRealizedPnL] = useState(null);

  const [assetInput, setAssetInput] = useState("");
  const [assetPnL, setAssetPnL] = useState(null);
  const [assetLoading, setAssetLoading] = useState(false);

  /* ================= LOAD PORTFOLIO + REALIZED ================= */
  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");

      const [portfolioRes, realizedRes] = await Promise.all([
        fetchPortfolioPnL(),
        fetchRealizedPnL(),
      ]);

      setPortfolioPnL(portfolioRes.data.data);
      setRealizedPnL(realizedRes.data.data);
    } catch (e) {
      console.error("Reports load failed", e);
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD ASSET PnL ================= */
  const handleAssetPnL = async () => {
    if (!assetInput.trim()) return;

    const symbol = assetInput.trim().toUpperCase(); // 🔥 IMPORTANT

    try {
      setAssetLoading(true);
      setAssetPnL(null);

      const res = await fetchAssetPnL(symbol);
      setAssetPnL(res.data.data);
    } catch (e) {
      console.error("Asset PnL failed", e);
      setAssetPnL(null);
    } finally {
      setAssetLoading(false);
    }
  };

  /* ================= CSV EXPORT ================= */
  const downloadCsv = async () => {
    try {
      const res = await exportPnLCsv();

      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "pnl-report.csv";
      a.click();
    } catch {
      alert("CSV export failed");
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  if (loading) return <p className="p-8">Loading reports...</p>;
  if (error) return <p className="p-8 text-red-400">{error}</p>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl mb-2">Reports</h1>
      <p className="text-slate-400 mb-8">
        Profit, loss and tax summaries
      </p>

      {/* ================= SUMMARY ================= */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        {/* Realized */}
        <div className="bg-slate-900 p-6 rounded-xl">
          <p className="text-slate-400 text-sm">Realized P&L</p>
          <p
            className={`text-2xl font-semibold ${
              realizedPnL.realizedPnL >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            ${realizedPnL.realizedPnL.toFixed(2)}
          </p>
        </div>

        {/* Unrealized */}
        <div className="bg-slate-900 p-6 rounded-xl">
          <p className="text-slate-400 text-sm">Unrealized P&L</p>
          <p
            className={`text-2xl font-semibold ${
              portfolioPnL.unrealizedPnL >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            ${portfolioPnL.unrealizedPnL.toFixed(2)}
          </p>
        </div>

        {/* Tax */}
        <div className="bg-slate-900 p-6 rounded-xl">
          <p className="text-slate-400 text-sm">Tax Status</p>
          <p className="text-2xl font-semibold">
            {realizedPnL.taxHint}
          </p>
        </div>
      </div>

      {/* ================= ASSET WISE PnL ================= */}
      <div className="bg-slate-900 p-6 rounded-xl mb-10">
        <h2 className="text-lg mb-4">Asset-wise P&L</h2>

        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Enter asset (BTC, ETH, ADA...)"
            value={assetInput}
            onChange={(e) => setAssetInput(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 p-3 rounded text-white"
          />

          <button
            onClick={handleAssetPnL}
            className="bg-emerald-600 hover:bg-emerald-700 px-4 rounded"
          >
            Get P&L
          </button>
        </div>

        {assetLoading && (
          <p className="text-slate-400">
            Calculating asset P&L...
          </p>
        )}

        {!assetLoading && assetPnL && (
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-slate-400 text-sm">Invested</p>
              <p className="text-xl">
                ${assetPnL.invested.toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm">
                Current Value
              </p>
              <p className="text-xl">
                ${assetPnL.currentValue.toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm">
                Unrealized P&L
              </p>
              <p
                className={`text-xl ${
                  assetPnL.unrealizedPnL >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                ${assetPnL.unrealizedPnL.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {!assetLoading && assetInput && !assetPnL && (
          <p className="text-slate-500 text-sm">
            No data available for this asset
          </p>
        )}
      </div>

      {/* ================= EXPORT ================= */}
      <div className="flex justify-end">
        <button
          onClick={downloadCsv}
          className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded"
        >
          Export CSV
        </button>
      </div>
    </div>
  );
}
