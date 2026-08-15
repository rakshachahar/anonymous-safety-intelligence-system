import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  MapPin,
  Users,
  Shield,
  CheckCircle,
  Volume2,
  Send,
  Plus,
  Trash2,
  Heart,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  is_primary: boolean;
}

const defaultContacts: Contact[] = [
  {
    id: '1',
    name: 'Emergency Services',
    phone: '100',
    relationship: 'Police',
    is_primary: true,
  },
  {
    id: '2',
    name: 'Women Helpline',
    phone: '1091',
    relationship: 'Helpline',
    is_primary: true,
  },
  {
    id: '3',
    name: 'Mom',
    phone: '+91-98765-43210',
    relationship: 'Family',
    is_primary: false,
  },
  {
    id: '4',
    name: 'Priya (Friend)',
    phone: '+91-91234-56789',
    relationship: 'Friend',
    is_primary: false,
  },
];

export default function SOS() {
  const [sosActive, setSosActive] = useState(false);
  const [sosSent, setSosSent] = useState(false);
  const [sosError, setSosError] = useState('');
  const [contacts, setContacts] = useState<Contact[]>(defaultContacts);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relationship: '',
  });
  const [countdown, setCountdown] = useState<number | null>(null);
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          setLocation({
            lat: 28.6139,
            lng: 77.209,
          });
        }
      );
    } else {
      setLocation({
        lat: 28.6139,
        lng: 77.209,
      });
    }
  }, []);

  useEffect(() => {
    async function fetchContacts() {
      try {
        const { data, error } = await supabase
          .from('trusted_contacts')
          .select('*')
          .limit(10);

        if (error) {
          console.error('Trusted contacts error:', error);
          return;
        }

        if (data?.length) {
          setContacts([
            ...defaultContacts,
            ...data.map((d) => ({
              ...d,
              is_primary: false,
            })),
          ]);
        }
      } catch (error) {
        console.error('Trusted contacts error:', error);
      }
    }

    fetchContacts();
  }, []);

  const handleSOSPress = () => {
    if (sosActive || sosSent) return;

    setSosError('');
    setSosActive(true);
    setCountdown(3);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          triggerSOS();
          return null;
        }

        return prev - 1;
      });
    }, 1000);
  };

  const triggerSOS = async () => {
    const latitude = location?.lat ?? 28.6139;
    const longitude = location?.lng ?? 77.209;

    try {
      const { error } = await supabase.from('sos_events').insert({
        user_id: null,
        latitude,
        longitude,
        location_name: 'Current Location',
        status: 'active',
        contacts_notified: contacts.length,
      });

      if (error) {
        console.error('SOS insert error:', error);
        setSosError(error.message);
        setSosActive(false);
        return;
      }

      setSosSent(true);
      setSosActive(false);
    } catch (error) {
      console.error('SOS error:', error);
      setSosError(
        error instanceof Error
          ? error.message
          : 'Failed to send SOS alert.'
      );
      setSosActive(false);
    }
  };

  const handleCancel = () => {
    setSosActive(false);
    setCountdown(null);
  };

  const handleReset = () => {
    setSosSent(false);
    setSosActive(false);
    setCountdown(null);
    setSosError('');
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) return;

    const contact: Contact = {
      id: Date.now().toString(),
      name: newContact.name,
      phone: newContact.phone,
      relationship: newContact.relationship || 'Friend',
      is_primary: false,
    };

    setContacts([...contacts, contact]);
    setNewContact({
      name: '',
      phone: '',
      relationship: '',
    });
    setShowAddContact(false);
  };

  const handleRemoveContact = (id: string) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center">
        <h1
          className="text-2xl font-bold text-slate-100 tracking-tight"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Emergency <span className="gradient-text">SOS</span>
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          One tap to alert your trusted contacts and emergency services
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-12 flex flex-col items-center justify-center"
        style={{
          background: sosActive
            ? 'linear-gradient(135deg, rgba(244,63,94,0.15), rgba(236,72,153,0.1))'
            : sosSent
            ? 'linear-gradient(135deg, rgba(52,211,153,0.1), rgba(16,185,129,0.05))'
            : undefined,
          border: sosActive
            ? '1px solid rgba(244,63,94,0.3)'
            : sosSent
            ? '1px solid rgba(52,211,153,0.2)'
            : undefined,
        }}
      >
        <AnimatePresence mode="wait">
          {!sosSent ? (
            <motion.div
              key="button"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center"
            >
              {sosActive && (
                <>
                  <div className="absolute w-48 h-48 rounded-full border-2 border-rose-500/30 pulse-ring" />
                  <div
                    className="absolute w-56 h-56 rounded-full border border-rose-500/20 pulse-ring"
                    style={{ animationDelay: '0.5s' }}
                  />
                  <div
                    className="absolute w-64 h-64 rounded-full border border-rose-500/10 pulse-ring"
                    style={{ animationDelay: '1s' }}
                  />
                </>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSOSPress}
                className="relative w-40 h-40 rounded-full flex items-center justify-center text-white font-bold text-3xl tracking-wider transition-all"
                style={{
                  background: sosActive
                    ? 'linear-gradient(135deg, #F43F5E, #EC4899)'
                    : 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                  boxShadow: sosActive
                    ? '0 0 40px rgba(244,63,94,0.5), 0 0 80px rgba(236,72,153,0.3)'
                    : '0 0 30px rgba(139,92,246,0.3), 0 0 60px rgba(236,72,153,0.15)',
                }}
              >
                {countdown !== null ? (
                  <motion.span
                    key={countdown}
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-5xl"
                  >
                    {countdown}
                  </motion.span>
                ) : (
                  <span>SOS</span>
                )}
              </motion.button>

              {sosActive && countdown !== null && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleCancel}
                  className="mt-8 px-6 py-2.5 rounded-xl text-sm font-medium text-slate-300 transition-all"
                  style={{
                    background: 'rgba(15,23,42,0.6)',
                    border: '1px solid rgba(139,92,246,0.2)',
                  }}
                >
                  Cancel Alert
                </motion.button>
              )}

              {!sosActive && (
                <p className="mt-6 text-sm text-slate-500">
                  Press and hold to send emergency alert
                </p>
              )}

              {sosError && (
                <p className="mt-4 max-w-md text-center text-xs text-rose-400">
                  SOS could not be saved: {sosError}
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="sent"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(52,211,153,0.2), rgba(16,185,129,0.1))',
                  border: '2px solid rgba(52,211,153,0.3)',
                }}
              >
                <CheckCircle className="w-12 h-12 text-emerald-400" />
              </motion.div>

              <h2 className="text-xl font-bold text-emerald-400 mb-2">
                SOS Alert Sent
              </h2>

              <p className="text-sm text-slate-400 text-center max-w-sm">
                Emergency alert has been recorded for {contacts.length} contacts.
              </p>

              <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
                <MapPin className="w-3 h-3 text-violet-400" />
                Location shared:{' '}
                {location
                  ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
                  : 'Acquiring...'}
              </div>

              <button
                onClick={handleReset}
                className="mt-6 px-6 py-2.5 rounded-xl text-sm font-medium text-slate-300 transition-all"
                style={{
                  background: 'rgba(15,23,42,0.6)',
                  border: '1px solid rgba(139,92,246,0.2)',
                }}
              >
                Reset SOS
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            icon: Phone,
            label: 'Call 100',
            color: 'from-rose-500 to-red-600',
            action: () => window.open('tel:100'),
          },
          {
            icon: Phone,
            label: 'Women Helpline',
            color: 'from-pink-500 to-rose-600',
            action: () => window.open('tel:1091'),
          },
          {
            icon: Volume2,
            label: 'Alarm Sound',
            color: 'from-amber-500 to-orange-600',
            action: () => {},
          },
          {
            icon: Send,
            label: 'Share Location',
            color: 'from-violet-500 to-purple-600',
            action: () => {},
          },
        ].map((action) => (
          <motion.button
            key={action.label}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={action.action}
            className="glass-card glass-card-hover p-4 flex flex-col items-center gap-2 text-center"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${action.color} opacity-80`}
            >
              <action.icon className="w-5 h-5 text-white" />
            </div>

            <span className="text-xs font-medium text-slate-300">
              {action.label}
            </span>
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-violet-400" />
            <h2 className="text-base font-semibold text-slate-200">
              Trusted Contacts
            </h2>
            <span className="text-xs text-slate-500">
              ({contacts.length})
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddContact(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-violet-300 transition-all"
            style={{
              background: 'rgba(139,92,246,0.1)',
              border: '1px solid rgba(139,92,246,0.2)',
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Contact
          </motion.button>
        </div>

        <AnimatePresence>
          {showAddContact && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 rounded-xl overflow-hidden"
              style={{
                background: 'rgba(139,92,246,0.05)',
                border: '1px solid rgba(139,92,246,0.15)',
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={newContact.name}
                  onChange={(e) =>
                    setNewContact({
                      ...newContact,
                      name: e.target.value,
                    })
                  }
                  className="input-field"
                />

                <input
                  type="tel"
                  placeholder="Phone number"
                  value={newContact.phone}
                  onChange={(e) =>
                    setNewContact({
                      ...newContact,
                      phone: e.target.value,
                    })
                  }
                  className="input-field"
                />

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Relationship"
                    value={newContact.relationship}
                    onChange={(e) =>
                      setNewContact({
                        ...newContact,
                        relationship: e.target.value,
                      })
                    }
                    className="input-field flex-1"
                  />

                  <button
                    onClick={handleAddContact}
                    className="btn-primary text-white px-4 text-xs"
                  >
                    Add
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          {contacts.map((contact, i) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-violet-500/5 transition-colors group"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                style={{
                  background: contact.is_primary
                    ? 'linear-gradient(135deg, #F43F5E, #EC4899)'
                    : 'linear-gradient(135deg, #8B5CF6, #A855F7)',
                }}
              >
                {contact.name.charAt(0)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">
                  {contact.name}
                </p>
                <p className="text-xs text-slate-500">
                  {contact.phone} - {contact.relationship}
                </p>
              </div>

              {contact.is_primary && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md text-rose-400 bg-rose-500/10 border border-rose-500/20">
                  Emergency
                </span>
              )}

              {!contact.is_primary && (
                <button
                  onClick={() => handleRemoveContact(contact.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-500/10 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-pink-400" />
          <h2 className="text-base font-semibold text-slate-200">
            Safety Tips
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            'Share your live location with trusted contacts when traveling alone',
            'Keep emergency numbers on speed dial',
            'Stay in well-lit areas and avoid shortcuts through isolated zones',
            'Trust your instincts - if something feels wrong, move to safety',
            'Use the SafeVoice heatmap to plan safer routes',
            'Report incidents anonymously to help the community',
          ].map((tip, i) => (
            <div
              key={i}
              className="flex items-start gap-2 p-3 rounded-xl"
              style={{ background: 'rgba(139,92,246,0.03)' }}
            >
              <Shield className="w-4 h-4 text-violet-400/60 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-400 leading-relaxed">
                {tip}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}