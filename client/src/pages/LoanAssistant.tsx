import { useState } from 'react';
import Navbar from '../components/Navbar';
import '../css/landing.css';
import '../css/assistant.css';

type Tab = 'strategy' | 'pathway';

const STRATEGIES = [
  {
    title: 'Reduce Outstanding Debt',
    desc: 'Paying down $5,000 in credit card debt would lower your DTI from 42% to 35%, crossing the preferred threshold for most lenders.',
    impact: 90,
    level: 'high' as const,
  },
  {
    title: 'Increase Credit Score',
    desc: 'Dispute any errors on your credit report and keep utilization below 30%. A 40-point increase opens significantly better rates.',
    impact: 75,
    level: 'high' as const,
  },
  {
    title: 'Save for a Larger Down Payment',
    desc: 'Increasing your down payment to 20% eliminates PMI and signals financial stability to lenders.',
    impact: 60,
    level: 'medium' as const,
  },
  {
    title: 'Avoid New Credit Applications',
    desc: 'Each hard inquiry can lower your score by 5-10 points. Consolidate your applications within a 14-day window.',
    impact: 40,
    level: 'medium' as const,
  },
  {
    title: 'Maintain Employment Stability',
    desc: 'Stay at your current employer if possible. Lenders prefer 2+ years of consistent employment history.',
    impact: 25,
    level: 'low' as const,
  },
];

const TIMELINE = [
  {
    month: 'Month 1',
    action: 'Reduce debt by $500',
    detail: 'Focus on highest-interest credit card. Set up automatic payments to ensure consistency.',
    impact: '+3% approval odds',
    status: 'active' as const,
  },
  {
    month: 'Month 2',
    action: 'Dispute credit report errors',
    detail: 'Request free credit reports from all three bureaus. File disputes for any inaccurate items.',
    impact: '+5% approval odds',
    status: 'upcoming' as const,
  },
  {
    month: 'Month 3',
    action: 'Save $2,000 for down payment',
    detail: 'Open a dedicated savings account. Automate $500/month transfers from checking.',
    impact: '+4% approval odds',
    status: 'upcoming' as const,
  },
  {
    month: 'Month 4',
    action: 'Lower credit utilization to 25%',
    detail: 'Continue paying down balances. Request credit limit increases on existing cards if eligible.',
    impact: '+6% approval odds',
    status: 'upcoming' as const,
  },
  {
    month: 'Month 5',
    action: 'Apply for loan',
    detail: 'With improved profile metrics, apply to your top 2-3 matched banks within a 14-day window.',
    impact: 'Target: 86% approval',
    status: 'upcoming' as const,
  },
];

const TRADEOFFS = [
  { name: 'Pay Down Debt', effort: 70, reward: 90 },
  { name: 'Increase Income', effort: 85, reward: 75 },
  { name: 'Build Credit History', effort: 30, reward: 60 },
  { name: 'Save Down Payment', effort: 60, reward: 65 },
];

export default function LoanAssistant() {
  const [tab, setTab] = useState<Tab>('strategy');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'strategy', label: 'Strategy Optimizer' },
    { key: 'pathway', label: 'Pathway Planner' },
  ];

  return (
    <div className="assistant-page">
      <Navbar />
      <div className="assistant-body">
        <div className="assistant-header">
          <h1>Loan Assistant</h1>
          <p>Personalized strategies and an actionable timeline to improve your loan approval chances.</p>
        </div>

        <div className="assistant-tabs">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={`assist-tab ${tab === t.key ? 'active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Strategy Optimizer */}
        {tab === 'strategy' && (
          <div className="strategy-section">
            <div className="strategy-list">
              {STRATEGIES.map((s, i) => (
                <div className="strategy-card" key={i}>
                  <div className="strategy-num">{i + 1}</div>
                  <div className="strategy-content">
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                    <div className="strategy-impact">
                      <div className="impact-bar-bg">
                        <div className="impact-bar-fill" style={{ width: `${s.impact}%` }} />
                      </div>
                      <span className={`impact-label ${s.level}`}>
                        {s.level} impact
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="strategy-current">
              <h2>Your Current Profile</h2>
              <div className="current-stats">
                <div className="curr-stat">
                  <div className="curr-label">Credit Score</div>
                  <div className="curr-val">680</div>
                </div>
                <div className="curr-stat">
                  <div className="curr-label">Annual Income</div>
                  <div className="curr-val">$72K</div>
                </div>
                <div className="curr-stat">
                  <div className="curr-label">Total Debt</div>
                  <div className="curr-val">$30K</div>
                </div>
                <div className="curr-stat">
                  <div className="curr-label">DTI Ratio</div>
                  <div className="curr-val">42%</div>
                </div>
                <div className="curr-stat">
                  <div className="curr-label">Down Payment</div>
                  <div className="curr-val">$8K</div>
                </div>
                <div className="curr-stat">
                  <div className="curr-label">Approval Odds</div>
                  <div className="curr-val">74%</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pathway Planner */}
        {tab === 'pathway' && (
          <div className="pathway-section">
            <div className="timeline">
              <h2>Your Personalized Action Plan</h2>
              <div className="timeline-items">
                {TIMELINE.map((item, i) => (
                  <div className={`timeline-item ${item.status}`} key={i}>
                    <div className="timeline-dot" />
                    <div className="timeline-month">{item.month}</div>
                    <div className="timeline-action">{item.action}</div>
                    <div className="timeline-detail">{item.detail}</div>
                    <span className="timeline-impact-badge">{item.impact}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="tradeoff-card">
              <h2>Effort vs. Reward</h2>
              <div className="tradeoff-list">
                {TRADEOFFS.map((t, i) => (
                  <div className="tradeoff-item" key={i}>
                    <div className="tradeoff-name">{t.name}</div>
                    <div className="tradeoff-bars">
                      <div className="tradeoff-bar-row">
                        <span className="tradeoff-bar-label">Effort</span>
                        <div className="tradeoff-bar-bg">
                          <div className="tradeoff-bar-fill effort" style={{ width: `${t.effort}%` }} />
                        </div>
                      </div>
                      <div className="tradeoff-bar-row">
                        <span className="tradeoff-bar-label">Reward</span>
                        <div className="tradeoff-bar-bg">
                          <div className="tradeoff-bar-fill reward" style={{ width: `${t.reward}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
