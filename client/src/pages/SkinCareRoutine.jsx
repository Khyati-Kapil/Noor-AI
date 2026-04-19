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
import '../styles/routines.css';

const SkinCareRoutine = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const demoMode = safeStorage.getItem('demoMode') === 'true';
      if (demoMode) {
        setUserData(null);
        setLoading(false);
        return;
      }

      try {
        const token = safeStorage.getItem('authToken');
        const response = await api.get('/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const skinType = userData?.user?.skinType || 'Not set';
  const skinConcerns = userData?.user?.skinConcerns || [];

  const getMorningRoutine = (type) => {
    const routines = {
      Dry: [
        { step: 1, action: 'Gentle cream cleanser', time: '2 min' },
        { step: 2, action: 'Hyaluronic acid serum', time: '1 min' },
        { step: 3, action: 'Rich moisturizer', time: '2 min' },
        { step: 4, action: 'SPF 30+ sunscreen', time: '2 min' }
      ],
      Oily: [
        { step: 1, action: 'Foaming cleanser', time: '2 min' },
        { step: 2, action: 'Niacinamide serum', time: '1 min' },
        { step: 3, action: 'Lightweight gel moisturizer', time: '1 min' },
        { step: 4, action: 'Oil-free SPF 30', time: '2 min' }
      ],
      Combination: [
        { step: 1, action: 'Balancing cleanser', time: '2 min' },
        { step: 2, action: 'Vitamin C serum (oily areas)', time: '1 min' },
        { step: 3, action: 'Dual-texture moisturizer', time: '2 min' },
        { step: 4, action: 'SPF 30+ sunscreen', time: '2 min' }
      ],
      Sensitive: [
        { step: 1, action: 'Micellar water cleanse', time: '2 min' },
        { step: 2, action: 'Calming centella serum', time: '1 min' },
        { step: 3, action: 'Fragrance-free moisturizer', time: '2 min' },
        { step: 4, action: 'Mineral SPF 30', time: '2 min' }
      ],
      Normal: [
        { step: 1, action: 'Gentle cleanser', time: '2 min' },
        { step: 2, action: 'Antioxidant serum', time: '1 min' },
        { step: 3, action: 'Daily moisturizer', time: '2 min' },
        { step: 4, action: 'SPF 30+ sunscreen', time: '2 min' }
      ]
    };
    return routines[type] || routines.Normal;
  };

  const getEveningRoutine = (type) => {
    const routines = {
      Dry: [
        { step: 1, action: 'Oil-based cleanser (makeup removal)', time: '3 min' },
        { step: 2, action: 'Cream cleanser', time: '2 min' },
        { step: 3, action: 'Retinol or peptide serum', time: '2 min' },
        { step: 4, action: 'Rich night cream', time: '3 min' }
      ],
      Oily: [
        { step: 1, action: 'Micellar water (makeup removal)', time: '2 min' },
        { step: 2, action: 'Salicylic acid cleanser', time: '2 min' },
        { step: 3, action: 'BHA treatment (problem areas)', time: '2 min' },
        { step: 4, action: 'Lightweight night gel', time: '2 min' }
      ],
      Combination: [
        { step: 1, action: 'Double cleanse method', time: '4 min' },
        { step: 2, action: 'Glycolic acid (T-zone)', time: '2 min' },
        { step: 3, action: 'Hydrating serum (cheeks)', time: '1 min' },
        { step: 4, action: 'Balancing night cream', time: '2 min' }
      ],
      Sensitive: [
        { step: 1, action: 'Gentle makeup remover', time: '3 min' },
        { step: 2, action: 'Calming cleanser', time: '2 min' },
        { step: 3, action: 'Barrier repair serum', time: '2 min' },
        { step: 4, action: 'Soothing night cream', time: '3 min' }
      ],
      Normal: [
        { step: 1, action: 'Oil cleanse', time: '3 min' },
        { step: 2, action: 'Gentle cleanser', time: '2 min' },
        { step: 3, action: 'Night serum', time: '2 min' },
        { step: 4, action: 'Night moisturizer', time: '2 min' }
      ]
    };
    return routines[type] || routines.Normal;
  };

  const getConcernTips = (concerns) => {
    const tipsMap = {
      Acne: ['Use non-comedogenic products', "Don't skip sunscreen - UV worsens acne", 'Change pillowcases weekly', 'Avoid touching your face'],
      Aging: ['Use retinol at night', 'Apply vitamin C in morning', 'Stay hydrated throughout day', 'Get 7-8 hours of sleep'],
      'Dark Spots': ['Use vitamin C consistently', 'Apply SPF 50+ daily', 'Consider niacinamide serum', 'Be patient - fading takes time'],
      Dryness: ['Apply moisturizer on damp skin', 'Use a humidifier at night', 'Drink 8 glasses of water daily', 'Avoid hot showers'],
      Redness: ['Look for azelaic acid', 'Avoid harsh exfoliants', 'Patch test new products', 'Use mineral sunscreen'],
      Dullness: ['Add chemical exfoliation', 'Use brightening vitamin C', 'Stay consistent with routine', 'Get adequate sleep']
    };

    let allTips = [];
    concerns.forEach((concern) => {
      if (tipsMap[concern]) allTips = [...allTips, ...tipsMap[concern]];
    });
    return [...new Set(allTips)].slice(0, 4);
  };

  const getProductRecommendations = (type) => {
    const products = {
      Dry: ['CeraVe Hydrating Cleanser', 'The Ordinary Hyaluronic Acid', 'La Roche-Posay Lipikar', 'Neutrogena Hydro Boost'],
      Oily: ['Cetaphil Oil Control', "Paula's Choice BHA", 'Clinique Moisture Surge', 'EltaMD UV Clear'],
      Combination: ['CeraVe Foaming', 'The Ordinary Niacinamide', 'CeraVe PM Moisturizer', 'Supergoop Unseen Sunscreen'],
      Sensitive: ['Vanicream Cleanser', 'La Roche-Posay Cicaplast', 'CeraVe Skin Renewing', 'Think Mineral Sunscreen'],
      Normal: ['Gentle pH-balanced cleanser', 'Any vitamin C serum', 'Lightweight day cream', 'SPF 30+ sunscreen']
    };
    return products[type] || products.Normal;
  };

  const morningRoutine = getMorningRoutine(skinType);
  const eveningRoutine = getEveningRoutine(skinType);
  const concernTips = getConcernTips(skinConcerns);
  const recommendedProducts = getProductRecommendations(skinType);

  return (
    <div className="routine-page skin-theme">
      <div className="routine-orb orb-1" />
      <div className="routine-orb orb-2" />
      <div className="routine-shell">
        <header className="routine-header reveal-up">
          <button onClick={() => navigate('/dashboard')} className="routine-back-btn">
            <ArrowLeft size={17} /> Back to Dashboard
          </button>
          <div className="routine-title-row">
            <div className="routine-title-icon skin">
              <Sparkles size={24} />
            </div>
            <div>
              <h1>Skin Care Routine</h1>
              <p>Your personalized daily skincare guide</p>
            </div>
          </div>
        </header>

        <section className="routine-card profile-card reveal-up delay-1">
          <h2>
            <Droplets size={20} /> Your Skin Profile
          </h2>
          <div className="profile-grid">
            <div className="profile-box">
              <span className="mini-label">Skin Type</span>
              <strong>{loading ? 'Loading...' : skinType}</strong>
            </div>
            <div className="profile-box">
              <span className="mini-label">Your Concerns</span>
              <div className="chip-row">
                {skinConcerns.length > 0 ? (
                  skinConcerns.map((c) => (
                    <span key={c} className="pill-chip">
                      {c}
                    </span>
                  ))
                ) : (
                  <span className="pill-chip muted">No concerns set</span>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="routine-grid reveal-up delay-2">
          <article className="routine-card">
            <div className="card-head">
              <div className="card-icon morning">
                <Sun size={20} />
              </div>
              <div>
                <h3>Morning Routine</h3>
                <p>Protect and prevent</p>
              </div>
            </div>
            <div className="step-list">
              {morningRoutine.map((item) => (
                <div key={item.step} className="step-item">
                  <div className="step-check">
                    <Check size={17} />
                  </div>
                  <div className="step-body">
                    <div className="step-meta">
                      <strong>{item.action}</strong>
                      <span>
                        <Clock size={13} /> {item.time}
                      </span>
                    </div>
                    <div className="step-progress-bg">
                      <div className="step-progress-fill" style={{ width: `${(item.step / morningRoutine.length) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="routine-card">
            <div className="card-head">
              <div className="card-icon evening">
                <Moon size={20} />
              </div>
              <div>
                <h3>Evening Routine</h3>
                <p>Repair and restore</p>
              </div>
            </div>
            <div className="step-list">
              {eveningRoutine.map((item) => (
                <div key={item.step} className="step-item">
                  <div className="step-check alt">
                    <Check size={17} />
                  </div>
                  <div className="step-body">
                    <div className="step-meta">
                      <strong>{item.action}</strong>
                      <span>
                        <Clock size={13} /> {item.time}
                      </span>
                    </div>
                    <div className="step-progress-bg">
                      <div className="step-progress-fill alt" style={{ width: `${(item.step / eveningRoutine.length) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="routine-card reveal-up delay-3">
          <h2>
            <Star size={20} /> Recommended Products for {skinType} Skin
          </h2>
          <div className="product-grid">
            {recommendedProducts.map((product) => (
              <div key={product} className="product-item">
                <CheckCircle size={17} />
                <span>{product}</span>
              </div>
            ))}
          </div>
        </section>

        {skinConcerns.length > 0 && (
          <section className="routine-tip-banner reveal-up delay-4">
            <h2>
              <Leaf size={20} /> Tips for Your Concerns
            </h2>
            <div className="tip-grid">
              {concernTips.map((tip, idx) => (
                <div key={idx} className="tip-item">
                  <Sparkles size={16} />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="routine-card reveal-up delay-4">
          <h2>
            <AlertCircle size={20} /> General Skin Care Tips
          </h2>
          <div className="general-grid">
            {[
              'Always patch test new products before full application',
              'Wait 2-3 minutes between skincare steps for better absorption',
              'Replace your skincare products every 6-12 months',
              "Don't forget to clean your makeup brushes regularly",
              'Stay consistent - results take time (4-6 weeks minimum)',
              'Protect your skin from pollution with antioxidants'
            ].map((tip, idx) => (
              <div key={idx} className="general-tip">
                <div className="tip-index">{idx + 1}</div>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SkinCareRoutine;
