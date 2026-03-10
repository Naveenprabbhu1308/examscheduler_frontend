import React from 'react';
import { Outlet } from 'react-router-dom';
import StudSidebar from '../components/StudSidebar';
import '../../admin/components/Dashboard.css';

const StudentLayout = () => (
  <div className="app-layout">
    <StudSidebar />
    <div className="main-content">
      <Outlet />
    </div>
  </div>
);

export default StudentLayout;