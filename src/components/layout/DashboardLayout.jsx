import { useLocation, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const TITLES = {
  "/": "Dashboard",
  "/portfolio": "Portfolio",
  "/alerts": "Risk & Alerts",
  "/reports": "Reports",
};

export default function DashboardLayout({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const title = TITLES[location.pathname] || "Dashboard";

  // Redirect if not logged in
  if (!token) return <Navigate to="/auth" />;

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar title={title} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
