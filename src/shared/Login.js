import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { loginUser } from './api';
import './Login.css';

const Login = () => {
  const { login } = useApp();
  const navigate  = useNavigate();
  const [form, setForm]       = useState({ username: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await loginUser(form);
      if (res.token) {
        login(res.user, res.token);
        if (res.user.role === 'admin')       navigate('/admin');
        else if (res.user.role === 'staff')  navigate('/staff');
        else                                  navigate('/student');
      } else {
        setError(res.message || 'Invalid credentials');
      }
    } catch {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">🎓</div>
          <h1>ExamScheduler</h1>
          <p>Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">{error}</div>}
          <div className="form-group">
            <label>Username</label>
            <input
              type="text" name="username" value={form.username}
              onChange={handleChange} placeholder="e.g. 126 or admin" required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password" name="password" value={form.password}
              onChange={handleChange} placeholder="password" required
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#64748b' }}>
            No account? <Link to="/register" style={{ color: '#3b82f6' }}>Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;