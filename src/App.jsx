import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherAttendance from './pages/TeacherAttendance';
import Assignments from './pages/Assignments';
import Progress from './pages/Progress';
import MyCourses from './pages/MyCourses';
import Payment from './pages/Payment';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import Calendar from './components/features/Calendar';
import Quiz from './components/features/Quiz';

function AppShell({ user, onLogout }) {
  const userName = user.role === 'teacher' ? 'Sir Yasir Ali' : 'Mujtaba Khan';

  return (
    <div className="app-shell" style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar onLogout={onLogout} role={user.role} />
      <div className="main-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Routes>
          <Route
            path="/dashboard"
            element={user.role === 'teacher' ? <TeacherDashboard /> : <Dashboard />}
          />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/attendance" element={<TeacherAttendance />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/quizzes" element={<Quiz />} />
          <Route path="/profile" element={<Profile role={user.role} />} />
          <Route
            path="/settings"
            element={<Settings role={user.role} userName={userName} onLogout={onLogout} />}
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [adminUser, setAdminUser] = useState(null);

  const handleLogin = (isTeacher) => {
    setUser({ role: isTeacher ? 'teacher' : 'student' });
  };

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ logout: () => setUser(null) }}>
      <Routes>
        <Route
          path="/admin"
          element={
            adminUser
              ? <Navigate to="/admin/panel" replace />
              : <AdminLogin onLogin={(role) => setAdminUser({ role })} />
          }
        />
        <Route
          path="/admin/panel"
          element={
            adminUser
              ? <AdminPanel admin={adminUser} onLogout={() => setAdminUser(null)} />
              : <Navigate to="/admin" replace />
          }
        />
        <Route
          path="/login"
          element={
            user
              ? <Navigate to={user.role === 'teacher' ? '/dashboard' : '/courses'} replace />
              : <Login onLogin={handleLogin} />
          }
        />
        <Route
          path="/courses"
          element={
            !user
              ? <Navigate to="/login" replace />
              : user.role === 'teacher'
                ? <Navigate to="/dashboard" replace />
                : <MyCourses />
          }
        />
        <Route
          path="/*"
          element={
            user
              ? <AppShell user={user} onLogout={() => setUser(null)} />
              : <Navigate to="/login" replace />
          }
        />
      </Routes>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
