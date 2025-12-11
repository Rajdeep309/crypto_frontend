// src/components/layout/Sidebar.jsx
import { NavLink } from "react-router-dom";

const linkBase =
  "block px-3 py-2 rounded-lg text-sm transition-colors";
const activeClass = "bg-emerald-500 text-black";
const inactiveClass = "bg-slate-900 hover:bg-slate-800 text-slate-200";

export default function Sidebar() {
  return (
    <aside className="w-60 h-screen bg-slate-950 text-slate-100 p-6 flex flex-col gap-6 border-r border-slate-800">
      <h1 className="text-2xl font-bold">
        Crypto<span className="text-emerald-400">Guard</span>
      </h1>

      <nav className="space-y-2 text-sm">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeClass : inactiveClass}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/portfolio"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeClass : inactiveClass}`
          }
        >
          Portfolio
        </NavLink>

        <NavLink
          to="/alerts"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeClass : inactiveClass}`
          }
        >
          Risk &amp; Scam Alerts
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeClass : inactiveClass}`
          }
        >
          Reports
        </NavLink>

        <div className="pt-4 border-t border-slate-800 mt-4">
          <NavLink
            to="/auth"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-xs ${
                isActive
                  ? "bg-slate-200 text-slate-900"
                  : "text-slate-400 hover:bg-slate-800"
              }`
            }
          >
            Go to Login
          </NavLink>
        </div>
      </nav>
    </aside>
  );
}
