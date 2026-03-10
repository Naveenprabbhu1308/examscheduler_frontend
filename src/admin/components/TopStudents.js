import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { updateStudentMarks } from '../../shared/api';
import './Dashboard.css';

const medals = ['🥇', '🥈', '🥉'];

const TopStudents = () => {
  const { students, setStudents } = useApp();
  const [bulkData, setBulkData]   = useState({});
  const [msg, setMsg]             = useState('');
  const [error, setError]         = useState('');
  const [saving, setSaving]       = useState(false);
  const [search, setSearch]       = useState('');

  // Initialize bulk data from existing student marks
  useEffect(() => {
    const init = {};
    students.forEach((s) => {
      init[s._id] = {
        totalMarks: s.totalMarks || '',
        maxMarks:   s.maxMarks   || 100,
      };
    });
    setBulkData(init);
  }, [students.length]);

  const handleChange = (id, field, value) => {
    setBulkData((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const calcScore = (id) => {
    const d = bulkData[id];
    if (!d?.totalMarks || !d?.maxMarks) return null;
    return Math.round((Number(d.totalMarks) / Number(d.maxMarks)) * 100);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setMsg('');
    setError('');
    try {
      const updates = await Promise.all(
        students.map(async (s) => {
          const d = bulkData[s._id];
          if (!d?.totalMarks || !d?.maxMarks) return s;
          const res = await updateStudentMarks(s._id, {
            totalMarks: Number(d.totalMarks),
            maxMarks:   Number(d.maxMarks),
          });
          return res._id ? res : s;
        })
      );
      setStudents(updates);
      setMsg('✅ All marks saved successfully!');
      setTimeout(() => setMsg(''), 3000);
    } catch {
      setError('❌ Failed to save. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const filtered = students.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNo?.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...students].sort((a, b) => b.score - a.score);

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>🏆 Top Students</h1>
        <p>Edit all marks in the table below and click Save All.</p>
      </div>

      {/* Messages */}
      {msg && (
        <div style={{
          background: '#f0fdf4', color: '#10b981', border: '1px solid #bbf7d0',
          borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontWeight: 600
        }}>{msg}</div>
      )}
      {error && (
        <div style={{
          background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca',
          borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontWeight: 600
        }}>{error}</div>
      )}

      {/* Leaderboard Summary */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {sorted.slice(0, 3).map((s, i) => (
          <div key={s._id} style={{
            flex: 1, minWidth: 160, background: 'white', borderRadius: 14,
            padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
            borderTop: `4px solid ${i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : '#cd7c2f'}`
          }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{medals[i]}</div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{s.name}</div>
            <div style={{ color: '#3b82f6', fontWeight: 700, fontSize: 20 }}>{s.score}%</div>
            <div style={{ color: '#94a3b8', fontSize: 12 }}>{s.rollNo}</div>
          </div>
        ))}
      </div>

      {/* Bulk Marks Table */}
      <div className="table-card">
        <div className="table-actions">
          <input
            className="search-input"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={handleSaveAll}
            disabled={saving}
            style={{ minWidth: 140 }}
          >
            {saving ? '⏳ Saving...' : '💾 Save All Marks'}
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Roll No</th>
              <th>Total Marks</th>
              <th>Max Marks</th>
              <th>Score %</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => {
              const score = calcScore(s._id);
              return (
                <tr key={s._id}>
                  <td>{i + 1}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: '50%',
                        background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 700, fontSize: 12, flexShrink: 0
                      }}>{s.name?.[0]}</div>
                      <span style={{ fontSize: 13 }}>{s.name}</span>
                    </div>
                  </td>
                  <td><span className="dash-badge">{s.rollNo}</span></td>
                  <td>
                    <input
                      type="number" min="0"
                      value={bulkData[s._id]?.totalMarks || ''}
                      onChange={(e) => handleChange(s._id, 'totalMarks', e.target.value)}
                      placeholder="e.g. 85"
                      style={{
                        width: 90, padding: '7px 10px',
                        border: '1.5px solid #e2e8f0', borderRadius: 8,
                        fontSize: 13, outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e)  => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </td>
                  <td>
                    <input
                      type="number" min="1"
                      value={bulkData[s._id]?.maxMarks || ''}
                      onChange={(e) => handleChange(s._id, 'maxMarks', e.target.value)}
                      placeholder="e.g. 100"
                      style={{
                        width: 90, padding: '7px 10px',
                        border: '1.5px solid #e2e8f0', borderRadius: 8,
                        fontSize: 13, outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e)  => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </td>
                  <td>
                    {score !== null ? (
                      <span style={{ fontWeight: 700, color: '#3b82f6' }}>{score}%</span>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>—</span>
                    )}
                  </td>
                  <td>
                    {score !== null ? (
                      <span className="dash-badge" style={{
                        background: score >= 90 ? '#f0fdf4' : score >= 75 ? '#eff6ff' : '#fff7ed',
                        color:      score >= 90 ? '#10b981' : score >= 75 ? '#3b82f6' : '#f59e0b'
                      }}>
                        {score >= 90 ? 'A+' : score >= 75 ? 'B' : 'C'}
                      </span>
                    ) : (
                      <span className="dash-badge">N/A</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopStudents;
