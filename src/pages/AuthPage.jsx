import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    
    localStorage.setItem("token", "FAKE_USER_TOKEN");
    localStorage.setItem("userEmail", email);

    
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 text-slate-100">

        {/* Branding */}
        <h1 className="text-2xl font-bold text-center">
          Crypto<span className="text-emerald-400">Guard</span>
        </h1>

        {/* Login Form */}
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-1 text-sm">
            <label className="block text-slate-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1 text-sm">
            <label className="block text-slate-300">Password</label>
            <input
              type="password"
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 text-black py-2 rounded-lg hover:bg-emerald-400"
          >
            Sign In
          </button>
        </form>

        <p className="text-[12px] text-slate-400 text-center">
          No account? <Link to="/register" className="text-emerald-400">Create one</Link>
        </p>
      </div>
    </div>
  );
}
