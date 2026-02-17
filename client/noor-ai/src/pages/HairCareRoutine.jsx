import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Droplets, 
  Scissors, 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  Star,
  Leaf,
  AlertCircle,
  Calendar,
  Wind,
  Check
} from 'lucide-react';
import api from '../api/axios';
import safeStorage from '../utils/safeStorage';
import "../styles/dashboard.css";

const HairCareRoutine = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const demoMode = safeStorage.getItem("demoMode") === "true";
      if (demoMode) {
        setUserData(null);
        setLoading(false);
        return;
      }

      try {
        const token = safeStorage.getItem("authToken");
        const response = await api.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const hairType = userData?.user?.hairType || "Not set";
  const hairConcerns = userData?.user?.hairConcerns || [];
  
  // Generate routine based on hair type
  const getDailyRoutine = (type) => {
    const routines = {
      "Straight": [
        { step: 1, action: "Gentle sulfate-free shampoo", time: "2 min" },
        { step: 2, action: "Light conditioner (ends only)", time: "2 min" },
        { step: 3, action: "Heat protectant spray", time: "1 min" },
        { step: 4, action: "Air dry or minimal styling", time: "3 min" }
      ],
      "Wavy": [
        { step: 1, action: "Moisturizing shampoo", time: "2 min" },
        { step: 2, action: "Leave-in conditioner", time: "2 min" },
        { step: 3, action: "Curl defining cream", time: "2 min" },
        { step: 4, action: "Diffuse or air dry", time: "5 min" }
      ],
      "Curly": [
        { step: 1, action: "Co-wash or gentle cleanser", time: "3 min" },
        { step: 2, action: "Deep conditioning mask", time: "5 min" },
        { step: 3, action: "Curl cream + gel", time: "3 min" },
        { step: 4, action: "Plop & air dry", time: "10 min" }
      ],
      "Coily": [
        { step: 1, action: "Sulfate-free shampoo", time: "3 min" },
        { step: 2, action: "Heavy moisture conditioner", time: "5 min" },
        { step: 3, action: "Leave-in conditioner", time: "2 min" },
        { step: 4, action: "Cream styler + oil seal", time: "3 min" }
      ],
      "Oily": [
        { step: 1, action: "Volume shampoo", time: "2 min" },
        { step: 2, action: "Light conditioner (scalp avoided)", time: "1 min" },
        { step: 3, action: "Scalp tonic", time: "1 min" },
        { step: 4, action: "Light styling", time: "2 min" }
      ],
      "Dry": [
        { step: 1, action: "Moisturizing shampoo", time: "2 min" },
        { step: 2, action: "Rich mask treatment", time: "5 min" },
        { step: 3, action: "Leave-in conditioner", time: "2 min" },
        { step: 4, action: "Argan oil serum", time: "1 min" }
      ]
    };
    return routines[type] || routines["Wavy"];
  };

  const getWeeklyRoutine = (type) => {
    const routines = {
      "Straight": [
        { day: "Sunday", action: "Clarifying shampoo to remove buildup", duration: "15 min" },
        { day: "Wednesday", action: "Light conditioning treatment", duration: "10 min" }
      ],
      "Wavy": [
        { day: "Sunday", action: "Deep conditioning mask", duration: "20 min" },
        { day: "Wednesday", action: "Protein treatment", duration: "15 min" }
      ],
      "Curly": [
        { day: "Sunday", action: "Deep conditioning + styler refresh", duration: "30 min" },
        { day: "Wednesday", action: "Apple cider vinegar rinse", duration: "10 min" }
      ],
      "Coily": [
        { day: "Sunday", action: "Deep cleanse + deep condition", duration: "45 min" },
        { day: "Wednesday", action: "Hot oil treatment", duration: "20 min" }
      ],
      "Oily": [
        { day: "Sunday", action: "Clay mask for scalp", duration: "15 min" },
        { day: "Wednesday", action: "Volume boost treatment", duration: "10 min" }
      ],
      "Dry": [
        { day: "Sunday", action: "Intensive moisture mask", duration: "30 min" },
        { day: "Wednesday", action: "Hot oil treatment", duration: "20 min" }
      ]
    };
    return routines[type] || routines["Wavy"];
  };

  const getConcernTips = (concerns) => {
    const tipsMap = {
      "Hair Fall": [
        "Scalp massage daily to improve circulation",
        "Avoid tight hairstyles",
        "Use a wide-tooth comb on wet hair",
        "Get regular trims to prevent breakage"
      ],
      "Dandruff": [
        "Use anti-dandruff shampoo regularly",
        "Keep scalp clean and moisturized",
        "Avoid hot water on scalp",
        "Reduce stress levels"
      ],
      "Frizz": [
        "Use anti-frizz serums",
        "Sleep on satin pillowcases",
        "Avoid over-washing",
        "Use leave-in conditioners"
      ],
      "Dryness": [
        "Deep condition weekly",
        "Limit heat styling",
        "Use argan or coconut oil",
        "Drink plenty of water"
      ],
      "Oiliness": [
        "Wash hair more frequently",
        "Avoid touching your hair",
        "Use dry shampoo between washes",
        "Keep conditioner lightweight"
      ],
      "Split Ends": [
        "Get regular trims every 6-8 weeks",
        "Use heat protectants",
        "Avoid harsh chemical treatments",
        "Use silk or satin pillowcases"
      ]
    };

    let allTips = [];
    concerns.forEach(concern => {
      if (tipsMap[concern]) {
        allTips = [...allTips, ...tipsMap[concern]];
      }
    });
    return [...new Set(allTips)].slice(0, 4);
  };

  const dailyRoutine = getDailyRoutine(hairType);
  const weeklyRoutine = getWeeklyRoutine(hairType);
  const concernTips = getConcernTips(hairConcerns);

  const getProductRecommendations = (type) => {
    const products = {
      "Straight": ["Pantene Smooth & Shiny", "TRESemme Keratin", "John Frieda Serum", "Dove Shampoo"],
      "Wavy": ["OGX Curling Cowash", "DevaCurl Wave Maker", "Cantu Coconut", "SheaMoisture Curl"],
      "Curly": ["Cantu Curly Cream", "SheaMoisture Mask", "Carol's Daughter Gel", "Mielle Organics"],
      "Coily": ["Mielle Styling Milk", "SheaMoisture Gel", "Creme of Nature", "Tgin Butter Cream"],
      "Oily": ["Neutrogena T/Sal", "Batiste Dry Shampoo", "Paul Mitchell Tea Tree", "Matrix Volume"],
      "Dry": ["Moroccan Oil Treatment", "Aussie Moist", "Herbal Essences Rose", "Nexxus Humectress"]
    };
    return products[type] || products["Wavy"];
  };

  const recommendedProducts = getProductRecommendations(hairType);

  return (
    <div className="noor-dashboard-root">
      <div style={{ maxWidth: '900px', width: '100%', margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
        
        {/* Header */}
        <header className="dashboard-header">
          <button 
            onClick={() => navigate('/dashboard')} 
            style={{
              background: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '30px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px',
              color: '#7c5e4d',
              fontWeight: '500',
              boxShadow: '0 4px 15px rgba(124, 94, 77, 0.1)',
              transition: 'all 0.3s ease'
            }}
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
          
          <div className="header-content">
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px'
            }}>
              <Scissors size={28} color="#4caf50" />
            </div>
            <h1 className="header-title">Hair Care Routine</h1>
          </div>
          <p className="header-subtitle">Your personalized daily hair care guide</p>
        </header>

        {/* Hair Profile Card */}
        <section style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '24px',
          padding: '28px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: '0 8px 32px rgba(124, 94, 77, 0.08)'
        }}>
          <h2 style={{ 
            color: '#4a3728', 
            margin: '0 0 20px 0', 
            fontSize: '1.3rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Droplets size={22} color="#4caf50" />
            Your Hair Profile
          </h2>
          
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ 
              flex: '1', 
              minWidth: '200px',
              background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
              borderRadius: '16px',
              padding: '20px'
            }}>
              <div style={{ 
                fontSize: '0.75rem', 
                color: '#5a7d5a', 
                textTransform: 'uppercase', 
                letterSpacing: '1px',
                marginBottom: '8px'
              }}>
                Hair Type
              </div>
              <div style={{ 
                fontSize: '1.4rem', 
                color: '#2e5a2e', 
                fontWeight: '600' 
              }}>
                {loading ? "Loading..." : hairType}
              </div>
            </div>
            
            <div style={{ 
              flex: '2', 
              minWidth: '250px',
              background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
              borderRadius: '16px',
              padding: '20px'
            }}>
              <div style={{ 
                fontSize: '0.75rem', 
                color: '#5a7d5a', 
                textTransform: 'uppercase', 
                letterSpacing: '1px',
                marginBottom: '8px'
              }}>
                Your Concerns
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {hairConcerns.length > 0 ? hairConcerns.map((c, idx) => (
                  <span key={idx} style={{
                    background: 'linear-gradient(135deg, #e8f5e9, #a5d6a7)',
                    color: '#2e5a2e',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}>
                    {c}
                  </span>
                )) : (
                  <span style={{
                    background: '#f5f3f0',
                    color: '#8c7e71',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '0.9rem'
                  }}>
                    No concerns set
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Daily & Weekly Routine */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          
          {/* Daily Routine */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '24px',
            padding: '28px',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 8px 32px rgba(124, 94, 77, 0.08)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              marginBottom: '24px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Wind size={24} color="#1976d2" />
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#4a3728', fontSize: '1.3rem' }}>Daily Routine</h3>
                <p style={{ margin: '4px 0 0 0', color: '#8c7e71', fontSize: '0.9rem' }}>Every Day Care</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {dailyRoutine.map((item) => (
                <div key={item.step} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #faf9f7, #f5fbff)',
                  borderRadius: '16px',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(124, 94, 77, 0.1)'
                  }}>
                    <Check size={20} color="#1976d2" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      marginBottom: '4px'
                    }}>
                      <span style={{ color: '#4a3728', fontWeight: '600' }}>{item.action}</span>
                      <span style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '4px',
                        color: '#8c7e71', 
                        fontSize: '0.85rem' 
                      }}>
                        <Clock size={14} /> {item.time}
                      </span>
                    </div>
                    <div style={{
                      height: '4px',
                      background: '#f0edea',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${(item.step / dailyRoutine.length) * 100}%`,
                        background: 'linear-gradient(90deg, #1976d2, #64b5f6)',
                        borderRadius: '4px'
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Routine */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '24px',
            padding: '28px',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 8px 32px rgba(124, 94, 77, 0.08)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              marginBottom: '24px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #fff3e0, #ffe0b2)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Calendar size={24} color="#f57c00" />
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#4a3728', fontSize: '1.3rem' }}>Weekly Routine</h3>
                <p style={{ margin: '4px 0 0 0', color: '#8c7e71', fontSize: '0.9rem' }}>Deep Care Days</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {weeklyRoutine.map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #faf9f7, #fff8e1)',
                  borderRadius: '16px',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #fff3e0, #ffe0b2)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(124, 94, 77, 0.1)'
                  }}>
                    <Check size={20} color="#f57c00" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      marginBottom: '4px'
                    }}>
                      <span style={{ color: '#4a3728', fontWeight: '600' }}>{item.action}</span>
                      <span style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '4px',
                        color: '#8c7e71', 
                        fontSize: '0.85rem' 
                      }}>
                        <Clock size={14} /> {item.duration}
                      </span>
                    </div>
                    <div style={{
                      fontSize: '0.85rem',
                      color: '#f57c00',
                      fontWeight: '500'
                    }}>
                      {item.day}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Recommendations */}
        <section style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '24px',
          padding: '28px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: '0 8px 32px rgba(124, 94, 77, 0.08)'
        }}>
          <h2 style={{ 
            color: '#4a3728', 
            margin: '0 0 20px 0', 
            fontSize: '1.3rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Star size={22} color="#4caf50" />
            Recommended Products for {hairType} Hair
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {recommendedProducts.map((product, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
                borderRadius: '14px',
                border: '1px solid #a5d6a7'
              }}>
                <CheckCircle size={18} color="#4caf50" />
                <span style={{ color: '#2e5a2e', fontWeight: '500' }}>{product}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Concern-Specific Tips */}
        {hairConcerns.length > 0 && (
          <section style={{
            background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
            borderRadius: '24px',
            padding: '28px',
            marginBottom: '24px'
          }}>
            <h2 style={{ 
              color: 'white', 
              margin: '0 0 20px 0', 
              fontSize: '1.3rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Leaf size={22} />
              Tips for Your Concerns
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
              {concernTips.map((tip, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '14px 18px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)'
                }}>
                  <Sparkles size={16} color="#ffd700" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span style={{ color: 'white', fontSize: '0.95rem', lineHeight: '1.5' }}>{tip}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* General Tips */}
        <section style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '24px',
          padding: '28px',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: '0 8px 32px rgba(124, 94, 77, 0.08)'
        }}>
          <h2 style={{ 
            color: '#4a3728', 
            margin: '0 0 20px 0', 
            fontSize: '1.3rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <AlertCircle size={22} color="#4caf50" />
            General Hair Care Tips
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {[
              "Trim your hair every 6-8 weeks to prevent split ends",
              "Use a silk or satin pillowcase to reduce friction",
              "Limit heat styling to 2-3 times per week",
              "Drink plenty of water for hydrated hair from within",
              "Eat a balanced diet rich in proteins and vitamins",
              "Avoid brushing wet hair - use a wide-tooth comb instead"
            ].map((tip, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '14px',
                background: '#faf9f7',
                borderRadius: '12px'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4caf50',
                  fontWeight: '600',
                  fontSize: '0.8rem',
                  flexShrink: 0
                }}>
                  {idx + 1}
                </div>
                <span style={{ color: '#5a4a3a', fontSize: '0.9rem', lineHeight: '1.5' }}>{tip}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default HairCareRoutine;

