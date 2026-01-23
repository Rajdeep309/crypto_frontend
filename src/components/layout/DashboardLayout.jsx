import { useLocation, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

/**
 * Page metadata – real product pattern
 */
const PAGE_META = {
  "/": {
    title: "Dashboard",
    subtitle: "Overview of portfolio performance and risk",
  },
  "/portfolio": {
    title: "Portfolio",
    subtitle: "Your crypto holdings and allocations",
  },
  "/trades": {
    title: "Trades",
    subtitle: "View and manage your trading history",
  },
  "/alerts": {
    title: "Risk & Alerts",
    subtitle: "Security warnings and risk signals",
  },
  "/reports": {
    title: "Reports",
    subtitle: "Profit, loss and tax summaries",
  },
  "/settings": {
    title: "Settings",
    subtitle: "Manage account and preferences",
  },
  "/add-exchange": {
    title: "Add Exchange",
    subtitle: "Connect your exchange using API keys",
  },
};

export default function DashboardLayout({ children, actions }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  // 🔐 Auth Guard (IMPORTANT FIX)
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const meta = PAGE_META[location.pathname] || {
    title: "Dashboard",
    subtitle: "",
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <Topbar title={meta.title} />

        {/* Page Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">{meta.title}</h1>
            <p className="text-sm text-slate-400">{meta.subtitle}</p>
          </div>

          {/* Page-level actions (optional buttons) */}
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}