import React from 'react';
import { Outlet } from 'react-router-dom';
import StaffSidebar from '../components/StaffSidebar';

const StaffLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <StaffSidebar />
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default StaffLayout;