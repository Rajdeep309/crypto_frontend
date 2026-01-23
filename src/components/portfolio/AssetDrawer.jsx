import { useState } from "react";
import { getPriceSnapshots } from "../../services/priceSnapshotService";
import { fetchAssetPnL } from "../../services/pnlService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AssetDrawer({ asset, onClose }) {
  /* ================= STATE ================= */
  const [prices, setPrices] = useState([]);
  const [assetPnL, setAssetPnL] = useState(null);

  const [loadingPrices, setLoadingPrices] = useState(false);
  const [loadingPnL, setLoadingPnL] = useState(false);
  const [error, setError] = useState("");

  if (!asset) return null;

  /* ================= FETCH PRICE SNAPSHOTS ================= */
  const fetchPrices = async () => {
    try {
      setLoadingPrices(true);
      setError("");
      setPrices([]);

      const symbol = asset.assetSymbol.trim().toUpperCase();

      const res = await getPriceSnapshots(symbol);

      // ✅ CORRECT RESPONSE PARSING + ASCENDING SORT
      const data = (res?.data?.data || []).sort(
        (a, b) =>
          new Date(a.capturedAt) - new Date(b.capturedAt)
      );

      setPrices(data);
    } catch (err) {
      console.error("Price snapshot error", err);
      setError("Failed to load price data");
      setPrices([]);
    } finally {
      setLoadingPrices(false);
    }
  };

  /* ================= FETCH ASSET PnL ================= */
  const fetchPnL = async () => {
    try {
      setLoadingPnL(true);
      const res = await fetchAssetPnL(
        asset.assetSymbol.trim().toUpperCase()
      );
      setAssetPnL(res?.data?.data || null);
    } catch {
      setAssetPnL(null);
    } finally {
      setLoadingPnL(false);
    }
  };

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
    <>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .asset-drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: flex-end;
          z-index: 50;
          animation: fadeIn 0.3s ease-out;
        }

        .asset-drawer-panel {
          width: 100%;
          max-width: 32rem;
          background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
          height: 100%;
          padding: 2.5rem;
          border-left: 1px solid rgba(255, 255, 255, 0.1);
          overflow-y: auto;
          animation: slideInRight 0.3s ease-out;
          box-shadow: -10px 0 40px rgba(0, 0, 0, 0.5);
        }

        .asset-drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid rgba(255, 255, 255, 0.05);
        }

        .asset-drawer-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.5px;
        }

        .asset-drawer-close {
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.2s;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
        }

        .asset-drawer-close:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.05);
        }

        .asset-info-grid {
          display: grid;
          gap: 0.75rem;
          font-size: 0.95rem;
          margin-bottom: 1.5rem;
        }

        .asset-info-item {
          color: #e2e8f0;
        }

        .asset-info-label {
          color: #94a3b8;
          font-weight: 500;
        }

        .asset-divider {
          border: none;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          margin: 1.5rem 0;
        }

        .fetch-button {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border: none;
          border-radius: 12px;
          color: #ffffff;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .fetch-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(59, 130, 246, 0.4);
        }

        .status-text {
          color: #94a3b8;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .error-text {
          color: #f87171;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          padding: 0.875rem 1rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
        }

        .price-summary {
          display: grid;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          padding: 1.25rem;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
        }

        .price-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.95rem;
        }

        .price-label {
          color: #94a3b8;
          font-weight: 500;
        }

        .price-value {
          color: #ffffff;
          font-weight: 600;
        }

        .profit-positive {
          color: #34d399;
          font-weight: 700;
        }

        .profit-negative {
          color: #f87171;
          font-weight: 700;
        }

        .chart-container {
          height: 12rem;
          margin-bottom: 1.5rem;
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 1rem;
        }

        .section-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #cbd5e1;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .price-history-list {
          max-height: 16rem;
          overflow-y: auto;
          font-size: 0.875rem;
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 0.75rem;
        }

        .price-history-list::-webkit-scrollbar {
          width: 6px;
        }

        .price-history-list::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.4);
          border-radius: 3px;
        }

        .price-history-list::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        .price-history-list::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .price-history-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          color: #cbd5e1;
          transition: all 0.2s;
        }

        .price-history-item:last-child {
          border-bottom: none;
        }

        .price-history-item:hover {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 6px;
        }

        .price-history-date {
          color: #94a3b8;
        }

        .price-history-value {
          color: #ffffff;
          font-weight: 600;
        }

        .pnl-summary-grid {
          display: grid;
          gap: 0.75rem;
          padding: 1.25rem;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
        }

        .pnl-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.95rem;
        }

        .pnl-label {
          color: #94a3b8;
          font-weight: 500;
        }

        .pnl-value {
          color: #ffffff;
          font-weight: 600;
        }

        .close-button {
          width: 100%;
          padding: 1rem;
          margin-top: 2rem;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          border: none;
          border-radius: 12px;
          color: #ffffff;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        }

        .close-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(239, 68, 68, 0.4);
        }

        @media (max-width: 640px) {
          .asset-drawer-panel {
            max-width: 100%;
            padding: 2rem 1.5rem;
          }

          .asset-drawer-title {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <div className="asset-drawer-overlay">
        <div className="asset-drawer-panel">

          {/* HEADER */}
          <div className="asset-drawer-header">
            <h2 className="asset-drawer-title">
              {asset.assetSymbol} Details
            </h2>
            <button
              onClick={onClose}
              className="asset-drawer-close"
            >
              ✕
            </button>
          </div>

          {/* ASSET INFO */}
          <div className="asset-info-grid">
            <p className="asset-info-item">
              <span className="asset-info-label">Quantity:</span> {quantity}
            </p>
            <p className="asset-info-item">
              <span className="asset-info-label">Avg Cost:</span> ${avgCost}
            </p>
            <p className="asset-info-item">
              <span className="asset-info-label">Source:</span> {asset.source || "MANUAL"}
            </p>
          </div>

          <hr className="asset-divider" />

          {/* FETCH BUTTON */}
          <button
            onClick={() => {
              fetchPrices();
              fetchPnL();
            }}
            className="fetch-button"
          >
            Fetch Last 7 Days Prices
          </button>

          {/* PRICE STATES */}
          {loadingPrices && (
            <p className="status-text">Loading price history...</p>
          )}

          {!loadingPrices && error && (
            <p className="error-text">{error}</p>
          )}

          {!loadingPrices && prices.length === 0 && !error && (
            <p className="status-text">
              Click fetch to load price data
            </p>
          )}

          {/* PRICE + GRAPH */}
          {!loadingPrices && prices.length > 0 && (
            <>
              <div className="price-summary">
                <div className="price-item">
                  <span className="price-label">Current Price:</span>
                  <span className="price-value">${currentPrice.toFixed(2)}</span>
                </div>

                <div className="price-item">
                  <span className="price-label">Profit / Loss:</span>
                  <span className={profitLoss >= 0 ? "profit-positive" : "profit-negative"}>
                    ${profitLoss.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* GRAPH */}
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={prices}>
                    <XAxis
                      dataKey="capturedAt"
                      tickFormatter={(v) =>
                        new Date(v).toLocaleDateString()
                      }
                      stroke="#94a3b8"
                      style={{ fontSize: '0.75rem' }}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      style={{ fontSize: '0.75rem' }}
                    />
                    <Tooltip
                      labelFormatter={(v) =>
                        new Date(v).toLocaleDateString()
                      }
                      contentStyle={{
                        background: '#0f172a',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="priceUsd"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* PRICE HISTORY LIST */}
              <div>
                <h3 className="section-title">
                  Price History
                </h3>

                <div className="price-history-list">
                  {prices.map((p, i) => (
                    <div key={i} className="price-history-item">
                      <span className="price-history-date">
                        {new Date(p.capturedAt).toLocaleDateString()}
                      </span>
                      <span className="price-history-value">${p.priceUsd}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ASSET PNL */}
          <hr className="asset-divider" />

          <h3 className="section-title">
            Asset P&L Summary
          </h3>

          {loadingPnL && (
            <p className="status-text">Calculating P&L...</p>
          )}

          {!loadingPnL && assetPnL && (
            <div className="pnl-summary-grid">
              <div className="pnl-item">
                <span className="pnl-label">Invested:</span>
                <span className="pnl-value">${assetPnL.invested.toFixed(2)}</span>
              </div>
              <div className="pnl-item">
                <span className="pnl-label">Current Value:</span>
                <span className="pnl-value">${assetPnL.currentValue.toFixed(2)}</span>
              </div>
              <div className="pnl-item">
                <span className="pnl-label">Unrealized P&L:</span>
                <span className={assetPnL.unrealizedPnL >= 0 ? "profit-positive" : "profit-negative"}>
                  ${assetPnL.unrealizedPnL.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {!loadingPnL && !assetPnL && (
            <p className="status-text">
              Asset P&L not available
            </p>
          )}

          {/* FOOTER */}
          <button
            onClick={onClose}
            className="close-button"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}