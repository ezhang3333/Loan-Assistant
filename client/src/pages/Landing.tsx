import { Link } from 'react-router-dom';
import cardStack from '../../imgs/card_stack.png';
import '../css/landing.css';

export default function Landing() {
  return (
    <div className="landing">
      <header className="top-bar">
        <div className="brand">LOAN MATCH</div>
        <nav className="top-nav">
          <a href="#">About</a>
          <Link to="/loans">Loans</Link>
          <Link to="/banks">Banks</Link>
        </nav>
        <div className="auth-actions">
          <a className="btn btn-ghost" href="#">Login</a>
          <a className="btn btn-accent" href="#">Start Now →</a>
        </div>
      </header>

      <main className="hero-grid">
        <section className="card card-hero">
          <h1>The Modern Loan<br />Matching Platform</h1>
          <img src={cardStack} alt="Stack of payment cards" className="hero-image" />
          <div className="hero-ctas">
            <Link className="btn btn-accent btn-lg" to="/loans">Browse Loans →</Link>
            <Link className="btn btn-ghost btn-lg" to="/banks">Find Banks →</Link>
          </div>
        </section>

        <aside className="hero-side">
          <div className="card card-photo">
            <div className="stat">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Loans Matched in Minutes</span>
            </div>
          </div>

          <div className="card card-info">
            <p>
              Loan Match is the next-generation platform for borrowers and banks
              to find each other instantly, with no guesswork.
            </p>
            <a href="#">Learn more ↓</a>
          </div>
        </aside>
      </main>
    </div>
  );
}
