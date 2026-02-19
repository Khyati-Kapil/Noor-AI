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
import '../styles/routines.css';

const HairCareRoutine = () => {
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

  const hairType = userData?.user?.hairType || 'Not set';
  const hairConcerns = userData?.user?.hairConcerns || [];

  const getDailyRoutine = (type) => {
    const routines = {
      Straight: [
        { step: 1, action: 'Gentle sulfate-free shampoo', time: '2 min' },
        { step: 2, action: 'Light conditioner (ends only)', time: '2 min' },
        { step: 3, action: 'Heat protectant spray', time: '1 min' },
        { step: 4, action: 'Air dry or minimal styling', time: '3 min' }
      ],
      Wavy: [
        { step: 1, action: 'Moisturizing shampoo', time: '2 min' },
        { step: 2, action: 'Leave-in conditioner', time: '2 min' },
        { step: 3, action: 'Curl defining cream', time: '2 min' },
        { step: 4, action: 'Diffuse or air dry', time: '5 min' }
      ],
      Curly: [
        { step: 1, action: 'Co-wash or gentle cleanser', time: '3 min' },
        { step: 2, action: 'Deep conditioning mask', time: '5 min' },
        { step: 3, action: 'Curl cream + gel', time: '3 min' },
        { step: 4, action: 'Plop and air dry', time: '10 min' }
      ],
      Coily: [
        { step: 1, action: 'Sulfate-free shampoo', time: '3 min' },
        { step: 2, action: 'Heavy moisture conditioner', time: '5 min' },
        { step: 3, action: 'Leave-in conditioner', time: '2 min' },
        { step: 4, action: 'Cream styler + oil seal', time: '3 min' }
      ],
      Oily: [
        { step: 1, action: 'Volume shampoo', time: '2 min' },
        { step: 2, action: 'Light conditioner (scalp avoided)', time: '1 min' },
        { step: 3, action: 'Scalp tonic', time: '1 min' },
        { step: 4, action: 'Light styling', time: '2 min' }
      ],
      Dry: [
        { step: 1, action: 'Moisturizing shampoo', time: '2 min' },
        { step: 2, action: 'Rich mask treatment', time: '5 min' },
        { step: 3, action: 'Leave-in conditioner', time: '2 min' },
        { step: 4, action: 'Argan oil serum', time: '1 min' }
      ]
    };
    return routines[type] || routines.Wavy;
  };

  const getWeeklyRoutine = (type) => {
    const routines = {
      Straight: [
        { day: 'Sunday', action: 'Clarifying shampoo to remove buildup', duration: '15 min' },
        { day: 'Wednesday', action: 'Light conditioning treatment', duration: '10 min' }
      ],
      Wavy: [
        { day: 'Sunday', action: 'Deep conditioning mask', duration: '20 min' },
        { day: 'Wednesday', action: 'Protein treatment', duration: '15 min' }
      ],
      Curly: [
        { day: 'Sunday', action: 'Deep conditioning + styler refresh', duration: '30 min' },
        { day: 'Wednesday', action: 'Apple cider vinegar rinse', duration: '10 min' }
      ],
      Coily: [
        { day: 'Sunday', action: 'Deep cleanse + deep condition', duration: '45 min' },
        { day: 'Wednesday', action: 'Hot oil treatment', duration: '20 min' }
      ],
      Oily: [
        { day: 'Sunday', action: 'Clay mask for scalp', duration: '15 min' },
        { day: 'Wednesday', action: 'Volume boost treatment', duration: '10 min' }
      ],
      Dry: [
        { day: 'Sunday', action: 'Intensive moisture mask', duration: '30 min' },
        { day: 'Wednesday', action: 'Hot oil treatment', duration: '20 min' }
      ]
    };
    return routines[type] || routines.Wavy;
  };

  const getConcernTips = (concerns) => {
    const tipsMap = {
      'Hair Fall': ['Scalp massage daily to improve circulation', 'Avoid tight hairstyles', 'Use a wide-tooth comb on wet hair', 'Get regular trims to prevent breakage'],
      Dandruff: ['Use anti-dandruff shampoo regularly', 'Keep scalp clean and moisturized', 'Avoid hot water on scalp', 'Reduce stress levels'],
      Frizz: ['Use anti-frizz serums', 'Sleep on satin pillowcases', 'Avoid over-washing', 'Use leave-in conditioners'],
      Dryness: ['Deep condition weekly', 'Limit heat styling', 'Use argan or coconut oil', 'Drink plenty of water'],
      Oiliness: ['Wash hair more frequently', 'Avoid touching your hair', 'Use dry shampoo between washes', 'Keep conditioner lightweight'],
      'Split Ends': ['Get regular trims every 6-8 weeks', 'Use heat protectants', 'Avoid harsh chemical treatments', 'Use silk or satin pillowcases']
    };

    let allTips = [];
    concerns.forEach((concern) => {
      if (tipsMap[concern]) allTips = [...allTips, ...tipsMap[concern]];
    });
    return [...new Set(allTips)].slice(0, 4);
  };

  const getProductRecommendations = (type) => {
    const products = {
      Straight: ['Pantene Smooth & Shiny', 'TRESemme Keratin', 'John Frieda Serum', 'Dove Shampoo'],
      Wavy: ['OGX Curling Cowash', 'DevaCurl Wave Maker', 'Cantu Coconut', 'SheaMoisture Curl'],
      Curly: ['Cantu Curly Cream', 'SheaMoisture Mask', "Carol's Daughter Gel", 'Mielle Organics'],
      Coily: ['Mielle Styling Milk', 'SheaMoisture Gel', 'Creme of Nature', 'Tgin Butter Cream'],
      Oily: ['Neutrogena T/Sal', 'Batiste Dry Shampoo', 'Paul Mitchell Tea Tree', 'Matrix Volume'],
      Dry: ['Moroccan Oil Treatment', 'Aussie Moist', 'Herbal Essences Rose', 'Nexxus Humectress']
    };
    return products[type] || products.Wavy;
  };

  const dailyRoutine = getDailyRoutine(hairType);
  const weeklyRoutine = getWeeklyRoutine(hairType);
  const concernTips = getConcernTips(hairConcerns);
  const recommendedProducts = getProductRecommendations(hairType);

  return (
    <div className="routine-page hair-theme">
      <div className="routine-orb orb-1" />
      <div className="routine-orb orb-2" />
      <div className="routine-shell">
        <header className="routine-header reveal-up">
          <button onClick={() => navigate('/dashboard')} className="routine-back-btn">
            <ArrowLeft size={17} /> Back to Dashboard
          </button>
          <div className="routine-title-row">
            <div className="routine-title-icon hair">
              <Scissors size={24} />
            </div>
            <div>
              <h1>Hair Care Routine</h1>
              <p>Your personalized daily hair care guide</p>
            </div>
          </div>
        </header>

        <section className="routine-card profile-card reveal-up delay-1">
          <h2>
            <Droplets size={20} /> Your Hair Profile
          </h2>
          <div className="profile-grid">
            <div className="profile-box">
              <span className="mini-label">Hair Type</span>
              <strong>{loading ? 'Loading...' : hairType}</strong>
            </div>
            <div className="profile-box">
              <span className="mini-label">Your Concerns</span>
              <div className="chip-row">
                {hairConcerns.length > 0 ? (
                  hairConcerns.map((c) => (
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
              <div className="card-icon hairdaily">
                <Wind size={20} />
              </div>
              <div>
                <h3>Daily Routine</h3>
                <p>Everyday care</p>
              </div>
            </div>
            <div className="step-list">
              {dailyRoutine.map((item) => (
                <div key={item.step} className="step-item">
                  <div className="step-check blue">
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
                      <div className="step-progress-fill blue" style={{ width: `${(item.step / dailyRoutine.length) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="routine-card">
            <div className="card-head">
              <div className="card-icon hairweekly">
                <Calendar size={20} />
              </div>
              <div>
                <h3>Weekly Routine</h3>
                <p>Deep care days</p>
              </div>
            </div>
            <div className="step-list">
              {weeklyRoutine.map((item, idx) => (
                <div key={idx} className="step-item">
                  <div className="step-check gold">
                    <Check size={17} />
                  </div>
                  <div className="step-body">
                    <div className="step-meta">
                      <strong>{item.action}</strong>
                      <span>
                        <Clock size={13} /> {item.duration}
                      </span>
                    </div>
                    <div className="day-pill">{item.day}</div>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="routine-card reveal-up delay-3">
          <h2>
            <Star size={20} /> Recommended Products for {hairType} Hair
          </h2>
          <div className="product-grid">
            {recommendedProducts.map((product) => (
              <div key={product} className="product-item hair-product">
                <CheckCircle size={17} />
                <span>{product}</span>
              </div>
            ))}
          </div>
        </section>

        {hairConcerns.length > 0 && (
          <section className="routine-tip-banner hair-banner reveal-up delay-4">
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
            <AlertCircle size={20} /> General Hair Care Tips
          </h2>
          <div className="general-grid">
            {[
              'Trim your hair every 6-8 weeks to prevent split ends',
              'Use a silk or satin pillowcase to reduce friction',
              'Limit heat styling to 2-3 times per week',
              'Drink plenty of water for hydrated hair from within',
              'Eat a balanced diet rich in proteins and vitamins',
              'Avoid brushing wet hair - use a wide-tooth comb instead'
            ].map((tip, idx) => (
              <div key={idx} className="general-tip">
                <div className="tip-index hair-index">{idx + 1}</div>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HairCareRoutine;
