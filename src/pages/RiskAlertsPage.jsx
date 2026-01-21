import { useEffect, useRef, useState } from "react";
import { AlertTriangle, ShieldAlert, Info } from "lucide-react";
import AssetDrawer from "../components/portfolio/AssetDrawer";
import {
  refreshExchangeHoldings,
  refreshManualHoldings,
} from "../services/holdingService";
import { getPriceSnapshots } from "../services/priceSnapshotService";
import { fetchAssetPnL } from "../services/pnlService";

/* ================= HELPERS ================= */
const badgeStyle = {
  HIGH: "bg-red-500/20 text-red-400",
  MEDIUM: "bg-yellow-500/20 text-yellow-400",
  LOW: "bg-emerald-500/20 text-emerald-400",
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

  // 🔥 STRICT MODE GUARD
  const hasLoadedRef = useRef(false);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    loadRiskAlerts();
  }, []);

  const loadRiskAlerts = async () => {
    try {
      setLoading(true);

      /* 1️⃣ LOAD HOLDINGS (ONCE) */
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

      /* 2️⃣ PROCESS HOLDINGS (PARALLEL) */
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

          const latestPrice =
            prices[prices.length - 1]?.priceUsd ?? 0;

          const pnlPercent =
            (pnl.unrealizedPnL / pnl.invested) * 100;

          let level = "LOW";
          let title = "Stable Asset";
          let description = "No major risk detected.";

          if (pnlPercent <= -10) {
            level = "HIGH";
            title = "High Loss Detected";
            description = `Unrealized loss is ${pnlPercent.toFixed(2)}%`;
          } else if (pnlPercent <= -5) {
            level = "MEDIUM";
            title = "Moderate Risk";
            description = `Asset is down ${pnlPercent.toFixed(2)}%`;
          }

          return {
            id: symbol,
            asset: symbol,
            level,
            title,
            description,
            source: h.walletType || "MANUAL",
            price: latestPrice,
            pnlPercent,
            holding: h,
          };
        })
      );

      setAlerts(alertsTemp.filter(Boolean));
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
    <div className="space-y-8">
      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard title="High Risk" count={high} color="text-red-400" />
        <SummaryCard title="Medium Risk" count={medium} color="text-yellow-400" />
        <SummaryCard title="Low Risk" count={low} color="text-emerald-400" />
      </div>

      {/* ALERTS */}
      <div className="bg-[#0b1220] border border-white/5 rounded-2xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Risk Alerts</h2>
          <span className="text-sm text-slate-400">
            {alerts.length} alerts
          </span>
        </div>

        {loading && (
          <p className="text-slate-400">Loading risk analysis...</p>
        )}

        {!loading && alerts.length === 0 && (
          <p className="text-slate-400">No risk alerts detected </p>
        )}

        <div className="space-y-3">
          {alerts.map((alert) => {
            const Icon = iconMap[alert.level];

            return (
              <div
                key={alert.id}
                className="border border-white/5 rounded-xl p-4 hover:bg-white/5 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <Icon
                      className={
                        alert.level === "HIGH"
                          ? "text-red-400"
                          : alert.level === "MEDIUM"
                          ? "text-yellow-400"
                          : "text-emerald-400"
                      }
                    />
                    <div>
                      <p className="font-medium">{alert.title}</p>
                      <p className="text-sm text-slate-400">
                        {alert.asset} · {alert.source}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${badgeStyle[alert.level]}`}
                  >
                    {alert.level}
                  </span>
                </div>

                <p className="text-sm text-slate-300 mt-3">
                  {alert.description}
                </p>

                <button
                  onClick={() => openAsset(alert)}
                  className="mt-3 text-sm text-emerald-400 hover:underline"
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
  );
}

/* ================= SUMMARY CARD ================= */
function SummaryCard({ title, count, color }) {
  return (
    <div className="bg-[#0b1220] border border-white/5 rounded-xl p-4">
      <p className="text-sm text-slate-400">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>{count}</p>
    </div>
  );
}
