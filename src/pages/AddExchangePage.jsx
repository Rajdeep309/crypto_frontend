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
    <>
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        body {
          background: linear-gradient(135deg, #4169e1 0%, #1e3a8a 100%);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
        }

        .exchange-container {
          max-width: 38rem;
          margin: 4rem auto;
          position: relative;
          z-index: 1;
          animation: slideIn 0.5s ease-out;
        }

        .exchange-card {
          background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 2.5rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 
                      0 0 40px rgba(65, 105, 225, 0.1);
        }

        .exchange-header {
          margin-bottom: 2rem;
          border-bottom: 2px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 1.5rem;
        }

        .exchange-title {
          font-size: 2rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.5rem;
          letter-spacing: -0.5px;
        }

        .exchange-subtitle {
          color: #94a3b8;
          font-size: 0.95rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #cbd5e1;
          margin-bottom: 0.5rem;
          letter-spacing: 0.3px;
        }

        .optional-tag {
          color: #64748b;
          font-weight: 400;
        }

        .form-input {
          width: 100%;
          padding: 0.875rem 1rem;
          background: rgba(15, 23, 42, 0.6);
          border: 2px solid #334155;
          border-radius: 12px;
          color: #ffffff;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          border-color: #3b82f6;
          background: rgba(15, 23, 42, 0.9);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-input::placeholder {
          color: #475569;
        }

        .input-wrapper {
          position: relative;
        }

        .input-with-icon {
          padding-right: 3rem;
        }

        .eye-button {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s;
          padding: 0.5rem;
          border-radius: 6px;
        }

        .eye-button:hover {
          color: #cbd5e1;
          background: rgba(255, 255, 255, 0.05);
        }

        .submit-button {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border: none;
          border-radius: 12px;
          color: #000000;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 0.5rem;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(16, 185, 129, 0.4);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .message {
          padding: 1rem 1.25rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          font-weight: 500;
          animation: slideIn 0.3s ease-out;
        }

        .success-message {
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #34d399;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
        }

        @media (max-width: 640px) {
          .exchange-container {
            margin: 2rem 1rem;
          }

          .exchange-card {
            padding: 2rem 1.5rem;
          }

          .exchange-title {
            font-size: 1.75rem;
          }
        }
      `}</style>

      <div className="exchange-container">
        <div className="exchange-card">
          <div className="exchange-header">
            <h2 className="exchange-title">Add Exchange</h2>
            <p className="exchange-subtitle">
              Connect your exchange using API credentials
            </p>
          </div>

          {/* 🔒 DUMMY INPUTS TO BLOCK BROWSER AUTOFILL */}
          <input type="text" style={{ display: "none" }} />
          <input type="password" style={{ display: "none" }} />

          {success && <div className="message success-message">{success}</div>}
          {error && <div className="message error-message">{error}</div>}

          <form onSubmit={handleSubmit} autoComplete="off">
            {/* ================= EXCHANGE NAME ================= */}
            <div className="form-group">
              <label className="form-label">Exchange Name</label>
              <input
                type="text"
                name="exchange_name_custom"
                autoComplete="new-password"
                placeholder="Binance"
                value={exchangeName}
                onChange={(e) => setExchangeName(e.target.value)}
                required
                className="form-input"
              />
            </div>

            {/* ================= API KEY ================= */}
            <div className="form-group">
              <label className="form-label">API Key</label>
              <div className="input-wrapper">
                <input
                  type={showApiKey ? "text" : "password"}
                  name="api_key_custom"
                  autoComplete="new-password"
                  inputMode="none"
                  placeholder="Enter API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  required
                  style={{ appearance: "none" }}
                  className="form-input input-with-icon"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="eye-button"
                >
                  {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* ================= API SECRET ================= */}
            <div className="form-group">
              <label className="form-label">
                API Secret <span className="optional-tag">(optional)</span>
              </label>
              <div className="input-wrapper">
                <input
                  type={showSecret ? "text" : "password"}
                  name="api_secret_custom"
                  autoComplete="new-password"
                  inputMode="none"
                  placeholder="Enter API Secret"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  style={{ appearance: "none" }}
                  className="form-input input-with-icon"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="eye-button"
                >
                  {showSecret ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* ================= LABEL ================= */}
            <div className="form-group">
              <label className="form-label">
                Label <span className="optional-tag">(optional)</span>
              </label>
              <input
                type="text"
                name="label_custom"
                autoComplete="off"
                placeholder="My Binance Account"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="form-input"
              />
            </div>

            {/* ================= SUBMIT ================= */}
            <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading ? "Adding..." : "Add Exchange"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}