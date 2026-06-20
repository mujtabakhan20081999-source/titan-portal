import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Sidebar from './components/sidebar';
import Dashboard from './pages/Dashboard';
import Assignments from './pages/Assignments';

function AppShell({ onLogout }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar onLogout={onLogout} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/dashboard"   element={<Dashboard />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="*"            element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            loggedIn
              ? <Navigate to="/dashboard" replace />
              : <Login onLogin={() => setLoggedIn(true)} />
          }
        />
        <Route
          path="/*"
          element={
            loggedIn
              ? <AppShell onLogout={() => setLoggedIn(false)} />
              : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
