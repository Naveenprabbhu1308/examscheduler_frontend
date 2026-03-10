import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import './Dashboard.css';
import API_BASE_URL from '../../config';

const PendingApprovals = () => {
  const { token } = useApp();
  const [pending, setPending] = useState([]);
  const [msg, setMsg]         = useState('');

  const fetchPending = async () => {
    const res = await fetch(`${API_BASE_URL}/api/auth/pending`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setPending(data);
  };

  useEffect(() => { fetchPending(); }, []);

  const approve = async (id) => {
    await fetch(`${API_BASE_URL}/api/auth/approve/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
    setMsg('✅ User approved!');
    fetchPending();
  };

  const reject = async (id) => {
    await fetch(`${API_BASE_URL}/api/auth/reject/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    setMsg('❌ User rejected!');
    fetchPending();
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Pending Approvals</h1>
        <p>Approve or reject new registration requests.</p>
      </div>
      {msg && <div className="dash-badge" style={{ marginBottom: 16, display: 'inline-block' }}>{msg}</div>}
      <div className="table-card">
        <table>
          <thead>
            <tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {pending.map((u, i) => (
              <tr key={u._id}>
                <td>{i + 1}</td>
                <td>👤 {u.name}</td>
                <td>{u.email}</td>
                <td><span className="dash-badge">{u.role}</span></td>
                <td style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary" onClick={() => approve(u._id)}>Approve</button>
                  <button className="btn btn-danger"  onClick={() => reject(u._id)}>Reject</button>
                </td>
              </tr>
            ))}
            {pending.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>No pending requests.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingApprovals;