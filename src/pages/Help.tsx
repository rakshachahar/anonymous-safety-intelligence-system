import { motion } from 'framer-motion';
import {
  HelpCircle,
  ShieldAlert,
  MapPin,
  AlertTriangle,
  MessageSquare,
  Phone,
  Mail,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    q: 'Is my identity really anonymous?',
    a: 'Yes, absolutely. All reports are submitted without any personal identifiers. Your location is only shared if you explicitly choose to. We use end-to-end encryption and never store personal data with reports.',
  },
  {
    q: 'How does the AI risk scoring work?',
    a: 'Our AI analyzes multiple factors including report severity, location patterns, time of day, and historical data to generate a risk score. Higher scores indicate areas that need immediate attention from authorities.',
  },
  {
    q: 'What happens when I press the SOS button?',
    a: 'The SOS button sends your live location and an emergency alert to all your trusted contacts and emergency services. A countdown gives you time to cancel if pressed accidentally.',
  },
  {
    q: 'How is the heatmap data generated?',
    a: 'The heatmap aggregates anonymous report data, AI risk scores, and community-verified safe zones to create a real-time visualization of safety conditions across different areas.',
  },
  {
    q: 'Can I add or remove trusted contacts?',
    a: 'Yes, you can manage your trusted contacts list from the SOS page. Add family, friends, or any emergency contacts who will be notified when you trigger an SOS alert.',
  },
  {
    q: 'How do authorities use this data?',
    a: 'Aggregated, anonymized data is shared with law enforcement and safety organizations to help them allocate resources, deploy patrols, and identify areas needing safety infrastructure improvements.',
  },
];

export default function Help() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Help & <span className="gradient-text">Support</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">Everything you need to know about SafeVoice Intelligence</p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: ShieldAlert, label: 'Report an Incident', desc: 'Submit an anonymous safety report', link: '/report' },
          { icon: MapPin, label: 'View Heatmap', desc: 'Check safety conditions in your area', link: '/heatmap' },
          { icon: AlertTriangle, label: 'Emergency SOS', desc: 'Send an emergency alert now', link: '/sos' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -3 }}
            className="glass-card glass-card-hover p-5 cursor-pointer"
            onClick={() => window.location.href = item.link}
          >
            <item.icon className="w-6 h-6 text-violet-400 mb-3" />
            <h3 className="text-sm font-semibold text-slate-200">{item.label}</h3>
            <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-5 h-5 text-violet-400" />
          <h2 className="text-base font-semibold text-slate-200">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-violet-500/5 transition-colors"
              >
                <span className="text-sm font-medium text-slate-200 flex-1">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="px-4 pb-4"
                >
                  <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Contact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="w-5 h-5 text-pink-400" />
          <h2 className="text-base font-semibold text-slate-200">Contact Us</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: Phone, label: 'Women Helpline', value: '1091', desc: '24/7 emergency support' },
            { icon: Phone, label: 'Police', value: '100', desc: 'Emergency services' },
            { icon: Mail, label: 'Email Support', value: 'help@safevoice.io', desc: 'Non-urgent inquiries' },
          ].map((contact) => (
            <div key={contact.label} className="p-4 rounded-xl" style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.1)' }}>
              <contact.icon className="w-5 h-5 text-violet-400 mb-2" />
              <p className="text-sm font-medium text-slate-200">{contact.label}</p>
              <p className="text-xs text-violet-300 mt-0.5">{contact.value}</p>
              <p className="text-[10px] text-slate-500 mt-1">{contact.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
