import { motion } from 'framer-motion';
import {
  Shield,
  Bell,
  MapPin,
  Volume2,
  Globe,
  ToggleLeft,
  ToggleRight,
  User,
  Mail,
  Save,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface SettingToggle {
  id: string;
  label: string;
  desc: string;
  enabled: boolean;
  icon: typeof Shield;
}

export default function Settings() {
  const [settings, setSettings] = useState<SettingToggle[]>([
    {
      id: 'location',
      label: 'Location Sharing',
      desc: 'Allow location to be used when submitting safety data',
      enabled: true,
      icon: MapPin,
    },
    {
      id: 'notifications',
      label: 'Safety Alerts',
      desc: 'Show safety alerts inside the application',
      enabled: true,
      icon: Bell,
    },
    {
      id: 'sound',
      label: 'Alert Sounds',
      desc: 'Allow application alert sounds',
      enabled: true,
      icon: Volume2,
    },
    {
      id: 'community',
      label: 'Community Updates',
      desc: 'Show community safety information',
      enabled: false,
      icon: Globe,
    },
  ]);

  const [userEmail, setUserEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        setIsAuthenticated(true);
        setUserEmail(data.user.email || '');
        setDisplayName(
          data.user.user_metadata?.display_name || ''
        );
      }
    }

    loadUser();
  }, []);

  const toggleSetting = (id: string) => {
    setSettings((current) =>
      current.map((setting) =>
        setting.id === id
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
  };

  const saveProfile = async () => {
    setSaving(true);
    setMessage('');

    const { error } = await supabase.auth.updateUser({
      data: {
        display_name: displayName.trim(),
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Profile updated successfully.');
    }

    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1
          className="text-2xl font-bold text-slate-100 tracking-tight"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <span className="gradient-text">Settings</span>
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Manage your account and application preferences
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-violet-400" />
          <h2 className="text-base font-semibold text-slate-200">
            Profile
          </h2>
        </div>

        {isAuthenticated ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-500 block mb-2">
                Email
              </label>

              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-violet-500/5 border border-violet-500/10">
                <Mail className="w-4 h-4 text-slate-500" />

                <span className="text-sm text-slate-300">
                  {userEmail || 'No email available'}
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 block mb-2">
                Display Name
              </label>

              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter display name"
                className="w-full px-4 py-3 rounded-xl text-sm bg-violet-500/5 border border-violet-500/10 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/30"
              />
            </div>

            <button
              onClick={saveProfile}
              disabled={saving}
              className="btn-primary text-white flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Profile'}
            </button>

            {message && (
              <p className="text-xs text-slate-400">
                {message}
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-xl p-4 bg-violet-500/5 border border-violet-500/10">
            <p className="text-sm font-medium text-slate-200">
              Anonymous User
            </p>

            <p className="text-xs text-slate-500 mt-1">
              No personal profile is maintained for anonymous users.
              Your safety reports remain separate from personal identity.
            </p>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-violet-400" />

          <h2 className="text-base font-semibold text-slate-200">
            Preferences
          </h2>
        </div>

        <div className="space-y-1">
          {settings.map((setting, i) => (
            <motion.button
              key={setting.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => toggleSetting(setting.id)}
              className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-violet-500/5 transition-colors text-left"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(139,92,246,0.1)' }}
              >
                <setting.icon className="w-4 h-4 text-violet-400" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-slate-200">
                  {setting.label}
                </p>

                <p className="text-xs text-slate-500">
                  {setting.desc}
                </p>
              </div>

              {setting.enabled ? (
                <ToggleRight className="w-6 h-6 text-violet-400" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-slate-600" />
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className="glass-card p-6">
        <h2 className="text-base font-semibold text-slate-200 mb-4">
          About SafeVoice
        </h2>

        <p className="text-sm text-slate-400 leading-relaxed">
          SafeVoice is a community safety intelligence platform for
          anonymous reporting, location-based safety visualization,
          emergency SOS events, and administrator moderation.
        </p>

        <div className="pt-4 mt-4 border-t border-violet-500/10 text-xs text-slate-600">
          Version 1.0.0
        </div>
      </div>
    </div>
  );
}