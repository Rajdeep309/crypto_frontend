import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function CriticalAlertsPreview() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("risk_alerts")) || [];

    // 🔥 ONLY HIGH & MEDIUM
    const critical = stored.filter(
      (a) => a.level === "HIGH" || a.level === "MEDIUM"
    );

    setAlerts(critical.slice(0, 3)); // max 3
  }, []);

  const styles = {
    HIGH: "border-red-500/50 bg-red-500/10 text-red-400",
    MEDIUM: "border-yellow-500/50 bg-yellow-500/10 text-yellow-400",
  };

  return (
    <div className="p-5 rounded-2xl bg-[#0b1220] border border-white/5">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={18} className="text-red-400" />
        <h3 className="font-semibold">Critical Alerts</h3>
      </div>

      <div className="space-y-3">
        {alerts.length === 0 && (
          <p className="text-sm text-slate-400">
            No critical risks detected 🎉
          </p>
        )}

        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`p-3 rounded-xl border-l-4 ${styles[alert.level]}`}
          >
            <p className="font-medium">{alert.title}</p>
            <p className="text-xs text-slate-400">
              {alert.description}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("/alerts")}
        className="mt-4 text-sm text-emerald-400 hover:underline"
      >
        View all alerts →
      </button>
    </div>
  );
}
