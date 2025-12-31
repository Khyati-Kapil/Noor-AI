import { Link, useLocation } from "react-router-dom";
import capybaraImg from "../assets/capybara.png";
import { safeGet } from "../utils/safeStorage.js";
import "../styles/layout.css";

const Layout = ({ children }) => {
  const location = useLocation();
  const isLoggedIn = !!safeGet("token");

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            <img src={capybaraImg} alt="Noor AI" className="navbar-logo" />
            <span>Noor AI</span>
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
          </div>
        </div>
      </nav>

      <main className="layout-main">
        {children}
      </main>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <img src={capybaraImg} alt="Noor AI" className="footer-logo" />
            <span>Noor AI</span>
          </div>
          
          <p className="footer-tagline">
            Your personal wellness companion 
          </p>
          
          <div className="footer-links">
            <div className="footer-section">
             
              <a href="#about">About Us</a>
              <a href="#contact">Contact</a>
            </div>
            
          </div>
          
          <div className="footer-bottom">
            <p>© 2025 Noor AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

