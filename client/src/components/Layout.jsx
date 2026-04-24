import { Link, useLocation } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import capybaraImg from "../assets/capybara.png";
import "../styles/layout.css";
import { safeGet } from "../utils/safeStorage";
import { useTheme } from "../context/ThemeContext";

const Layout = ({ children }) => {
  const location = useLocation();
  const linkedinUrl = "https://www.linkedin.com/";
  const { theme, toggleTheme } = useTheme();

  const isLoggedIn = !!safeGet("authToken");

  const isLanding = location.pathname === "/";

  return (
    <div className={`layout${isLanding ? " layout-landing" : ""}`}>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            <img src={capybaraImg} alt="Noor" className="navbar-logo" />
            <span>Noor</span>
          </Link>

          <div className="navbar-links">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
            >
              Home
            </Link>
            
            {isLoggedIn ? (
              <Link 
                to="/dashboard" 
                className={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`nav-link ${location.pathname === "/login" ? "active" : ""}`}
                >
                  Login
                </Link>
                <Link to="/register" className="nav-btn nav-btn-primary">
                  Sign Up
                </Link>
              </>
            )}
            <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle dark mode">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </nav>

      <main className={`layout-main${isLanding ? " layout-main-landing" : ""}`}>
        {children}
      </main>

      <footer className={`footer${isLanding ? " footer-landing" : ""}`}>
        <div className="footer-container">
          <div className="footer-brand">
            <img src={capybaraImg} alt="Noor" className="footer-logo" />
            <span>Noor</span>
          </div>
          
          <p className="footer-tagline">
            Your personal wellness companion 
          </p>
          
          <div className="footer-links">
            <div className="footer-section">
             
              <Link to="/about-us">About Us</Link>
              <a href={linkedinUrl} target="_blank" rel="noreferrer">Contact</a>
            </div>
            
          </div>
          
          <div className="footer-bottom">
            <p>© 2025 Noor.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
