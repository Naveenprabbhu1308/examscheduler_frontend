import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import axios from 'axios';

const actionColors = {
  ADDED:         { bg: '#d1fae5', color: '#065f46', icon: '➕' },
  UPDATED:       { bg: '#dbeafe', color: '#1e40af', icon: '✏️' },
  DELETED:       { bg: '#fee2e2', color: '#991b1b', icon: '🗑️' },
  MARKS_UPDATED: { bg: '#fef9c3', color: '#854d0e', icon: '📝' },
};

const ActivityFeed = () => {
  const { token } = useApp();
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('ALL');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/activity`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(res.data);
    } catch (err) {
      console.error('Failed to fetch logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  const filtered = filter === 'ALL' ? logs : logs.filter(l => l.action === filter);

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>🔔 Activity Feed</h1>
        <p>All student-related actions by admin and staff</p>
      </div>

      {/* Filter Buttons */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {['ALL', 'ADDED', 'UPDATED', 'DELETED', 'MARKS_UPDATED'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 16px', borderRadius: 20, border: 'none', cursor: 'pointer',
            background: filter === f ? '#3b82f6' : '#e2e8f0',
            color: filter === f ? '#fff' : '#334155',
            fontWeight: filter === f ? 700 : 400,
            fontSize: 13,
          }}>
            {f === 'ALL' ? '🔍 All' :
             f === 'ADDED' ? '➕ Added' :
             f === 'UPDATED' ? '✏️ Updated' :
             f === 'DELETED' ? '🗑️ Deleted' : '📝 Marks'}
          </button>
        ))}
        <button onClick={fetchLogs} style={{
          padding: '6px 16px', borderRadius: 20, border: 'none', cursor: 'pointer',
          background: '#f1f5f9', color: '#334155', fontSize: 13, marginLeft: 'auto'
        }}>
          🔄 Refresh
        </button>
      </div>

      {loading && <p style={{ color: '#64748b' }}>Loading activity logs...</p>}

      {!loading && filtered.length === 0 && (
        <p style={{ color: '#94a3b8', textAlign: 'center', marginTop: 48 }}>No activity logs found.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map((log, i) => {
          const style = actionColors[log.action] || { bg: '#f1f5f9', color: '#334155', icon: '📋' };
          return (
            <div key={i} style={{
              background: '#fff', borderRadius: 12, padding: '14px 18px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
              borderLeft: `4px solid ${style.color}`,
              display: 'flex', alignItems: 'center', gap: 14
            }}>
              {/* Action Badge */}
              <div style={{
                background: style.bg, color: style.color,
                borderRadius: 8, padding: '4px 10px',
                fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap'
              }}>
                {style.icon} {log.action}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#1e293b' }}>
                  {log.studentName}
                  <span style={{ fontWeight: 400, color: '#64748b', marginLeft: 8, fontSize: 13 }}>
                    ({log.studentRollNo})
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                  {log.details}
                </div>
              </div>

              {/* Meta */}
              <div style={{ textAlign: 'right', minWidth: 120 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>
                  {log.performedBy}
                  <span style={{
                    marginLeft: 6, background: '#e0f2fe', color: '#0369a1',
                    borderRadius: 10, padding: '1px 7px', fontSize: 11
                  }}>
                    {log.role}
                  </span>
                </div>
                {log.department && (
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                    Dept: {log.department}
                  </div>
                )}
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                  {new Date(log.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityFeed;