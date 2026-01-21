import { useEffect, useState } from "react";
import StatCard from "../components/ui/StatCard";
import PortfolioValueChart from "../components/charts/PortfolioValueChart";
import QuickActions from "../components/ui/QuickActions";
import CriticalAlertsPreview from "../components/risk/CriticalAlertsPreview";

import {
  refreshExchangeHoldings,
  refreshManualHoldings,
} from "../services/holdingService";
import { getPriceSnapshots } from "../services/priceSnapshotService";
import { fetchAssetPnL, fetchRealizedPnL } from "../services/pnlService";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  const [totalValue, setTotalValue] = useState(0);
  const [exchangeCount, setExchangeCount] = useState(0);

  const [pnl24h, setPnl24h] = useState({ value: 0, percent: 0 });
  const [riskCounts, setRiskCounts] = useState({ high: 0, medium: 0 });

  const [taxStatus, setTaxStatus] = useState("—");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      /* ================= HOLDINGS ================= */
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

      /* ================= CALCULATIONS ================= */
      let total = 0;
      let todayValue = 0;
      let yesterdayValue = 0;

      let high = 0;
      let medium = 0;

      for (const h of holdings) {
        const symbol = h.assetSymbol;
        const qty = Number(h.quantity || 0);
        const avgCost = Number(h.avgCost || 0);

        if (!symbol || qty === 0) continue;

        let latestPrice;
        let prevPrice;

        /* ===== PRICE SNAPSHOT WITH FALLBACK ===== */
        try {
          const snapRes = await getPriceSnapshots(symbol);
          const prices = snapRes?.data || [];

          if (prices.length > 0) {
            latestPrice = Number(prices[prices.length - 1].priceUsd);
            prevPrice =
              prices.length > 1
                ? Number(prices[prices.length - 2].priceUsd)
                : latestPrice;
          } else {
            // 🔥 MANUAL HOLDING FALLBACK
            latestPrice = avgCost;
            prevPrice = avgCost;
          }
        } catch {
          latestPrice = avgCost;
          prevPrice = avgCost;
        }

        const currentValue = latestPrice * qty;
        const yesterdayVal = prevPrice * qty;

        total += currentValue;
        todayValue += currentValue;
        yesterdayValue += yesterdayVal;

        /* ================= RISK ================= */
        try {
          const pnlRes = await fetchAssetPnL(symbol);
          const pnl = pnlRes?.data?.data;

          if (pnl?.invested > 0) {
            const percent =
              (pnl.unrealizedPnL / pnl.invested) * 100;

            if (percent <= -10) high++;
            else if (percent <= -5) medium++;
          }
        } catch {
          // ignore risk error
        }
      }

      setTotalValue(total);

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
    return <p className="p-8 text-slate-400">Loading dashboard…</p>;
  }

  return (
    <div className="space-y-8">
      {/* ================= STAT CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QuickActions />
        <CriticalAlertsPreview />
      </div>

      {/* ================= PORTFOLIO CHART ================= */}
      <div className="grid grid-cols-1">
        <PortfolioValueChart />
      </div>
    </div>
  );
}
