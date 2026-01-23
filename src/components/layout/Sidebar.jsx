import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  ShieldAlert,
  FileText,
  Settings,
  PlusCircle,
  ArrowLeftRight,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/login");
  };

  return (
    <>
      <style>{`
        @keyframes slideInLeft {
          from {
            transform: translateX(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .sidebar-container {
          width: 16rem;
          height: 100vh;
          background: linear-gradient(180deg, #0a0e27 0%, #020617 100%);
          color: #f1f5f9;
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          animation: slideInLeft 0.5s ease-out;
          box-shadow: 4px 0 20px rgba(0, 0, 0, 0.3);
        }

        .sidebar-logo {
          font-size: 1.75rem;
          font-weight: 800;
          margin-bottom: 2.5rem;
          letter-spacing: -0.5px;
          animation: fadeIn 0.6s ease-out;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid rgba(255, 255, 255, 0.05);
        }

        .logo-highlight {
          background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          animation: fadeIn 0.8s ease-out;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 0.875rem 1rem;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .nav-link::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 3px;
          background: linear-gradient(180deg, #10b981 0%, #34d399 100%);
          transform: scaleY(0);
          transition: transform 0.3s ease;
        }

        .nav-link-active {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%);
          color: #34d399;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.1),
                      inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transform: translateX(4px);
        }

        .nav-link-active::before {
          transform: scaleY(1);
        }

        .nav-link-inactive {
          color: #cbd5e1;
        }

        .nav-link-inactive:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #ffffff;
          transform: translateX(4px);
        }

        .nav-icon {
          transition: transform 0.3s ease;
        }

        .nav-link:hover .nav-icon {
          transform: scale(1.1);
        }

        .nav-link-active .nav-icon {
          filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.5));
        }

        .sidebar-footer {
          margin-top: auto;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          animation: fadeIn 1s ease-out;
        }

        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 0.875rem 1rem;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 700;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          border: none;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        }

        .logout-btn:hover {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(239, 68, 68, 0.4);
        }

        .logout-btn:hover .nav-icon {
          transform: scale(1.1);
        }

        @media (max-width: 1024px) {
          .sidebar-container {
            width: 5rem;
            padding: 1.5rem 0.75rem;
          }

          .sidebar-logo {
            font-size: 1rem;
            text-align: center;
          }

          .logo-highlight {
            display: none;
          }

          .nav-link {
            flex-direction: column;
            gap: 0.25rem;
            padding: 0.75rem 0.5rem;
            font-size: 0.7rem;
          }

          .logout-btn {
            flex-direction: column;
            gap: 0.25rem;
            padding: 0.75rem 0.5rem;
            font-size: 0.7rem;
          }
        }

        @media (max-width: 768px) {
          .sidebar-container {
            display: none;
          }
        }
      `}</style>

      <aside className="sidebar-container">
        {/* Logo */}
        <h1 className="sidebar-logo">
          Crypto<span className="logo-highlight">Guard</span>
        </h1>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`
            }
          >
            <LayoutDashboard size={18} className="nav-icon" />
            Dashboard
          </NavLink>

          <NavLink
            to="/portfolio"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`
            }
          >
            <Wallet size={18} className="nav-icon" />
            Portfolio
          </NavLink>

          <NavLink
            to="/trades"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`
            }
          >
            <ArrowLeftRight size={18} className="nav-icon" />
            Trades
          </NavLink>

          <NavLink
            to="/add-exchange"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`
            }
          >
            <PlusCircle size={18} className="nav-icon" />
            Add Exchange
          </NavLink>

          <NavLink
            to="/alerts"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`
            }
          >
            <ShieldAlert size={18} className="nav-icon" />
            Risk & Alerts
          </NavLink>

          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`
            }
          >
            <FileText size={18} className="nav-icon" />
            Reports
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`
            }
          >
            <Settings size={18} className="nav-icon" />
            Settings
          </NavLink>
        </nav>

        {/* Footer with Logout */}
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} className="nav-icon" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}