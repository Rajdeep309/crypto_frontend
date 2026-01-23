import { Bell } from "lucide-react";
import { useState } from "react";
import NotificationPanel from "./NotificationPanel";
import { useNotifications } from "../../context/NotificationContext";

export default function NotificationBell() {
  const { notifications } = useNotifications();
  const [open, setOpen] = useState(false);

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <>
      <style>{`
        @keyframes bellRing {
          0%, 100% { transform: rotate(0deg); }
          10%, 30% { transform: rotate(-10deg); }
          20%, 40% { transform: rotate(10deg); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }

        .notification-bell-container {
          position: relative;
        }

        .notification-bell-button {
          position: relative;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 0.625rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #cbd5e1;
        }

        .notification-bell-button:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(16, 185, 129, 0.3);
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
        }

        .notification-bell-button:hover .bell-icon {
          animation: bellRing 0.5s ease-in-out;
        }

        .bell-icon {
          transition: all 0.3s ease;
        }

        .notification-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: #ffffff;
          font-size: 0.625rem;
          font-weight: 700;
          padding: 0.125rem 0.375rem;
          border-radius: 10px;
          border: 2px solid #0a0e27;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
          animation: pulse 2s ease-in-out infinite;
          min-width: 18px;
          text-align: center;
        }

        @media (max-width: 768px) {
          .notification-bell-button {
            padding: 0.5rem;
          }
        }
      `}</style>

      <div className="notification-bell-container">
        <button
          onClick={() => setOpen((v) => !v)}
          className="notification-bell-button"
        >
          <Bell size={20} className="bell-icon" />
          {unread > 0 && (
            <span className="notification-badge">
              {unread}
            </span>
          )}
        </button>

        {open && <NotificationPanel onClose={() => setOpen(false)} />}
      </div>
    </>
  );
}