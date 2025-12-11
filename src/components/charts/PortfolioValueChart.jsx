// src/components/charts/PortfolioValueChart.jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Mock portfolio value over time (days)
const DATA = [
  { day: "Mon", value: 9500 },
  { day: "Tue", value: 9800 },
  { day: "Wed", value: 10200 },
  { day: "Thu", value: 10100 },
  { day: "Fri", value: 10450 },
  { day: "Sat", value: 10320 },
  { day: "Sun", value: 10580 },
];

export default function PortfolioValueChart() {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 h-64">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-semibold">Portfolio Value (Last 7 Days)</h2>
        <span className="text-xs text-slate-500">Mock data</span>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="day" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            contentStyle={{ backgroundColor: "#020617", borderColor: "#1f2937" }}
            labelStyle={{ color: "#e5e7eb" }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
