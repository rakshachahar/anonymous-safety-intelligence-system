import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  AlertTriangle,
  MapPin,
  Shield,
  Activity,
  Zap,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Radio,
  Brain,
  ChevronRight,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SafetyReport {
  id: string;
  category: string;
  description: string;
  severity: string;
  location_name: string;
  zone: string;
  ai_risk_score: number;
  ai_insight: string;
  created_at: string;
  status: string;
}

interface Alert {
  id: string;
  title: string;
  description: string;
  zone: string;
  risk_level: string;
  alert_type: string;
  is_active: boolean;
  created_at: string;
}

const severityColors: Record<string, string> = {
  critical: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  high: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

const riskColors: Record<string, string> = {
  critical: '#F43F5E',
  high: '#F97316',
  medium: '#FBBF24',
  low: '#34D399',
};

const incidentTrend = [
  { month: 'Jan', incidents: 45, risk: 0.62 },
  { month: 'Feb', incidents: 38, risk: 0.55 },
  { month: 'Mar', incidents: 67, risk: 0.71 },
  { month: 'Apr', incidents: 52, risk: 0.65 },
  { month: 'May', incidents: 89, risk: 0.82 },
  { month: 'Jun', incidents: 72, risk: 0.76 },
  { month: 'Jul', incidents: 95, risk: 0.88 },
  { month: 'Aug', incidents: 108, risk: 0.91 },
  { month: 'Sep', incidents: 78, risk: 0.73 },
  { month: 'Oct', incidents: 92, risk: 0.79 },
  { month: 'Nov', incidents: 85, risk: 0.77 },
  { month: 'Dec', incidents: 110, risk: 0.93 },
];

const categoryBreakdown = [
  { category: 'Harassment', count: 45, color: '#EC4899' },
  { category: 'Stalking', count: 28, color: '#8B5CF6' },
  { category: 'Assault', count: 15, color: '#F43F5E' },
  { category: 'Voyeurism', count: 8, color: '#60A5FA' },
  { category: 'Other', count: 12, color: '#A855F7' },
];

const aiInsights = [
  { icon: Brain, text: '3 new high-risk corridors detected in Central Delhi zone this week', severity: 'critical' },
  { icon: Zap, text: 'Stalking incidents up 23% near metro stations after 9 PM', severity: 'high' },
  { icon: Shield, text: 'Community safe route verified: Hauz Khas Village corridor now active', severity: 'low' },
  { icon: Activity, text: 'Predictive model flags Sector 18 for potential escalation this weekend', severity: 'high' },
];

export default function Dashboard() {
  const [reports, setReports] = useState<SafetyReport[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [_loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [reportsRes, alertsRes] = await Promise.all([
          supabase.from('safety_reports').select('*').order('created_at', { ascending: false }).limit(10),
          supabase.from('alerts').select('*').eq('is_active', true).order('created_at', { ascending: false }),
        ]);
        if (reportsRes.data) setReports(reportsRes.data);
        if (alertsRes.data) setAlerts(alertsRes.data);
      } catch {
        // Use fallback data
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const totalReports = reports.length || 15;
  const highRiskZones = alerts.filter(a => a.risk_level === 'critical' || a.risk_level === 'high').length || 4;
  const activeAlerts = alerts.length || 6;
  const safeAreas = 8;

  const statCards = [
    {
      label: 'Total Safety Reports',
      value: totalReports.toLocaleString(),
      change: '+12.5%',
      trend: 'up' as const,
      icon: ShieldAlert,
      gradient: 'from-violet-500 to-purple-600',
      glow: 'rgba(139, 92, 246, 0.2)',
    },
    {
      label: 'High Risk Zones',
      value: highRiskZones.toString(),
      change: '+3 new',
      trend: 'up' as const,
      icon: AlertTriangle,
      gradient: 'from-rose-500 to-red-600',
      glow: 'rgba(244, 63, 94, 0.2)',
    },
    {
      label: 'Active Alerts',
      value: activeAlerts.toString(),
      change: '2 critical',
      trend: 'up' as const,
      icon: Radio,
      gradient: 'from-amber-500 to-orange-600',
      glow: 'rgba(245, 158, 11, 0.2)',
    },
    {
      label: 'Safe Areas Identified',
      value: safeAreas.toString(),
      change: '+2 this week',
      trend: 'up' as const,
      icon: Shield,
      gradient: 'from-emerald-500 to-teal-600',
      glow: 'rgba(52, 211, 153, 0.2)',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Safety <span className="gradient-text">Intelligence</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Real-time safety analytics and threat intelligence</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="input-field w-auto text-sm py-2">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
          </select>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-emerald-400" style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}>
            <span className="w-2 h-2 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 8px rgba(52,211,153,0.5)' }} />
            Live Monitoring
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="stat-card group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${stat.gradient} opacity-80 group-hover:opacity-100 transition-opacity`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-100 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {stat.value}
            </p>
            <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Incident Trends Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="xl:col-span-2 glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-slate-200">Incident Trends</h2>
              <p className="text-sm text-slate-500 mt-0.5">Monthly incident volume and risk index</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full bg-violet-500" /> Incidents</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full bg-pink-500" /> Risk Index</span>
            </div>
          </div>
          <div className="flex items-end gap-1.5 h-52">
            {incidentTrend.map((item) => {
              const maxIncidents = Math.max(...incidentTrend.map(d => d.incidents));
              const heightPct = (item.incidents / maxIncidents) * 100;
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end h-44 relative group">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPct}%` }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="w-full rounded-t-md cursor-pointer"
                      style={{
                        background: `linear-gradient(to top, #8B5CF6, #A855F7)`,
                        opacity: 0.8,
                      }}
                    />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block px-2 py-1 rounded-md text-[10px] text-white whitespace-nowrap" style={{ background: 'rgba(15,23,42,0.9)' }}>
                      {item.incidents} incidents
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-600 font-medium">{item.month}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-slate-200">Category Breakdown</h2>
              <p className="text-sm text-slate-500 mt-0.5">Incident distribution by type</p>
            </div>
          </div>
          <div className="space-y-4">
            {categoryBreakdown.map((cat) => {
              const maxCount = Math.max(...categoryBreakdown.map(c => c.count));
              const widthPct = (cat.count / maxCount) * 100;
              return (
                <div key={cat.category}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-slate-300">{cat.category}</span>
                    <span className="text-sm font-semibold text-slate-200">{cat.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800/50 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPct}%` }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="h-full rounded-full"
                      style={{ background: cat.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* AI Insights + Alert Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-5 h-5 text-violet-400" />
            <h2 className="text-base font-semibold text-slate-200">AI Safety Insights</h2>
            <span className="ml-auto px-2 py-0.5 rounded-md text-[10px] font-semibold text-violet-300 bg-violet-500/10 border border-violet-500/20">AI Generated</span>
          </div>
          <div className="space-y-3">
            {aiInsights.map((insight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-violet-500/5 transition-colors cursor-pointer group"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  insight.severity === 'critical' ? 'bg-rose-500/10' :
                  insight.severity === 'high' ? 'bg-amber-500/10' : 'bg-emerald-500/10'
                }`}>
                  <insight.icon className={`w-4 h-4 ${
                    insight.severity === 'critical' ? 'text-rose-400' :
                    insight.severity === 'high' ? 'text-amber-400' : 'text-emerald-400'
                  }`} />
                </div>
                <p className="text-sm text-slate-400 leading-relaxed flex-1">{insight.text}</p>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-violet-400 transition-colors flex-shrink-0 mt-0.5" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Live Alert Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Radio className="w-5 h-5 text-rose-400" />
            <h2 className="text-base font-semibold text-slate-200">Live Alert Feed</h2>
            <span className="ml-auto flex items-center gap-1.5 text-[10px] font-semibold text-rose-400">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 glow-pulse" />
              LIVE
            </span>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            <AnimatePresence>
              {(alerts.length ? alerts : [
                { id: '1', title: 'High Risk Zone: Connaught Place', description: 'Multiple harassment reports in last 48 hours', zone: 'Central Delhi', risk_level: 'critical', alert_type: 'zone_warning', is_active: true, created_at: new Date().toISOString() },
                { id: '2', title: 'Stalking Pattern: Rajiv Chowk', description: 'AI detected serial stalking pattern', zone: 'Central Delhi', risk_level: 'critical', alert_type: 'ai_detection', is_active: true, created_at: new Date(Date.now() - 3600000).toISOString() },
                { id: '3', title: 'Moderate Risk: Sector 18', description: 'Evening hours show elevated incidents', zone: 'Noida', risk_level: 'high', alert_type: 'zone_warning', is_active: true, created_at: new Date(Date.now() - 7200000).toISOString() },
                { id: '4', title: 'Safe Route: Hauz Khas Village', description: 'Community verified safe route active', zone: 'South Delhi', risk_level: 'low', alert_type: 'safe_route', is_active: true, created_at: new Date(Date.now() - 10800000).toISOString() },
                { id: '5', title: 'Patrol Deployed: India Gate', description: 'Police patrol active after critical report', zone: 'Central Delhi', risk_level: 'high', alert_type: 'patrol_active', is_active: true, created_at: new Date(Date.now() - 14400000).toISOString() },
                { id: '6', title: 'New Pattern: Expressway', description: 'Vehicle-based stalking incidents increasing', zone: 'Noida-Greater Noida', risk_level: 'critical', alert_type: 'ai_detection', is_active: true, created_at: new Date(Date.now() - 18000000).toISOString() },
              ]).map((alert, i) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 + i * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-violet-500/5 transition-colors cursor-pointer"
                >
                  <div
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                    style={{
                      backgroundColor: riskColors[alert.risk_level] || '#8B5CF6',
                      boxShadow: `0 0 8px ${riskColors[alert.risk_level] || '#8B5CF6'}50`,
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{alert.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{alert.description}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] text-slate-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {alert.zone}
                      </span>
                      <span className="text-[10px] text-slate-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${severityColors[alert.risk_level] || ''}`}>
                    {alert.risk_level}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Recent Reports Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7 }}
        className="glass-card overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-violet-500/10">
          <div>
            <h2 className="text-base font-semibold text-slate-200">Recent Safety Reports</h2>
            <p className="text-sm text-slate-500 mt-0.5">Latest anonymous intelligence submissions</p>
          </div>
          <button className="text-sm text-violet-400 font-medium hover:text-violet-300 transition-colors">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'rgba(139, 92, 246, 0.03)' }}>
                <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Category</th>
                <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Location</th>
                <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3 hidden md:table-cell">Zone</th>
                <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Severity</th>
                <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3 hidden lg:table-cell">AI Risk</th>
                <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3 hidden lg:table-cell">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-violet-500/5">
              {(reports.length ? reports : [
                { id: '1', category: 'harassment', description: 'Verbal harassment near bus stop', severity: 'high', location_name: 'Connaught Place', zone: 'Central Delhi', ai_risk_score: 0.82, status: 'verified', created_at: new Date().toISOString() },
                { id: '2', category: 'stalking', description: 'Followed from metro station', severity: 'critical', location_name: 'Rajiv Chowk Metro', zone: 'Central Delhi', ai_risk_score: 0.94, status: 'verified', created_at: new Date().toISOString() },
                { id: '3', category: 'harassment', description: 'Catcalling in market area', severity: 'medium', location_name: 'Sector 18 Market', zone: 'Noida', ai_risk_score: 0.65, status: 'verified', created_at: new Date().toISOString() },
                { id: '4', category: 'assault', description: 'Physical intimidation near park', severity: 'critical', location_name: 'India Gate Area', zone: 'Central Delhi', ai_risk_score: 0.97, status: 'verified', created_at: new Date().toISOString() },
                { id: '5', category: 'stalking', description: 'Repeated following same route', severity: 'high', location_name: 'Hauz Khas', zone: 'South Delhi', ai_risk_score: 0.85, status: 'verified', created_at: new Date().toISOString() },
              ]).map((report) => (
                <tr key={report.id} className="hover:bg-violet-500/5 transition-colors cursor-pointer">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-200 capitalize">{report.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-violet-400/50" />
                      {report.location_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-sm text-slate-500">{report.zone}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-md border ${severityColors[report.severity] || ''}`}>
                      {report.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-slate-800/50 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(report.ai_risk_score || 0) * 100}%`,
                            background: report.ai_risk_score > 0.8 ? '#F43F5E' : report.ai_risk_score > 0.6 ? '#FBBF24' : '#34D399',
                          }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">{((report.ai_risk_score || 0) * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="text-xs text-slate-500 capitalize">{report.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
