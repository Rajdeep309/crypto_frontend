
import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 text-slate-100">
        <h1 className="text-2xl font-bold text-center">
          Crypto<span className="text-emerald-400">Guard</span>
        </h1>
        <p className="text-xs text-slate-400 text-center">
          Create an account to start tracking your crypto portfolio.
        </p>

        <form className="space-y-3">
          <div className="space-y-1 text-sm">
            <label htmlFor="name" className="block text-slate-300">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              placeholder="Karthik Sonaveni"
            />
          </div>

          <div className="space-y-1 text-sm">
            <label htmlFor="email" className="block text-slate-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1 text-sm">
            <label htmlFor="password" className="block text-slate-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-1 text-sm">
            <label htmlFor="confirm" className="block text-slate-300">
              Confirm Password
            </label>
            <input
              id="confirm"
              type="password"
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-emerald-500 text-slate-950 font-semibold text-sm py-2 rounded-lg hover:bg-emerald-400"
          >
            Create Account
          </button>
        </form>

        <p className="text-[11px] text-slate-500 text-center">
          Already have an account?{" "}
          <Link to="/auth" className="text-emerald-400 hover:underline">
            Sign in
          </Link>
        </p>

        <p className="text-[11px] text-slate-500 text-center">
          {/* This is only frontend UI. Real registration logic (saving to DB) will
          be added later. */}
        </p>
      </div>
    </div>
  );
}
