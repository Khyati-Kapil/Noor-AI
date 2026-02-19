import { Heart, Sparkles, Leaf, Target } from 'lucide-react';
import '../styles/about.css';

const AboutUs = () => {
  return (
    <div className="about-page">
      <div className="about-shell">
        <header className="about-hero">
          <p className="about-eyebrow">About Noor</p>
          <h1>Simple wellness for skin, body, and hair.</h1>
          <p>
            Noor helps you build healthy routines with clear guidance, practical tracking, and a calm experience that fits everyday life.
          </p>
        </header>

        <section className="about-grid">
          <article className="about-card">
            <div className="about-icon">
              <Target size={20} />
            </div>
            <h3>Our Mission</h3>
            <p>Make wellness easy to follow, consistent, and personalized for everyone.</p>
          </article>

          <article className="about-card">
            <div className="about-icon">
              <Sparkles size={20} />
            </div>
            <h3>What We Do</h3>
            <p>Provide personalized routines and daily support for nutrition, skincare, and haircare.</p>
          </article>

          <article className="about-card">
            <div className="about-icon">
              <Leaf size={20} />
            </div>
            <h3>Our Approach</h3>
            <p>Clean design, practical recommendations, and progress-first habits.</p>
          </article>

          <article className="about-card">
            <div className="about-icon">
              <Heart size={20} />
            </div>
            <h3>Our Promise</h3>
            <p>Keep wellness approachable, supportive, and built around real life.</p>
          </article>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
