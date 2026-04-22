import { useEffect, useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import '../css/app.css';

interface Bank {
  bank_id: number;
  name: string;
  type: string;
  zipcode: number;
  state: string | null;
  medium_house_income: number | null;
  avg_credit_score: number | null;
}

export default function Banks() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [state, setState] = useState('');

  const load = async (qs = '') => {
    const r = await api.getBanks<{ banks: Bank[] }>(qs);
    setBanks(r.banks || []);
  };

  useEffect(() => { load(); }, []);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    load(state ? '?state=' + encodeURIComponent(state) : '');
  };

  return (
    <div>
      <h1>Banks</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/users">Users</Link>
        <Link to="/loans">Loans</Link>
        <Link to="/banks">Banks</Link>
        <Link to="/analytics">Analytics</Link>
      </nav>
      <hr />

      <fieldset>
        <legend>Filter by State</legend>
        <form onSubmit={onSearch}>
          <label>State (2-letter)</label>
          <input type="text" maxLength={2} style={{ width: 60 }} value={state} onChange={e => setState(e.target.value)} />
          <button type="submit">Search</button>
          <button type="button" onClick={() => { setState(''); load(); }}>Reset</button>
        </form>
      </fieldset>

      <h3>Bank Directory ({banks.length})</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Type</th><th>Zipcode</th>
            <th>State</th><th>Median Income</th><th>Avg Credit Score</th>
          </tr>
        </thead>
        <tbody>
          {banks.map(b => (
            <tr key={b.bank_id}>
              <td>{b.bank_id}</td>
              <td>{b.name}</td>
              <td>{b.type}</td>
              <td>{b.zipcode}</td>
              <td>{b.state}</td>
              <td>{b.medium_house_income ?? 'N/A'}</td>
              <td>{b.avg_credit_score ?? 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
