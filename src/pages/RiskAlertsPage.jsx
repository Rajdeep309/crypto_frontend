import { useEffect, useRef, useState } from "react";
import { AlertTriangle, ShieldAlert, Info } from "lucide-react";
import AssetDrawer from "../components/portfolio/AssetDrawer";
import {
  refreshExchangeHoldings,
  refreshManualHoldings,
} from "../services/holdingService";
import { getPriceSnapshots } from "../services/priceSnapshotService";
import { fetchAssetPnL } from "../services/pnlService";
import { useNotifications } from "../context/NotificationContext"; // ✅ ADDED

/* ================= HELPERS ================= */
const badgeStyle = {
  HIGH: "badge-high",
  MEDIUM: "badge-medium",
  LOW: "badge-low",
};

const iconMap = {
  HIGH: AlertTriangle,
  MEDIUM: ShieldAlert,
  LOW: Info,
};

/* ================= PAGE ================= */
export default function RiskAlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [loading, setLoading] = useState(true);

  const { notify } = useNotifications(); // ✅ ADDED

  // 🔥 STRICT MODE + DUPLICATE NOTIFICATION GUARD
  const hasLoadedRef = useRef(false);
  const notifiedAssetsRef = useRef(new Set());

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    loadRiskAlerts();
  }, []);

  const loadRiskAlerts = async () => {
    try {
      setLoading(true);

      /* 1️⃣ LOAD HOLDINGS */
      const [exRes, manRes] = await Promise.all([
        refreshExchangeHoldings(),
        refreshManualHoldings(),
      ]);

      const holdings = [
        ...(exRes?.data || []),
        ...(manRes?.data || []),
      ];

      if (!holdings.length) {
        setAlerts([]);
        return;
      }

      /* 2️⃣ PROCESS HOLDINGS */
      const alertsTemp = await Promise.all(
        holdings.map(async (h) => {
          if (!h?.assetSymbol) return null;

          const symbol = h.assetSymbol.toUpperCase();

          const [snapRes, pnlRes] = await Promise.all([
            getPriceSnapshots(symbol),
            fetchAssetPnL(symbol),
          ]);

          const prices = snapRes?.data?.data || [];
          const pnl = pnlRes?.data?.data;

          if (!prices.length || !pnl?.invested) return null;

          const pnlPercent =
            (pnl.unrealizedPnL / pnl.invested) * 100;

          let level = "LOW";
          let title = "Stable Asset";
          let description = "No major risk detected.";

          /* 🔔 NOTIFICATION LOGIC (ONLY ONCE PER ASSET) */
          if (pnlPercent <= -10) {
            level = "HIGH";
            title = "High Loss Detected";
            description = `Unrealized loss is ${pnlPercent.toFixed(2)}%`;

            if (!notifiedAssetsRef.current.has(symbol)) {
              notify({
                title: "High Risk Alert",
                message: `${symbol} is down ${pnlPercent.toFixed(2)}%`,
                level: "HIGH",
              });
              notifiedAssetsRef.current.add(symbol);
            }
          } else if (pnlPercent <= -5) {
            level = "MEDIUM";
            title = "Moderate Risk";
            description = `Asset is down ${pnlPercent.toFixed(2)}%`;

            if (!notifiedAssetsRef.current.has(symbol)) {
              notify({
  title: "High Risk Alert",
  message: `${symbol} is down ${pnlPercent.toFixed(2)}%`,
  key: symbol + level, // 🔥 uniqueness
});

              notifiedAssetsRef.current.add(symbol);
            }
          }

          return {
            id: symbol,
            asset: symbol,
            level,
            title,
            description,
            source: h.walletType || "MANUAL",
            pnlPercent,
            holding: h,
          };
        })
      );

    const finalAlerts = alertsTemp.filter(Boolean);

      setAlerts(finalAlerts);

      // 🔥 reuse for dashboard + preview
      localStorage.setItem(
        "risk_alerts",
        JSON.stringify(finalAlerts)
      );
    } catch (err) {
      console.error("Risk alert load failed", err);
    } finally {
      setLoading(false);
    }
  };
  
  /* SUMMARY COUNTS */
  const high = alerts.filter((a) => a.level === "HIGH").length;
  const medium = alerts.filter((a) => a.level === "MEDIUM").length;
  const low = alerts.filter((a) => a.level === "LOW").length;

  /* VIEW ASSET */
  const openAsset = (alert) => {
    setSelectedAsset({
      assetSymbol: alert.asset,
      quantity: alert.holding.quantity,
      avgCost: alert.holding.avgCost,
      source: alert.source,
    });
  };

  /* ================= UI ================= */
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

        .risk-alerts-container {
          position: relative;
          z-index: 1;
          padding: 2rem;
          max-width: 80rem;
          margin: 0 auto;
        }

        .alerts-grid {
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
          color: #94a3b8;
          margin-bottom: 0.5rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .summary-count {
          font-size: 2.5rem;
          font-weight: 800;
          line-height: 1;
        }

        .count-high { color: #f87171; }
        .count-medium { color: #fbbf24; }
        .count-low { color: #34d399; }

        .alerts-section {
          background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
        }

        .alerts-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid rgba(255, 255, 255, 0.05);
        }

        .alerts-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.5px;
        }

        .alerts-count {
          font-size: 0.875rem;
          color: #64748b;
          background: rgba(100, 116, 139, 0.1);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
        }

        .alerts-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .alert-card {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 1.5rem;
          transition: all 0.3s ease;
          animation: fadeIn 0.4s ease-out;
        }

        .alert-card:hover {
          background: rgba(30, 41, 59, 0.6);
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateX(4px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .alert-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .alert-info {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .alert-icon {
          padding: 0.5rem;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
        }

        .alert-icon.high { color: #f87171; }
        .alert-icon.medium { color: #fbbf24; }
        .alert-icon.low { color: #34d399; }

        .alert-content h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 0.25rem;
        }

        .alert-meta {
          font-size: 0.875rem;
          color: #64748b;
        }

        .badge-high {
          background: rgba(239, 68, 68, 0.2);
          color: #fca5a5;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .badge-medium {
          background: rgba(251, 191, 36, 0.2);
          color: #fcd34d;
          border: 1px solid rgba(251, 191, 36, 0.3);
        }

        .badge-low {
          background: rgba(52, 211, 153, 0.2);
          color: #6ee7b7;
          border: 1px solid rgba(52, 211, 153, 0.3);
        }

        .alert-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .alert-description {
          font-size: 0.9rem;
          color: #cbd5e1;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .view-asset-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #34d399;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          transition: all 0.2s;
        }

        .view-asset-btn:hover {
          color: #6ee7b7;
          text-decoration: underline;
          transform: translateX(4px);
        }

        .loading-text, .empty-text {
          text-align: center;
          color: #64748b;
          font-size: 1rem;
          padding: 3rem 0;
        }

        @media (max-width: 768px) {
          .risk-alerts-container {
            padding: 1.5rem;
          }

          .alerts-grid {
            grid-template-columns: 1fr;
          }

          .alerts-section {
            padding: 1.5rem;
          }

          .summary-count {
            font-size: 2rem;
          }
        }

        @media (max-width: 480px) {
          .alerts-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
        }
      `}</style>

      <div className="risk-alerts-container">
        {/* SUMMARY */}
        <div className="alerts-grid">
          <div className="summary-card">
            <p className="summary-label">High Risk</p>
            <p className="summary-count count-high">{high}</p>
          </div>
          <div className="summary-card">
            <p className="summary-label">Medium Risk</p>
            <p className="summary-count count-medium">{medium}</p>
          </div>
          <div className="summary-card">
            <p className="summary-label">Low Risk</p>
            <p className="summary-count count-low">{low}</p>
          </div>
        </div>

        {/* ALERTS */}
        <div className="alerts-section">
          <div className="alerts-header">
            <h2 className="alerts-title">Risk Alerts</h2>
            <span className="alerts-count">{alerts.length} alerts</span>
          </div>

          {loading && (
            <p className="loading-text">Loading risk analysis...</p>
          )}

          {!loading && alerts.length === 0 && (
            <p className="empty-text">No risk alerts detected</p>
          )}

          <div className="alerts-list">
            {alerts.map((alert) => {
              const Icon = iconMap[alert.level];
              const iconClass = alert.level.toLowerCase();

              return (
                <div key={alert.id} className="alert-card">
                  <div className="alert-header">
                    <div className="alert-info">
                      <div className={`alert-icon ${iconClass}`}>
                        <Icon size={20} />
                      </div>
                      <div className="alert-content">
                        <h3>{alert.title}</h3>
                        <p className="alert-meta">
                          {alert.asset} · {alert.source}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`alert-badge ${badgeStyle[alert.level]}`}
                    >
                      {alert.level}
                    </span>
                  </div>

                  <p className="alert-description">
                    {alert.description}
                  </p>

                  <button
                    onClick={() => openAsset(alert)}
                    className="view-asset-btn"
                  >
                    View Asset →
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ASSET DRAWER */}
        <AssetDrawer
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
        />
      </div>
    </>
  );
}