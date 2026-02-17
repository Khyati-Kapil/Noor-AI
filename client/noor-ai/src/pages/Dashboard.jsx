import { useState, useEffect, useRef } from 'react';
import { Flame, Weight, Activity, Utensils, Sparkles, Droplets, Camera, Send, Droplet, TrendingUp, Bell, X, Loader2, CheckCircle } from 'lucide-react';
import capybaraImg from '../assets/capybara.png';
import api from '../api/axios';
import safeStorage from '../utils/safeStorage';
import "../styles/dashboard.css";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [waterIntake, setWaterIntake] = useState(0);
  const [mealText, setMealText] = useState("");
  const [mealResult, setMealResult] = useState("");
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState("");
  const [loadingMeal, setLoadingMeal] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [greeting, setGreeting] = useState("");
  

  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [photoAnalysis, setPhotoAnalysis] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

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

  
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size should be less than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      analyzeFoodPhoto(file);
    }
    

    event.target.value = '';
  };

  const analyzeFoodPhoto = async (imageFile) => {
    if (!imageFile) return;
    
    setUploading(true);
    setPhotoAnalysis(null);

    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const res = await api.post("/api/ai/analyze-food-photo", 
        formData,
        {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setPhotoAnalysis(res.data);
      
      if (res.data.calories) {
        setConsumedCalories(prev => prev + res.data.calories);
        setMealText(res.data.description || "Analyzed from photo");
      }
    } catch (error) {
      console.error("Photo analysis error:", error);
      setPhotoAnalysis({
        error: false,
        analysis: "Unable to analyze photo right now. Please try describing your meal instead.",
        foodItems: [],
        totalCalories: 0,
        tips: []
      });
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setImagePreview(null);
    setPhotoAnalysis(null);
  };

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

  const addWater = () => {
    setWaterIntake(prev => Math.min(prev + 1, 12));
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

  const wellnessQuotes = [
    { text: "The greatest wealth is health.", author: "Virgil" },
    { text: "Wellness is not a destination, it's a way of life." },
    { text: "Take care of your body. It's the only place you have to live." },
    { text: "Small daily improvements lead to stunning results."},
  ];

  const randomQuote = wellnessQuotes[Math.floor(Math.random() * wellnessQuotes.length)];
  const userName = userData?.user?.name || "there";

  return (
    <div className="noor-dashboard-root">
     
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageSelect}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <div style={{ maxWidth: '1100px', width: '100%', margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
        
        <header className="dashboard-header">
          <div className="header-content">
            <img src={capybaraImg} alt="Noor AI Logo" className="header-logo" />
            <h1 className="header-title">Noor AI</h1>
          </div>
          <p className="header-subtitle">Your personal wellness companion</p>
        </header>

        <section className="greeting-section">
          <h2 className="greeting-text">
            {greeting}, <span>{userName}!</span> 
          </h2>
          <p className="greeting-subtext">
            Let's continue your wellness journey today. You're doing great!
          </p>
        </section>

        <section className="stats-section">
          <div className="stats-grid">
            {loading ? (
              <>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="stat-card">
                    <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '14px', marginBottom: '16px' }}></div>
                    <div className="skeleton" style={{ width: '80px', height: '14px', marginBottom: '8px' }}></div>
                    <div className="skeleton" style={{ width: '100px', height: '32px' }}></div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="stat-card">
                  <div className="stat-icon-wrapper flame"><Flame size={24} /></div>
                  <div className="stat-label">Calories</div>
                  <div className="stat-value">{isDemoMode ? "—" : consumedCalories}</div>
                  <div className="stat-goal">{isDemoMode ? "" : `/ ${dailyCalories} kcal`}</div>
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${Math.min(caloriePercentage, 100)}%` }}></div>
                    </div>
                  </div>
                  <div className="stat-sub positive">{caloriePercentage}% of goal</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon-wrapper weight"><Weight size={24} /></div>
                  <div className="stat-label">Weight</div>
                  <div className="stat-value">{userWeight}</div>
                  <div className="stat-goal">kg</div>
                  <div className="stat-sub">Current weight</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon-wrapper activity"><Activity size={24} /></div>
                  <div className="stat-label">Activity</div>
                  <div className="stat-value">{userActivity}</div>
                  <div className="stat-goal">Level</div>
                  <div className="stat-sub">Stay active!</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon-wrapper water"><Droplet size={24} /></div>
                  <div className="stat-label">Water</div>
                  <div className="stat-value">{waterIntake}</div>
                  <div className="stat-goal">/ 8 glasses</div>
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${(waterIntake / 8) * 100}%`, background: 'linear-gradient(90deg, #03a9f4 0%, #4fc3f7 50%, #81d4fa 100%)' }}></div>
                    </div>
                  </div>
                  <div className="stat-sub">{(waterIntake / 8) * 100}% hydrated</div>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="quote-section">
          <p className="quote-text">"{randomQuote.text}"</p>
        
        </section>

        <section className="quick-actions">
          <button className="quick-action-btn" onClick={() => document.getElementById('meal-section')?.scrollIntoView({ behavior: 'smooth' })}>
            <div className="quick-action-icon"><Utensils size={24} /></div>
            <span className="quick-action-label">Log Meal</span>
          </button>
          <button className="quick-action-btn" onClick={addWater}>
            <div className="quick-action-icon"><Droplet size={24} /></div>
            <span className="quick-action-label">Add Water</span>
          </button>
          <button className="quick-action-btn" onClick={() => document.getElementById('chat-section')?.scrollIntoView({ behavior: 'smooth' })}>
            <div className="quick-action-icon"><Sparkles size={24} /></div>
            <span className="quick-action-label">Ask Noor</span>
          </button>
     
        </section>

        <div className="main-content">
          <section id="meal-section" className="meal-card">
            <div className="meal-header">
              <div className="meal-icon-wrapper">
                <Utensils size={26} />
              </div>
              <div>
                <h3 className="meal-title">
                  What did you eat? 
                  <span className="ai-badge">AI Powered</span>
                </h3>
                <p className="meal-subtitle">
                  Describe your meal in natural language, or snap a photo!
                </p>
              </div>
            </div>

            {imagePreview && (
              <div className="photo-preview-container">
                <div className="photo-preview-header">
                  <span className="photo-preview-title">
                    {uploading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Analyzing your photo...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={18} /> Photo Analysis Complete
                      </>
                    )}
                  </span>
                  <button className="photo-clear-btn" onClick={clearImage}>
                    <X size={18} />
                  </button>
                </div>
                <div className="photo-preview-content">
                  <img src={imagePreview} alt="Food preview" className="photo-preview-image" />
                  {photoAnalysis && (
                    <div className="photo-analysis-results">
                      {photoAnalysis.foodItems && photoAnalysis.foodItems.length > 0 && (
                        <div className="photo-food-items">
                          <strong>Detected items:</strong>
                          <div className="food-tags">
                            {photoAnalysis.foodItems.map((item, idx) => (
                              <span key={idx} className="food-tag">{item}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {photoAnalysis.calories > 0 && (
                        <div className="photo-calories">
                          <Flame size={16} />
                          <span>~{photoAnalysis.calories} calories</span>
                        </div>
                      )}
                      {photoAnalysis.analysis && (
                        <p className="photo-analysis-text">{photoAnalysis.analysis}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="input-group">
              <input
                type="text"
                placeholder="e.g., 2 rotis, dal, paneer sabzi, and a bowl of salad..."
                value={mealText}
                onChange={(e) => setMealText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && analyzeMeal()}
              />
              <Sparkles className="input-icon" size={20} />
            </div>

            <div className="btn-row">
              <button className="btn-secondary" onClick={triggerFileInput}>
                <Camera size={18} /> 
                {imagePreview ? 'Change Photo' : 'Add Photo'}
              </button>
              <button className="btn-primary" onClick={analyzeMeal} disabled={loadingMeal}>
                {loadingMeal ? "Analyzing..." : "Analyze Meal"}
              </button>
            </div>

            {mealResult && (
              <div className="ai-response">
                <strong><Sparkles size={16} /> AI Analysis</strong>
                <p>{mealResult}</p>
              </div>
            )}
          </section>

 
          <section className="care-section">
            <div className="care-card">
              <div className="care-header">
                <div className="care-icon-wrapper">
                  <Sparkles size={22} />
                </div>
                <h3 className="care-title">Skin Care</h3>
              </div>
              <div className="label-text">TYPE</div>
              <div className="care-type">{skinType}</div>
              <div className="label-text">CONCERNS</div>
              <div className="concerns-row">
                {skinConcerns.length > 0 ? skinConcerns.map((c) => (
                  <span key={c} className="concern-tag">{c}</span>
                )) : <span className="concern-tag" style={{ background: '#f5f3f0', color: '#8c7e71' }}>None set</span>}
              </div>
              <button className="link-btn">
                View Routine <TrendingUp size={16} />
              </button>
            </div>

            <div className="care-card">
              <div className="care-header">
                <div className="care-icon-wrapper">
                  <Droplets size={22} />
                </div>
                <h3 className="care-title">Hair Care</h3>
              </div>
              <div className="label-text">TYPE</div>
              <div className="care-type">{hairType}</div>
              <div className="label-text">CONCERNS</div>
              <div className="concerns-row">
                {hairConcerns.length > 0 ? hairConcerns.map((c) => (
                  <span key={c} className="concern-tag">{c}</span>
                )) : <span className="concern-tag" style={{ background: '#f5f3f0', color: '#8c7e71' }}>None set</span>}
              </div>
              <button className="link-btn">
                View Routine <TrendingUp size={16} />
              </button>
            </div>
          </section>
        </div>


        <section id="chat-section" className="chat-section">
          <h2 className="section-title">
            <Sparkles size={22} />
            Ask Noor AI
          </h2>

          <div className="chat-card">
            <div className="chat-welcome">
              <img src={capybaraImg} alt="Noor AI" />
              <p>
                Hi! I'm Noor. Ask me about diet, skincare, haircare, fitness, or any wellness question. I'm here to help! 🌟
              </p>
            </div>

            <div className="chat-input-wrapper">
              <input
                type="text"
                placeholder="How can I improve my sleep quality?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && askNoor()}
              />
              <button className="send-btn" onClick={askNoor}>
                {loadingChat ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>

            <div className="suggestions-row">
              <button onClick={() => setQuestion("How can I lose weight naturally?")}>How can I lose weight?</button>
              <button onClick={() => setQuestion("Best skincare routine for acne-prone skin")}>Skincare for acne</button>
              <button onClick={() => setQuestion("Tips to reduce hair frizz")}>Reduce hair frizz</button>
              <button onClick={() => setQuestion("What foods boost energy?")}>Boost energy</button>
            </div>

            {reply && (
              <div className="ai-reply">
                <strong><Sparkles size={16} /> Noor AI</strong>
                <p>{reply}</p>
              </div>
            )}
          </div>
        </section>

        {!isDemoMode && !userData && !loading && (
          <div className="stat-card" style={{ textAlign: 'center', padding: '40px', marginTop: '20px' }}>
            <div className="stat-icon-wrapper" style={{ margin: '0 auto 16px', background: 'linear-gradient(135deg, #fff5e6, #ffe4cc)' }}>
              <Bell size={24} color="#e67e22" />
            </div>
            <h3 style={{ color: '#4a3728', marginBottom: '12px' }}>Please log in to view your personalized dashboard</h3>
            <p style={{ color: '#8c7e71', marginBottom: '20px' }}>Sign in to track your wellness journey</p>
            <a href="/login" className="btn-primary" style={{ display: 'inline-flex', textDecoration: 'none' }}>
              Go to Login
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

