import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, ShieldAlert } from 'lucide-react';
import Sidebar from './Sidebar';
import GradientOrbs from './GradientOrbs';
import Particles from './Particles';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#07020F] flex relative">
      <GradientOrbs />
      <Particles count={30} />

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <header
          className="h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30"
          style={{
            background: 'rgba(7, 2, 15, 0.8)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
          }}
        >
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-violet-500/10 transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5 text-slate-400" />
          </button>

          <div className="hidden lg:block">
            <p className="text-sm text-slate-500">
              Safety Intelligence Platform
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/sos')}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
            style={{
              background: 'linear-gradient(135deg, #EC4899, #F43F5E)',
              boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)',
            }}
          >
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              SOS
            </span>
          </motion.button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}