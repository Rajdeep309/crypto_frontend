// src/components/ui/StatCard.jsx
export default function StatCard({ title, value, subtitle }) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-slate-400">
        {title}
      </span>
      <span className="text-2xl font-semibold">{value}</span>
      {subtitle && (
        <span className="text-xs text-slate-500">{subtitle}</span>
      )}
    </div>
  );
}
