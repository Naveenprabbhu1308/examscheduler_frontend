import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import '../../admin/components/Dashboard.css';

const ExamSchedule = () => {
  const { exams, user } = useApp();
  const [filter, setFilter] = useState('all');
  const today = new Date();

  const getMySeat = (exam) => {
    return exam.seats?.find(
      (s) => s.name?.toLowerCase() === user?.name?.toLowerCase()
    );
  };

  const filtered = exams.filter((e) => {
    if (filter === 'upcoming') return new Date(e.date) >= today;
    if (filter === 'completed') return new Date(e.date) < today;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="dashboard-page" style={{ color: "#1e293b" }}>
      
      <div className="page-header">
        <h1 style={{ color: "#0f172a" }}>📅 Exam Schedule</h1>
        <p style={{ color: "#334155" }}>Your exam timetable with seat details.</p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {['all', 'upcoming', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="btn"
            style={{
              background: filter === f ? '#2563eb' : '#e2e8f0',
              color: filter === f ? 'white' : '#1e293b',
              fontWeight: 600,
              textTransform: 'capitalize',
              borderRadius: 8,
              padding: "8px 14px"
            }}
          >
            {f === 'all' ? '📋 All' : f === 'upcoming' ? '📅 Upcoming' : '✅ Completed'}
          </button>
        ))}
      </div>

      {/* Exam Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {sorted.map((e, i) => {
          const isUpcoming = new Date(e.date) >= today;
          const mySeat = getMySeat(e);
          const days = Math.ceil((new Date(e.date) - today) / (1000 * 60 * 60 * 24));

          return (
            <div
              key={i}
              style={{
                background: '#ffffff',
                borderRadius: 12,
                padding: 22,
                border: '1px solid #e2e8f0',
                borderLeft: `6px solid ${isUpcoming ? '#2563eb' : '#94a3b8'}`
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: 10
                }}
              >
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                    📘 {e.subject}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: 20,
                      fontSize: 15,
                      color: '#334155',
                      flexWrap: 'wrap'
                    }}
                  >
                    <span>🗓️ <strong>{e.date}</strong></span>
                    <span>⏰ <strong>{e.time}</strong></span>
                  </div>
                </div>

                <span
                  style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 700,
                    background: isUpcoming ? '#dbeafe' : '#e2e8f0',
                    color: isUpcoming ? '#1d4ed8' : '#475569'
                  }}
                >
                  {isUpcoming ? '🟢 Upcoming' : '⚪ Completed'}
                </span>
              </div>

              {/* Seat Info */}
              {mySeat ? (
                <div
                  style={{
                    marginTop: 16,
                    display: 'flex',
                    gap: 14,
                    flexWrap: 'wrap'
                  }}
                >
                  <div
                    style={{
                      background: '#eff6ff',
                      border: '2px solid #bfdbfe',
                      borderRadius: 10,
                      padding: '12px 18px',
                      textAlign: 'center',
                      minWidth: 100
                    }}
                  >
                    <div style={{ fontSize: 12, color: '#475569' }}>HALL</div>
                    <div style={{ fontWeight: 700, color: '#1d4ed8', fontSize: 17 }}>
                      🏛️ {mySeat.hallName}
                    </div>
                  </div>

                  <div
                    style={{
                      background: '#f0fdf4',
                      border: '2px solid #bbf7d0',
                      borderRadius: 10,
                      padding: '12px 18px',
                      textAlign: 'center',
                      minWidth: 100
                    }}
                  >
                    <div style={{ fontSize: 12, color: '#475569' }}>SEAT</div>
                    <div style={{ fontWeight: 800, color: '#059669', fontSize: 26 }}>
                      {mySeat.seat}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    marginTop: 14,
                    padding: '10px 16px',
                    borderRadius: 8,
                    background: '#fff7ed',
                    color: '#b45309',
                    fontSize: 14,
                    fontWeight: 600,
                    display: 'inline-block'
                  }}
                >
                  ⚠️ Seat not assigned yet
                </div>
              )}

              {/* Days Remaining */}
              {isUpcoming && (
                <div
                  style={{
                    marginTop: 14,
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: days <= 3 ? '#fee2e2' : '#dcfce7',
                    color: days <= 3 ? '#b91c1c' : '#047857',
                    fontSize: 14,
                    fontWeight: 700,
                    display: 'inline-block'
                  }}
                >
                  {days === 0
                    ? '⚠️ Today!'
                    : days === 1
                    ? '⚠️ Tomorrow!'
                    : `📆 ${days} days remaining`}
                </div>
              )}
            </div>
          );
        })}

        {sorted.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              color: '#475569',
              padding: '40px 0',
              fontSize: 16
            }}
          >
            No exams found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamSchedule;