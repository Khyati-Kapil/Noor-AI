import React from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Heart,
  Leaf,
  Brain,
  ArrowRight,
  Check,
  Droplets,
  Scissors,
  BarChart3,
  Calendar,
  Clock,
  Flame,
  Weight,
  Activity
} from "lucide-react";

import capybaraImg from "../assets/capybara.png";
import "../styles/landing.css";

const Landing = () => {
  const features = [
    {
      icon: Brain,
      title: "Smart Insights",
      description:
        "Smart meal analysis and personalized wellness recommendations"
    },
    {
      icon: Heart,
      title: "Holistic Care",
      description:
        "Skin, hair, and nutrition guidance tailored just for you"
    },
    {
      icon: Leaf,
      title: "Natural Approach",
      description:
        "Evidence-based routines that work with your body"
    }
  ];

  const benefits = [
    "Track meals with natural language",
    "Personalized skin & hair routines",
    "Wellness companion 24/7",
    "Progress tracking & insights"
  ];

  return (
    <div className="landing-page">
     
      <div className="landing-glow landing-glow-1" />
      <div className="landing-glow landing-glow-2" />

      <main>
        <section className="landing-hero">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>Your Personal Wellness Companion</span>
          </div>

          <h1 className="hero-title">
            Wellness, <span className="hero-highlight">simplified</span>
          </h1>

          <p className="hero-subtitle">
            Meet Noor — your companion for nutrition, skincare,
            and holistic wellness. Simple. Personal. Calming.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="btn-noor btn-lg hero-cta">
              Get Started
              <ArrowRight size={20} />
            </Link>

            <Link to="/login" className="btn-subtle btn-lg">
              Login
            </Link>

            <Link to="/demo" className="btn-subtle btn-lg">
              View Demo
            </Link>
          </div>

          <div className="hero-image-container">
            <img
              src={capybaraImg}
              alt="Noor Mascot"
              className="hero-capybara"
            />
          </div>
        </section>

        <section className="landing-features">
          <h2 className="section-title">Everything you need</h2>
          <p className="section-subtitle">
            A complete wellness ecosystem in one calm space
          </p>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <feature.icon size={24} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="landing-samples">
          <div className="samples-container">
            <h2 className="section-title">See Noor in action</h2>
            <p className="section-subtitle">
              Personalized routines and insights tailored to your unique needs
            </p>

            <div className="samples-stack">
              <div className="sample-card">
                <div className="sample-header">
                  <Droplets className="sample-icon" />
                  <h3>Skincare Routine</h3>
                </div>
                <div className="sample-content">
                  <div className="routine-item">
                    <Clock size={16} />
                    <span><strong>Morning:</strong> Gentle cleanser → Vitamin C serum → Moisturizer → SPF</span>
                  </div>
                  <div className="routine-item">
                    <Clock size={16} />
                    <span><strong>Evening:</strong> Oil cleanser → Retinoid → Hydrating mask → Night cream</span>
                  </div>
                  <div className="routine-tip">
                    <Sparkles size={14} />
                    <span>Adapted for your dry skin type with focus on hydration</span>
                  </div>
                </div>
              </div>

              <div className="sample-card">
                <div className="sample-header">
                  <Scissors className="sample-icon" />
                  <h3>Hair Care Routine</h3>
                </div>
                <div className="sample-content">
                  <div className="routine-item">
                    <Calendar size={16} />
                    <span><strong>Weekly:</strong> Protein treatment → Deep conditioning mask</span>
                  </div>
                  <div className="routine-item">
                    <Calendar size={16} />
                    <span><strong>Daily:</strong> Sulfate-free shampoo → Leave-in conditioner → Heat protectant</span>
                  </div>
                  <div className="routine-tip">
                    <Sparkles size={14} />
                    <span>Optimized for your wavy hair with anti-frizz focus</span>
                  </div>
                </div>
              </div>

              <div className="sample-card dashboard-preview">
                <div className="sample-header">
                  <BarChart3 className="sample-icon" />
                  <h3>Dashboard Insights</h3>
                </div>
                <div className="sample-content">
                  <div className="dashboard-real">
                    <div className="dashboard-stats-row">
                      <div className="stat-pill">
                        <Flame size={14} />
                        <span>2,450 / 2,200 kcal</span>
                      </div>
                      <div className="stat-pill">
                        <Weight size={14} />
                        <span>65 kg</span>
                      </div>
                      <div className="stat-pill">
                        <Activity size={14} />
                        <span>Moderate</span>
                      </div>
                    </div>
                    <div className="care-cards-row">
                      <div className="mini-care-card">
                        <Sparkles size={14} />
                        <span>Skin: Combination</span>
                      </div>
                      <div className="mini-care-card">
                        <Droplets size={14} />
                        <span>Hair: Wavy</span>
                      </div>
                    </div>
                    <div className="progress-bar-container">
                      <div className="progress-label">
                        <span>Daily Progress</span>
                        <span>85%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: '85%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-benefits">
          <div className="benefits-content">
            <h2 className="section-title">Why Noor?</h2>
            <p className="section-subtitle">
              We believe wellness should feel natural, not overwhelming
            </p>

            <ul className="benefits-list">
              {benefits.map((benefit, index) => (
                <li key={index} className="benefit-item">
                  <Check size={20} className="benefit-check" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <Link to="/register" className="btn-noor mt-8">
              Start Your Journey
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        <section className="landing-cta">
          <h2 className="cta-title">Ready to feel your best?</h2>
          <p className="cta-subtitle">
            Join thousands finding balance with Noor
          </p>
        </section>
      </main>
    </div>
  );
};

export default Landing;

