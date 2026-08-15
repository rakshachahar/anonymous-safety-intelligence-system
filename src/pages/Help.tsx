import { motion } from 'framer-motion';
import {
  HelpCircle,
  ShieldAlert,
  MapPin,
  AlertTriangle,
  MessageSquare,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const faqs = [
  {
    q: 'Is my identity anonymous?',
    a: 'SafeVoice is designed to allow safety reports without requiring personal information in the report itself. Location is only used when provided by the user.',
  },
  {
    q: 'How does the safety analysis work?',
    a: 'SafeVoice uses stored safety reports, their categories, severity, and locations to present safety information and identify patterns in reported incidents.',
  },
  {
    q: 'What happens when I press SOS?',
    a: 'An SOS event is recorded with the available location and the configured trusted-contact count. A short countdown gives you time to cancel an accidental trigger.',
  },
  {
    q: 'How does the heatmap work?',
    a: 'The heatmap uses reports that contain valid geographic coordinates. Reports without coordinates can still appear elsewhere in the application but cannot be accurately placed on the map.',
  },
  {
    q: 'Can I manage trusted contacts?',
    a: 'Trusted contacts can be viewed and managed from the SOS section of SafeVoice.',
  },
  {
    q: 'Who can moderate reports?',
    a: 'Report moderation is restricted to authenticated administrators. Anonymous users can submit reports but cannot verify or modify them.',
  },
];

export default function Help() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const navigate = useNavigate();

  const quickLinks = [
    {
      icon: ShieldAlert,
      label: 'Report an Incident',
      desc: 'Submit an anonymous safety report',
      link: '/report',
    },
    {
      icon: MapPin,
      label: 'View Heatmap',
      desc: 'View reports with available coordinates',
      link: '/heatmap',
    },
    {
      icon: AlertTriangle,
      label: 'Emergency SOS',
      desc: 'Record an emergency alert',
      link: '/sos',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1
          className="text-2xl font-bold text-slate-100 tracking-tight"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Help & <span className="gradient-text">Support</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Learn how SafeVoice works
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {quickLinks.map((item, i) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -3 }}
            onClick={() => navigate(item.link)}
            className="glass-card glass-card-hover p-5 text-left"
          >
            <item.icon className="w-6 h-6 text-violet-400 mb-3" />
            <h3 className="text-sm font-semibold text-slate-200">
              {item.label}
            </h3>
            <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-5 h-5 text-violet-400" />
          <h2 className="text-base font-semibold text-slate-200">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={faq.q} className="rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-violet-500/5 transition-colors"
              >
                <span className="text-sm font-medium text-slate-200 flex-1">
                  {faq.q}
                </span>

                <ChevronDown
                  className={`w-4 h-4 text-slate-500 transition-transform ${
                    openFaq === i ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openFaq === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="px-4 pb-4"
                >
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-pink-400" />
          <h2 className="text-base font-semibold text-slate-200">
            SafeVoice
          </h2>
        </div>

        <p className="text-sm text-slate-400 leading-relaxed">
          SafeVoice provides anonymous reporting, location-based safety
          visualization, emergency SOS recording, and administrator
          moderation for community safety intelligence.
        </p>
      </div>
    </div>
  );
}