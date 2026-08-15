import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Heatmap from './pages/Heatmap';
import SOS from './pages/SOS';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import Report from './pages/Report';
import Settings from './pages/Settings';
import Help from './pages/Help';
import { supabase } from './lib/supabase';

const ADMIN_EMAIL = 'admin.safevoice@gmail.com';

function ProtectedAdmin() {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      const { data } = await supabase.auth.getSession();
      const email = data.session?.user?.email?.toLowerCase();

      setIsAdmin(email === ADMIN_EMAIL);
      setChecking(false);
    }

    checkAdmin();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const email = session?.user?.email?.toLowerCase();
      setIsAdmin(email === ADMIN_EMAIL);
      setChecking(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        Checking authentication...
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  return <Admin />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/admin-login" element={<AdminLogin />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/heatmap" element={<Heatmap />} />
          <Route path="/sos" element={<SOS />} />
          <Route path="/admin" element={<ProtectedAdmin />} />
          <Route path="/report" element={<Report />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;