import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import '../../admin/components/Dashboard.css';

const links = [
  { to: '/student',              icon: '📊', label: 'My Dashboard',  end: true },
  { to: '/student/exams',        icon: '📅', label: 'Exam Schedule' },
  { to: '/student/list',         icon: '👥', label: 'Students' },
  { to: '/student/top-students', icon: '🏆', label: 'Top Students' },
];

const StudSidebar = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-logo">🎓</span>
        <span className="sidebar-title">Student</span>
      </div>
      <nav className="sidebar-nav">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <span className="sidebar-icon">{l.icon}</span>
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{user?.name?.[0] || 'S'}</div>
          <div>
            <div className="sidebar-uname">{user?.name || 'Student'}</div>
            <div className="sidebar-role">Student</div>
          </div>
        </div>
        <button className="sidebar-logout" onClick={handleLogout}>⬅ Logout</button>
      </div>
    </aside>
  );
};

export default StudSidebar;