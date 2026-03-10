import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

import Login from './shared/Login';
import Register from './shared/Register';
import ProtectedRoute from './shared/ProtectedRoute';

import AdminLayout from './admin/pages/AdminLayout';
import Dashboard from './admin/components/Dashboard';
import ScheduleExam from './admin/components/ScheduleExam';
import HallList from './admin/components/HallList';
import TopStudents from './admin/components/TopStudents';
import CalenderView from './admin/components/CalenderView';
import PendingApprovals from './admin/components/PendingApprovals';
import ActivityFeed from './admin/components/ActivityFeed';

import StudentLayout from './student/pages/StudentLayout';
import StudentDashboard from './student/components/StudentDashboard';
import StudentList from './student/components/StudentList';
import TopStudentsView from './student/components/TopStudentsView';
import ExamSchedule from './student/components/ExamSchedule';

import StaffLayout from './staff/pages/StaffLayout';
import StaffDashboard from './staff/components/StaffDashboard';
import StaffStudentList from './staff/components/StaffStudentList';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>

          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}><AdminLayout /></ProtectedRoute>
          }>
            <Route index                  element={<Dashboard />} />
            <Route path="schedule"        element={<ScheduleExam />} />
            <Route path="halls"           element={<HallList />} />
            <Route path="top-students"    element={<TopStudents />} />
            <Route path="calendar"        element={<CalenderView />} />
            <Route path="approvals"       element={<PendingApprovals />} />
            <Route path="activity"        element={<ActivityFeed />} />
          </Route>

          {/* Staff Routes */}
          <Route path="/staff" element={
            <ProtectedRoute roles={['staff']}><StaffLayout /></ProtectedRoute>
          }>
            <Route index                  element={<StaffDashboard />} />
            <Route path="students"        element={<StaffStudentList />} />
          </Route>

          {/* Student Routes */}
          <Route path="/student" element={
            <ProtectedRoute roles={['student']}><StudentLayout /></ProtectedRoute>
          }>
            <Route index                  element={<StudentDashboard />} />
            <Route path="exams"           element={<ExamSchedule />} />
            <Route path="list"            element={<StudentList />} />
            <Route path="top-students"    element={<TopStudentsView />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" />} />

        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;