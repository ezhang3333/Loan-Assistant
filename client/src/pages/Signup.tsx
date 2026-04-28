import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Mail, Lock, EyeOff } from 'lucide-react';
import googleIcon from '../../imgs/google.svg';
import '../css/landing.css';
import '../css/auth.css';

export default function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Username and password required');
      return;
    }
    setError('');
    navigate('/signup/profile', { state: { username: username.trim(), password } });
  };

  return (
    <div className="auth-page">
      <div className="auth-grid">
        <section className="card card-auth-form">
          <h1>Welcome to Loan Match!</h1>
          <p className="auth-sub">Start finding the right loans today</p>

          <form className="auth-form" onSubmit={onSubmit}>
            <div className="auth-input">
              <Mail className="icon-leading" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="auth-input">
              <Lock className="icon-leading" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="new-password"
                className="has-trailing"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <EyeOff className="icon-trailing" />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="btn btn-accent btn-lg auth-primary">
              Sign up
            </button>

            <div className="auth-divider">or</div>

            <button type="button" className="btn btn-ghost btn-lg auth-google">
              <img src={googleIcon} alt="" />
              Continue with Google
            </button>

            <p className="auth-swap">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </form>
        </section>

        <aside className="card card-auth-photo" aria-hidden="true" />
      </div>
    </div>
  );
}
