import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ name: '', email: '', username: '', password: '', role: 'student' });
  const [msg, setMsg]         = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMsg('');
    try {
      const res = await fetch('https://examscheduler-production-c7c6.up.railway.app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setMsg(data.message);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.message);
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
          <h1>Register</h1>
          <p>Create your account</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">{error}</div>}
          {msg && (
            <div style={{
              background: '#f0fdf4', color: '#10b981',
              border: '1px solid #bbf7d0', borderRadius: 8,
              padding: '10px 14px', fontSize: 13, marginBottom: 16
            }}>{msg}</div>
          )}
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" value={form.name}
              onChange={handleChange} placeholder="Your name" required />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input name="username" value={form.username}
              onChange={handleChange} placeholder="e.g. 126 or yourname" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email}
              onChange={handleChange} placeholder="you@school.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={form.password}
              onChange={handleChange} placeholder="••••••••" required />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Submitting...' : 'Register'}
          </button>
          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#64748b' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#3b82f6' }}>Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
