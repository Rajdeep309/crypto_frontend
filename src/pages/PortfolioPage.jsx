import { useEffect, useRef, useState } from "react";
import HoldingsTable from "../components/portfolio/HoldingsTable";
import ManualHoldingDrawer from "../components/portfolio/ManualHoldingDrawer";
import AssetDrawer from "../components/portfolio/AssetDrawer";
import {
  refreshExchangeHoldings,
  refreshManualHoldings,
  deleteManualHolding,
} from "../services/holdingService";

export default function PortfolioPage() {
  const [exchangeHoldings, setExchangeHoldings] = useState([]);
  const [manualHoldings, setManualHoldings] = useState([]);
  const [viewAsset, setViewAsset] = useState(null);
  const [editAsset, setEditAsset] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 STRICT MODE GUARD (KEY FIX)
  const hasLoadedRef = useRef(false);

  const loadHoldings = async () => {
    try {
      setLoading(true);

      const [exRes, manRes] = await Promise.all([
        refreshExchangeHoldings(),
        refreshManualHoldings(),
      ]);

      setExchangeHoldings(exRes?.data || []);
      setManualHoldings(manRes?.data || []);
    } catch (err) {
      console.error("Failed to load holdings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // ✅ Prevent double API call in React 18 StrictMode
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    loadHoldings();
  }, []);

  /* ✅ BACKEND DELETE + SAFE REFRESH */
  const handleDeleteManual = async (asset) => {
    const ok = window.confirm(
      `Delete ${asset.assetSymbol}?`
    );
    if (!ok) return;

    await deleteManualHolding(asset.assetSymbol);
    loadHoldings(); // single controlled refresh
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Exchange Holdings */}
      <div className="bg-slate-900 p-6 mb-8 rounded">
        <h2 className="text-xl mb-4">Exchange Holdings</h2>
        <HoldingsTable
          data={exchangeHoldings}
          loading={loading}
          onView={setViewAsset}
        />
      </div>

      {/* Manual Holdings */}
      <div className="bg-slate-900 p-6 rounded">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl">Manual Holdings</h2>
          <button
            onClick={() => setEditAsset({})}
            className="bg-green-600 px-4 py-2 rounded"
          >
            + Add Asset
          </button>
        </div>

        <HoldingsTable
          data={manualHoldings}
          loading={loading}
          onView={setViewAsset}
          onEdit={setEditAsset}
          onDelete={handleDeleteManual}
        />
      </div>

      {viewAsset && (
        <AssetDrawer
          asset={viewAsset}
          onClose={() => setViewAsset(null)}
        />
      )}

      <ManualHoldingDrawer
        asset={editAsset}
        onClose={() => setEditAsset(null)}
        onSaved={loadHoldings}
      />
    </div>
  );
}
