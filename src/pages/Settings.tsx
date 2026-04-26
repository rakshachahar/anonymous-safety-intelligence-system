import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Bell,
  Lock,
  Eye,
  MapPin,
  Volume2,
  Moon,
  Globe,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

interface SettingToggle {
  id: string;
  label: string;
  desc: string;
  enabled: boolean;
  icon: typeof Shield;
}

export default function Settings() {
  const [settings, setSettings] = useState<SettingToggle[]>([
    { id: 'anonymous', label: 'Anonymous Mode', desc: 'All reports are submitted anonymously by default', enabled: true, icon: Eye },
    { id: 'location', label: 'Location Sharing', desc: 'Share your location for more accurate safety data', enabled: true, icon: MapPin },
    { id: 'notifications', label: 'Safety Alerts', desc: 'Receive alerts about nearby high-risk zones', enabled: true, icon: Bell },
    { id: 'darkMode', label: 'Dark Mode', desc: 'Use dark theme for the interface', enabled: true, icon: Moon },
    { id: 'sound', label: 'Alert Sounds', desc: 'Play sound for emergency notifications', enabled: true, icon: Volume2 },
    { id: 'encryption', label: 'End-to-End Encryption', desc: 'Encrypt all data before transmission', enabled: true, icon: Lock },
    { id: 'community', label: 'Community Updates', desc: 'Receive community safety updates and tips', enabled: false, icon: Globe },
  ]);

  const toggleSetting = (id: string) => {
    setSettings(settings.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          <span className="gradient-text">Settings</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">Manage your privacy and safety preferences</p>
      </div>

      {/* Privacy section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-violet-400" />
          <h2 className="text-base font-semibold text-slate-200">Privacy & Security</h2>
        </div>
        <div className="space-y-1">
          {settings.slice(0, 4).map((setting, i) => (
            <motion.div
              key={setting.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-violet-500/5 transition-colors cursor-pointer"
              onClick={() => toggleSetting(setting.id)}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)' }}>
                <setting.icon className="w-4 h-4 text-violet-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-200">{setting.label}</p>
                <p className="text-xs text-slate-500">{setting.desc}</p>
              </div>
              {setting.enabled ? (
                <ToggleRight className="w-6 h-6 text-violet-400" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-slate-600" />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Notifications section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-pink-400" />
          <h2 className="text-base font-semibold text-slate-200">Notifications</h2>
        </div>
        <div className="space-y-1">
          {settings.slice(4).map((setting, i) => (
            <motion.div
              key={setting.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-violet-500/5 transition-colors cursor-pointer"
              onClick={() => toggleSetting(setting.id)}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(236,72,153,0.1)' }}>
                <setting.icon className="w-4 h-4 text-pink-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-200">{setting.label}</p>
                <p className="text-xs text-slate-500">{setting.desc}</p>
              </div>
              {setting.enabled ? (
                <ToggleRight className="w-6 h-6 text-pink-400" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-slate-600" />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* About */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <h2 className="text-base font-semibold text-slate-200 mb-4">About SafeVoice</h2>
        <div className="space-y-3 text-sm text-slate-400">
          <p>SafeVoice Intelligence is an AI-powered anonymous safety intelligence platform designed to protect communities through data-driven awareness.</p>
          <p>Every report is encrypted, anonymized, and analyzed by our AI system to identify threat patterns and protect vulnerable areas.</p>
          <div className="pt-3 border-t border-violet-500/10 flex items-center justify-between text-xs text-slate-600">
            <span>Version 1.0.0</span>
            <span>Built with care for community safety</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
