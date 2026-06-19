import Sidebar from './components/sidebar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TopBar />
        <Dashboard />
      </div>
    </div>
  );
}

export default App;