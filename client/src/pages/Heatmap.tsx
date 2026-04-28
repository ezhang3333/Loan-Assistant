import { useState } from 'react';
import Navbar from '../components/Navbar';
import '../css/landing.css';
import '../css/heatmap.css';

type LoanType = 'all' | 'home' | 'auto' | 'personal';

interface HeatData {
  [bank: string]: { [col: string]: number };
}

const COLUMNS = ['300-500', '500-600', '600-650', '650-700', '700-750', '750-800', '800-850'];

const MOCK_DATA: Record<LoanType, HeatData> = {
  all: {
    'Chase Bank':       { '300-500': 12, '500-600': 28, '600-650': 45, '650-700': 63, '700-750': 78, '750-800': 88, '800-850': 95 },
    'Bank of America':  { '300-500': 8,  '500-600': 22, '600-650': 38, '650-700': 55, '700-750': 72, '750-800': 84, '800-850': 92 },
    'Wells Fargo':      { '300-500': 15, '500-600': 31, '600-650': 48, '650-700': 60, '700-750': 74, '750-800': 82, '800-850': 90 },
    'US Bank':          { '300-500': 5,  '500-600': 18, '600-650': 35, '650-700': 52, '700-750': 68, '750-800': 80, '800-850': 88 },
    'PNC Financial':    { '300-500': 10, '500-600': 25, '600-650': 42, '650-700': 58, '700-750': 71, '750-800': 83, '800-850': 91 },
    'Capital One':      { '300-500': 18, '500-600': 35, '600-650': 50, '650-700': 62, '700-750': 70, '750-800': 78, '800-850': 85 },
    'TD Bank':          { '300-500': 7,  '500-600': 20, '600-650': 36, '650-700': 50, '700-750': 65, '750-800': 77, '800-850': 86 },
    'Citibank':         { '300-500': 11, '500-600': 26, '600-650': 40, '650-700': 57, '700-750': 73, '750-800': 85, '800-850': 93 },
  },
  home: {
    'Chase Bank':       { '300-500': 8,  '500-600': 22, '600-650': 40, '650-700': 58, '700-750': 75, '750-800': 86, '800-850': 94 },
    'Bank of America':  { '300-500': 5,  '500-600': 18, '600-650': 34, '650-700': 50, '700-750': 68, '750-800': 82, '800-850': 91 },
    'Wells Fargo':      { '300-500': 10, '500-600': 26, '600-650': 42, '650-700': 56, '700-750': 72, '750-800': 80, '800-850': 89 },
    'US Bank':          { '300-500': 3,  '500-600': 14, '600-650': 30, '650-700': 48, '700-750': 65, '750-800': 78, '800-850': 87 },
    'PNC Financial':    { '300-500': 7,  '500-600': 20, '600-650': 38, '650-700': 54, '700-750': 69, '750-800': 81, '800-850': 90 },
    'Capital One':      { '300-500': 12, '500-600': 28, '600-650': 44, '650-700': 56, '700-750': 66, '750-800': 74, '800-850': 82 },
    'TD Bank':          { '300-500': 4,  '500-600': 16, '600-650': 32, '650-700': 46, '700-750': 62, '750-800': 75, '800-850': 84 },
    'Citibank':         { '300-500': 9,  '500-600': 24, '600-650': 38, '650-700': 54, '700-750': 70, '750-800': 83, '800-850': 92 },
  },
  auto: {
    'Chase Bank':       { '300-500': 18, '500-600': 35, '600-650': 52, '650-700': 68, '700-750': 82, '750-800': 90, '800-850': 96 },
    'Bank of America':  { '300-500': 12, '500-600': 28, '600-650': 44, '650-700': 60, '700-750': 76, '750-800': 86, '800-850': 93 },
    'Wells Fargo':      { '300-500': 20, '500-600': 38, '600-650': 54, '650-700': 66, '700-750': 78, '750-800': 85, '800-850': 92 },
    'US Bank':          { '300-500': 8,  '500-600': 22, '600-650': 40, '650-700': 56, '700-750': 72, '750-800': 83, '800-850': 90 },
    'PNC Financial':    { '300-500': 15, '500-600': 32, '600-650': 48, '650-700': 64, '700-750': 76, '750-800': 86, '800-850': 93 },
    'Capital One':      { '300-500': 24, '500-600': 42, '600-650': 56, '650-700': 68, '700-750': 76, '750-800': 82, '800-850': 88 },
    'TD Bank':          { '300-500': 10, '500-600': 25, '600-650': 42, '650-700': 56, '700-750': 70, '750-800': 80, '800-850': 88 },
    'Citibank':         { '300-500': 14, '500-600': 30, '600-650': 46, '650-700': 62, '700-750': 76, '750-800': 88, '800-850': 95 },
  },
  personal: {
    'Chase Bank':       { '300-500': 14, '500-600': 30, '600-650': 48, '650-700': 64, '700-750': 76, '750-800': 86, '800-850': 93 },
    'Bank of America':  { '300-500': 10, '500-600': 24, '600-650': 40, '650-700': 56, '700-750': 70, '750-800': 82, '800-850': 90 },
    'Wells Fargo':      { '300-500': 16, '500-600': 32, '600-650': 50, '650-700': 62, '700-750': 72, '750-800': 80, '800-850': 88 },
    'US Bank':          { '300-500': 6,  '500-600': 20, '600-650': 36, '650-700': 52, '700-750': 66, '750-800': 78, '800-850': 86 },
    'PNC Financial':    { '300-500': 12, '500-600': 26, '600-650': 44, '650-700': 58, '700-750': 70, '750-800': 82, '800-850': 90 },
    'Capital One':      { '300-500': 20, '500-600': 38, '600-650': 52, '650-700': 64, '700-750': 72, '750-800': 80, '800-850': 86 },
    'TD Bank':          { '300-500': 8,  '500-600': 22, '600-650': 38, '650-700': 52, '700-750': 66, '750-800': 76, '800-850': 84 },
    'Citibank':         { '300-500': 12, '500-600': 28, '600-650': 42, '650-700': 58, '700-750': 72, '750-800': 84, '800-850': 92 },
  },
};

function heatLevel(v: number): string {
  if (v >= 90) return 'heat-9';
  if (v >= 80) return 'heat-8';
  if (v >= 70) return 'heat-7';
  if (v >= 60) return 'heat-6';
  if (v >= 50) return 'heat-5';
  if (v >= 40) return 'heat-4';
  if (v >= 30) return 'heat-3';
  if (v >= 20) return 'heat-2';
  if (v >= 10) return 'heat-1';
  return 'heat-0';
}

export default function Heatmap() {
  const [loanType, setLoanType] = useState<LoanType>('all');
  const data = MOCK_DATA[loanType];
  const banks = Object.keys(data);

  const allValues = banks.flatMap((b) => COLUMNS.map((c) => data[b][c]));
  const avgApproval = Math.round(allValues.reduce((a, b) => a + b, 0) / allValues.length);
  const bestBank = banks.reduce((best, b) => {
    const avg = COLUMNS.reduce((s, c) => s + data[b][c], 0) / COLUMNS.length;
    const bestAvg = COLUMNS.reduce((s, c) => s + data[best][c], 0) / COLUMNS.length;
    return avg > bestAvg ? b : best;
  });
  const bestRange = COLUMNS[COLUMNS.length - 1];

  const filters: { key: LoanType; label: string }[] = [
    { key: 'all', label: 'All Loans' },
    { key: 'home', label: 'Home' },
    { key: 'auto', label: 'Auto' },
    { key: 'personal', label: 'Personal' },
  ];

  return (
    <div className="heatmap-page">
      <Navbar />
      <div className="heatmap-body">
        <div className="heatmap-header">
          <h1>Bank Approval Heatmap</h1>
          <p>
            Approval density across banks for profiles similar to yours.
            Each cell shows the approval rate (%) for applicants in that credit score range.
          </p>
        </div>

        {/* Stats */}
        <div className="heatmap-stats">
          <div className="heat-stat-card">
            <div className="stat-num">{avgApproval}%</div>
            <div className="stat-desc">Average Approval Rate</div>
          </div>
          <div className="heat-stat-card">
            <div className="stat-num">{bestBank.split(' ')[0]}</div>
            <div className="stat-desc">Top Performing Bank</div>
          </div>
          <div className="heat-stat-card">
            <div className="stat-num">{bestRange}</div>
            <div className="stat-desc">Highest Approval Range</div>
          </div>
        </div>

        {/* Filters */}
        <div className="heatmap-controls">
          {filters.map((f) => (
            <button
              key={f.key}
              className={`heat-filter-btn ${loanType === f.key ? 'active' : ''}`}
              onClick={() => setLoanType(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="heatmap-container">
          <table className="heatmap-table">
            <thead>
              <tr>
                <th>Bank</th>
                {COLUMNS.map((c) => (
                  <th key={c}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {banks.map((bank) => (
                <tr key={bank}>
                  <td>{bank}</td>
                  {COLUMNS.map((col) => {
                    const val = data[bank][col];
                    return (
                      <td key={col}>
                        <div className={`heat-cell ${heatLevel(val)}`}>
                          {val}%
                          <div className="heat-tooltip">
                            <strong>{bank}</strong><br />
                            Credit: {col}<br />
                            Approval: {val}%
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Legend */}
          <div className="heatmap-legend">
            <span className="legend-label">Low</span>
            <div className="legend-bar">
              {[0,1,2,3,4,5,6,7,8,9].map((i) => (
                <div key={i} className={`legend-swatch heat-${i}`} />
              ))}
            </div>
            <span className="legend-label">High</span>
          </div>
        </div>
      </div>
    </div>
  );
}
