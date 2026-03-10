import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import '../../admin/components/Dashboard.css';

const StudentList = () => {
  const { students } = useApp();
  const [search, setSearch] = useState('');

  const filtered = students.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNo?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Students</h1>
        <p>All registered students.</p>
      </div>
      <div className="table-card">
        <div className="table-actions">
          <input className="search-input" placeholder="Search by name or roll no..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <table>
          <thead>
            <tr><th>#</th><th>Name</th><th>Roll No</th><th>Email</th></tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s._id}>
                <td>{i + 1}</td>
                <td>👤 {s.name}</td>
                <td><span className="dash-badge">{s.rollNo}</span></td>
                <td>{s.email}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;