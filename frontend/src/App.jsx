import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterSchoolPage from './pages/RegisterSchoolPage';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import ActivityLogPage from './pages/ActivityLogPage';

// Teacher Pages
import TeacherDashboard from './pages/TeacherDashboard';

// Shared Pages
import ClassManagementPage from './pages/ClassManagementPage';
import ClassDetailsPage from './pages/ClassDetailsPage';
import CreateInternalFilePage from './pages/CreateInternalFilePage';
import FilesListPage from './pages/FilesListPage';
import FileViewerPage from './pages/FileViewerPage';

import './index.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register-school" element={<RegisterSchoolPage />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/classes" element={<ClassManagementPage />} />
              <Route path="/admin/classes/:classId" element={<ClassDetailsPage />} />
              <Route path="/admin/files" element={<FilesListPage />} />
              <Route path="/admin/create-file" element={<CreateInternalFilePage />} />
              <Route path="/admin/activity-log" element={<ActivityLogPage />} />
            </Route>
          </Route>

          {/* Teacher Routes */}
          <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
              <Route path="/teacher/classes" element={<ClassManagementPage />} />
              <Route path="/teacher/classes/:classId" element={<ClassDetailsPage />} />
              <Route path="/teacher/files" element={<FilesListPage />} />
              <Route path="/teacher/internal/create" element={<CreateInternalFilePage />} />
            </Route>
          </Route>

          {/* Common Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'teacher']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/files/view/:fileId" element={<FileViewerPage />} />
            </Route>
          </Route>

        </Routes>
      </Router>
    </div>
  );
}

export default App;