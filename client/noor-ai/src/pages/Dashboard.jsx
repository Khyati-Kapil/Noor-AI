import { useState, useEffect } from 'react';
import { Flame, Weight, Activity, Utensils, Sparkles, Droplets, Camera, Send } from 'lucide-react';
import capybaraImg from '../assets/capybara.png';
import api from '../api/axios';
import safeStorage from '../utils/safeStorage';
import "../styles/dashboard.css";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [mealText, setMealText] = useState("");
  const [mealResult, setMealResult] = useState("");
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState("");
  const [loadingMeal, setLoadingMeal] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const getAuthHeader = () => {
    const token = safeStorage.getItem("authToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const demoMode = safeStorage.getItem("demoMode") === "true";
    setIsDemoMode(demoMode);

    const fetchUserData = async () => {
      if (demoMode) {
        setUserData(null);
        setLoading(false);
        return;
      }
      
      try {
        const response = await api.get("/api/user/profile", {
          headers: getAuthHeader()
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        safeStorage.removeItem("authToken");
        safeStorage.removeItem("user");
        
        if (typeof window !== "undefined" && !window.location.origin.startsWith("null")) {
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const analyzeMeal = async () => {
    if (!mealText.trim()) return;
    setLoadingMeal(true);
    setMealResult("");

    try {
      const res = await api.post("/api/ai/analyze-meal", 
        { mealText },
        { headers: getAuthHeader() }
      );
      setMealResult(res.data.analysis);

      if (res.data.calories) {
        setConsumedCalories(prev => prev + res.data.calories);
      }
    } catch {
      setMealResult("Unable to analyze meal right now.");
    } finally {
      setLoadingMeal(false);
    }
  };

  const askNoor = async () => {
    if (!question.trim()) return;
    setLoadingChat(true);
    setReply("");

    try {
      const res = await api.post("/api/ai/ask", 
        { question },
        { headers: getAuthHeader() }
      );
      setReply(res.data.reply);
    } catch {
      setReply("Noor AI is unavailable at the moment.");
    } finally {
      setLoadingChat(false);
    }
  };

  const caloriePercentage = userData?.dailyCalories 
    ? Math.round((consumedCalories / userData.dailyCalories) * 100)
    : 0;

  const dailyCalories = userData?.dailyCalories || 2000;
  const userWeight = userData?.user?.weight || "—";
  const userActivity = userData?.user?.activityLevel || "—";
  const skinType = userData?.user?.skinType || "Not set";
  const skinConcerns = userData?.user?.skinConcerns || [];
  const hairType = userData?.user?.hairType || "Not set";
  const hairConcerns = userData?.user?.hairConcerns || [];

  return (
    <div className="noor-dashboard-root">
      <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto', padding: '40px 20px' }}>
        {isDemoMode}
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <img src={capybaraImg} alt="Noor AI Logo" style={{ width: '50px', height: '50px' }} />
            <h1 style={{ fontSize: '3rem', margin: 0, color: '#7c5e4d', fontFamily: 'serif' }}>
              Noor AI
            </h1>
          </div>
          <p style={{ color: '#8c7e71', margin: '8px 0' }}>
            Your personal wellness companion
          </p>
        </header>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Daily Overview</h2>
          <div className="dashboard-grid-3">
            {loading ? (
              <>
                <StatCard icon={<Flame size={20} />} label="Calories" val="Loading..." goal="" sub="" />
                <StatCard icon={<Weight size={20} />} label="Weight" val="Loading..." goal="" />
                <StatCard icon={<Activity size={20} />} label="Activity" val="Loading..." goal="" />
              </>
            ) : (
              <>
                <StatCard
                  icon={<Flame size={20} />}
                  label="Calories"
                  val={isDemoMode ? "Not logged in" : consumedCalories}
                  goal={isDemoMode ? "" : `/ ${dailyCalories} kcal`}
                  sub={isDemoMode ? "" : `${caloriePercentage}% of goal`}
                />
                <StatCard
                  icon={<Weight size={20} />}
                  label="Weight"
                  val={`${userWeight} kg`}
                  goal=""
                />
                <StatCard
                  icon={<Activity size={20} />}
                  label="Activity"
                  val={userActivity}
                  goal=""
                />
              </>
            )}
          </div>
        </section>

        <section className="meal-card">
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <Utensils size={24} />
            <div>
              <h3>What did you eat? <span className="ai-badge">AI Powered</span></h3>
              <p style={{ fontSize: '0.9rem' }}>
                Describe your meal in natural language, or snap a photo!
              </p>
            </div>
          </div>

          <div className="input-group">
            <input
              type="text"
              placeholder="e.g., 2 rotis, dal, paneer sabzi..."
              value={mealText}
              onChange={(e) => setMealText(e.target.value)}
            />
            <Sparkles className="input-icon" size={18} />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-secondary">
              <Camera size={18} /> Add Photo
            </button>
            <button className="btn-primary" onClick={analyzeMeal}>
              {loadingMeal ? "Analyzing..." : "Analyze Meal"}
            </button>
          </div>

          {mealResult && (
            <div className="ai-response">
              <strong>AI Analysis</strong>
              <p>{mealResult}</p>
            </div>
          )}
        </section>

        <div className="dashboard-grid-2">
          <CareCard 
            title="Skin Care" 
            type={skinType} 
            concerns={skinConcerns} 
            icon={<Sparkles size={20} />} 
          />
          <CareCard 
            title="Hair Care" 
            type={hairType} 
            concerns={hairConcerns} 
            icon={<Droplets size={20} />} 
          />
        </div>

        <section className="section-block">
          <h2 className="section-title">Ask Noor AI</h2>

          <div className="chat-card">
            <div className="chat-welcome">
              <img src={capybaraImg} alt="Noor AI" style={{ width: '32px' }} />
              <p>
                Hi! I am Noor. Ask me about diet, skincare, haircare, or wellness.
              </p>
            </div>

            <div className="chat-input-wrapper">
              <input
                type="text"
                placeholder="Reduce hair frizz"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <button className="send-btn" onClick={askNoor}>
                {loadingChat ? "..." : <Send size={18} />}
              </button>
            </div>

            <div className="suggestions-row">
              <button onClick={() => setQuestion("How can I lose weight?")}>How can I lose weight?</button>
              <button onClick={() => setQuestion("Skincare for acne")}>Skincare for acne</button>
              <button onClick={() => setQuestion("Reduce hair frizz")}>Reduce hair frizz</button>
            </div>

            {reply && (
              <div className="ai-reply">
                <strong>Noor AI</strong>
                <p>{reply}</p>
              </div>
            )}
          </div>
        </section>

        {!isDemoMode && !userData && !loading && (
          <div className="card shadow" style={{ textAlign: 'center', padding: '40px', marginTop: '20px' }}>
            <h3>Please log in to view your personalized dashboard</h3>
            <a href="/login" className="btn-primary" style={{ display: 'inline-block', marginTop: '20px' }}>
              Go to Login
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, val, goal, sub }) => (
  <div className="card shadow">
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
      {icon} {label}
    </div>
    <div>
      <strong style={{ fontSize: '1.6rem' }}>{val}</strong> <span>{goal}</span>
    </div>
    {sub && <div style={{ fontSize: '0.75rem' }}>{sub}</div>}
  </div>
);

const CareCard = ({ title, type, concerns, icon }) => (
  <div className="card shadow">
    <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
      {icon} <h3>{title}</h3>
    </div>
    <div className="label-text">TYPE</div>
    <div>{type}</div>
    <div className="label-text">CONCERNS</div>
    <div style={{ display: 'flex', gap: '10px' }}>
      {concerns.length > 0 ? concerns.map((c) => <span key={c}>{c}</span>) : <span>None</span>}
    </div>
    <button className="link-btn">View Routine </button>
  </div>
);

export default Dashboard;
