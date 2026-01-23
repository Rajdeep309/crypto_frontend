import { createPortal } from "react-dom";
import { useNotifications } from "../../context/NotificationContext";

export default function NotificationPanel() {
  const { notifications, markAsRead, clearAll } = useNotifications();

  const getColor = (title) => {
    const t = title.toLowerCase();
    if (t.includes("high")) return "#f87171";   // 🔴 High
    if (t.includes("medium")) return "#facc15"; // 🟡 Medium
    return "#34d399";                            // 🟢 Low
  };

  return createPortal(
    <>
      <style>{`
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .notification-panel {
          position: fixed;
          top: 72px;
          right: 24px;
          width: 380px;
          max-height: 480px;
          background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8),
                      0 0 40px rgba(16, 185, 129, 0.1);
          z-index: 2147483647;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideInDown 0.3s ease-out;
        }

        .notification-header {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
          background: rgba(15, 23, 42, 0.6);
        }

        .notification-title {
          font-weight: 700;
          font-size: 1rem;
          color: #ffffff;
          letter-spacing: -0.3px;
        }

        .clear-button {
          color: #f87171;
          font-size: 0.875rem;
          font-weight: 600;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 8px;
          padding: 0.375rem 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .clear-button:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.4);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
        }

        .notification-body {
          padding: 1rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          flex: 1;
        }

        .notification-body::-webkit-scrollbar {
          width: 8px;
        }

        .notification-body::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.6);
          border-radius: 4px;
        }

        .notification-body::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.4) 0%, rgba(52, 211, 153, 0.4) 100%);
          border-radius: 4px;
        }

        .notification-body::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.6) 0%, rgba(52, 211, 153, 0.6) 100%);
        }

        .empty-state {
          text-align: center;
          color: #94a3b8;
          padding: 3rem 0;
          font-size: 0.9rem;
        }

        .notification-item {
          background: linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.6) 100%);
          padding: 1rem;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          animation: fadeIn 0.4s ease-out;
          position: relative;
          overflow: hidden;
        }

        .notification-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 4px;
          transition: width 0.3s ease;
        }

        .notification-item:hover {
          background: linear-gradient(145deg, rgba(30, 41, 59, 1) 0%, rgba(15, 23, 42, 0.8) 100%);
          transform: translateX(4px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .notification-item:hover::before {
          width: 6px;
        }

        .notification-item-unread {
          background: linear-gradient(145deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%);
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .notification-item-read {
          background: linear-gradient(145deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.4) 100%);
          border: 1px solid rgba(255, 255, 255, 0.03);
          opacity: 0.8;
        }

        .notification-item-title {
          font-weight: 700;
          font-size: 0.9rem;
          margin-bottom: 0.375rem;
          letter-spacing: -0.2px;
        }

        .notification-item-message {
          font-size: 0.8rem;
          color: #cbd5e1;
          line-height: 1.5;
          margin-bottom: 0.5rem;
        }

        .notification-item-time {
          font-size: 0.7rem;
          color: #64748b;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .notification-panel {
            right: 16px;
            width: calc(100vw - 32px);
            max-width: 380px;
          }
        }
      `}</style>

      <div className="notification-panel">
        {/* HEADER */}
        <div className="notification-header">
          <span className="notification-title">Notifications</span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              clearAll();
            }}
            className="clear-button"
          >
            Clear All
          </button>
        </div>

        {/* BODY */}
        <div className="notification-body">
          {notifications.length === 0 && (
            <p className="empty-state">
              No notifications
            </p>
          )}

          {notifications.map((n) => {
            const color = getColor(n.title);

            return (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`notification-item ${n.read ? 'notification-item-read' : 'notification-item-unread'}`}
                style={{
                  '--border-color': color,
                }}
              >
                {/* Border accent */}
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: '4px',
                  background: color,
                  transition: 'width 0.3s ease'
                }}></div>

                {/* TITLE */}
                <p
                  className="notification-item-title"
                  style={{ color }}
                >
                  {n.title}
                </p>

                {/* MESSAGE */}
                <p className="notification-item-message">
                  {n.message}
                </p>

                {/* TIME */}
                <p className="notification-item-time">
                  {n.time}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </>,
    document.body
  );
}