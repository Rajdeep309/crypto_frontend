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

  /* ✅ BACKEND DELETE + SAFE REFRESH WITH STYLED DIALOG */
  const handleDeleteManual = async (asset) => {
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
      animation: fadeIn 0.3s ease-out;
    `;

    const dialogBox = document.createElement('div');
    dialogBox.style.cssText = `
      background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 2rem;
      max-width: 420px;
      width: 90%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
      animation: slideUp 0.3s ease-out;
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
        ">🗑️</div>
        <h3 style="
          color: #ffffff;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.5px;
        ">Delete Holding</h3>
      </div>
      <p style="
        color: #cbd5e1;
        font-size: 1rem;
        line-height: 1.6;
        margin-bottom: 2rem;
      ">Are you sure you want to delete <strong style="color: #ffffff;">${asset.assetSymbol}</strong>?<br><br>This action cannot be undone.</p>
      <div style="
        display: flex;
        gap: 1rem;
      ">
        <button id="deleteCancel" style="
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
        <button id="deleteConfirm" style="
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
        ">Delete</button>
      </div>
    `;

    dialogOverlay.appendChild(dialogBox);
    document.body.appendChild(dialogOverlay);

    // Add keyframe animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    // Add hover effects
    const cancelBtn = dialogBox.querySelector('#deleteCancel');
    const confirmBtn = dialogBox.querySelector('#deleteConfirm');
    
    cancelBtn.onmouseover = () => {
      cancelBtn.style.background = 'rgba(100, 116, 139, 0.3)';
      cancelBtn.style.transform = 'translateY(-2px)';
    };
    cancelBtn.onmouseout = () => {
      cancelBtn.style.background = 'rgba(100, 116, 139, 0.2)';
      cancelBtn.style.transform = 'translateY(0)';
    };

    confirmBtn.onmouseover = () => {
      confirmBtn.style.transform = 'translateY(-2px)';
      confirmBtn.style.boxShadow = '0 6px 25px rgba(239, 68, 68, 0.4)';
    };
    confirmBtn.onmouseout = () => {
      confirmBtn.style.transform = 'translateY(0)';
      confirmBtn.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
    };

    const ok = await new Promise((resolve) => {
      cancelBtn.onclick = () => {
        document.body.removeChild(dialogOverlay);
        document.head.removeChild(style);
        resolve(false);
      };
      confirmBtn.onclick = () => {
        document.body.removeChild(dialogOverlay);
        document.head.removeChild(style);
        resolve(true);
      };
      dialogOverlay.onclick = (e) => {
        if (e.target === dialogOverlay) {
          document.body.removeChild(dialogOverlay);
          document.head.removeChild(style);
          resolve(false);
        }
      };
    });

    if (!ok) return;

    await deleteManualHolding(asset.assetSymbol);
    loadHoldings(); // single controlled refresh
  };

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

        .portfolio-container {
          padding: 2rem;
          position: relative;
          z-index: 1;
          max-width: 80rem;
          margin: 0 auto;
        }

        .holdings-section {
          background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
          margin-bottom: 2rem;
          animation: fadeIn 0.5s ease-out;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid rgba(255, 255, 255, 0.05);
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.5px;
        }

        .add-asset-btn {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #000000;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          border: none;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .add-asset-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }

        @media (max-width: 768px) {
          .portfolio-container {
            padding: 1.5rem;
          }

          .holdings-section {
            padding: 1.5rem;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .add-asset-btn {
            width: 100%;
          }

          .section-title {
            font-size: 1.25rem;
          }
        }

        @media (max-width: 480px) {
          .portfolio-container {
            padding: 1rem;
          }

          .holdings-section {
            padding: 1rem;
            border-radius: 16px;
          }
        }
      `}</style>

      <div className="portfolio-container">
        {/* Exchange Holdings */}
        <div className="holdings-section">
          <div className="section-header">
            <h2 className="section-title">Exchange Holdings</h2>
          </div>
          <HoldingsTable
            data={exchangeHoldings}
            loading={loading}
            onView={setViewAsset}
          />
        </div>

        {/* Manual Holdings */}
        <div className="holdings-section">
          <div className="section-header">
            <h2 className="section-title">Manual Holdings</h2>
            <button
              onClick={() => setEditAsset({})}
              className="add-asset-btn"
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
    </>
  );
}