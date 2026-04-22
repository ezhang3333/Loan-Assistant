import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import '../css/app.css';

type Row = Record<string, string | number | null>;

const DESCRIPTIONS: Record<string, string> = {
  '1': 'Bank count, avg income, and avg credit score per state.',
  '2': 'Loan purposes where amounts exceed the overall average.',
  '3': 'Banks in areas with above-average credit scores.'
};

const LABELS: Record<string, string> = {
  '1': 'Banks by State',
  '2': 'High-Value Loans',
  '3': 'Credit-Focused Banks'
};

export default function Analytics() {
  const [activeQuery, setActiveQuery] = useState('1');
  const [results, setResults] = useState<Row[]>([]);

  useEffect(() => {
    api.getAnalytics<{ results: Row[] }>(activeQuery).then(r => setResults(r.results || []));
  }, [activeQuery]);

  const columns = results.length > 0 ? Object.keys(results[0]) : [];

  return (
    <div>
      <h1>Analytics</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/users">Users</Link>
        <Link to="/loans">Loans</Link>
        <Link to="/banks">Banks</Link>
        <Link to="/analytics">Analytics</Link>
      </nav>
      <hr />

      <div className="tabs">
        {['1', '2', '3'].map(q => (
          <button key={q} className={activeQuery === q ? 'active' : ''} onClick={() => setActiveQuery(q)}>
            {LABELS[q]}
          </button>
        ))}
      </div>

      <p>{DESCRIPTIONS[activeQuery]}</p>

      <table>
        <thead>
          <tr>
            {columns.map(k => <th key={k}>{k.replace(/_/g, ' ')}</th>)}
          </tr>
        </thead>
        <tbody>
          {results.map((row, i) => (
            <tr key={i}>
              {columns.map(k => {
                const v = row[k];
                const display = v === null
                  ? 'N/A'
                  : typeof v === 'number' && v % 1 !== 0 ? v.toFixed(2) : v;
                return <td key={k}>{display}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p>{results.length} results</p>
    </div>
  );
}
