import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Sidebar from './components/sidebar';
import Dashboard from './pages/Dashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import Assignments from './pages/Assignments';
<<<<<<< HEAD
import Calendar from '../titan-dashboard/src/component/Calendar';
import Quiz from '../titan-dashboard/src/component/Quiz';
=======
>>>>>>> 2a3037c9ab570c8743747a95cfde52373daba90d

function AppShell({ user, onLogout }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar onLogout={onLogout} role={user.role} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route
            path="/dashboard"
            element={user.role === 'teacher' ? <TeacherDashboard /> : <Dashboard />}
          />
          <Route path="/assignments" element={<Assignments />} />
<<<<<<< HEAD
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/quizzes" element={<Quiz />} />
=======
>>>>>>> 2a3037c9ab570c8743747a95cfde52373daba90d
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (isTeacher) => {
    setUser({ role: isTeacher ? 'teacher' : 'student' });
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            user
              ? <Navigate to="/dashboard" replace />
              : <Login onLogin={handleLogin} />
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
    </BrowserRouter>
  );
}

export default App;
