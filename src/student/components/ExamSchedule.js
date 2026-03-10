import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import '../../admin/components/Dashboard.css';

const ExamSchedule = () => {
  const { exams, user } = useApp();
  const [filter, setFilter] = useState('all');
  const today = new Date();

  // Find student's seat in an exam
  const getMySeat = (exam) => {
    return exam.seats?.find(
      (s) => s.name?.toLowerCase() === user?.name?.toLowerCase()
    );
  };

  const filtered = exams.filter((e) => {
    if (filter === 'upcoming')  return new Date(e.date) >= today;
    if (filter === 'completed') return new Date(e.date) < today;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>📅 Exam Schedule</h1>
        <p>Your exam timetable with seat details.</p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['all', 'upcoming', 'completed'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className="btn"
            style={{
              background:    filter === f ? '#3b82f6' : '#f1f5f9',
              color:         filter === f ? 'white'   : '#64748b',
              textTransform: 'capitalize'
            }}>
            {f === 'all' ? '📋 All' : f === 'upcoming' ? '📅 Upcoming' : '✅ Completed'}
          </button>
        ))}
      </div>

      {/* Exam Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {sorted.map((e, i) => {
          const isUpcoming = new Date(e.date) >= today;
          const mySeat     = getMySeat(e);
          const days       = Math.ceil((new Date(e.date) - today) / (1000 * 60 * 60 * 24));

          return (
            <div key={i} style={{
              background: 'white', borderRadius: 14, padding: 20,
              boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
              borderLeft: `4px solid ${isUpcoming ? '#3b82f6' : '#94a3b8'}`,
              opacity: isUpcoming ? 1 : 0.75
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>
                    📘 {e.subject}
                  </div>
                  <div style={{ display: 'flex', gap: 20, fontSize: 14, color: '#64748b', flexWrap: 'wrap' }}>
                    <span>🗓️ <strong>{e.date}</strong></span>
                    <span>⏰ <strong>{e.time}</strong></span>
                  </div>
                </div>
                <span style={{
                  padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                  background: isUpcoming ? '#eff6ff' : '#f1f5f9',
                  color:      isUpcoming ? '#3b82f6' : '#94a3b8'
                }}>
                  {isUpcoming ? '🟢 Upcoming' : '⚪ Completed'}
                </span>
              </div>

              {/* Seat Info */}
              {mySeat ? (
                <div style={{
                  marginTop: 14, display: 'flex', gap: 12, flexWrap: 'wrap'
                }}>
                  <div style={{
                    background: '#eff6ff', border: '1.5px solid #bfdbfe',
                    borderRadius: 10, padding: '10px 16px', textAlign: 'center', minWidth: 80
                  }}>
                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>HALL</div>
                    <div style={{ fontWeight: 700, color: '#1d4ed8', fontSize: 16 }}>
                      🏛️ {mySeat.hallName}
                    </div>
                  </div>
                  <div style={{
                    background: '#f0fdf4', border: '1.5px solid #bbf7d0',
                    borderRadius: 10, padding: '10px 16px', textAlign: 'center', minWidth: 80
                  }}>
                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>SEAT</div>
                    <div style={{ fontWeight: 700, color: '#10b981', fontSize: 24 }}>
                      {mySeat.seat}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{
                  marginTop: 12, padding: '8px 14px', borderRadius: 8,
                  background: '#fff7ed', color: '#f59e0b',
                  fontSize: 13, fontWeight: 600, display: 'inline-block'
                }}>
                  ⚠️ Seat not assigned yet
                </div>
              )}

              {/* Days remaining */}
              {isUpcoming && (
                <div style={{
                  marginTop: 12, padding: '8px 12px', borderRadius: 8,
                  background: days <= 3 ? '#fef2f2' : '#f0fdf4',
                  color:      days <= 3 ? '#dc2626' : '#10b981',
                  fontSize: 13, fontWeight: 600, display: 'inline-block'
                }}>
                  {days === 0 ? '⚠️ Today!' : days === 1 ? '⚠️ Tomorrow!' : `📆 ${days} days remaining`}
                </div>
              )}
            </div>
          );
        })}

        {sorted.length === 0 && (
          <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>
            No exams found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamSchedule;