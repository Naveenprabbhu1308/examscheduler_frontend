import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL;

const StaffStudentList = () => {
  const { token } = useApp();
  const [students, setStudents]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [showAdd, setShowAdd]     = useState(false);
  const [editStudent, setEdit]    = useState(null);
  const [form, setForm]           = useState({ name: '', rollNo: '', email: '', score: 0 });
  const [error, setError]         = useState('');

  const headers = { Authorization: `Bearer ${token}` };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/students`, { headers });
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleAdd = async () => {
    setError('');
    try {
      await axios.post(`${API}/api/students`, form, { headers });
      setShowAdd(false);
      setForm({ name: '', rollNo: '', email: '', score: 0 });
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add student');
    }
  };

  const handleUpdate = async () => {
    setError('');
    try {
      await axios.put(`${API}/api/students/${editStudent._id}`, form, { headers });
      setEdit(null);
      setForm({ name: '', rollNo: '', email: '', score: 0 });
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update student');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try {
      await axios.delete(`${API}/api/students/${id}`, { headers });
      fetchStudents();
    } catch (err) {
      alert('Failed to delete student');
    }
  };

  const openEdit = (s) => {
    setEdit(s);
    setForm({ name: s.name, rollNo: s.rollNo, email: s.email || '', score: s.score || 0 });
    setShowAdd(false);
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(search.toLowerCase())
  );

  const modalStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.4)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000
  };
  const cardStyle = {
    background: '#fff', borderRadius: 14, padding: 28,
    width: 420, boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
  };
  const inputStyle = {
    width: '100%', padding: '8px 12px', borderRadius: 8,
    border: '1px solid #e2e8f0', fontSize: 14, marginTop: 4,
    boxSizing: 'border-box'
  };

  return (
    <div className="dashboard-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>My Students</h1>
          <p>{students.length} / 400 students assigned</p>
        </div>
        <button onClick={() => { setShowAdd(true); setEdit(null); setForm({ name: '', rollNo: '', email: '', score: 0 }); }}
          style={{
            padding: '10px 20px', background: '#3b82f6', color: '#fff',
            border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600
          }}>
          + Add Student
        </button>
      </div>

      {/* Search */}
      <input
        type="text" placeholder="🔍 Search by name or roll no..."
        value={search} onChange={e => setSearch(e.target.value)}
        style={{ ...inputStyle, marginBottom: 20, maxWidth: 360 }}
      />

      {loading && <p style={{ color: '#64748b' }}>Loading students...</p>}

      {/* Table */}
      {!loading && (
        <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f1f5f9' }}>
                {['#', 'Name', 'Roll No', 'Email', 'Score', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, color: '#64748b', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s._id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: 13 }}>{i + 1}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: 14 }}>{s.name}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{s.rollNo}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{s.email || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      background: s.score >= 75 ? '#d1fae5' : s.score >= 50 ? '#fef9c3' : '#fee2e2',
                      color: s.score >= 75 ? '#065f46' : s.score >= 50 ? '#854d0e' : '#991b1b',
                      borderRadius: 10, padding: '2px 10px', fontSize: 13, fontWeight: 600
                    }}>{s.score}%</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => openEdit(s)} style={{
                      marginRight: 8, padding: '5px 12px', borderRadius: 6,
                      border: 'none', background: '#dbeafe', color: '#1e40af',
                      cursor: 'pointer', fontSize: 12, fontWeight: 600
                    }}>✏️ Edit</button>
                    <button onClick={() => handleDelete(s._id)} style={{
                      padding: '5px 12px', borderRadius: 6,
                      border: 'none', background: '#fee2e2', color: '#991b1b',
                      cursor: 'pointer', fontSize: 12, fontWeight: 600
                    }}>🗑️ Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>No students found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {(showAdd || editStudent) && (
        <div style={modalStyle}>
          <div style={cardStyle}>
            <h3 style={{ marginBottom: 18, fontSize: 18 }}>{editStudent ? '✏️ Edit Student' : '➕ Add Student'}</h3>
            {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '8px 12px', borderRadius: 8, marginBottom: 12, fontSize: 13 }}>{error}</div>}

            {[
              { label: 'Full Name', key: 'name', type: 'text' },
              { label: 'Roll Number', key: 'rollNo', type: 'text' },
              { label: 'Email', key: 'email', type: 'email' },
              { label: 'Score (%)', key: 'score', type: 'number' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>{f.label}</label>
                <input
                  type={f.type} value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value })}
                  style={inputStyle}
                />
              </div>
            ))}

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={editStudent ? handleUpdate : handleAdd} style={{
                flex: 1, padding: '10px', background: '#3b82f6', color: '#fff',
                border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600
              }}>
                {editStudent ? 'Update' : 'Add Student'}
              </button>
              <button onClick={() => { setShowAdd(false); setEdit(null); setError(''); }} style={{
                flex: 1, padding: '10px', background: '#f1f5f9', color: '#334155',
                border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600
              }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffStudentList;