import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgetPassword, resetPassword } from "../services/authService";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=reset
  const [email, setEmail] = useState("");

  const [serverOtp, setServerOtp] = useState(""); // 🔥 API OTP
  const [otp, setOtp] = useState("");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= STEP 1 : EMAIL ================= */
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await forgetPassword(email);

      // ✅ OTP from backend response
      const otpFromApi = res?.data?.otp;

      if (!otpFromApi) {
        setError("OTP not received from server");
        return;
      }

      setServerOtp(String(otpFromApi)); // 🔥 store OTP
      setMessage("OTP sent to your email");
      setStep(2);
    } catch {
      setError("Email not found");
    } finally {
      setLoading(false);
    }
  };

  /* ================= STEP 2 : OTP VERIFY ================= */
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (otp !== serverOtp) {
      setError("Invalid OTP");
      return;
    }

    setMessage("OTP verified successfully");
    setStep(3);
  };

  /* ================= STEP 3 : RESET PASSWORD ================= */
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email, password, otp);

      setMessage("Password reset successful");

      // 🔁 redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch {
      setError("Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SKIP RESET ================= */
  const skipReset = () => {
    // ✅ skip only after OTP verified
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800 p-8 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Forgot Password
        </h2>

        {error && <p className="text-red-400 text-center mb-3">{error}</p>}
        {message && <p className="text-green-400 text-center mb-3">{message}</p>}

        {/* STEP 1 */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Enter registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded bg-slate-700 text-white"
            />
            <button className="w-full bg-emerald-500 py-3 rounded font-semibold">
              {loading ? "Checking..." : "Continue"}
            </button>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full p-3 rounded bg-slate-700 text-white"
            />
            <button className="w-full bg-emerald-500 py-3 rounded font-semibold">
              Verify OTP
            </button>
          </form>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 rounded bg-slate-700 text-white"
              />

              <input
                type="password"
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full p-3 rounded bg-slate-700 text-white"
              />

              <button className="w-full bg-emerald-500 py-3 rounded font-semibold">
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>

            {/* 🔹 SKIP BUTTON */}
            <button
              onClick={skipReset}
              className="w-full mt-4 border border-slate-500 text-slate-300 py-2 rounded hover:bg-slate-700"
            >
              Skip reset & Go to Dashboard
            </button>
          </>
        )}

        <p className="text-slate-400 text-sm mt-6 text-center">
          Remember password?{" "}
          <Link to="/login" className="text-blue-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
