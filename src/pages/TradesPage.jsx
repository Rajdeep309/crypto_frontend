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
    // Create custom styled confirm dialog
    const dialogOverlay = document.createElement('div');
    dialogOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.75);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      backdrop-filter: blur(4px);
    `;

    const dialogBox = document.createElement('div');
    dialogBox.style.cssText = `
      background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 2rem;
      max-width: 500px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
    `;

    dialogBox.innerHTML = `
      <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
        <div style="
          width: 48px;
          height: 48px;
          background: rgba(239, 68, 68, 0.15);
          border: 2px solid rgba(239, 68, 68, 0.3);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        ">⚠️</div>
        <h3 style="
          color: #ffffff;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
        ">Warning</h3>
      </div>
      <p style="
        color: #cbd5e1;
        font-size: 1rem;
        line-height: 1.6;
        margin-bottom: 2rem;
      ">Fetching ALL previous trades may take 20–30 minutes and may hit exchange rate limits.<br><br>Do you want to continue?</p>
      <div style="
        display: flex;
        gap: 1rem;
      ">
        <button id="confirmCancel" style="
          flex: 1;
          padding: 0.875rem 1.5rem;
          background: rgba(100, 116, 139, 0.2);
          border: 1px solid rgba(100, 116, 139, 0.3);
          border-radius: 12px;
          color: #cbd5e1;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s ease;
        ">Cancel</button>
        <button id="confirmOk" style="
          flex: 1;
          padding: 0.875rem 1.5rem;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          border: none;
          border-radius: 12px;
          color: #ffffff;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        ">Continue</button>
      </div>
    `;

    dialogOverlay.appendChild(dialogBox);
    document.body.appendChild(dialogOverlay);

    // Add hover effects
    const cancelBtn = dialogBox.querySelector('#confirmCancel');
    const okBtn = dialogBox.querySelector('#confirmOk');
    
    cancelBtn.onmouseover = () => {
      cancelBtn.style.background = 'rgba(100, 116, 139, 0.3)';
      cancelBtn.style.transform = 'translateY(-2px)';
    };
    cancelBtn.onmouseout = () => {
      cancelBtn.style.background = 'rgba(100, 116, 139, 0.2)';
      cancelBtn.style.transform = 'translateY(0)';
    };

    okBtn.onmouseover = () => {
      okBtn.style.transform = 'translateY(-2px)';
      okBtn.style.boxShadow = '0 6px 25px rgba(239, 68, 68, 0.4)';
    };
    okBtn.onmouseout = () => {
      okBtn.style.transform = 'translateY(0)';
      okBtn.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
    };

    const ok = await new Promise((resolve) => {
      cancelBtn.onclick = () => {
        document.body.removeChild(dialogOverlay);
        resolve(false);
      };
      okBtn.onclick = () => {
        document.body.removeChild(dialogOverlay);
        resolve(true);
      };
      dialogOverlay.onclick = (e) => {
        if (e.target === dialogOverlay) {
          document.body.removeChild(dialogOverlay);
          resolve(false);
        }
      };
    });

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
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        body {
          background: linear-gradient(135deg, #4169e1 0%, #1e3a8a 100%);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
        }

        .trades-container {
          padding: 2rem;
          position: relative;
          z-index: 1;
          max-width: 80rem;
          margin: 0 auto;
        }

        .trades-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid rgba(255, 255, 255, 0.05);
        }

        .trades-title {
          font-size: 2rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.5px;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          border: none;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn-sync {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #000000;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .btn-sync:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }

        .btn-sync:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-fetch {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: #ffffff;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        }

        .btn-fetch:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .summary-card {
          background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
          animation: fadeIn 0.5s ease-out;
        }

        .summary-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
        }

        .summary-label {
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .summary-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #ffffff;
        }

        .value-positive { color: #34d399; }
        .value-negative { color: #f87171; }

        .message-box {
          background: rgba(59, 130, 246, 0.15);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #93c5fd;
          padding: 1rem 1.25rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          animation: fadeIn 0.3s ease-out;
        }

        .trades-table-wrapper {
          background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
          overflow: hidden;
        }

        .trades-table {
          width: 100%;
          border-collapse: collapse;
        }

        .trades-table thead {
          background: rgba(15, 23, 42, 0.6);
        }

        .trades-table th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          font-size: 0.875rem;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 2px solid rgba(255, 255, 255, 0.05);
        }

        .trades-table td {
          padding: 1rem;
          color: #e2e8f0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .trades-table tbody tr {
          transition: all 0.2s ease;
        }

        .trades-table tbody tr:hover {
          background: rgba(51, 65, 85, 0.3);
          transform: translateX(2px);
        }

        .asset-symbol {
          font-weight: 600;
          color: #ffffff;
        }

        .side-buy {
          color: #34d399;
          font-weight: 600;
        }

        .side-sell {
          color: #f87171;
          font-weight: 600;
        }

        .trade-date {
          color: #64748b;
          font-size: 0.875rem;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 0;
          color: #64748b;
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .trades-container {
            padding: 1.5rem;
          }

          .trades-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .action-buttons {
            width: 100%;
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }

          .summary-grid {
            grid-template-columns: 1fr;
          }

          .trades-title {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .trades-table-wrapper {
            padding: 1rem;
          }

          .trades-table th,
          .trades-table td {
            padding: 0.75rem 0.5rem;
            font-size: 0.875rem;
          }
        }
      `}</style>

      <div className="trades-container">
        {/* ================= HEADER ================= */}
        <div className="trades-header">
          <div className="action-buttons">
            <button
              onClick={syncTrades}
              disabled={syncing}
              className="btn btn-sync"
            >
              {syncing ? "Syncing..." : "Sync Trades"}
            </button>

            <button
              onClick={fetchAllWithWarning}
              className="btn btn-fetch"
            >
              Fetch All Previous Trades
            </button>
          </div>
        </div>

        {/* ================= SUMMARY ================= */}
        <div className="summary-grid">
          <div className="summary-card">
            <p className="summary-label">Invested</p>
            <p className="summary-value">${summary.invested.toFixed(2)}</p>
          </div>

          <div className="summary-card">
            <p className="summary-label">Returned</p>
            <p className="summary-value">${summary.returned.toFixed(2)}</p>
          </div>

          <div className="summary-card">
            <p className="summary-label">Profit / Loss</p>
            <p className={`summary-value ${summary.pnl >= 0 ? 'value-positive' : 'value-negative'}`}>
              ${summary.pnl.toFixed(2)}
            </p>
          </div>
        </div>

        {/* ================= MESSAGE ================= */}
        {!loading && message && (
          <div className="message-box">{message}</div>
        )}

        {/* ================= TABLE ================= */}
        {loading ? (
          <p className="empty-state">Loading...</p>
        ) : trades.length === 0 ? (
          <p className="empty-state">No trades found</p>
        ) : (
          <div className="trades-table-wrapper">
            <table className="trades-table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Side</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((t, i) => (
                  <tr key={i}>
                    <td className="asset-symbol">{t.assetSymbol}</td>
                    <td className={t.side === "BUY" ? "side-buy" : "side-sell"}>
                      {t.side}
                    </td>
                    <td>{t.quantity}</td>
                    <td>${t.price.toFixed(2)}</td>
                    <td className="trade-date">
                      {new Date(t.tradeTime).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}