import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  MapPin,
  Shield,
  Eye,
  Zap,
  ArrowRight,
  Heart,
} from 'lucide-react';
import Particles from '../components/Particles';
import GradientOrbs from '../components/GradientOrbs';

const features = [
  {
    icon: Eye,
    title: 'Anonymous Reporting',
    desc: 'Submit safety reports without attaching personal information to the report.',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: MapPin,
    title: 'Safety Heatmap',
    desc: 'Visualize reported incidents that contain valid geographic coordinates.',
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    icon: ShieldAlert,
    title: 'Emergency SOS',
    desc: 'Record an emergency event with available location information.',
    gradient: 'from-rose-500 to-red-600',
  },
  {
    icon: Zap,
    title: 'Safety Intelligence',
    desc: 'Turn stored incident data into useful community safety information.',
    gradient: 'from-blue-500 to-violet-600',
  },
  {
    icon: Shield,
    title: 'Admin Moderation',
    desc: 'Authenticated administrators can review and verify submitted reports.',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Heart,
    title: 'Community Safety',
    desc: 'Create a shared view of safety conditions through anonymous reports.',
    gradient: 'from-amber-500 to-orange-600',
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#07020F] relative overflow-hidden">
      <GradientOrbs />
      <Particles count={60} />

      <nav className="relative z-20 flex items-center justify-between px-6 lg:px-16 py-5">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
            }}
          >
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>

          <div>
            <span
              className="text-xl font-bold tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <span className="gradient-text">SafeVoice</span>
            </span>

            <p className="text-[10px] text-violet-400/60 -mt-0.5 tracking-widest uppercase">
              Intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-slate-400 hover:text-violet-300 transition-colors hidden sm:block"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate('/heatmap')}
            className="text-sm text-slate-400 hover:text-violet-300 transition-colors hidden sm:block"
          >
            Heatmap
          </button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/report')}
            className="btn-primary text-white"
          >
            Get Started
          </motion.button>
        </div>
      </nav>

      <section className="relative z-10 px-6 lg:px-16 pt-16 lg:pt-24 pb-20">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
              style={{
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
              }}
            >
              <span
                className="w-2 h-2 rounded-full bg-emerald-400"
                style={{
                  boxShadow: '0 0 8px rgba(52,211,153,0.5)',
                }}
              />

              <span className="text-xs font-medium text-violet-300">
                Community Safety Intelligence Platform
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Turning anonymous
            <br />
            <span className="gradient-text">voices</span> into visible
            <br />
            safety <span className="gradient-text">insights</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            SafeVoice transforms anonymous safety reports into structured,
            location-aware community safety information.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/report')}
              className="btn-primary text-white flex items-center gap-2"
            >
              Report Anonymously
              <ShieldAlert className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/heatmap')}
              className="btn-secondary flex items-center gap-2"
            >
              View Heatmap
              <MapPin className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="flex justify-center mt-16"
        >
          <div className="relative w-64 h-64 lg:w-80 lg:h-80">
            <div
              className="absolute inset-0 rounded-full opacity-20"
              style={{
                background:
                  'radial-gradient(circle, #8B5CF6, transparent 70%)',
              }}
            />

            <div
              className="absolute inset-4 rounded-full opacity-30"
              style={{
                background:
                  'radial-gradient(circle, #EC4899, transparent 70%)',
              }}
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <ShieldAlert className="w-24 h-24 text-violet-400/40" />
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 px-6 lg:px-16 py-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl lg:text-4xl font-bold tracking-tight mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Built around <span className="gradient-text">real workflows</span>
            </h2>

            <p className="text-slate-400 max-w-xl mx-auto">
              Report incidents, visualize available location data, trigger
              emergency events, and moderate reports through a protected admin
              workflow.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-card glass-card-hover p-6"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${feature.gradient} opacity-80`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-lg font-semibold text-slate-200 mb-2">
                  {feature.title}
                </h3>

                <p className="text-sm text-slate-500 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 lg:px-16 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center glass-card p-12"
          style={{
            background:
              'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(236,72,153,0.05))',
            border: '1px solid rgba(139,92,246,0.2)',
          }}
        >
          <h2
            className="text-3xl lg:text-4xl font-bold tracking-tight mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Make safety data <span className="gradient-text">useful</span>
          </h2>

          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            Every anonymous report contributes structured information that can
            help communities understand local safety conditions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/report')}
              className="btn-primary text-white flex items-center gap-2"
            >
              Report Now
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
            >
              View Dashboard
            </motion.button>
          </div>
        </motion.div>
      </section>

      <footer className="relative z-10 px-6 lg:px-16 py-8 border-t border-violet-500/10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            SafeVoice Intelligence
          </p>

          <p className="text-xs text-slate-600">
            Anonymous community safety reporting
          </p>
        </div>
      </footer>
    </div>
  );
}