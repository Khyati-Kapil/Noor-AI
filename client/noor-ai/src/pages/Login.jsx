import { useEffect, useRef, useState } from "react";
import "../styles/auth.css";
import { useNavigate } from "react-router-dom";
import safeStorage from "../utils/safeStorage";

const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  if (import.meta.env.PROD === true) {
    return "https://noor-ai-backend.onrender.com";
  }

  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
 
  if (!hostname.includes('localhost') && !hostname.includes('127.0.0.1')) {
    return "https://noor-ai-backend.onrender.com";
  }
  
  return "http://localhost:5000";
};

const API_URL = getApiUrl();


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
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleConfigLoading, setGoogleConfigLoading] = useState(false);
  const [googleNotConfigured, setGoogleNotConfigured] = useState(false);
  const googleBtnRef = useRef(null);
  const [googleClientId, setGoogleClientId] = useState(import.meta.env.VITE_GOOGLE_CLIENT_ID || "");
 
  const [isRestricted] = useState(() => isRestrictedEnvironment());

  const completeAuth = (data) => {
    safeStorage.setItem("authToken", data.token);
    safeStorage.setItem("user", JSON.stringify(data.user));
    safeStorage.removeItem("demoMode");
    navigate("/dashboard", { replace: true });
  };

  useEffect(() => {
    let isMounted = true;

    const fetchGoogleClientId = async () => {
      if (googleClientId) return;
      setGoogleConfigLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/auth/google-config`);
        const data = await response.json();
        if (!isMounted) return;
        if (data?.configured && data?.clientId) {
          setGoogleClientId(data.clientId);
          setGoogleNotConfigured(false);
        } else {
          setGoogleNotConfigured(true);
        }
      } catch {
        if (isMounted) setGoogleNotConfigured(true);
      } finally {
        if (isMounted) setGoogleConfigLoading(false);
      }
    };

    fetchGoogleClientId();

    return () => {
      isMounted = false;
    };
  }, [googleClientId]);

  useEffect(() => {
    if (!googleClientId || !googleBtnRef.current) return;

    const existingScript = document.getElementById("google-identity-script");
    const initializeGoogle = () => {
      if (!window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          if (!response?.credential) return;
          setGoogleLoading(true);
          setError("");
          try {
            const apiResponse = await fetch(`${API_URL}/api/auth/google`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ idToken: response.credential })
            });
            const data = await apiResponse.json();
            if (data.success && data.token) {
              completeAuth(data);
            } else {
              setError(data.message || "Google sign in failed");
            }
          } catch {
            setError("Google sign in failed. Please try again.");
          } finally {
            setGoogleLoading(false);
          }
        }
      });

      window.google.accounts.id.renderButton(googleBtnRef.current, {
        type: "standard",
        shape: "pill",
        theme: "outline",
        text: "continue_with",
        size: "large",
        width: 320
      });
    };

    if (existingScript) {
      initializeGoogle();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.id = "google-identity-script";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    document.body.appendChild(script);
  }, [googleClientId]);

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
        completeAuth(data);
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
          Continue your health journey with Noor
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

        {(googleClientId || googleConfigLoading || googleNotConfigured) && (
          <div className="google-login-wrap">
            <p className="google-login-label">or continue with</p>
            {googleClientId && <div ref={googleBtnRef} className="google-btn-container" />}
            {googleConfigLoading && <p className="google-login-label">Loading Google sign in...</p>}
            {googleNotConfigured && !googleConfigLoading && (
              <p className="google-login-label">Google login not configured on server yet.</p>
            )}
            {googleLoading && <p className="google-login-label">Signing in with Google...</p>}
          </div>
        )}

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
