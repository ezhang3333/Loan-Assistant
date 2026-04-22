import { useEffect, useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import '../css/app.css';

interface User {
  user_id: number;
  username: string;
  gender: string;
  marital_status: string;
  annual_income: number;
  credit_score: number;
  num_loans_taken: number;
  age: number;
  employment_status: string;
  num_existing_loans: number;
  zipcode: number;
  loan_amount_asked: number;
}

const EMPTY_ADD = {
  username: '', password: '', gender: 'Male', marital_status: 'Single',
  annual_income: '', credit_score: '', num_loans_taken: 0, age: '',
  employment_status: 'Employed', num_existing_loans: 0, zipcode: '', loan_amount_asked: ''
};

const EMPTY_UPDATE = {
  user_id: '', username: '', gender: 'Male', marital_status: 'Single',
  annual_income: '', credit_score: '', num_loans_taken: '', age: '',
  employment_status: 'Employed', num_existing_loans: '', zipcode: '', loan_amount_asked: ''
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [msg, setMsg] = useState<{ ok?: string; err?: string }>({});
  const [search, setSearch] = useState({ username: '', min_credit: '', max_credit: '' });
  const [addForm, setAddForm] = useState<Record<string, string | number>>(EMPTY_ADD);
  const [updForm, setUpdForm] = useState<Record<string, string | number>>(EMPTY_UPDATE);

  const load = async (qs = '') => {
    const r = await api.getUsers<{ users: User[]; error?: string }>(qs);
    if (r.error) setMsg({ err: r.error });
    setUsers(r.users || []);
  };

  useEffect(() => { load(); }, []);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.username) params.set('username', search.username);
    if (search.min_credit) params.set('min_credit', search.min_credit);
    if (search.max_credit) params.set('max_credit', search.max_credit);
    load('/search?' + params.toString());
  };

  const onAdd = async (e: FormEvent) => {
    e.preventDefault();
    const r = await api.addUser<{ success?: string; error?: string }>(addForm);
    setMsg(r.error ? { err: r.error } : { ok: r.success });
    if (r.success) { setAddForm(EMPTY_ADD); load(); }
  };

  const onUpdate = async (e: FormEvent) => {
    e.preventDefault();
    const r = await api.updateUser<{ success?: string; error?: string }>(updForm);
    setMsg(r.error ? { err: r.error } : { ok: r.success });
    if (r.success) load();
  };

  const onDelete = async (user_id: number) => {
    if (!confirm('Delete?')) return;
    const r = await api.deleteUser<{ success?: string; error?: string }>(user_id);
    setMsg(r.error ? { err: r.error } : { ok: r.success });
    load();
  };

  return (
    <div>
      <h1>Users</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/users">Users</Link>
        <Link to="/loans">Loans</Link>
        <Link to="/banks">Banks</Link>
        <Link to="/analytics">Analytics</Link>
      </nav>
      <hr />

      {msg.ok && <p className="msg-ok">{msg.ok}</p>}
      {msg.err && <p className="msg-err">{msg.err}</p>}

      <fieldset>
        <legend>Search</legend>
        <form onSubmit={onSearch}>
          <label>Username</label>
          <input type="text" value={search.username} onChange={e => setSearch({ ...search, username: e.target.value })} />
          <label>Min Credit</label>
          <input type="number" value={search.min_credit} onChange={e => setSearch({ ...search, min_credit: e.target.value })} />
          <label>Max Credit</label>
          <input type="number" value={search.max_credit} onChange={e => setSearch({ ...search, max_credit: e.target.value })} />
          <button type="submit">Search</button>
          <button type="button" onClick={() => { setSearch({ username: '', min_credit: '', max_credit: '' }); load(); }}>Reset</button>
        </form>
      </fieldset>

      <fieldset>
        <legend>Add User</legend>
        <form onSubmit={onAdd}>
          <div className="row"><label>Username</label><input type="text" required value={addForm.username as string} onChange={e => setAddForm({ ...addForm, username: e.target.value })} /></div>
          <div className="row"><label>Password</label><input type="password" required value={addForm.password as string} onChange={e => setAddForm({ ...addForm, password: e.target.value })} /></div>
          <div className="row"><label>Gender</label>
            <select value={addForm.gender as string} onChange={e => setAddForm({ ...addForm, gender: e.target.value })}>
              <option>Male</option><option>Female</option><option>Other</option>
            </select></div>
          <div className="row"><label>Marital Status</label>
            <select value={addForm.marital_status as string} onChange={e => setAddForm({ ...addForm, marital_status: e.target.value })}>
              <option>Single</option><option>Married</option><option>Divorced</option>
            </select></div>
          <div className="row"><label>Annual Income</label><input type="number" step="0.01" value={addForm.annual_income as string} onChange={e => setAddForm({ ...addForm, annual_income: e.target.value })} /></div>
          <div className="row"><label>Credit Score</label><input type="number" value={addForm.credit_score as string} onChange={e => setAddForm({ ...addForm, credit_score: e.target.value })} /></div>
          <div className="row"><label>Loans Taken</label><input type="number" value={addForm.num_loans_taken as number} onChange={e => setAddForm({ ...addForm, num_loans_taken: e.target.value })} /></div>
          <div className="row"><label>Age</label><input type="number" value={addForm.age as string} onChange={e => setAddForm({ ...addForm, age: e.target.value })} /></div>
          <div className="row"><label>Employment</label>
            <select value={addForm.employment_status as string} onChange={e => setAddForm({ ...addForm, employment_status: e.target.value })}>
              <option>Employed</option><option>Self-employed</option><option>Unemployed</option><option>Student</option>
            </select></div>
          <div className="row"><label>Existing Loans</label><input type="number" value={addForm.num_existing_loans as number} onChange={e => setAddForm({ ...addForm, num_existing_loans: e.target.value })} /></div>
          <div className="row"><label>Zipcode</label><input type="number" value={addForm.zipcode as string} onChange={e => setAddForm({ ...addForm, zipcode: e.target.value })} /></div>
          <div className="row"><label>Loan Amount</label><input type="number" step="0.01" value={addForm.loan_amount_asked as string} onChange={e => setAddForm({ ...addForm, loan_amount_asked: e.target.value })} /></div>
          <button type="submit">Add</button>
        </form>
      </fieldset>

      <h3>All Users ({users.length})</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Username</th><th>Gender</th><th>Marital</th><th>Income</th>
            <th>Credit</th><th>Age</th><th>Employment</th><th>Zipcode</th><th>Loan Asked</th><th></th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.user_id}>
              <td>{u.user_id}</td>
              <td>{u.username}</td>
              <td>{u.gender}</td>
              <td>{u.marital_status}</td>
              <td>{u.annual_income}</td>
              <td>{u.credit_score}</td>
              <td>{u.age}</td>
              <td>{u.employment_status}</td>
              <td>{u.zipcode}</td>
              <td>{u.loan_amount_asked}</td>
              <td><button onClick={() => onDelete(u.user_id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <fieldset>
        <legend>Update User</legend>
        <form onSubmit={onUpdate}>
          <div className="row"><label>User ID</label><input type="number" required value={updForm.user_id as string} onChange={e => setUpdForm({ ...updForm, user_id: e.target.value })} /></div>
          <div className="row"><label>Username</label><input type="text" required value={updForm.username as string} onChange={e => setUpdForm({ ...updForm, username: e.target.value })} /></div>
          <div className="row"><label>Gender</label>
            <select value={updForm.gender as string} onChange={e => setUpdForm({ ...updForm, gender: e.target.value })}>
              <option>Male</option><option>Female</option><option>Other</option>
            </select></div>
          <div className="row"><label>Marital Status</label>
            <select value={updForm.marital_status as string} onChange={e => setUpdForm({ ...updForm, marital_status: e.target.value })}>
              <option>Single</option><option>Married</option><option>Divorced</option>
            </select></div>
          <div className="row"><label>Annual Income</label><input type="number" step="0.01" value={updForm.annual_income as string} onChange={e => setUpdForm({ ...updForm, annual_income: e.target.value })} /></div>
          <div className="row"><label>Credit Score</label><input type="number" value={updForm.credit_score as string} onChange={e => setUpdForm({ ...updForm, credit_score: e.target.value })} /></div>
          <div className="row"><label>Loans Taken</label><input type="number" value={updForm.num_loans_taken as string} onChange={e => setUpdForm({ ...updForm, num_loans_taken: e.target.value })} /></div>
          <div className="row"><label>Age</label><input type="number" value={updForm.age as string} onChange={e => setUpdForm({ ...updForm, age: e.target.value })} /></div>
          <div className="row"><label>Employment</label>
            <select value={updForm.employment_status as string} onChange={e => setUpdForm({ ...updForm, employment_status: e.target.value })}>
              <option>Employed</option><option>Self-employed</option><option>Unemployed</option><option>Student</option>
            </select></div>
          <div className="row"><label>Existing Loans</label><input type="number" value={updForm.num_existing_loans as string} onChange={e => setUpdForm({ ...updForm, num_existing_loans: e.target.value })} /></div>
          <div className="row"><label>Zipcode</label><input type="number" value={updForm.zipcode as string} onChange={e => setUpdForm({ ...updForm, zipcode: e.target.value })} /></div>
          <div className="row"><label>Loan Amount</label><input type="number" step="0.01" value={updForm.loan_amount_asked as string} onChange={e => setUpdForm({ ...updForm, loan_amount_asked: e.target.value })} /></div>
          <button type="submit">Update</button>
        </form>
      </fieldset>
    </div>
  );
}
