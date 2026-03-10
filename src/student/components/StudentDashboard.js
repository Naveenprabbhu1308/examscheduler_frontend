import React from 'react';
import { useApp } from '../../context/AppContext';
import '../../admin/components/Dashboard.css';

const StudentDashboard = () => {
  const { exams, user, students, halls } = useApp();

  const today     = new Date();
  const upcoming  = exams.filter((e) => new Date(e.date) >= today);
  const completed = exams.filter((e) => new Date(e.date) < today);

  const sorted   = [...students].sort((a, b) => b.score - a.score);
  const myRecord = sorted.find((s) =>
    s.name?.toLowerCase() === user?.name?.toLowerCase()
  );
  const myRank = myRecord ? sorted.findIndex((s) =>
    s.name?.toLowerCase() === user?.name?.toLowerCase()
  ) + 1 : 0;

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Welcome, {user?.name || 'Student'} 👋</h1>
        <p>Here's your personal dashboard.</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card stat-blue">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <div className="stat-value">{upcoming.length}</div>
            <div className="stat-label">Upcoming Exams</div>
          </div>
        </div>
        <div className="stat-card stat-green">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-value">{completed.length}</div>
            <div className="stat-label">Completed Exams</div>
          </div>
        </div>
        <div className="stat-card stat-purple">
          <div className="stat-icon">🏆</div>
          <div className="stat-info">
            <div className="stat-value">{myRank > 0 ? `#${myRank}` : 'N/A'}</div>
            <div className="stat-label">Your Rank</div>
          </div>
        </div>
        <div className="stat-card stat-orange">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <div className="stat-value">{myRecord?.score > 0 ? `${myRecord.score}%` : 'N/A'}</div>
            <div className="stat-label">Your Score</div>
          </div>
        </div>
      </div>

      {/* My Standing */}
      <div className="dash-card" style={{ marginBottom: 20 }}>
        <h3>📈 My Standing</h3>
        {myRecord && myRecord.score > 0 ? (
          <>
            <div className="dash-row">
              <span>Name</span>
              <span className="dash-badge">{myRecord.name}</span>
            </div>
            <div className="dash-row">
              <span>Roll No</span>
              <span className="dash-badge">{myRecord.rollNo}</span>
            </div>
            <div className="dash-row">
              <span>Marks</span>
              <span className="dash-badge">{myRecord.totalMarks} / {myRecord.maxMarks}</span>
            </div>
            <div className="dash-row">
              <span>Score</span>
              <span className="dash-badge green">{myRecord.score}%</span>
            </div>
            <div className="dash-row">
              <span>Rank</span>
              <span className="dash-badge">
                {myRank <= 3 ? medals[myRank - 1] : `#${myRank}`} out of {sorted.length}
              </span>
            </div>
            <div className="dash-row">
              <span>Grade</span>
              <span className="dash-badge" style={{
                background: myRecord.score >= 90 ? '#f0fdf4' : myRecord.score >= 75 ? '#eff6ff' : '#fff7ed',
                color:      myRecord.score >= 90 ? '#10b981' : myRecord.score >= 75 ? '#3b82f6' : '#f59e0b'
              }}>
                {myRecord.score >= 90 ? 'A+' : myRecord.score >= 75 ? 'B' : 'C'}
              </span>
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>
                <span>Score Progress</span>
                <span>{myRecord.score}%</span>
              </div>
              <div style={{ background: '#e2e8f0', borderRadius: 8, height: 10 }}>
                <div style={{
                  width: `${myRecord.score}%`, height: 10, borderRadius: 8,
                  background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>
          </>
        ) : (
          <p className="empty-msg">No marks recorded yet. Check back after exams! 📝</p>
        )}
      </div>

      <div className="dashboard-grid">

        {/* Upcoming Exams */}
        <div className="dash-card">
          <h3>📅 Upcoming Exams</h3>
          {upcoming.length > 0 ? upcoming.map((e, i) => {
            const mySeat = e.seats?.find(
              (s) => s.name?.toLowerCase() === user?.name?.toLowerCase()
            );
            return (
              <div key={i} style={{
                padding: '14px', marginBottom: 10, borderRadius: 10,
                background: '#f8fafc', border: '1.5px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>📘 {e.subject}</span>
                  <span className="dash-badge" style={{ background: '#f0fdf4', color: '#10b981' }}>Upcoming</span>
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#64748b', flexWrap: 'wrap' }}>
                  <span>🗓️ {e.date}</span>
                  <span>⏰ {e.time}</span>
                  {mySeat && (
                    <>
                      <span>🏛️ <strong>{mySeat.hallName}</strong></span>
                      <span style={{
                        background: '#f0fdf4', color: '#10b981',
                        padding: '1px 10px', borderRadius: 20, fontWeight: 700
                      }}>Seat: {mySeat.seat}</span>
                    </>
                  )}
                </div>
              </div>
            );
          }) : <p className="empty-msg">No upcoming exams.</p>}
        </div>

        {/* Completed Exams */}
        <div className="dash-card">
          <h3>✅ Completed Exams</h3>
          {completed.length > 0 ? completed.map((e, i) => (
            <div key={i} style={{
              padding: '14px', marginBottom: 10, borderRadius: 10,
              background: '#f8fafc', border: '1.5px solid #e2e8f0',
              opacity: 0.7
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>📘 {e.subject}</span>
                <span className="dash-badge" style={{ background: '#f1f5f9', color: '#94a3b8' }}>Done</span>
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#64748b' }}>
                <span>🗓️ {e.date}</span>
                <span>⏰ {e.time}</span>
              </div>
            </div>
          )) : <p className="empty-msg">No completed exams yet.</p>}
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;
