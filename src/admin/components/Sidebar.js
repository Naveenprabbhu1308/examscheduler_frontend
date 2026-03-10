import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './Dashboard.css';

const links = [
  { to: '/admin',              icon: '📊', label: 'Dashboard',     end: true },
  { to: '/admin/schedule',     icon: '📅', label: 'Schedule Exam' },
  { to: '/admin/halls',        icon: '🏛️', label: 'Halls' },
  { to: '/admin/top-students', icon: '🏆', label: 'Top Students' },
  { to: '/admin/calendar',     icon: '🗓️', label: 'Calendar' },
  { to: '/admin/approvals',    icon: '🕐', label: 'Approvals' },
  { to: '/admin/activity',     icon: '🔔', label: 'Activity Feed' },
];

const Sidebar = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-logo">🎓</span>
        <span className="sidebar-title">ExamPro</span>
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
          <div className="sidebar-avatar">{user?.name?.[0] || 'A'}</div>
          <div>
            <div className="sidebar-uname">{user?.name || 'Admin'}</div>
            <div className="sidebar-role">Administrator</div>
          </div>
        </div>
        <button className="sidebar-logout" onClick={handleLogout}>⬅ Logout</button>
      </div>
    </aside>
  );
};

export default Sidebar;