import React from 'react';
import { useApp } from '../../context/AppContext';
import '../../admin/components/Dashboard.css';

const medals = ['🥇', '🥈', '🥉'];

const TopStudentsView = () => {
  const { students, user } = useApp();
  const sorted = [...students].sort((a, b) => b.score - a.score);

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>🏆 Top Students</h1>
        <p>Overall leaderboard rankings.</p>
      </div>
      <div className="table-card">
        <table>
          <thead>
            <tr><th>Rank</th><th>Student</th><th>Marks</th><th>Score</th><th>Grade</th></tr>
          </thead>
          <tbody>
            {sorted.map((s, i) => {
              const isMe = s.name?.toLowerCase() === user?.name?.toLowerCase();
              return (
                <tr key={s._id || i} style={{
                  background: isMe ? '#eff6ff' : 'transparent',
                  fontWeight: isMe ? 700 : 400
                }}>
                  <td style={{ fontSize: 22 }}>{medals[i] || `#${i + 1}`}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: isMe ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)' : '#e2e8f0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: isMe ? 'white' : '#64748b', fontWeight: 700, fontSize: 14
                      }}>{s.name?.[0]}</div>
                      <span>{s.name} {isMe && <span style={{ color: '#3b82f6', fontSize: 11 }}>(You)</span>}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: '#64748b' }}>
                    {s.totalMarks > 0 ? `${s.totalMarks} / ${s.maxMarks}` : '—'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 100, background: '#e2e8f0', borderRadius: 4, height: 8 }}>
                        <div style={{
                          width: `${s.score}%`,
                          background: isMe ? 'linear-gradient(90deg,#3b82f6,#8b5cf6)' : '#94a3b8',
                          borderRadius: 4, height: 8
                        }} />
                      </div>
                      <span style={{ fontWeight: 700, color: isMe ? '#3b82f6' : '#374151' }}>{s.score}%</span>
                    </div>
                  </td>
                  <td>
                    <span className="dash-badge" style={{
                      background: s.score >= 90 ? '#f0fdf4' : s.score >= 75 ? '#eff6ff' : s.score > 0 ? '#fff7ed' : '#f1f5f9',
                      color:      s.score >= 90 ? '#10b981' : s.score >= 75 ? '#3b82f6' : s.score > 0 ? '#f59e0b' : '#94a3b8'
                    }}>
                      {s.score >= 90 ? 'A+' : s.score >= 75 ? 'B' : s.score > 0 ? 'C' : 'N/A'}
                    </span>
                  </td>
                </tr>
              );
            })}
            {sorted.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>
                  No leaderboard data yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopStudentsView;