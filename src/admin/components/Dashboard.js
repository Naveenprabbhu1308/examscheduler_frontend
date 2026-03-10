import React from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const StatCard = ({ icon, label, value, color, onClick }) => (
  <div className={`stat-card stat-${color}`} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-info">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  </div>
);

const Dashboard = () => {
  const { students, halls, exams, topStudents } = useApp();
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening today.</p>
      </div>
      <div className="stats-grid">
        <StatCard icon="👨‍🎓" label="Total Students"   value={students.length}    color="blue"   />
        <StatCard icon="🏛️"  label="Exam Halls"        value={halls.length}       color="green"  />
        <StatCard icon="📅"  label="Scheduled Exams"   value={exams.length}       color="purple" />
        <StatCard icon="🏆"  label="Top Performers"    value={topStudents.length} color="orange" />
        <StatCard
          icon="🔔"
          label="Activity Feed"
          value="View Logs"
          color="red"
          onClick={() => navigate('/admin/activity')}
        />
      </div>
      <div className="dashboard-grid">
        <div className="dash-card">
          <h3>Recent Exams</h3>
          {exams.slice(0, 5).map((e, i) => (
            <div className="dash-row" key={i}>
              <span>📘 {e.subject || e.name}</span>
              <span className="dash-badge">{e.date}</span>
            </div>
          ))}
          {exams.length === 0 && <p className="empty-msg">No exams scheduled yet.</p>}
        </div>
        <div className="dash-card">
          <h3>Top Students</h3>
          {topStudents.slice(0, 5).map((s, i) => (
            <div className="dash-row" key={i}>
              <span>🎖️ {s.name}</span>
              <span className="dash-badge green">{s.score}%</span>
            </div>
          ))}
          {topStudents.length === 0 && <p className="empty-msg">No data available.</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;