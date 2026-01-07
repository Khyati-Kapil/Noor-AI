import { useState } from "react";
import "../styles/auth.css";
import { useNavigate } from "react-router-dom";
import safeStorage from "../utils/safeStorage";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


const isRestrictedEnvironment = () => {
  try {
   
    const userAgent = navigator.userAgent || "";
    if (userAgent.includes("PDF") || userAgent.includes("Acrobat")) {
      return true;
    }
    
    
    try {
      if (window.self !== window.top) {
        
        if (document.referrer.includes("pdf") || document.domain !== window.location.hostname) {
          return true;
        }
      }
    } catch {
      return true; 
    }
    

    const testKey = "__pdf_test__";
    try {
      sessionStorage.setItem(testKey, "1");
      sessionStorage.removeItem(testKey);
      return false;
    } catch {
      return true; 
    }
  } catch {
    return true;
  }
};

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
 
  const [isRestricted] = useState(() => isRestrictedEnvironment());

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("Please enter email and password");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password
        })
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (data.success && data.token) {
        safeStorage.setItem("authToken", data.token);
        safeStorage.setItem("user", JSON.stringify(data.user));
        safeStorage.removeItem("demoMode");
        console.log("Token stored, navigating to dashboard...");
        navigate("/dashboard", { replace: true });
      } else {
        setError(data.message || "Invalid credentials");
        setLoading(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Connection error. Please check if server is running.");
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="glass-card">
        {isRestricted && (
          <div style={{
            background: "rgba(255, 193, 7, 0.2)",
            border: "1px solid rgba(255, 193, 7, 0.5)",
            borderRadius: "12px",
            padding: "12px 20px",
            marginBottom: "20px",
            color: "#fff",
            textAlign: "center",
            fontSize: "14px"
          }}>
            ⚠️ Running in restricted mode (PDF/Sandbox). Some features may be limited.
          </div>
        )}
        <div className="glow-border" />

        <h2 className="title">WELCOME BACK</h2>
        <p style={{ textAlign: "center", opacity: 0.8, marginBottom: "1.5rem" }}>
          Continue your health journey with Noor AI
        </p>

        <div className="section-row">
          <div className="glass-section account-bg">
            <span className="section-label">LOGIN</span>

            <div className="input-flex">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                id="password"
                name="password"
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

        <div style={{ textAlign: "center", marginTop: "1rem", opacity: 0.85 }}>
          Do not have an account?{" "}
          <a href="/register" style={{ color: "#fff", fontWeight: 500 }}>
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
