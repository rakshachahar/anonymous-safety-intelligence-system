import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Heatmap from './pages/Heatmap';
import SOS from './pages/SOS';
import Admin from './pages/Admin';
import Report from './pages/Report';
import Settings from './pages/Settings';
import Help from './pages/Help';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page - standalone */}
        <Route path="/" element={<Landing />} />

        {/* App pages - with sidebar layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/heatmap" element={<Heatmap />} />
          <Route path="/sos" element={<SOS />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/report" element={<Report />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
