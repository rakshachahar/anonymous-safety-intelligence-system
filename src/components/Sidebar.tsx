import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Map,
  AlertTriangle,
  Shield,
  UserPlus,
  Settings,
  HelpCircle,
  LogOut,
  X,
  ShieldAlert,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const navLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Map, label: 'Heatmap', path: '/heatmap' },
  { icon: AlertTriangle, label: 'SOS', path: '/sos' },
  { icon: Shield, label: 'Admin', path: '/admin' },
  { icon: UserPlus, label: 'Report', path: '/report' },
];

const bottomLinks = [
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: HelpCircle, label: 'Help', path: '/help' },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return;
    }

    onClose();
    navigate('/');
  };

  const goToSettings = () => {
    navigate('/settings');
    onClose();
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'rgba(7, 2, 15, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(139, 92, 246, 0.1)',
        }}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-violet-500/10">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
              }}
            >
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>

            <div>
              <span
                className="text-lg font-bold tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <span className="gradient-text">SafeVoice</span>
              </span>

              <p className="text-[10px] text-violet-400/60 -mt-0.5 tracking-widest uppercase">
                Intelligence
              </p>
            </div>
          </div>

          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-violet-500/10"
            onClick={onClose}
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-violet-400/40">
            Navigation
          </p>

          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;

            return (
              <motion.button
                key={link.label}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  navigate(link.path);
                  onClose();
                }}
                className={`sidebar-link w-full text-left ${
                  isActive ? 'active' : 'text-slate-400'
                }`}
              >
                <link.icon
                  className={`w-[18px] h-[18px] ${
                    isActive ? 'text-violet-400' : ''
                  }`}
                />

                {link.label}

                {link.label === 'SOS' && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-rose-500 glow-pink" />
                )}
              </motion.button>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-violet-500/10 space-y-1">
          {bottomLinks.map((link) => (
            <motion.button
              key={link.label}
              whileHover={{ x: 4 }}
              onClick={() => {
                navigate(link.path);
                onClose();
              }}
              className={`sidebar-link w-full text-left ${
                location.pathname === link.path
                  ? 'active'
                  : 'text-slate-500'
              }`}
            >
              <link.icon className="w-[18px] h-[18px]" />
              {link.label}
            </motion.button>
          ))}

          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="sidebar-link w-full text-left text-slate-500"
          >
            <LogOut className="w-[18px] h-[18px]" />
            Log Out
          </motion.button>
        </div>

        <button
          onClick={goToSettings}
          className="w-full px-4 py-4 border-t border-violet-500/10 text-left hover:bg-violet-500/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
              }}
            >
              A
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">
                Anonymous User
              </p>

              <p className="text-xs text-slate-500 truncate">
                Protected Identity
              </p>
            </div>

            <Settings className="w-4 h-4 text-slate-600" />
          </div>
        </button>
      </aside>
    </>
  );
}