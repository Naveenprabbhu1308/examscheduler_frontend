import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './Dashboard.css';

const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const CalenderView = () => {
  const { exams } = useApp();
  const today = new Date();
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year     = current.getFullYear();
  const month    = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const examDates = exams.map((e) => e.date?.slice(0, 10));

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="dashboard-page">
      <div className="page-header"><h1>Calendar</h1><p>View all scheduled exams.</p></div>
      <div className="table-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <button className="btn" style={{ background: '#f1f5f9' }} onClick={() => setCurrent(new Date(year, month - 1, 1))}>◀</button>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>{MONTHS[month]} {year}</h2>
          <button className="btn" style={{ background: '#f1f5f9' }} onClick={() => setCurrent(new Date(year, month + 1, 1))}>▶</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {DAYS.map((d) => (
            <div key={d} style={{ textAlign: 'center', fontWeight: 600, fontSize: 12, color: '#94a3b8', padding: '8px 0' }}>{d}</div>
          ))}
          {cells.map((d, i) => {
            const dateStr = d ? `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}` : '';
            const hasExam = d && examDates.includes(dateStr);
            const isToday = d && today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
            return (
              <div key={i} style={{
                textAlign: 'center', padding: '10px 0', borderRadius: 10,
                background: isToday ? '#3b82f6' : hasExam ? '#eff6ff' : 'transparent',
                color:      isToday ? 'white'   : hasExam ? '#3b82f6' : '#374151',
                fontWeight: isToday || hasExam ? 700 : 400,
                fontSize: 14, cursor: hasExam ? 'pointer' : 'default',
              }}>
                {d || ''}
                {hasExam && !isToday && (
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#3b82f6', margin: '2px auto 0' }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalenderView;