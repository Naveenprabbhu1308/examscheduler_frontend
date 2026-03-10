import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../components/Dashboard.css';

const AdminLayout = () => (
  <div className="app-layout">
    <Sidebar />
    <div className="main-content">
      <Outlet />
    </div>
  </div>
);

export default AdminLayout;