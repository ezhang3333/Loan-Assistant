import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { api, SignupPayload } from '../api';
import '../css/landing.css';
import '../css/auth.css';

interface CredsState {
  username: string;
  password: string;
}

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];
const MARITAL_OPTIONS = ['Single', 'Married', 'Divorced', 'Widowed'];
const EMPLOYMENT_OPTIONS = ['Employed', 'Unemployed', 'Self-employed', 'Student', 'Retired'];

export default function CompleteProfile() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const creds = state as CredsState | null;

  const [gender, setGender] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [age, setAge] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');
  const [creditScore, setCreditScore] = useState('');
  const [numLoansTaken, setNumLoansTaken] = useState('');
  const [numExistingLoans, setNumExistingLoans] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [loanAmountAsked, setLoanAmountAsked] = useState('');

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!creds?.username || !creds?.password) {
    return <Navigate to="/signup" replace />;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const fields = {
      gender,
      maritalStatus,
      employmentStatus,
      age,
      annualIncome,
      creditScore,
      numLoansTaken,
      numExistingLoans,
      zipcode,
      loanAmountAsked,
    };
    if (Object.values(fields).some((v) => v === '' || v === null)) {
      setError('Please fill in every field');
      return;
    }
    if (!/^\d{5}$/.test(zipcode)) {
      setError('Zipcode must be 5 digits');
      return;
    }

    const payload: SignupPayload = {
      username: creds.username,
      password: creds.password,
      gender,
      marital_status: maritalStatus,
      employment_status: employmentStatus,
      age: Number(age),
      annual_income: Number(annualIncome),
      credit_score: Number(creditScore),
      num_loans_taken: Number(numLoansTaken),
      num_existing_loans: Number(numExistingLoans),
      zipcode: Number(zipcode),
      loan_amount_asked: Number(loanAmountAsked),
    };

    setSubmitting(true);
    try {
      await api.signupUser(payload);
      navigate('/loans');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-grid">
        <section className="card card-auth-form">
          <h1>Complete your profile</h1>
          <p className="auth-sub">A few details so we can match you with the right loans</p>

          <form className="auth-form" onSubmit={onSubmit}>
            <div className="auth-fields-grid">
              <div className="auth-input">
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="" disabled>Gender</option>
                  {GENDER_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div className="auth-input">
                <select value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)}>
                  <option value="" disabled>Marital status</option>
                  {MARITAL_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div className="auth-input">
                <select value={employmentStatus} onChange={(e) => setEmploymentStatus(e.target.value)}>
                  <option value="" disabled>Employment status</option>
                  {EMPLOYMENT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div className="auth-input">
                <input
                  type="number"
                  placeholder="Age"
                  min={18}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>

              <div className="auth-input">
                <input
                  type="number"
                  placeholder="Annual income"
                  min={0}
                  step={0.01}
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(e.target.value)}
                />
              </div>

              <div className="auth-input">
                <input
                  type="number"
                  placeholder="Credit score"
                  min={300}
                  max={850}
                  value={creditScore}
                  onChange={(e) => setCreditScore(e.target.value)}
                />
              </div>

              <div className="auth-input">
                <input
                  type="number"
                  placeholder="Loans taken (lifetime)"
                  min={0}
                  value={numLoansTaken}
                  onChange={(e) => setNumLoansTaken(e.target.value)}
                />
              </div>

              <div className="auth-input">
                <input
                  type="number"
                  placeholder="Existing loans"
                  min={0}
                  value={numExistingLoans}
                  onChange={(e) => setNumExistingLoans(e.target.value)}
                />
              </div>

              <div className="auth-input">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="\d{5}"
                  placeholder="Zipcode"
                  maxLength={5}
                  value={zipcode}
                  onChange={(e) => setZipcode(e.target.value.replace(/\D/g, ''))}
                />
              </div>

              <div className="auth-input">
                <input
                  type="number"
                  placeholder="Loan asking amount"
                  min={0}
                  step={0.01}
                  value={loanAmountAsked}
                  onChange={(e) => setLoanAmountAsked(e.target.value)}
                />
              </div>
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button
              type="submit"
              className="btn btn-accent btn-lg auth-primary"
              disabled={submitting}
            >
              {submitting ? 'Signing up…' : 'Sign up'}
            </button>
          </form>
        </section>

        <aside className="card card-auth-photo" aria-hidden="true" />
      </div>
    </div>
  );
}
