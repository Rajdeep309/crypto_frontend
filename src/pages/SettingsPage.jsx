import { useEffect, useState } from "react";

const USER_KEY = "user_profile";

export default function SettingsPage() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [message, setMessage] = useState("");

  // Load user data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem(USER_KEY);
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Invalid user_profile data");
      }
    }
  }, []);

  // Save profile
  const saveProfile = () => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setMessage("Profile saved successfully ✅");
    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        body {
          background: linear-gradient(135deg, #4169e1 0%, #1e3a8a 100%);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        .settings-container {
          padding: 3rem 2rem;
          max-width: 40rem;
          margin: 0 auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          position: relative;
          z-index: 1;
          animation: slideIn 0.5s ease-out;
        }

        .settings-card {
          background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 2.5rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5),
                      0 0 40px rgba(65, 105, 225, 0.1);
        }

        .settings-header {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid rgba(255, 255, 255, 0.05);
        }

        .settings-title {
          font-size: 2rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.5rem;
          letter-spacing: -0.5px;
        }

        .settings-subtitle {
          color: #94a3b8;
          font-size: 0.95rem;
        }

        .form-group {
          margin-bottom: 1.75rem;
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

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 0.875rem 1rem;
          background: rgba(15, 23, 42, 0.6);
          border: 2px solid #334155;
          border-radius: 12px;
          color: #ffffff;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: #475569;
        }

        .form-input:focus,
        .form-textarea:focus {
          border-color: #3b82f6;
          background: rgba(15, 23, 42, 0.9);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .save-button {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
          border: none;
          border-radius: 12px;
          color: #ffffff;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 0.5rem;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
        }

        .save-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(139, 92, 246, 0.4);
        }

        .success-message {
          margin-top: 1.25rem;
          padding: 1rem 1.25rem;
          background: rgba(34, 197, 94, 0.15);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 12px;
          color: #34d399;
          text-align: center;
          font-weight: 600;
          font-size: 0.95rem;
          animation: fadeIn 0.3s ease-out;
        }

        @media (max-width: 640px) {
          .settings-container {
            padding: 2rem 1rem;
          }

          .settings-card {
            padding: 2rem 1.5rem;
          }

          .settings-title {
            font-size: 1.75rem;
          }
        }
      `}</style>

      <div className="settings-container">
        <div className="settings-card">
          <div className="settings-header">
            <h1 className="settings-title">Profile Settings</h1>
            <p className="settings-subtitle">Manage your account information</p>
          </div>

          {/* USERNAME */}
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              value={user.name}
              onChange={(e) =>
                setUser({ ...user, name: e.target.value })
              }
              className="form-input"
              placeholder="Enter username"
            />
          </div>

          {/* EMAIL */}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) =>
                setUser({ ...user, email: e.target.value })
              }
              className="form-input"
              placeholder="Enter email"
            />
          </div>

          {/* ADDRESS */}
          <div className="form-group">
            <label className="form-label">
              Address <span className="optional-tag">(optional)</span>
            </label>
            <textarea
              rows={3}
              value={user.address}
              onChange={(e) =>
                setUser({ ...user, address: e.target.value })
              }
              className="form-textarea"
              placeholder="Enter your address"
            />
          </div>

          {/* SAVE BUTTON */}
          <button onClick={saveProfile} className="save-button">
            Save Profile
          </button>

          {/* SUCCESS MESSAGE */}
          {message && <div className="success-message">{message}</div>}
        </div>
      </div>
    </>
  );
}