import NotificationBell from "../ui/NotificationBell";

export default function Topbar() {
  return (
    <>
      <style>{`
        @keyframes slideInDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .topbar-container {
          height: 4rem;
          background: linear-gradient(90deg, #0a0e27 0%, #020617 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          animation: slideInDown 0.5s ease-out;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
        }

        .topbar-branding {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          animation: fadeIn 0.6s ease-out;
        }

        .topbar-logo {
          font-size: 1.25rem;
          font-weight: 700;
          color: #f1f5f9;
          letter-spacing: -0.3px;
        }

        .logo-highlight {
          background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .topbar-actions {
          display: flex;
          align-items: center;
          animation: fadeIn 0.8s ease-out;
        }

        @media (max-width: 768px) {
          .topbar-container {
            padding: 0 1rem;
          }

          .topbar-logo {
            font-size: 1rem;
          }
        }
      `}</style>

      <header className="topbar-container">
        {/* LEFT: App Branding */}
        <div className="topbar-branding">
          <span className="topbar-logo">
            Crypto<span className="logo-highlight">Guard</span>
          </span>
        </div>

        {/* RIGHT: Notification Bell Only */}
        <div className="topbar-actions">
          <NotificationBell />
        </div>
      </header>
    </>
  );
}