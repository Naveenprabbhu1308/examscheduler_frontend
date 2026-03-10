import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { addHall, deleteHall } from '../../shared/api';
import './Dashboard.css';

const HallList = () => {
  const { halls, setHalls } = useApp();
  const [search, setSearch]     = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]         = useState({ name: '', capacity: '' });

  const filtered = halls.filter((h) =>
    h.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await addHall(form);
    if (res._id) {
      setHalls((prev) => [...prev, res]);
      setShowModal(false);
      setForm({ name: '', capacity: '' });
    }
  };

  const handleDelete = async (id) => {
    await deleteHall(id);
    setHalls((prev) => prev.filter((h) => h._id !== id));
  };

  return (
    <div className="dashboard-page">
      <div className="page-header"><h1>Exam Halls</h1><p>Manage your examination halls.</p></div>
      <div className="table-card">
        <div className="table-actions">
          <input className="search-input" placeholder="Search halls..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Hall</button>
        </div>
        <table>
          <thead><tr><th>#</th><th>Hall Name</th><th>Capacity</th><th>Action</th></tr></thead>
          <tbody>
            {filtered.map((h, i) => (
              <tr key={h._id}>
                <td>{i + 1}</td>
                <td>🏛️ {h.name}</td>
                <td><span className="dash-badge">{h.capacity} seats</span></td>
                <td><button className="btn btn-danger" onClick={() => handleDelete(h._id)}>Delete</button></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="4" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>No halls found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Hall</h2>
            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label>Hall Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Capacity</label>
                <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn" style={{ background: '#f1f5f9' }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Hall</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HallList;