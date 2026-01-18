import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  ShieldAlert,
  FileText,
  Settings,
  PlusCircle,
  ArrowLeftRight, // 🔄 Trades icon
} from "lucide-react";

const linkBase =
  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all";

const activeClass =
  "bg-emerald-500/20 text-emerald-400 shadow-inner";

const inactiveClass =
  "text-slate-300 hover:bg-white/5 hover:text-white";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-[#020617] text-slate-100 p-6 flex flex-col border-r border-white/5">
      {/* Logo */}
      <h1 className="text-2xl font-bold mb-8">
        Crypto<span className="text-emerald-400">Guard</span>
      </h1>

      {/* Navigation */}
      <nav className="space-y-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink
          to="/portfolio"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <Wallet size={18} />
          Portfolio
        </NavLink>

        {/* 🔄 Trades */}
        <NavLink
          to="/trades"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <ArrowLeftRight size={18} />
          Trades
        </NavLink>

        <NavLink
          to="/add-exchange"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <PlusCircle size={18} />
          Add Exchange
        </NavLink>

        <NavLink
          to="/alerts"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <ShieldAlert size={18} />
          Risk & Alerts
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <FileText size={18} />
          Reports
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <Settings size={18} />
          Settings
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="mt-auto text-xs text-slate-500 pt-6">
        {/* v1.0 • Local Demo */}
      </div>
    </aside>
  );
}
