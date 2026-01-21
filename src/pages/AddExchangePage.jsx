import { useState } from "react";
import { addExchange } from "../services/apiKeyService";
import { Eye, EyeOff } from "lucide-react";

export default function AddExchangePage() {
  const [exchangeName, setExchangeName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [label, setLabel] = useState("");

  const [showApiKey, setShowApiKey] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);

    try {
      await addExchange({
        exchangeName: exchangeName.trim(),
        apiKey: apiKey.trim(),
        apiSecret: apiSecret.trim() || null,
        label: label.trim() || null,
      });

      setSuccess("Exchange added successfully ✅");

      setExchangeName("");
      setApiKey("");
      setApiSecret("");
      setLabel("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to add exchange ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-slate-900 border border-slate-700 p-6 rounded-xl">
      <h2 className="text-2xl font-semibold mb-1 text-white">
        Add Exchange
      </h2>
      <p className="text-slate-400 mb-6">
        Connect your exchange using API credentials
      </p>

      {/* 🔒 DUMMY INPUTS TO BLOCK BROWSER AUTOFILL */}
      <input type="text" style={{ display: "none" }} />
      <input type="password" style={{ display: "none" }} />

      {success && <p className="mb-4 text-green-400">{success}</p>}
      {error && <p className="mb-4 text-red-400">{error}</p>}

      <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
        {/* ================= EXCHANGE NAME ================= */}
        <div>
          <label className="text-sm text-slate-300 mb-1 block">
            Exchange Name
          </label>
          <input
            type="text"
            name="exchange_name_custom"
            autoComplete="new-password"
            placeholder="Binance"
            value={exchangeName}
            onChange={(e) => setExchangeName(e.target.value)}
            required
            className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-white"
          />
        </div>

        {/* ================= API KEY ================= */}
        <div>
          <label className="text-sm text-slate-300 mb-1 block">
            API Key
          </label>

          <div className="relative">
            <input
              type={showApiKey ? "text" : "password"}
              name="api_key_custom"
              autoComplete="new-password"
              inputMode="none"
              placeholder="Enter API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
              style={{ appearance: "none" }}   // 🔥 DOUBLE EYE FIX
              className="w-full p-3 pr-10 rounded bg-slate-800 border border-slate-700 text-white"
            />

            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
            >
              {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* ================= API SECRET ================= */}
        <div>
          <label className="text-sm text-slate-300 mb-1 block">
            API Secret <span className="text-slate-500">(optional)</span>
          </label>

          <div className="relative">
            <input
              type={showSecret ? "text" : "password"}
              name="api_secret_custom"
              autoComplete="new-password"
              inputMode="none"
              placeholder="Enter API Secret"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              style={{ appearance: "none" }}   // 🔥 DOUBLE EYE FIX
              className="w-full p-3 pr-10 rounded bg-slate-800 border border-slate-700 text-white"
            />

            <button
              type="button"
              onClick={() => setShowSecret(!showSecret)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
            >
              {showSecret ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* ================= LABEL ================= */}
        <div>
          <label className="text-sm text-slate-300 mb-1 block">
            Label <span className="text-slate-500">(optional)</span>
          </label>
          <input
            type="text"
            name="label_custom"
            autoComplete="off"
            placeholder="My Binance Account"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-white"
          />
        </div>

        {/* ================= SUBMIT ================= */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded font-semibold text-black transition
            ${
              loading
                ? "bg-emerald-300 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-600"
            }`}
        >
          {loading ? "Adding..." : "Add Exchange"}
        </button>
      </form>
    </div>
  );
}
