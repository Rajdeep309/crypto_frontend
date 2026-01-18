import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { forgetPassword } from "../services/authService";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ Verify email exists
      await forgetPassword(email);

      // ✅ Move directly to reset password page
      navigate("/reset-password", {
        state: { email },
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Email not found"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800 p-8 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Forgot Password
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded bg-slate-700 text-white outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold py-3 rounded disabled:opacity-50"
          >
            {loading ? "Checking..." : "Continue"}
          </button>
        </form>

        <p className="text-slate-400 text-sm mt-6 text-center">
          Remember password?{" "}
          <Link
            to="/login"
            className="text-blue-400 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
