import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Droplets, 
  Sun, 
  Moon, 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  Star,
  Leaf,
  AlertCircle,
  Check
} from 'lucide-react';
import api from '../api/axios';
import safeStorage from '../utils/safeStorage';
import "../styles/dashboard.css";

const SkinCareRoutine = () => {
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

  const skinType = userData?.user?.skinType || "Not set";
  const skinConcerns = userData?.user?.skinConcerns || [];
  
  
  const getMorningRoutine = (type) => {
    const routines = {
      "Dry": [
        { step: 1, action: "Gentle cream cleanser", time: "2 min" },
        { step: 2, action: "Hyaluronic acid serum", time: "1 min" },
        { step: 3, action: "Rich moisturizer", time: "2 min" },
        { step: 4, action: "SPF 30+ sunscreen", time: "2 min" }
      ],
      "Oily": [
        { step: 1, action: "Foaming cleanser", time: "2 min" },
        { step: 2, action: "Niacinamide serum", time: "1 min" },
        { step: 3, action: "Lightweight gel moisturizer", time: "1 min" },
        { step: 4, action: "Oil-free SPF 30", time: "2 min" }
      ],
      "Combination": [
        { step: 1, action: "Balancing cleanser", time: "2 min" },
        { step: 2, action: "Vitamin C serum (oily areas)", time: "1 min" },
        { step: 3, action: "Dual-texture moisturizer", time: "2 min" },
        { step: 4, action: "SPF 30+ sunscreen", time: "2 min" }
      ],
      "Sensitive": [
        { step: 1, action: "Micellar water cleanse", time: "2 min" },
        { step: 2, action: "Calming centella serum", time: "1 min" },
        { step: 3, action: "Fragrance-free moisturizer", time: "2 min" },
        { step: 4, action: "Mineral SPF 30", time: "2 min" }
      ],
      "Normal": [
        { step: 1, action: "Gentle cleanser", time: "2 min" },
        { step: 2, action: "Antioxidant serum", time: "1 min" },
        { step: 3, action: "Daily moisturizer", time: "2 min" },
        { step: 4, action: "SPF 30+ sunscreen", time: "2 min" }
      ]
    };
    return routines[type] || routines["Normal"];
  };

  const getEveningRoutine = (type) => {
    const routines = {
      "Dry": [
        { step: 1, action: "Oil-based cleanser (makeup removal)", time: "3 min" },
        { step: 2, action: "Cream cleanser", time: "2 min" },
        { step: 3, action: "Retinol or peptide serum", time: "2 min" },
        { step: 4, action: "Rich night cream", time: "3 min" }
      ],
      "Oily": [
        { step: 1, action: "Micellar water (makeup removal)", time: "2 min" },
        { step: 2, action: "Salicylic acid cleanser", time: "2 min" },
        { step: 3, action: "BHA treatment (problem areas)", time: "2 min" },
        { step: 4, action: "Lightweight night gel", time: "2 min" }
      ],
      "Combination": [
        { step: 1, action: "Double cleanse method", time: "4 min" },
        { step: 2, action: "Glycolic acid (T-zone)", time: "2 min" },
        { step: 3, action: "Hydrating serum (cheeks)", time: "1 min" },
        { step: 4, action: "Balancing night cream", time: "2 min" }
      ],
      "Sensitive": [
        { step: 1, action: "Gentle makeup remover", time: "3 min" },
        { step: 2, action: "Calming cleanser", time: "2 min" },
        { step: 3, action: "Barrier repair serum", time: "2 min" },
        { step: 4, action: "Soothing night cream", time: "3 min" }
      ],
      "Normal": [
        { step: 1, action: "Oil cleanse", time: "3 min" },
        { step: 2, action: "Gentle cleanser", time: "2 min" },
        { step: 3, action: "Night serum", time: "2 min" },
        { step: 4, action: "Night moisturizer", time: "2 min" }
      ]
    };
    return routines[type] || routines["Normal"];
  };

  const getConcernTips = (concerns) => {
    const tipsMap = {
      "Acne": [
        "Use non-comedogenic products",
        "Don't skip sunscreen - UV worsens acne",
        "Change pillowcases weekly",
        "Avoid touching your face"
      ],
      "Aging": [
        "Use retinol at night",
        "Apply vitamin C in morning",
        "Stay hydrated throughout day",
        "Get 7-8 hours of sleep"
      ],
      "Dark Spots": [
        "Use vitamin C consistently",
        "Apply SPF 50+ daily",
        "Consider niacinamide serum",
        "Be patient - fading takes time"
      ],
      "Dryness": [
        "Apply moisturizer on damp skin",
        "Use a humidifier at night",
        "Drink 8 glasses of water daily",
        "Avoid hot showers"
      ],
      "Redness": [
        "Look for azelaic acid",
        "Avoid harsh exfoliants",
        "Patch test new products",
        "Use mineral sunscreen"
      ],
      "Dullness": [
        "Add chemical exfoliation",
        "Use brightening vitamin C",
        "Stay consistent with routine",
        "Get adequate sleep"
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

  const morningRoutine = getMorningRoutine(skinType);
  const eveningRoutine = getEveningRoutine(skinType);
  const concernTips = getConcernTips(skinConcerns);

  const getProductRecommendations = (type) => {
    const products = {
      "Dry": ["CeraVe Hydrating Cleanser", "The Ordinary Hyaluronic Acid", "La Roche-Posay Lipikar", "Neutrogena Hydro Boost"],
      "Oily": ["Cetaphil Oil Control", "Paula's Choice BHA", "Clinique Moisture Surge", "EltaMD UV Clear"],
      "Combination": ["CeraVe Foaming", "The Ordinary Niacinamide", "CeraVe PM Moisturizer", "Supergoop Unseen Sunscreen"],
      "Sensitive": ["Vanicream Cleanser", "La Roche-Posay Cicaplast", "CeraVe Skin Renewing", "Think Mineral Sunscreen"],
      "Normal": ["Gentle pH-balanced cleanser", "Any vitamin C serum", "Lightweight day cream", "SPF 30+ sunscreen"]
    };
    return products[type] || products["Normal"];
  };

  const recommendedProducts = getProductRecommendations(skinType);

  return (
    <div className="noor-dashboard-root">
      <div style={{ maxWidth: '900px', width: '100%', margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
        
        {/* Header */}
        <header className="dashboard-header">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="back-btn"
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
              background: 'linear-gradient(135deg, #fff5e6, #ffe4cc)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px'
            }}>
              <Sparkles size={28} color="#7c5e4d" />
            </div>
            <h1 className="header-title">Skin Care Routine</h1>
          </div>
          <p className="header-subtitle">Your personalized daily skincare guide</p>
        </header>

        {/* Skin Profile Card */}
        <section className="profile-card" style={{
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
            <Droplets size={22} color="#7c5e4d" />
            Your Skin Profile
          </h2>
          
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ 
              flex: '1', 
              minWidth: '200px',
              background: 'linear-gradient(135deg, #fff9f0, #fff5eb)',
              borderRadius: '16px',
              padding: '20px'
            }}>
              <div style={{ 
                fontSize: '0.75rem', 
                color: '#8c7e71', 
                textTransform: 'uppercase', 
                letterSpacing: '1px',
                marginBottom: '8px'
              }}>
                Skin Type
              </div>
              <div style={{ 
                fontSize: '1.4rem', 
                color: '#4a3728', 
                fontWeight: '600' 
              }}>
                {loading ? "Loading..." : skinType}
              </div>
            </div>
            
            <div style={{ 
              flex: '2', 
              minWidth: '250px',
              background: 'linear-gradient(135deg, #fff9f0, #fff5eb)',
              borderRadius: '16px',
              padding: '20px'
            }}>
              <div style={{ 
                fontSize: '0.75rem', 
                color: '#8c7e71', 
                textTransform: 'uppercase', 
                letterSpacing: '1px',
                marginBottom: '8px'
              }}>
                Your Concerns
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {skinConcerns.length > 0 ? skinConcerns.map((c, idx) => (
                  <span key={idx} style={{
                    background: 'linear-gradient(135deg, #fff5e6, #ffe4cc)',
                    color: '#7c5e4d',
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

        {/* Morning & Evening Routine */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          
          {/* Morning Routine */}
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
                background: 'linear-gradient(135deg, #fff5e6, #ffe4cc)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sun size={24} color="#e67e22" />
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#4a3728', fontSize: '1.3rem' }}>Morning Routine</h3>
                <p style={{ margin: '4px 0 0 0', color: '#8c7e71', fontSize: '0.9rem' }}>Protect & Prevent</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {morningRoutine.map((item) => (
                <div key={item.step} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #faf9f7, #fff9f5)',
                  borderRadius: '16px',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #fff5e6, #ffe4cc)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(124, 94, 77, 0.1)'
                  }}>
                    <Check size={20} color="#7c5e4d" />
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
                        width: `${(item.step / morningRoutine.length) * 100}%`,
                        background: 'linear-gradient(90deg, #7c5e4d, #e8b896)',
                        borderRadius: '4px'
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evening Routine */}
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
                background: 'linear-gradient(135deg, #e8e0f0, #d4c4e8)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Moon size={24} color="#7c5e8a" />
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#4a3728', fontSize: '1.3rem' }}>Evening Routine</h3>
                <p style={{ margin: '4px 0 0 0', color: '#8c7e71', fontSize: '0.9rem' }}>Repair & Restore</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {eveningRoutine.map((item) => (
                <div key={item.step} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #faf9f7, #f5f0fa)',
                  borderRadius: '16px',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #e8e0f0, #d4c4e8)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(124, 94, 77, 0.1)'
                  }}>
                    <Check size={20} color="#7c5e8a" />
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
                        width: `${(item.step / eveningRoutine.length) * 100}%`,
                        background: 'linear-gradient(90deg, #7c5e8a, #a68bc4)',
                        borderRadius: '4px'
                      }} />
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
            <Star size={22} color="#7c5e4d" />
            Recommended Products for {skinType} Skin
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {recommendedProducts.map((product, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                background: 'linear-gradient(135deg, #fff9f0, #fff5eb)',
                borderRadius: '14px',
                border: '1px solid #f0edea'
              }}>
                <CheckCircle size={18} color="#7c5e4d" />
                <span style={{ color: '#4a3728', fontWeight: '500' }}>{product}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Concern-Specific Tips */}
        {skinConcerns.length > 0 && (
          <section style={{
            background: 'linear-gradient(135deg, #7c5e4d 0%, #5a3c28 100%)',
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
            <AlertCircle size={22} color="#7c5e4d" />
            General Skin Care Tips
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {[
              "Always patch test new products before full application",
              "Wait 2-3 minutes between skincare steps for better absorption",
              "Replace your skincare products every 6-12 months",
              "Don't forget to clean your makeup brushes regularly",
              "Stay consistent - results take time (4-6 weeks minimum)",
              "Protect your skin from pollution with antioxidants"
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
                  background: 'linear-gradient(135deg, #fff5e6, #ffe4cc)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#7c5e4d',
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

export default SkinCareRoutine;

