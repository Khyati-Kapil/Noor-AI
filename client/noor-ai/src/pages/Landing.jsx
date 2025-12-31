import { Link } from "react-router-dom";
import {
  Sparkles,
  Heart,
  Leaf,
  Brain,
  ArrowRight,
  Check
} from "lucide-react";

import capybaraImg from "../assets/capybara.png";
import "../styles/landing.css";

const Landing = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
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
    "AI wellness companion 24/7",
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
            Meet Noor — your AI companion for nutrition, skincare,
            and holistic wellness. Simple. Personal. Calming.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="btn-noor btn-lg hero-cta">
              Get Started
              <ArrowRight size={20} />
            </Link>

            <Link to="/dashboard" className="btn-subtle btn-lg">
              View Demo
            </Link>
          </div>

          <div className="hero-image-container">
            <img
              src={capybaraImg}
              alt="Noor AI Mascot"
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

        <section className="landing-benefits">
          <div className="benefits-content">
            <h2 className="section-title">Why Noor AI?</h2>
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
            Join thousands finding balance with Noor AI
          </p>

          <Link to="/register" className="btn-noor btn-lg hero-cta">
            Get Started — It's Free
            <ArrowRight size={20} />
          </Link>
        </section>
      </main>
    </div>
  );
};

export default Landing;

