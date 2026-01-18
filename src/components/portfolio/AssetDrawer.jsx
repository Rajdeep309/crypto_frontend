import { useEffect, useState } from "react";
import { getPriceSnapshots } from "../../services/priceSnapshotService";
import { fetchAssetPnL } from "../../services/pnlService";

export default function AssetDrawer({ asset, onClose }) {
  /* ================= STATE ================= */
  const [prices, setPrices] = useState([]);
  const [assetPnL, setAssetPnL] = useState(null);

  const [loadingPrices, setLoadingPrices] = useState(false);
  const [loadingPnL, setLoadingPnL] = useState(false);

  const [error, setError] = useState("");

  /* ================= FETCH PRICE SNAPSHOTS ================= */
  useEffect(() => {
    if (!asset?.assetSymbol) return;

    const loadPrices = async () => {
      try {
        setLoadingPrices(true);
        setError("");
        setPrices([]);

        const res = await getPriceSnapshots(asset.assetSymbol);
        setPrices(res?.data?.data || []);
      } catch (err) {
        console.error("Price snapshot error", err);
        setError("Failed to load price data");
      } finally {
        setLoadingPrices(false);
      }
    };

    loadPrices();
  }, [asset]);

  /* ================= FETCH ASSET PnL ================= */
  useEffect(() => {
    if (!asset?.assetSymbol) return;

    const loadAssetPnL = async () => {
      try {
        setLoadingPnL(true);
        const res = await fetchAssetPnL(asset.assetSymbol);
        setAssetPnL(res?.data?.data || null);
      } catch (err) {
        console.warn("Asset PnL not available");
        setAssetPnL(null); // 👈 safe fallback
      } finally {
        setLoadingPnL(false);
      }
    };

    loadAssetPnL();
  }, [asset]);

  /* ================= DRAWER CLOSED ================= */
  if (!asset) return null;

  /* ================= CALCULATIONS ================= */
  const quantity = Number(asset.quantity || 0);
  const avgCost = Number(asset.avgCost || 0);

  const currentPrice =
    prices.length > 0
      ? Number(prices[prices.length - 1].priceUsd)
      : null;

  const investedValue = quantity * avgCost;
  const currentValue =
    currentPrice !== null ? quantity * currentPrice : null;

  const profitLoss =
    currentValue !== null ? currentValue - investedValue : null;

  /* ================= UI ================= */
  return (
    <div className="fixed inset-0 bg-black/60 flex justify-end z-50">
      <div className="w-full max-w-md bg-slate-900 h-full p-6 border-l border-slate-700 overflow-y-auto">

        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {asset.assetSymbol} Details
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* ================= ASSET INFO ================= */}
        <div className="space-y-2 text-sm mb-6">
          <p>
            <span className="text-slate-400">Quantity:</span>{" "}
            {quantity}
          </p>
          <p>
            <span className="text-slate-400">Avg Cost:</span>{" "}
            ${avgCost.toLocaleString()}
          </p>
          <p>
            <span className="text-slate-400">Source:</span>{" "}
            {asset.source || "MANUAL"}
          </p>
        </div>

        <hr className="border-slate-700 my-4" />

        {/* ================= PRICE SECTION ================= */}
        {loadingPrices && (
          <p className="text-slate-400">Loading price history...</p>
        )}

        {!loadingPrices && error && (
          <p className="text-red-400">{error}</p>
        )}

        {!loadingPrices && !error && prices.length === 0 && (
          <p className="text-slate-400">No price data available</p>
        )}

        {!loadingPrices && prices.length > 0 && (
          <>
            <div className="space-y-2 mb-4">
              <p>
                <span className="text-slate-400">Current Price:</span>{" "}
                ${currentPrice.toFixed(2)}
              </p>

              <p>
                <span className="text-slate-400">Profit / Loss:</span>{" "}
                <span
                  className={
                    profitLoss >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  ${profitLoss.toFixed(2)}
                </span>
              </p>
            </div>

            {/* ================= PRICE HISTORY ================= */}
            <div className="mt-4">
              <h3 className="text-sm mb-2 text-slate-300">
                Price History
              </h3>

              <ul className="text-xs space-y-1 max-h-40 overflow-y-auto">
                {prices.map((p, i) => (
                  <li key={i} className="flex justify-between">
                    <span>
                      {new Date(p.capturedAt).toLocaleDateString()}
                    </span>
                    <span>${p.priceUsd}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* ================= ASSET PnL SECTION ================= */}
        <hr className="border-slate-700 my-4" />

        <h3 className="text-sm mb-2 text-slate-300">
          Asset P&L Summary
        </h3>

        {loadingPnL && (
          <p className="text-slate-400">Calculating P&L...</p>
        )}

        {!loadingPnL && assetPnL && (
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-slate-400">Invested:</span>{" "}
              ${assetPnL.invested.toFixed(2)}
            </p>

            <p>
              <span className="text-slate-400">Current Value:</span>{" "}
              ${assetPnL.currentValue.toFixed(2)}
            </p>

            <p>
              <span className="text-slate-400">Unrealized P&L:</span>{" "}
              <span
                className={
                  assetPnL.unrealizedPnL >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                ${assetPnL.unrealizedPnL.toFixed(2)}
              </span>
            </p>
          </div>
        )}

        {!loadingPnL && !assetPnL && (
          <p className="text-slate-500 text-sm">
            Asset P&L not available
          </p>
        )}

        {/* ================= FOOTER ================= */}
        <button
          onClick={onClose}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
