import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage, RegisterPage, DashboardPage, CoursesPage, ProgramsPage, StudentsPage, FinancePage, HRPage, GradesPage, MarketingPage, AssetsPage, AnalyticsPage, CollaborationPage, SecurityDashboard, SettingsPage, ProfilePage } from './pages';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const RoleProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles: string[] }> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;

  const userRole = (user as any)?.role?.name || 'Student';
  if (!allowedRoles.includes(userRole) && userRole !== 'Super Admin') {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

          <Route path="/courses" element={<RoleProtectedRoute allowedRoles={['Super Admin', 'Administrator', 'Instructor', 'Student']}><CoursesPage /></RoleProtectedRoute>} />
          <Route path="/programs" element={<RoleProtectedRoute allowedRoles={['Super Admin', 'Administrator']}><ProgramsPage /></RoleProtectedRoute>} />
          <Route path="/grades" element={<RoleProtectedRoute allowedRoles={['Super Admin', 'Administrator', 'Instructor', 'Student']}><GradesPage /></RoleProtectedRoute>} />
          <Route path="/students" element={<RoleProtectedRoute allowedRoles={['Super Admin', 'Administrator', 'Instructor']}><StudentsPage /></RoleProtectedRoute>} />

          <Route path="/marketing" element={<RoleProtectedRoute allowedRoles={['Super Admin', 'Administrator']}><MarketingPage /></RoleProtectedRoute>} />
          <Route path="/finance" element={<RoleProtectedRoute allowedRoles={['Super Admin', 'Administrator', 'Staff']}><FinancePage /></RoleProtectedRoute>} />
          <Route path="/hr" element={<RoleProtectedRoute allowedRoles={['Super Admin', 'Administrator', 'Staff']}><HRPage /></RoleProtectedRoute>} />
          <Route path="/assets" element={<RoleProtectedRoute allowedRoles={['Super Admin', 'Administrator', 'Staff']}><AssetsPage /></RoleProtectedRoute>} />
          <Route path="/analytics" element={<RoleProtectedRoute allowedRoles={['Super Admin', 'Administrator']}><AnalyticsPage /></RoleProtectedRoute>} />

          <Route path="/collaboration" element={<ProtectedRoute><CollaborationPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/security" element={<RoleProtectedRoute allowedRoles={['Super Admin']}><SecurityDashboard /></RoleProtectedRoute>} />
          <Route path="/settings" element={<RoleProtectedRoute allowedRoles={['Super Admin']}><SettingsPage /></RoleProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
