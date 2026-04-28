import { Link } from 'react-router-dom';
import { LayoutDashboard, Map, Lightbulb, SlidersHorizontal } from 'lucide-react';
import '../css/landing.css';

export default function Landing() {
  return (
    <div className="landing">
      {/* Nav */}
      <nav className="landing-nav">
        <div className="landing-brand">LOAN MATCH</div>
        <div className="landing-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </div>
        <div className="landing-auth">
          <Link className="btn btn-ghost-dark" to="/login">Login</Link>
          <Link className="btn btn-primary" to="/signup">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="hero-badge">CS 411 Final Project Demo</div>
        <h1>Navigate the Loan Process <span>with Confidence</span></h1>
        <p className="hero-subtitle">
          Get a pre-qualification score, find your best bank matches,
          and build a personalized plan to maximize your approval odds.
        </p>
        <div className="hero-buttons">
          <Link className="btn btn-primary btn-lg" to="/signup">Create Account</Link>
          <Link className="btn btn-ghost-dark btn-lg" to="/login">Sign In</Link>
        </div>
        <div className="hero-stats">
          <div className="hero-stat-item">
            <div className="hero-stat-num">10K+</div>
            <div className="hero-stat-label">Loan Profiles Analyzed</div>
          </div>
          <div className="hero-stat-item">
            <div className="hero-stat-num">8</div>
            <div className="hero-stat-label">Partner Banks</div>
          </div>
          <div className="hero-stat-item">
            <div className="hero-stat-num">3</div>
            <div className="hero-stat-label">Loan Types Supported</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-features" id="features">
        <div className="features-header">
          <h2>Application Features</h2>
          <p>
            Everything you need to understand your loan eligibility and
            improve your chances of approval.
          </p>
        </div>
        <div className="features-grid">
          <Link to="/dashboard" className="feature-card">
            <div className="feature-icon"><LayoutDashboard size={24} /></div>
            <h3>Dashboard</h3>
            <p>
              View your pre-qualification score, top bank matches ranked
              by fit score, and key risk factors at a glance.
            </p>
            <span className="feature-tag">Core Feature</span>
          </Link>

          <Link to="/heatmap" className="feature-card">
            <div className="feature-icon"><Map size={24} /></div>
            <h3>Approval Heatmap</h3>
            <p>
              Interactive heatmap showing approval density across banks
              for profiles similar to yours by credit score range.
            </p>
            <span className="feature-tag">Creative Component</span>
          </Link>

          <Link to="/assistant" className="feature-card">
            <div className="feature-icon"><Lightbulb size={24} /></div>
            <h3>Loan Assistant</h3>
            <p>
              Personalized strategy optimizer and timeline planner with
              actionable steps to improve your approval odds.
            </p>
            <span className="feature-tag">Creative Component</span>
          </Link>

          <Link to="/simulator" className="feature-card">
            <div className="feature-icon"><SlidersHorizontal size={24} /></div>
            <h3>What-If Simulator</h3>
            <p>
              Adjust your financial profile and instantly see how changes
              affect your projected approval probability.
            </p>
            <span className="feature-tag">Interactive Tool</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer" id="about">
        <p>
          <span>Loan Match</span> &mdash; CS 411 Team 095 (AEA) &middot; University of Illinois Urbana-Champaign &middot; Spring 2026
        </p>
      </footer>
    </div>
  );
}
