import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage, RegisterPage, CoursesPage, StudentsPage, FinancePage, HRPage } from './pages';
import { DashboardLayout } from './components/layout/DashboardLayout';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardLayout>
                <div className="p-4">
                  <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
                  {/* Dashboard Content */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded shadow">
                      <h3 className="text-lg font-semibold">Total Students</h3>
                      <p className="text-3xl font-bold text-blue-600">1,234</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                      <h3 className="text-lg font-semibold">Active Courses</h3>
                      <p className="text-3xl font-bold text-green-600">42</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                      <h3 className="text-lg font-semibold">Pending Tasks</h3>
                      <p className="text-3xl font-bold text-yellow-600">5</p>
                    </div>
                  </div>
                </div>
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/courses" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
          <Route path="/students" element={<ProtectedRoute><StudentsPage /></ProtectedRoute>} />
          <Route path="/finance" element={<ProtectedRoute><FinancePage /></ProtectedRoute>} />
          <Route path="/hr" element={<ProtectedRoute><HRPage /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
