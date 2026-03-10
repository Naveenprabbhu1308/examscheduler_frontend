import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StaffDashboard = () => {
  const { user, token } = useApp();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/students`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudents(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [token]);

  const topStudents = [...students].sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Staff Dashboard</h1>
        <p>Welcome, {user?.name}! Managing <strong>{user?.department}</strong> department.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-blue">
          <div className="stat-icon">👨‍🎓</div>
          <div className="stat-info">
            <div className="stat-value">{students.length}</div>
            <div className="stat-label">My Students</div>
          </div>
        </div>
        <div className="stat-card stat-orange">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <div className="stat-value">{400 - students.length}</div>
            <div className="stat-label">Slots Remaining</div>
          </div>
        </div>
        <div className="stat-card stat-green">
          <div className="stat-icon">🏆</div>
          <div className="stat-info">
            <div className="stat-value">
              {students.length > 0
                ? Math.round(students.reduce((a, s) => a + (s.score || 0), 0) / students.length)
                : 0}%
            </div>
            <div className="stat-label">Avg Score</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dash-card">
          <h3>Top 5 Students</h3>
          {loading && <p className="empty-msg">Loading...</p>}
          {!loading && topStudents.map((s, i) => (
            <div className="dash-row" key={i}>
              <span>🎖️ {s.name}</span>
              <span className="dash-badge green">{s.score}%</span>
            </div>
          ))}
          {!loading && topStudents.length === 0 && (
            <p className="empty-msg">No students yet.</p>
          )}
        </div>
        <div className="dash-card">
          <h3>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
            <button
              onClick={() => navigate('/staff/students')}
              style={{
                padding: '10px 16px', borderRadius: 8, border: 'none',
                background: '#3b82f6', color: '#fff', cursor: 'pointer',
                fontWeight: 600, fontSize: 14, textAlign: 'left'
              }}>
              👨‍🎓 Manage Students
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;