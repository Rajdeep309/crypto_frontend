import { useEffect, useRef, useState } from "react";
import StatCard from "../components/ui/StatCard";
import PortfolioValueChart from "../components/charts/PortfolioValueChart";
import QuickActions from "../components/ui/QuickActions";
import CriticalAlertsPreview from "../components/risk/CriticalAlertsPreview";

import {
  refreshExchangeHoldings,
  refreshManualHoldings,
} from "../services/holdingService";
import { getPriceSnapshots } from "../services/priceSnapshotService";
import {
  fetchAssetPnL,
  fetchRealizedPnL,
} from "../services/pnlService";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  const [totalValue, setTotalValue] = useState(0);
  const [exchangeCount, setExchangeCount] = useState(0);

  const [pnl24h, setPnl24h] = useState({ value: 0, percent: 0 });
  const [riskCounts, setRiskCounts] = useState({ high: 0, medium: 0 });
  const [taxStatus, setTaxStatus] = useState("—");

  // 🔥 STRICT MODE GUARD
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      /* ================= HOLDINGS (ONCE) ================= */
      const [exRes, manRes] = await Promise.all([
        refreshExchangeHoldings(),
        refreshManualHoldings(),
      ]);

      const exchangeHoldings = exRes?.data || [];
      const manualHoldings = manRes?.data || [];
      const holdings = [...exchangeHoldings, ...manualHoldings];

      /* ================= EXCHANGE COUNT ================= */
      const exchanges = new Set(
        exchangeHoldings.map((h) => h.exchangeName)
      );
      setExchangeCount(exchanges.size);

      if (!holdings.length) {
        setTotalValue(0);
        setPnl24h({ value: 0, percent: 0 });
        setRiskCounts({ high: 0, medium: 0 });
        setTaxStatus("—");
        return;
      }

      /* ================= PER-ASSET PARALLEL FETCH ================= */
      let high = 0;
      let medium = 0;

      let todayValue = 0;
      let yesterdayValue = 0;

      const assetResults = await Promise.all(
        holdings.map(async (h) => {
          const symbol = h.assetSymbol;
          const qty = Number(h.quantity || 0);
          const avgCost = Number(h.avgCost || 0);

          if (!symbol || qty === 0) return null;

          try {
            const [snapRes, pnlRes] = await Promise.all([
              getPriceSnapshots(symbol),
              fetchAssetPnL(symbol),
            ]);

            const prices = snapRes?.data || [];
            const pnl = pnlRes?.data?.data;

            let latestPrice = avgCost;
            let prevPrice = avgCost;

            if (prices.length > 0) {
              latestPrice = Number(prices[prices.length - 1].priceUsd);
              prevPrice =
                prices.length > 1
                  ? Number(prices[prices.length - 2].priceUsd)
                  : latestPrice;
            }

            const currentValue = latestPrice * qty;
            const yesterdayVal = prevPrice * qty;

            if (pnl?.invested > 0) {
              const percent =
                (pnl.unrealizedPnL / pnl.invested) * 100;

              if (percent <= -10) high++;
              else if (percent <= -5) medium++;
            }

            return { currentValue, yesterdayVal };
          } catch {
            return null;
          }
        })
      );

      assetResults.filter(Boolean).forEach((r) => {
        todayValue += r.currentValue;
        yesterdayValue += r.yesterdayVal;
      });

      setTotalValue(todayValue);

      /* ================= 24H PNL ================= */
      const diff = todayValue - yesterdayValue;
      const percent =
        yesterdayValue !== 0
          ? (diff / Math.abs(yesterdayValue)) * 100
          : 0;

      setPnl24h({ value: diff, percent });
      setRiskCounts({ high, medium });

      /* ================= TAX ================= */
      const taxRes = await fetchRealizedPnL();
      setTaxStatus(taxRes?.data?.data?.taxHint || "—");
    } catch (e) {
      console.error("Dashboard load failed", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          body {
            background: linear-gradient(135deg, #4169e1 0%, #1e3a8a 100%);
            min-height: 100vh;
            position: relative;
            overflow-x: hidden;
          }

          .loading-container {
            padding: 2rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 70vh;
            position: relative;
            z-index: 1;
          }

          .spinner {
            width: 60px;
            height: 60px;
            margin-bottom: 1.5rem;
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-top-color: #10b981;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          .loading-text {
            color: #ffffff;
            font-size: 1.125rem;
            font-weight: 500;
          }
        `}</style>
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading dashboard...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
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

        .dashboard-container {
          position: relative;
          z-index: 1;
          padding: 2.5rem 2rem;
          max-width: 90rem;
          margin: 0 auto;
        }

        .dashboard-header {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid rgba(255, 255, 255, 0.08);
        }

        .dashboard-title {
          font-size: 2rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.5px;
          margin-bottom: 0.5rem;
        }

        .dashboard-subtitle {
          color: rgba(255, 255, 255, 0.6);
          font-size: 1rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
          animation: fadeIn 0.5s ease-out;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
          animation: fadeIn 0.6s ease-out;
        }

        .chart-section {
          width: 100%;
          animation: fadeIn 0.7s ease-out;
        }

        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 2rem 1.5rem;
          }

          .dashboard-title {
            font-size: 1.75rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .content-grid {
            gap: 1rem;
          }
        }

        @media (max-width: 480px) {
          .dashboard-container {
            padding: 1.5rem 1rem;
          }

          .dashboard-title {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <div className="dashboard-container">
        {/* ================= STAT CARDS ================= */}
        <div className="stats-grid">
          <StatCard
            title="Total Portfolio Value"
            value={`$${totalValue.toFixed(2)}`}
            sub={`Across ${exchangeCount} exchange(s)`}
            highlight
          />

          <StatCard
            title="24h P&L"
            value={`${pnl24h.value >= 0 ? "+" : ""}$${pnl24h.value.toFixed(
              2
            )} (${pnl24h.percent.toFixed(2)}%)`}
            sub="Since yesterday"
          />

          <StatCard
            title="Open Risk Alerts"
            value={riskCounts.high + riskCounts.medium}
            sub={`${riskCounts.high} high · ${riskCounts.medium} medium`}
          />

          <StatCard
            title="Tax Reports"
            value={taxStatus === "—" ? "Not Ready" : "Ready"}
            sub="Based on realized P&L"
          />
        </div>

        {/* ================= ACTIONS + ALERTS ================= */}
        <div className="content-grid">
          <QuickActions />
          <CriticalAlertsPreview />
        </div>

        {/* ================= PORTFOLIO CHART ================= */}
        <div className="chart-section">
          <PortfolioValueChart />
        </div>
      </div>
    </>
  );
}