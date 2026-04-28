import { Link } from 'react-router-dom';
import { MapPin, Landmark, TrendingUp, Map, Lightbulb, SlidersHorizontal } from 'lucide-react';
import Navbar from '../components/Navbar';
import '../css/landing.css';
import '../css/dashboard.css';

const SCORE = 74;
const CIRCUMFERENCE = 2 * Math.PI * 78;

const BANKS = [
  { rank: 1, name: 'Chase Bank', fit: 4.4, loanType: 'Home', distance: '2.3 mi', rate: '6.25%' },
  { rank: 2, name: 'Bank of America', fit: 3.8, loanType: 'Auto', distance: '4.1 mi', rate: '5.89%' },
  { rank: 3, name: 'Wells Fargo', fit: 3.6, loanType: 'Personal', distance: '1.8 mi', rate: '7.10%' },
  { rank: 4, name: 'US Bank', fit: 3.3, loanType: 'Home', distance: '5.6 mi', rate: '6.55%' },
  { rank: 5, name: 'PNC Financial', fit: 3.1, loanType: 'Auto', distance: '3.2 mi', rate: '5.45%' },
  { rank: 6, name: 'Capital One', fit: 2.9, loanType: 'Personal', distance: '7.4 mi', rate: '8.20%' },
];

const RISKS = [
  {
    title: 'Credit Score',
    severity: 'medium' as const,
    desc: 'Your credit score of 680 is fair. Raising it above 720 would significantly improve approval odds and lower rates.',
  },
  {
    title: 'Debt-to-Income Ratio',
    severity: 'high' as const,
    desc: 'Your DTI of 42% exceeds the preferred 36% threshold. Reducing existing debt would be the highest-impact change.',
  },
  {
    title: 'Employment Stability',
    severity: 'low' as const,
    desc: 'Your 3+ years of continuous employment is a strong positive signal for lenders.',
  },
  {
    title: 'Down Payment',
    severity: 'medium' as const,
    desc: 'A larger down payment (20%+) would eliminate PMI requirements and improve your fit score with most lenders.',
  },
];

export default function Dashboard() {
  const offset = CIRCUMFERENCE - (SCORE / 100) * CIRCUMFERENCE;

  return (
    <div className="dash">
      <Navbar />
      <div className="dash-body">
        <div className="dash-welcome">
          <h1>Your Dashboard</h1>
          <p>A snapshot of your loan readiness and top bank matches.</p>
        </div>

        <div className="dash-top">
          <div className="score-card">
            <h2>Pre-Qualification Score</h2>
            <div className="score-ring">
              <svg viewBox="0 0 180 180">
                <circle className="ring-bg" cx="90" cy="90" r="78" />
                <circle
                  className="ring-fill"
                  cx="90" cy="90" r="78"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={offset}
                />
              </svg>
              <div className="score-value">
                <span className="number">{SCORE}%</span>
                <span className="label">Approval Odds</span>
              </div>
            </div>
            <p className="score-verdict">
              Good standing -- a few improvements could push you into the top tier of applicants.
            </p>
          </div>

          <div className="profile-card">
            <h2>Your Profile Summary</h2>
            <div className="profile-grid">
              <div className="profile-stat">
                <div className="stat-label">Credit Score</div>
                <div className="stat-value warn">680</div>
              </div>
              <div className="profile-stat">
                <div className="stat-label">Annual Income</div>
                <div className="stat-value">$72,000</div>
              </div>
              <div className="profile-stat">
                <div className="stat-label">Loan Amount</div>
                <div className="stat-value">$45,000</div>
              </div>
              <div className="profile-stat">
                <div className="stat-label">Debt-to-Income</div>
                <div className="stat-value bad">42%</div>
              </div>
              <div className="profile-stat">
                <div className="stat-label">Employment</div>
                <div className="stat-value good">Employed</div>
              </div>
              <div className="profile-stat">
                <div className="stat-label">Existing Loans</div>
                <div className="stat-value warn">3</div>
              </div>
            </div>
          </div>
        </div>

        <div className="dash-section">
          <div className="dash-section-header">
            <h2>Top Matched Banks</h2>
            <Link to="/heatmap">View heatmap &rarr;</Link>
          </div>
          <div className="bank-list">
            {BANKS.map((b) => (
              <div className="bank-card" key={b.rank}>
                <div className="bank-rank">{b.rank}</div>
                <div className="bank-info">
                  <div className="bank-name">{b.name}</div>
                  <div className="bank-meta">
                    <span><Landmark size={12} /> {b.loanType}</span>
                    <span><MapPin size={12} /> {b.distance}</span>
                    <span><TrendingUp size={12} /> {b.rate}</span>
                  </div>
                </div>
                <div className="bank-fit">
                  <div className="fit-score">{b.fit}</div>
                  <div className="fit-label">Fit Score</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-section">
          <div className="dash-section-header">
            <h2>Risk Factors</h2>
            <Link to="/assistant">Get help &rarr;</Link>
          </div>
          <div className="risk-grid">
            {RISKS.map((r) => (
              <div className={`risk-card ${r.severity}`} key={r.title}>
                <h3>
                  {r.title}
                  <span className={`risk-badge ${r.severity}`}>{r.severity}</span>
                </h3>
                <p>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-section">
          <div className="dash-section-header">
            <h2>Explore</h2>
          </div>
          <div className="quick-actions">
            <Link to="/heatmap" className="action-card">
              <div className="action-icon"><Map size={24} /></div>
              <div className="action-text">
                <h3>Bank Approval Heatmap</h3>
                <p>Approval density across banks for profiles like yours.</p>
              </div>
            </Link>
            <Link to="/assistant" className="action-card">
              <div className="action-icon"><Lightbulb size={24} /></div>
              <div className="action-text">
                <h3>Loan Assistant</h3>
                <p>Strategies and a timeline to boost approval odds.</p>
              </div>
            </Link>
            <Link to="/simulator" className="action-card">
              <div className="action-icon"><SlidersHorizontal size={24} /></div>
              <div className="action-text">
                <h3>What-If Simulator</h3>
                <p>See how changes to your profile affect approval.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
