import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { getPriceSnapshots } from "../../services/priceSnapshotService";

export default function PortfolioValueChart() {
  const [symbol, setSymbol] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadChart = async () => {
    const asset = symbol.trim().toUpperCase();
    setError("");
    setData([]);

    if (!asset) {
      setError("Enter asset symbol");
      return;
    }

    try {
      setLoading(true);

      const res = await getPriceSnapshots(asset);
      const raw = res?.data?.data || [];

      console.log("PriceSnapshot API:", raw);

      if (raw.length === 0) {
        setError("No price data available");
        return;
      }

      // ✅ MAP CORRECT BACKEND FIELDS
      const formatted = raw.map((item) => ({
        time: new Date(item.capturedAt).toLocaleString(),
        price: Number(item.priceUsd),
      }));

      setData(formatted);
    } catch (e) {
      console.error(e);
      setError("Failed to load price chart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold text-slate-200">
          Asset Price Trend
        </h2>
        <span className="text-xs text-slate-500">
          {/* PriceSnapshot */}
        </span>
      </div>

      {/* INPUT */}
      <div className="flex gap-2 mb-4">
        <input
          placeholder="BTC / ETH / SOL"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-700 p-2 rounded outline-none"
        />
        <button
          onClick={loadChart}
          className="bg-emerald-600 hover:bg-emerald-700 px-4 rounded font-medium"
        >
          View
        </button>
      </div>

      {/* STATES */}
      {loading && (
        <p className="text-slate-400 text-sm">
          Loading chart...
        </p>
      )}

      {error && (
        <p className="text-red-400 text-sm">
          {error}
        </p>
      )}

      {/* ✅ FIXED HEIGHT */}
      {!loading && data.length > 0 && (
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1f2937"
              />
              <XAxis
                dataKey="time"
                stroke="#9ca3af"
                tick={{ fontSize: 10 }}
              />
              <YAxis
                stroke="#9ca3af"
                tick={{ fontSize: 10 }}
                domain={["auto", "auto"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  border: "1px solid #1f2937",
                  borderRadius: 8,
                }}
                labelStyle={{ color: "#e5e7eb" }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#22c55e"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
