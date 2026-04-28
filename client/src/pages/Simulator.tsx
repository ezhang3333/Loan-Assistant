import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import '../css/landing.css';
import '../css/assistant.css';

interface SavedScenario {
  id: number;
  name: string;
  score: number;
}

const BASE = { credit: 680, income: 72000, debt: 30000, downPayment: 8000 };

function calcScore(credit: number, income: number, debt: number, downPayment: number): number {
  const creditFactor = Math.min(((credit - 300) / 550) * 40, 40);
  const dti = debt / Math.max(income, 1);
  const dtiFactor = Math.max(0, (1 - dti / 0.6)) * 25;
  const dpFactor = Math.min((downPayment / 50000) * 20, 20);
  const incomeFactor = Math.min((income / 200000) * 15, 15);
  return Math.round(Math.min(creditFactor + dtiFactor + dpFactor + incomeFactor, 99));
}

export default function Simulator() {
  const [credit, setCredit] = useState(BASE.credit);
  const [income, setIncome] = useState(BASE.income);
  const [debt, setDebt] = useState(BASE.debt);
  const [downPayment, setDownPayment] = useState(BASE.downPayment);

  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([
    { id: 1, name: 'Aggressive Debt Payoff', score: 82 },
    { id: 2, name: 'Income Growth Plan', score: 79 },
  ]);

  const baseScore = calcScore(BASE.credit, BASE.income, BASE.debt, BASE.downPayment);
  const projectedScore = calcScore(credit, income, debt, downPayment);
  const delta = projectedScore - baseScore;

  const resetSim = () => {
    setCredit(BASE.credit);
    setIncome(BASE.income);
    setDebt(BASE.debt);
    setDownPayment(BASE.downPayment);
  };

  const saveScenario = () => {
    const id = Date.now();
    const name = `Scenario ${savedScenarios.length + 1}`;
    setSavedScenarios([...savedScenarios, { id, name, score: projectedScore }]);
  };

  const deleteScenario = (id: number) => {
    setSavedScenarios(savedScenarios.filter((s) => s.id !== id));
  };

  return (
    <div className="assistant-page">
      <Navbar />
      <div className="assistant-body">
        <div className="assistant-header">
          <h1>What-If Simulator</h1>
          <p>Adjust your financial profile below and see how changes affect your projected approval probability in real time.</p>
        </div>

        <div className="simulator-section">
          <div className="sim-controls">
            <h2>Adjust Your Profile</h2>
            <div className="sim-slider-group">
              <div className="sim-slider">
                <div className="sim-slider-header">
                  <span className="sim-slider-label">Credit Score</span>
                  <span className="sim-slider-value">{credit}</span>
                </div>
                <input
                  type="range" min={300} max={850} step={5}
                  value={credit}
                  onChange={(e) => setCredit(Number(e.target.value))}
                />
                <div className="sim-range-labels"><span>300</span><span>850</span></div>
              </div>

              <div className="sim-slider">
                <div className="sim-slider-header">
                  <span className="sim-slider-label">Annual Income</span>
                  <span className="sim-slider-value">${income.toLocaleString()}</span>
                </div>
                <input
                  type="range" min={20000} max={200000} step={2000}
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                />
                <div className="sim-range-labels"><span>$20K</span><span>$200K</span></div>
              </div>

              <div className="sim-slider">
                <div className="sim-slider-header">
                  <span className="sim-slider-label">Total Debt</span>
                  <span className="sim-slider-value">${debt.toLocaleString()}</span>
                </div>
                <input
                  type="range" min={0} max={100000} step={1000}
                  value={debt}
                  onChange={(e) => setDebt(Number(e.target.value))}
                />
                <div className="sim-range-labels"><span>$0</span><span>$100K</span></div>
              </div>

              <div className="sim-slider">
                <div className="sim-slider-header">
                  <span className="sim-slider-label">Down Payment</span>
                  <span className="sim-slider-value">${downPayment.toLocaleString()}</span>
                </div>
                <input
                  type="range" min={0} max={50000} step={500}
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                />
                <div className="sim-range-labels"><span>$0</span><span>$50K</span></div>
              </div>
            </div>

            <div className="sim-actions">
              <button className="sim-reset-btn" onClick={resetSim}>Reset</button>
              <button className="sim-save-btn" onClick={saveScenario}>Save Scenario</button>
            </div>
          </div>

          <div className="sim-results">
            <div className="sim-comparison">
              <h2>Projected Approval</h2>
              <div className="sim-scores">
                <div className="sim-score-block current">
                  <div className="sim-score-num">{baseScore}%</div>
                  <div className="sim-score-label">Current</div>
                </div>
                <div className="sim-arrow">&rarr;</div>
                <div className="sim-score-block projected">
                  <div className="sim-score-num">{projectedScore}%</div>
                  <div className="sim-score-label">Projected</div>
                </div>
              </div>
              <div className={`sim-change ${delta > 0 ? 'positive' : delta < 0 ? 'negative' : ''}`}>
                {delta > 0 ? `+${delta}%` : delta < 0 ? `${delta}%` : 'No change'}
              </div>
            </div>

            <div className="sim-changes">
              <h3>Changes from Baseline</h3>
              <div className="change-list">
                <div className="change-item">
                  <span className="change-name">Credit Score</span>
                  <span className={`change-delta ${credit > BASE.credit ? 'up' : credit < BASE.credit ? 'down' : 'neutral'}`}>
                    {credit - BASE.credit > 0 ? '+' : ''}{credit - BASE.credit} pts
                  </span>
                </div>
                <div className="change-item">
                  <span className="change-name">Annual Income</span>
                  <span className={`change-delta ${income > BASE.income ? 'up' : income < BASE.income ? 'down' : 'neutral'}`}>
                    {income - BASE.income > 0 ? '+' : ''}${(income - BASE.income).toLocaleString()}
                  </span>
                </div>
                <div className="change-item">
                  <span className="change-name">Total Debt</span>
                  <span className={`change-delta ${debt < BASE.debt ? 'up' : debt > BASE.debt ? 'down' : 'neutral'}`}>
                    {debt - BASE.debt > 0 ? '+' : ''}${(debt - BASE.debt).toLocaleString()}
                  </span>
                </div>
                <div className="change-item">
                  <span className="change-name">Down Payment</span>
                  <span className={`change-delta ${downPayment > BASE.downPayment ? 'up' : downPayment < BASE.downPayment ? 'down' : 'neutral'}`}>
                    {downPayment - BASE.downPayment > 0 ? '+' : ''}${(downPayment - BASE.downPayment).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {savedScenarios.length > 0 && (
          <div className="saved-scenarios" style={{ marginTop: 18 }}>
            <h3>Saved Scenarios</h3>
            <div className="scenario-list">
              {savedScenarios.map((s) => (
                <div className="scenario-item" key={s.id}>
                  <span className="scenario-name">{s.name}</span>
                  <span className="scenario-score">{s.score}% approval</span>
                  <button className="scenario-delete" onClick={() => deleteScenario(s.id)}>
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
