import { useEffect, useState } from "react";
import { manualAddEditHolding } from "../../services/holdingService";

export default function ManualHoldingDrawer({
  asset,
  onClose,
  onSaved,
}) {
  const [symbol, setSymbol] = useState("");
  const [qty, setQty] = useState("");
  const [avgCost, setAvgCost] = useState("");
  const [chain, setChain] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (asset) {
      setSymbol(asset.assetSymbol || "");
      setQty(asset.quantity || "");
      setAvgCost(asset.avgCost || "");
      setChain(asset.chain || "");
      setAddress(asset.address || "");
    }
  }, [asset]);

  if (!asset) return null;

  const save = async () => {
    await manualAddEditHolding({
      assetSymbol: symbol.toUpperCase(),
      quantity: Number(qty),
      avgCost: Number(avgCost),

      // ✅ OPTIONAL FIELDS (paper requirement)
      chain: chain.trim() ? chain.trim().toUpperCase() : null,
      address: address.trim() ? address.trim() : null,
    });

    onSaved();   // refresh only after save
    onClose();
  };

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .manual-drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: flex-end;
          z-index: 1000;
          animation: fadeIn 0.3s ease-out;
        }

        .manual-drawer-panel {
          width: 28rem;
          background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
          padding: 2.5rem;
          border-left: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: -10px 0 40px rgba(0, 0, 0, 0.5);
          animation: slideIn 0.3s ease-out;
          overflow-y: auto;
        }

        .manual-drawer-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid rgba(255, 255, 255, 0.05);
          letter-spacing: -0.5px;
        }

        .manual-drawer-input {
          width: 100%;
          padding: 0.875rem 1rem;
          margin-bottom: 1rem;
          background: rgba(15, 23, 42, 0.6);
          border: 2px solid #334155;
          border-radius: 12px;
          color: #ffffff;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.3s ease;
        }

        .manual-drawer-input::placeholder {
          color: #475569;
        }

        .manual-drawer-input:focus {
          border-color: #3b82f6;
          background: rgba(15, 23, 42, 0.9);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .manual-drawer-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .manual-drawer-btn {
          flex: 1;
          padding: 1rem;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .manual-drawer-btn-save {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #000000;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .manual-drawer-btn-save:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(16, 185, 129, 0.4);
        }

        .manual-drawer-btn-cancel {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }

        .manual-drawer-btn-cancel:hover {
          background: rgba(239, 68, 68, 0.3);
          transform: translateY(-2px);
        }

        @media (max-width: 640px) {
          .manual-drawer-panel {
            width: 100%;
            padding: 2rem 1.5rem;
          }
        }
      `}</style>

      <div className="manual-drawer-overlay">
        <div className="manual-drawer-panel">
          <h2 className="manual-drawer-title">
            {asset.assetSymbol ? "Edit Holding" : "Add Holding"}
          </h2>

          <input
            className="manual-drawer-input"
            placeholder="Asset Symbol (BTC)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          />

          {/* OPTIONAL */}
          <input
            className="manual-drawer-input"
            placeholder="Chain (optional)"
            value={chain}
            onChange={(e) => setChain(e.target.value)}
          />

          {/* OPTIONAL */}
          <input
            className="manual-drawer-input"
            placeholder="Address (optional)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <input
            type="number"
            className="manual-drawer-input"
            placeholder="Quantity"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />

          <input
            type="number"
            className="manual-drawer-input"
            placeholder="Average Cost"
            value={avgCost}
            onChange={(e) => setAvgCost(e.target.value)}
          />

          <div className="manual-drawer-buttons">
            <button
              onClick={save}
              className="manual-drawer-btn manual-drawer-btn-save"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="manual-drawer-btn manual-drawer-btn-cancel"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}