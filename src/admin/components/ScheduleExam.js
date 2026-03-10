import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { scheduleExam, deleteExam } from '../../shared/api';
import './Dashboard.css';

const ScheduleExam = () => {
  const { exams, setExams, halls } = useApp();
  const [search, setSearch]        = useState('');
  const [showModal, setShowModal]  = useState(false);
  const [showSeats, setShowSeats]  = useState(null);
  const [form, setForm]            = useState({ subject: '', date: '', time: '', hallIds: [] });

  const filtered = exams.filter((e) =>
    e.subject?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleHall = (id) => {
    setForm((prev) => ({
      ...prev,
      hallIds: prev.hallIds.includes(id)
        ? prev.hallIds.filter((h) => h !== id)
        : [...prev.hallIds, id]
    }));
  };

  const handleAdd = async (ev) => {
    ev.preventDefault();
    if (form.hallIds.length === 0) return alert('Select at least one hall!');
    const res = await scheduleExam(form);
    if (res._id) {
      setExams((prev) => [...prev, res]);
      setShowModal(false);
      setForm({ subject: '', date: '', time: '', hallIds: [] });
    }
  };

  const handleDelete = async (id) => {
    await deleteExam(id);
    setExams((prev) => prev.filter((e) => e._id !== id));
  };

  // Group seats by hall for display
  const groupByHall = (seats) => {
    const groups = {};
    seats?.forEach((s) => {
      if (!groups[s.hallName]) groups[s.hallName] = [];
      groups[s.hallName].push(s);
    });
    return groups;
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Schedule Exams</h1>
        <p>Create exams — seats auto assigned by roll number.</p>
      </div>

      <div className="table-card">
        <div className="table-actions">
          <input className="search-input" placeholder="Search exams..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Schedule Exam
          </button>
        </div>
        <table>
          <thead>
            <tr><th>#</th><th>Subject</th><th>Date</th><th>Time</th><th>Halls</th><th>Students</th><th>Action</th></tr>
          </thead>
          <tbody>
            {filtered.map((e, i) => (
              <tr key={e._id}>
                <td>{i + 1}</td>
                <td>📘 {e.subject}</td>
                <td>{e.date}</td>
                <td><span className="dash-badge">{e.time}</span></td>
                <td>
                  {e.hallIds?.map((h) => (
                    <span key={h._id || h} className="dash-badge" style={{ marginRight: 4 }}>
                      {h.name || 'Hall'}
                    </span>
                  ))}
                </td>
                <td><span className="dash-badge green">{e.seats?.length || 0} students</span></td>
                <td style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-primary"
                    onClick={() => setShowSeats(e)}>
                    👁 View Seats
                  </button>
                  <button className="btn btn-danger"
                    onClick={() => handleDelete(e._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="7" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>
                No exams scheduled yet.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Schedule Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Schedule New Exam</h2>
            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label>Subject</label>
                <input value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input type="time" value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Select Halls (multiple allowed)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}>
                  {halls.map((h) => (
                    <label key={h._id} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
                      background: form.hallIds.includes(h._id) ? '#eff6ff' : '#f8fafc',
                      border: `1.5px solid ${form.hallIds.includes(h._id) ? '#3b82f6' : '#e2e8f0'}`,
                    }}>
                      <input type="checkbox"
                        checked={form.hallIds.includes(h._id)}
                        onChange={() => toggleHall(h._id)} />
                      <span style={{ fontWeight: 600 }}>{h.name}</span>
                      <span style={{ color: '#64748b', fontSize: 13 }}>({h.capacity} seats)</span>
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ background: '#f0fdf4', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#10b981', marginBottom: 16 }}>
                ✅ Seats will be auto assigned A1–F5 per hall by roll number order
              </div>
              <div className="modal-actions">
                <button type="button" className="btn" style={{ background: '#f1f5f9' }}
                  onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Schedule & Assign</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Seats Modal */}
      {showSeats && (
        <div className="modal-overlay" onClick={() => setShowSeats(null)}>
          <div className="modal" style={{ maxWidth: 700, maxHeight: '80vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}>
            <h2>📋 Seat Allocation — {showSeats.subject}</h2>
            <p style={{ color: '#64748b', fontSize: 13, marginBottom: 20 }}>
              {showSeats.date} at {showSeats.time}
            </p>
            {Object.entries(groupByHall(showSeats.seats)).map(([hallName, seats]) => (
              <div key={hallName} style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12,
                  padding: '8px 14px', background: '#eff6ff', borderRadius: 8, color: '#1d4ed8' }}>
                  🏛️ {hallName}
                </h3>
                {/* Seat Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8, marginBottom: 16 }}>
                  {seats.map((s, i) => (
                    <div key={i} style={{
                      background: '#f0fdf4', border: '1.5px solid #bbf7d0',
                      borderRadius: 8, padding: '8px 6px', textAlign: 'center'
                    }}>
                      <div style={{ fontWeight: 700, color: '#10b981', fontSize: 14 }}>{s.seat}</div>
                      <div style={{ fontSize: 11, color: '#374151', marginTop: 2,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {s.name?.split(' ')[0]}
                      </div>
                      <div style={{ fontSize: 10, color: '#94a3b8' }}>{s.rollNo?.slice(-3)}</div>
                    </div>
                  ))}
                </div>
                {/* Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '8px', background: '#f8fafc', color: '#64748b' }}>Seat</th>
                      <th style={{ textAlign: 'left', padding: '8px', background: '#f8fafc', color: '#64748b' }}>Name</th>
                      <th style={{ textAlign: 'left', padding: '8px', background: '#f8fafc', color: '#64748b' }}>Roll No</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seats.map((s, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '8px', fontWeight: 700, color: '#3b82f6' }}>{s.seat}</td>
                        <td style={{ padding: '8px' }}>{s.name}</td>
                        <td style={{ padding: '8px', color: '#64748b' }}>{s.rollNo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={() => setShowSeats(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleExam;