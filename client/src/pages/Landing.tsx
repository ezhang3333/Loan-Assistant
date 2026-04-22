import '../css/landing.css';

export default function Landing() {
  return (
    <div className="landing">
      <header className="top-bar">
        <div className="brand">LOAN MATCH</div>
        <div className="auth-actions">
          <a className="btn btn-ghost" href="#">Login</a>
          <a className="btn btn-accent" href="#">Start Now →</a>
        </div>
      </header>

      <main className="hero-grid">
        <section className="card card-hero">
          <h1>The Modern Loan<br />Matching Platform</h1>
          <a className="btn btn-accent btn-lg" href="#">Sign up with sandbox →</a>

          <div className="match-widget">
            <div className="match-badge">$</div>
            <div className="match-side">
              <span className="label">Loan Amount</span>
              <span className="value">50,000.00</span>
            </div>
            <span className="match-arrow">--&gt;</span>
            <div className="match-side right">
              <span className="label">Matched Bank</span>
              <span className="value">Chase Premier</span>
            </div>
          </div>
          <a className="match-cta" href="#">Click to match</a>
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
