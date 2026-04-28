import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Mail, Lock, EyeOff } from 'lucide-react';
import googleIcon from '../../imgs/google.svg';
import { api } from '../api';
import '../css/landing.css';
import '../css/auth.css';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.loginUser(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-grid">
        <section className="card card-auth-form">
          <h1>Welcome Back!</h1>

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
                autoComplete="current-password"
                className="has-trailing"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <EyeOff className="icon-trailing" />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button
              type="submit"
              className="btn btn-accent btn-lg auth-primary"
              disabled={submitting}
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>

            <div className="auth-divider">or</div>

            <button type="button" className="btn btn-ghost btn-lg auth-google">
              <img src={googleIcon} alt="" />
              Continue with Google
            </button>

            <p className="auth-swap">
              New here? <Link to="/signup">Sign up</Link>
            </p>
          </form>
        </section>

        <aside className="card card-auth-photo" aria-hidden="true" />
      </div>
    </div>
  );
}
