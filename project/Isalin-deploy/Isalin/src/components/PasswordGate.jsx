import { useEffect, useState } from "react";

const STORAGE_KEY = "isalin_app_password";

const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api";

export function getStoredPassword() {
  return sessionStorage.getItem(STORAGE_KEY) || "";
}

export default function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = getStoredPassword();
    if (stored) verify(stored, false);
    else setChecking(false);
  }, []);

  async function verify(pw, showError = true) {
    setChecking(true);
    try {
      const res = await fetch(`${BASE}/health`, {
        headers: { "x-app-password": pw },
      });
      if (res.ok) {
        sessionStorage.setItem(STORAGE_KEY, pw);
        setUnlocked(true);
        setError("");
      } else if (showError) {
        setError("Incorrect password.");
      }
    } catch {
      if (showError) setError("Couldn't reach the server — try again.");
    } finally {
      setChecking(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    verify(password);
  }

  if (unlocked) return children;

  return (
    <div className="app-shell" style={{ maxWidth: 380, textAlign: "center" }}>
      <h1 className="app-title" style={{ fontSize: "1.8rem", justifyContent: "center" }}>
        Isalin
      </h1>
      <p className="app-subtitle" style={{ margin: "12px 0 20px" }}>
        This app is password-protected. Enter the password to continue.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          className="text-area input"
          style={{ minHeight: "auto", padding: "10px 14px" }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
        />
        <button
          type="submit"
          className="copy-button"
          style={{ marginTop: 12, width: "100%" }}
          disabled={checking}
        >
          {checking ? "Checking…" : "Enter"}
        </button>
        {error && (
          <p className="status-text error" style={{ marginTop: 10 }}>
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
