import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Weight, Activity, Utensils, Sparkles, Droplets, Camera, Send, Droplet, TrendingUp, Bell, X, Loader2, CheckCircle } from 'lucide-react';
import capybaraImg from '../assets/capybara.png';
import api from '../api/axios';
import safeStorage from '../utils/safeStorage';
import '../styles/dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [waterIntake, setWaterIntake] = useState(0);
  const [mealText, setMealText] = useState('');
  const [mealResult, setMealResult] = useState('');
  const [question, setQuestion] = useState('');
  const [reply, setReply] = useState('');
  const [loadingMeal, setLoadingMeal] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [greeting, setGreeting] = useState('');

  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [photoAnalysis, setPhotoAnalysis] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');

  }, []);

  const getAuthHeader = () => {
    const token = safeStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const demoMode = safeStorage.getItem('demoMode') === 'true';
    setIsDemoMode(demoMode);

    const fetchUserData = async () => {
      if (demoMode) {
        setUserData(null);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/api/user/profile', {
          headers: getAuthHeader()
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        safeStorage.removeItem('authToken');
        safeStorage.removeItem('user');

        if (typeof window !== 'undefined' && !window.location.origin.startsWith('null')) {
          window.location.href = '/login';
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

      const res = await api.post('/api/ai/analyze-food-photo', formData, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'multipart/form-data'
        }
      });

      setPhotoAnalysis(res.data);

      if (res.data.calories) {
        setConsumedCalories((prev) => prev + res.data.calories);
        setMealText(res.data.description || 'Analyzed from photo');
      }
    } catch (error) {
      console.error('Photo analysis error:', error);
      setPhotoAnalysis({
        error: false,
        analysis: 'Unable to analyze photo right now. Please try describing your meal instead.',
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
    setMealResult('');

    try {
      const res = await api.post('/api/ai/analyze-meal', { mealText }, { headers: getAuthHeader() });
      setMealResult(res.data.analysis);

      if (res.data.calories) {
        setConsumedCalories((prev) => prev + res.data.calories);
      }
    } catch {
      setMealResult('Unable to analyze meal right now.');
    } finally {
      setLoadingMeal(false);
    }
  };

  const askNoor = async () => {
    if (!question.trim()) return;
    setLoadingChat(true);
    setIsStreaming(true);
    setReply('');

    try {
      const response = await fetch(`${api.defaults.baseURL}/api/ai/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
          ...getAuthHeader()
        },
        body: JSON.stringify({ question })
      });

      if (!response.ok || !response.body) {
        throw new Error('Stream request failed');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let finished = false;

      while (!finished) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';

        for (const eventText of events) {
          const lines = eventText.split('\n');
          const eventLine = lines.find((line) => line.startsWith('event:'));
          const dataLine = lines.find((line) => line.startsWith('data:'));
          if (!eventLine || !dataLine) continue;

          const eventName = eventLine.replace('event:', '').trim();
          const dataPayload = dataLine.replace('data:', '').trim();

          let parsed = {};
          try {
            parsed = JSON.parse(dataPayload);
          } catch {
            parsed = {};
          }

          if (eventName === 'token' && parsed.token) {
            setReply((prev) => `${prev}${parsed.token}`);
          }

          if (eventName === 'end') {
            finished = true;
            break;
          }

          if (eventName === 'error') {
            throw new Error(parsed.message || 'Streaming failed');
          }
        }
      }
    } catch {
      try {
        const fallback = await api.post('/api/ai/ask', { question }, { headers: getAuthHeader() });
        setReply(fallback.data.reply);
      } catch {
        setReply('Noor is unavailable at the moment.');
      }
    } finally {
      setIsStreaming(false);
      setLoadingChat(false);
    }
  };

  const addWater = () => {
    setWaterIntake((prev) => Math.min(prev + 1, 12));
  };

  const caloriePercentage = userData?.dailyCalories ? Math.round((consumedCalories / userData.dailyCalories) * 100) : 0;

  const dailyCalories = userData?.dailyCalories || 2000;
  const userWeight = userData?.user?.weight || '—';
  const userActivity = userData?.user?.activityLevel || '—';
  const skinType = userData?.user?.skinType || 'Not set';
  const skinConcerns = userData?.user?.skinConcerns || [];
  const hairType = userData?.user?.hairType || 'Not set';
  const hairConcerns = userData?.user?.hairConcerns || [];
  const hydrationPercent = Math.min(Math.round((waterIntake / 8) * 100), 100);

  const userName = userData?.user?.name || 'there';
  return (
    <div className="noor-dashboard-root">
      <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" style={{ display: 'none' }} />

      <div className="dashboard-shell">
        <header className="dashboard-topbar fade-in-up">
          <div className="brand-wrap">
            <div className="brand-logo-wrap">
              <img src={capybaraImg} alt="Noor Logo" className="header-logo" />
            </div>
            <div>
              <h1 className="header-title">Noor</h1>
              <p className="header-subtitle">Skin, body and hair wellness intelligence</p>
            </div>
          </div>
        </header>

        <section className="hero-panel fade-in-up delay-1">
          <div className="hero-copy">
            <p className="eyebrow">Personal Wellness Command Center</p>
            <h2 className="greeting-text">
              {greeting}, <span>{userName}</span>
            </h2>
            <p className="greeting-subtext">Track your nutrition, hydration, skin care and hair goals from one smart dashboard.</p>

            <div className="hero-cta-row">
              <button
                className="quick-action-btn"
                onClick={() => document.getElementById('meal-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="quick-action-icon">
                  <Utensils size={20} />
                </div>
                <span className="quick-action-label">Log Meal</span>
              </button>
              <button className="quick-action-btn" onClick={addWater}>
                <div className="quick-action-icon">
                  <Droplet size={20} />
                </div>
                <span className="quick-action-label">Add Water</span>
              </button>
              <button
                className="quick-action-btn"
                onClick={() => document.getElementById('chat-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="quick-action-icon">
                  <Sparkles size={20} />
                </div>
                <span className="quick-action-label">Ask Noor</span>
              </button>
            </div>
          </div>

        </section>

        <section className="stats-section fade-in-up delay-2">
          <div className="stats-grid">
            {loading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="stat-card">
                    <div className="skeleton" style={{ width: '46px', height: '46px', borderRadius: '14px', marginBottom: '14px' }} />
                    <div className="skeleton" style={{ width: '110px', height: '12px', marginBottom: '10px' }} />
                    <div className="skeleton" style={{ width: '130px', height: '30px', marginBottom: '12px' }} />
                    <div className="skeleton" style={{ width: '100%', height: '10px', borderRadius: '999px' }} />
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="stat-card">
                  <div className="stat-icon-wrapper flame">
                    <Flame size={22} />
                  </div>
                  <div className="stat-label">Calories</div>
                  <div className="stat-value">{isDemoMode ? '—' : consumedCalories}</div>
                  <div className="stat-goal">{isDemoMode ? '' : `/ ${dailyCalories} kcal`}</div>
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${Math.min(caloriePercentage, 100)}%` }} />
                    </div>
                  </div>
                  <div className="stat-sub">{caloriePercentage}% of daily goal</div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrapper weight">
                    <Weight size={22} />
                  </div>
                  <div className="stat-label">Weight</div>
                  <div className="stat-value">{userWeight}</div>
                  <div className="stat-goal">kg</div>
                  <div className="stat-sub">Current body snapshot</div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrapper activity">
                    <Activity size={22} />
                  </div>
                  <div className="stat-label">Activity</div>
                  <div className="stat-value">{userActivity}</div>
                  <div className="stat-goal">level</div>
                  <div className="stat-sub">Movement momentum</div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrapper water">
                    <Droplet size={22} />
                  </div>
                  <div className="stat-label">Hydration</div>
                  <div className="stat-value">{waterIntake}</div>
                  <div className="stat-goal">/ 8 glasses</div>
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div className="progress-fill water-fill" style={{ width: `${(waterIntake / 8) * 100}%` }} />
                    </div>
                  </div>
                  <div className="stat-sub">{hydrationPercent}% hydrated</div>
                </div>
              </>
            )}
          </div>
        </section>

        <div className="main-content fade-in-up delay-3">
          <section id="meal-section" className="meal-card">
            <div className="meal-header">
              <div className="meal-icon-wrapper">
                <Utensils size={24} />
              </div>
              <div>
                <h3 className="meal-title">
                  Smart Meal Analyzer
                  <span className="ai-badge">Guided</span>
                </h3>
                <p className="meal-subtitle">Describe your plate or upload a meal photo for instant nutrition breakdown.</p>
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
                        <CheckCircle size={18} /> Photo analysis complete
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
                              <span key={idx} className="food-tag">
                                {item}
                              </span>
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
                      {photoAnalysis.analysis && <p className="photo-analysis-text">{photoAnalysis.analysis}</p>}
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
                {loadingMeal ? 'Analyzing...' : 'Analyze Meal'}
              </button>
            </div>

            {mealResult && (
              <div className="ai-response">
                <strong>
                  <Sparkles size={16} /> Meal Analysis
                </strong>
                <p>{mealResult}</p>
              </div>
            )}
          </section>

          <section className="care-section">
            <div className="care-card skin-card">
              <div className="care-header">
                <div className="care-icon-wrapper">
                  <Sparkles size={21} />
                </div>
                <h3 className="care-title">Skin Wellness</h3>
              </div>
              <div className="label-text">TYPE</div>
              <div className="care-type">{skinType}</div>
              <div className="label-text">CONCERNS</div>
              <div className="concerns-row">
                {skinConcerns.length > 0 ? (
                  skinConcerns.map((c) => (
                    <span key={c} className="concern-tag">
                      {c}
                    </span>
                  ))
                ) : (
                  <span className="concern-tag muted-tag">None set</span>
                )}
              </div>
              <button className="link-btn" onClick={() => navigate('/skincare-routine')}>
                View Skin Routine <TrendingUp size={16} />
              </button>
            </div>

            <div className="care-card hair-card">
              <div className="care-header">
                <div className="care-icon-wrapper">
                  <Droplets size={21} />
                </div>
                <h3 className="care-title">Hair Wellness</h3>
              </div>
              <div className="label-text">TYPE</div>
              <div className="care-type">{hairType}</div>
              <div className="label-text">CONCERNS</div>
              <div className="concerns-row">
                {hairConcerns.length > 0 ? (
                  hairConcerns.map((c) => (
                    <span key={c} className="concern-tag">
                      {c}
                    </span>
                  ))
                ) : (
                  <span className="concern-tag muted-tag">None set</span>
                )}
              </div>
              <button className="link-btn" onClick={() => navigate('/haircare-routine')}>
                View Hair Routine <TrendingUp size={16} />
              </button>
            </div>
          </section>
        </div>

        <section id="chat-section" className="chat-section fade-in-up delay-4">
          <h2 className="section-title">
            <Sparkles size={22} />
            Ask Noor
          </h2>

          <div className="chat-card">
            <div className="chat-welcome">
              <img src={capybaraImg} alt="Noor" />
              <p>Hi! I'm Noor. Ask me about diet, skincare, haircare, fitness, or any wellness question. I'm here to help.</p>
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
                {loadingChat ? <span className="animate-pulse">...</span> : <Send size={18} />}
              </button>
            </div>

            {isStreaming && (
              <div className="ai-reply">
                <strong>
                  <Sparkles size={16} /> Noor
                </strong>
                <p>Typing live...</p>
              </div>
            )}

            <div className="suggestions-row">
              <button onClick={() => setQuestion('How can I lose weight naturally?')}>How can I lose weight?</button>
              <button onClick={() => setQuestion('Best skincare routine for acne-prone skin')}>Skincare for acne</button>
              <button onClick={() => setQuestion('Tips to reduce hair frizz')}>Reduce hair frizz</button>
              <button onClick={() => setQuestion('What foods boost energy?')}>Boost energy</button>
            </div>

            {reply && (
              <div className="ai-reply">
                <strong>
                  <Sparkles size={16} /> Noor
                </strong>
                <p>{reply}</p>
              </div>
            )}
          </div>
        </section>

        {!isDemoMode && !userData && !loading && (
          <div className="login-reminder-card fade-in-up">
            <div className="stat-icon-wrapper reminder-icon">
              <Bell size={24} color="#a84f2f" />
            </div>
            <h3>Please log in to view your personalized dashboard</h3>
            <p>Sign in to track your wellness journey</p>
            <a href="/login" className="btn-primary reminder-btn-link">
              Go to Login
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
