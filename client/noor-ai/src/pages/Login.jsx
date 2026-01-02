import { useState, useEffect } from "react";
import api from "../api/axios.js";
import "../styles/auth.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    // Detect if page is embedded in an iframe
    setIsInIframe(window.self !== window.top);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      navigate("/dashboard");

    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // If in iframe, show a warning and open in new tab
  if (isInIframe) {
    return (
      <div className="register-container">
        <div className="glass-card">
          <h2 className="title">OPEN IN BROWSER</h2>
          <p style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            For the best experience, please open Noor AI directly in your browser.
          </p>
          <button 
            className="next-btn" 
            onClick={() => window.open(window.location.href, '_blank')}
          >
            OPEN IN NEW TAB
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <form className="glass-card" onSubmit={handleSubmit}>
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

        <button type="submit" className="next-btn" disabled={loading}>
          {loading ? "LOGGING IN..." : "LOGIN"}
        </button>

        <div
          style={{
            textAlign: "center",
            marginTop: "1rem",
            opacity: 0.85,
          }}
        >
          Don’t have an account?{" "}
          <a href="/register" style={{ color: "#fff", fontWeight: 500 }}>
            Register
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;
