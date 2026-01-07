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

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "", 
    email: "",
    password: "",
    age: "",
    height: "",
    weight: "",
    gender: "",
    primaryGoal: "",
    activityLevel: "",
    skinType: "",
    skinConcerns: [],
    hairType: "",
    hairConcerns: []
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
 
  const [isRestricted] = useState(() => isRestrictedEnvironment());

  const validate = () => {
    const newErrors = {};

    
    if (formData.name && formData.name.trim().length === 0) {
      newErrors.name = "Name cannot be empty";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (
      !formData.email.includes("@") ||
      !formData.email.includes(".") ||
      formData.email.indexOf("@") > formData.email.lastIndexOf(".")
    ) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.age || Number(formData.age) < 1 || Number(formData.age) > 120) {
      newErrors.age = "Enter a valid age (1-120)";
    }

    if (!formData.height || Number(formData.height) < 1) {
      newErrors.height = "Enter a valid height";
    }

    if (!formData.weight || Number(formData.weight) < 1) {
      newErrors.weight = "Enter a valid weight";
    }

    if (!formData.primaryGoal) {
      newErrors.primaryGoal = "Select a goal";
    }

    if (!formData.activityLevel) {
      newErrors.activityLevel = "Select activity level";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e, type) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [type]: checked
        ? [...prev[type], value]
        : prev[type].filter((v) => v !== value)
    }));
  };

  const handleRegister = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    setApiMessage("");

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          age: Number(formData.age),
          height: Number(formData.height),
          weight: Number(formData.weight),
          gender: formData.gender,
          primaryGoal: formData.primaryGoal,
          activityLevel: formData.activityLevel,
          skinType: formData.skinType,
          skinConcerns: formData.skinConcerns,
          hairType: formData.hairType,
          hairConcerns: formData.hairConcerns
        })
      });

      const data = await response.json();

      if (data.success && data.token) {
        safeStorage.setItem("authToken", data.token);
        safeStorage.setItem("user", JSON.stringify(data.user));
        safeStorage.removeItem("demoMode");
        navigate("/dashboard");
      } else {
        setApiMessage(data.message || "Registration failed. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setApiMessage("Something went wrong. Please try again.");
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
        <h2 className="title">YOUR JOURNEY STARTS HERE!</h2>

        <div className="section-row">
          <div className="glass-section account-bg">
            <span className="section-label">ACCOUNT INFO</span>
            <div className="input-flex">
              <input 
                name="name" 
                placeholder="Full Name" 
                value={formData.name} 
                onChange={handleChange} 
              />
              {errors.name && <p className="error-text">{errors.name}</p>} 

              <input 
                name="email" 
                placeholder="Email" 
                value={formData.email} 
                onChange={handleChange} 
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
              
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                value={formData.password} 
                onChange={handleChange} 
              />
              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>
          </div>
        </div>

        <div className="section-row">
          <div className="glass-section pink-bg">
            <span className="section-label">ABOUT YOU</span>
            <div className="input-grid">
              <input name="age" placeholder="Age" value={formData.age} onChange={handleChange} />
              <input name="height" placeholder="Height (cm)" value={formData.height} onChange={handleChange} />
              <select name="gender" value={formData.gender} onChange={handleChange} className="full-span">
                <option value="">Select Gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
            {(errors.age || errors.height) && <p className="error-text">Check Age/Height</p>}
          </div>

          <div className="glass-section purple-bg">
            <span className="section-label">WELLNESS GOALS</span>
            <div className="input-grid">
              <input name="weight" placeholder="Weight (kg)" value={formData.weight} onChange={handleChange} />
              <input name="targetWeight" placeholder="Target Weight" />
              <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="full-span">
                <option value="">Activity Level</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
              </select>
            </div>
            {errors.weight && <p className="error-text">{errors.weight}</p>}
            {errors.activityLevel && <p className="error-text">{errors.activityLevel}</p>}
          </div>
        </div>

        <div className="section-row">
          <div className="glass-section yellow-bg">
            <span className="section-label">SKIN ANALYSIS</span>
            <div className="analysis-flex">
              <label className="field-title">Skin Type</label>
              <select name="skinType" value={formData.skinType} onChange={handleChange}>
                <option value="">Select</option>
                <option value="dry">Dry</option>
                <option value="oily">Oily</option>
                <option value="combination">Combination</option>
                <option value="normal">Normal</option>
              </select>
              <label className="field-title">Skin Concerns</label>
              <div className="checkbox-row">
                {["acne", "pigmentation", "dullness", "wrinkles", "redness", "others"].map((c) => (
                  <label key={c} className="check-item">
                    <input 
                      type="checkbox" 
                      value={c} 
                      checked={formData.skinConcerns.includes(c)}
                      onChange={(e) => handleCheckboxChange(e, "skinConcerns")} 
                    />
                    <span className="checkmark"></span>
                    <span className="check-text">{c}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-section blue-bg">
            <span className="section-label">HAIR ANALYSIS</span>
            <div className="analysis-flex">
              <label className="field-title">Hair Type</label>
              <select name="hairType" value={formData.hairType} onChange={handleChange}>
                <option value="">Select</option>
                <option value="dry">Dry</option>
                <option value="oily">Oily</option>
                <option value="normal">Normal</option>
                <option value="combination">Combination</option>
              </select>
              <label className="field-title">Hair Concerns</label>
              <div className="checkbox-row">
                {["hair fall", "dandruff", "frizz", "slow growth"].map((c) => (
                  <label key={c} className="check-item">
                    <input 
                      type="checkbox" 
                      value={c} 
                      checked={formData.hairConcerns.includes(c)}
                      onChange={(e) => handleCheckboxChange(e, "hairConcerns")} 
                    />
                    <span className="checkmark"></span>
                    <span className="check-text">{c}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="section-row">
          <div className="glass-section account-bg full-width">
            <span className="section-label">PRIMARY GOAL</span>
            <select name="primaryGoal" value={formData.primaryGoal} onChange={handleChange}>
              <option value="">Select</option>
              <option value="gain">Weight Gain</option>
              <option value="loss">Weight Loss</option>
              <option value="maintain">Maintain</option>
              <option value="skin">Improve Skin</option>
              <option value="hair">Improve Hair</option>
              <option value="wellness">Overall Wellness</option>
            </select>
            {errors.primaryGoal && <p className="error-text">{errors.primaryGoal}</p>}
          </div>
        </div>

        <button type="button" className="next-btn" onClick={handleRegister} disabled={loading}>
          {loading ? "Creating Account..." : "CREATE ACCOUNT"}
        </button>
        <p className="login-option">
          Already have an account?
          <span
            className="login-link"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

        {apiMessage && <p className="api-message-text">{apiMessage}</p>}
      </div>
    </div>
  );
};

export default Register;

