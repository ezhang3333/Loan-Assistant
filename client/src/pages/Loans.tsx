import { useEffect, useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import '../css/app.css';

interface Loan {
  loan_id: number;
  amount: number;
  term: string;
  subgrade: string;
  installments: number;
  purpose: string;
  loan_type: string;
  loan_state: string;
}

export default function Loans() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filter, setFilter] = useState({ purpose: '', loan_type: '' });

  const load = async (qs = '') => {
    const r = await api.getLoans<{ loans: Loan[] }>(qs);
    setLoans(r.loans || []);
  };

  useEffect(() => { load(); }, []);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filter.purpose) params.set('purpose', filter.purpose);
    if (filter.loan_type) params.set('loan_type', filter.loan_type);
    const qs = params.toString();
    load(qs ? '?' + qs : '');
  };

  return (
    <div>
      <h1>Loans</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/users">Users</Link>
        <Link to="/loans">Loans</Link>
        <Link to="/banks">Banks</Link>
        <Link to="/analytics">Analytics</Link>
      </nav>
      <hr />

      <fieldset>
        <legend>Filter</legend>
        <form onSubmit={onSearch}>
          <label>Purpose</label>
          <input type="text" value={filter.purpose} onChange={e => setFilter({ ...filter, purpose: e.target.value })} />
          <label>Loan Type</label>
          <input type="text" value={filter.loan_type} onChange={e => setFilter({ ...filter, loan_type: e.target.value })} />
          <button type="submit">Search</button>
          <button type="button" onClick={() => { setFilter({ purpose: '', loan_type: '' }); load(); }}>Reset</button>
        </form>
      </fieldset>

      <h3>Loan Records ({loans.length})</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Amount</th><th>Term</th><th>Subgrade</th>
            <th>Installments</th><th>Purpose</th><th>Type</th><th>State</th>
          </tr>
        </thead>
        <tbody>
          {loans.map(l => (
            <tr key={l.loan_id}>
              <td>{l.loan_id}</td>
              <td>{l.amount}</td>
              <td>{l.term}</td>
              <td>{l.subgrade}</td>
              <td>{l.installments}</td>
              <td>{l.purpose}</td>
              <td>{l.loan_type}</td>
              <td>{l.loan_state}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
