import { useState } from "react";
import "../styles/auth.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("Please enter email and password");
      return;
    }

    setError("");
    setLoading(true);
    setRedirecting(true);

    try {
      const params = new URLSearchParams({
        email: email.trim().toLowerCase(),
        password: password,
      });

      window.location.href = `${API_URL}/auth/login-redirect?${params.toString()}`;
    } catch {
      setRedirecting(false);
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  };

  if (redirecting) {
    return (
      <div className="register-container">
        <div className="glass-card">
          <h2 className="title">REDIRECTING...</h2>
          <p style={{ textAlign: "center" }}>
            Please wait while we log you in.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="glass-card">
        <div className="glow-border"></div>

        <h2 className="title">WELCOME BACK</h2>
        <p style={{ textAlign: "center", opacity: 0.8, marginBottom: "1.5rem" }}>
          Continue your health journey with Noor AI
        </p>

        <div className="section-row">
          <div className="glass-section account-bg">
            <span className="section-label">LOGIN</span>

            <div className="input-flex">
              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && <p className="error-text">{error}</p>}
            </div>
          </div>
        </div>

        <button type="button" className="next-btn" onClick={handleLogin} disabled={loading}>
          {loading ? "LOGGING IN..." : "LOGIN"}
        </button>

        <div
          style={{
            textAlign: "center",
            marginTop: "1rem",
            opacity: 0.85,
          }}
        >
          Don't have an account?{" "}
          <a href="/register" style={{ color: "#fff", fontWeight: 500 }}>
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;

