import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  AlertTriangle,
  MapPin,
  Shield,
  Activity,
  Clock,
  ArrowUpRight,
  Radio,
  Brain,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SafetyReport {
  id: string;
  category: string;
  description: string;
  severity: string;
  location_name: string;
  zone: string;
  ai_risk_score: number | null;
  ai_insight: string | null;
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

interface SafeZone {
  id: string;
  name: string;
}

const severityStyles: Record<string, string> = {
  critical:
    'text-rose-400 bg-rose-500/10 border-rose-500/20',
  high:
    'text-orange-400 bg-orange-500/10 border-orange-500/20',
  medium:
    'text-amber-400 bg-amber-500/10 border-amber-500/20',
  low:
    'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

const riskColors: Record<string, string> = {
  critical: '#F43F5E',
  high: '#F97316',
  medium: '#FBBF24',
  low: '#34D399',
};

const categoryColors: Record<string, string> = {
  harassment: '#EC4899',
  stalking: '#A855F7',
  assault: '#EF4444',
  voyeurism: '#3B82F6',
  other: '#8B5CF6',
};

export default function Dashboard() {
  const [reports, setReports] = useState<SafetyReport[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [safeZones, setSafeZones] = useState<SafeZone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);

      const [reportsRes, alertsRes, safeZonesRes] =
        await Promise.all([
          supabase
            .from('safety_reports')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100),

          supabase
            .from('alerts')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false }),

          supabase
            .from('safe_zones')
            .select('id, name')
            .order('created_at', { ascending: false }),
        ]);

      if (reportsRes.error) {
        console.error('Reports error:', reportsRes.error);
      } else {
        setReports(reportsRes.data || []);
      }

      if (alertsRes.error) {
        console.error('Alerts error:', alertsRes.error);
      } else {
        setAlerts(alertsRes.data || []);
      }

      if (safeZonesRes.error) {
        console.error('Safe zones error:', safeZonesRes.error);
      } else {
        setSafeZones(safeZonesRes.data || []);
      }

      setLoading(false);
    }

    fetchDashboardData();
  }, []);

  const totalReports = reports.length;

  const highRiskReports = useMemo(
    () =>
      reports.filter((report) => {
        const severity = report.severity?.toLowerCase();
        return severity === 'critical' || severity === 'high';
      }).length,
    [reports]
  );

  const activeAlerts = alerts.length;
  const safeAreas = safeZones.length;

  const reportsThisWeek = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    return reports.filter(
      (report) =>
        new Date(report.created_at).getTime() >= weekAgo
    ).length;
  }, [reports]);

  const categoryCounts = useMemo(() => {
    const counts = {
      harassment: 0,
      stalking: 0,
      assault: 0,
      voyeurism: 0,
      other: 0,
    };

    reports.forEach((report) => {
      const category = report.category?.toLowerCase();

      if (category === 'harassment') {
        counts.harassment++;
      } else if (category === 'stalking') {
        counts.stalking++;
      } else if (category === 'assault') {
        counts.assault++;
      } else if (category === 'voyeurism') {
        counts.voyeurism++;
      } else {
        counts.other++;
      }
    });

    return counts;
  }, [reports]);

  const categoryBreakdown = [
    {
      category: 'Harassment',
      key: 'harassment',
      count: categoryCounts.harassment,
    },
    {
      category: 'Stalking',
      key: 'stalking',
      count: categoryCounts.stalking,
    },
    {
      category: 'Assault',
      key: 'assault',
      count: categoryCounts.assault,
    },
    {
      category: 'Voyeurism',
      key: 'voyeurism',
      count: categoryCounts.voyeurism,
    },
    {
      category: 'Other',
      key: 'other',
      count: categoryCounts.other,
    },
  ];

  const currentYear = new Date().getFullYear();

  const incidentTrend = useMemo(() => {
    return Array.from({ length: 12 }, (_, month) => {
      const monthReports = reports.filter((report) => {
        const date = new Date(report.created_at);

        return (
          date.getFullYear() === currentYear &&
          date.getMonth() === month
        );
      });

      return {
        month: new Date(
          currentYear,
          month,
          1
        ).toLocaleString('en-US', {
          month: 'short',
        }),
        incidents: monthReports.length,
      };
    });
  }, [reports, currentYear]);

  const maxIncidents = Math.max(
    1,
    ...incidentTrend.map((item) => item.incidents)
  );

  const topCategory = useMemo(() => {
    const entries = Object.entries(categoryCounts);

    return entries.sort((a, b) => b[1] - a[1])[0];
  }, [categoryCounts]);

  const latestReport = reports[0];

  const stats = [
    {
      label: 'Total Safety Reports',
      value: totalReports,
      change:
        reportsThisWeek > 0
          ? `+${reportsThisWeek} this week`
          : 'No new reports',
      positive: reportsThisWeek > 0,
      icon: ShieldAlert,
      gradient: 'from-violet-500 to-purple-600',
    },
    {
      label: 'High Risk Reports',
      value: highRiskReports,
      change:
        highRiskReports > 0
          ? `${highRiskReports} high risk`
          : 'None detected',
      positive: false,
      icon: AlertTriangle,
      gradient: 'from-rose-500 to-red-600',
    },
    {
      label: 'Active Alerts',
      value: activeAlerts,
      change:
        activeAlerts > 0
          ? `${activeAlerts} active`
          : 'No active alerts',
      positive: false,
      icon: Radio,
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      label: 'Safe Areas Identified',
      value: safeAreas,
      change:
        safeAreas > 0
          ? `${safeAreas} registered`
          : 'None registered',
      positive: safeAreas > 0,
      icon: Shield,
      gradient: 'from-emerald-500 to-teal-600',
    },
  ];

  const insights = useMemo(() => {
    const result: {
      icon: typeof Brain;
      text: string;
      type: 'info' | 'warning';
    }[] = [];

    if (totalReports === 0) {
      result.push({
        icon: Brain,
        text:
          'No safety reports are currently stored. Submit a report to begin building safety intelligence.',
        type: 'info',
      });

      return result;
    }

    result.push({
      icon: Activity,
      text: `${totalReports} safety report${
        totalReports === 1 ? '' : 's'
      } currently stored in the system.`,
      type: 'info',
    });

    if (highRiskReports > 0) {
      result.push({
        icon: AlertTriangle,
        text: `${highRiskReports} report${
          highRiskReports === 1 ? '' : 's'
        } are marked high or critical severity.`,
        type: 'warning',
      });
    }

    if (topCategory && topCategory[1] > 0) {
      result.push({
        icon: Brain,
        text: `${topCategory[0]} is currently the most frequently reported category.`,
        type: 'info',
      });
    }

    if (latestReport) {
      result.push({
        icon: MapPin,
        text: `Latest report: ${
          latestReport.category || 'Incident'
        } near ${
          latestReport.location_name || 'an unspecified location'
        }.`,
        type: 'info',
      });
    }

    return result;
  }, [
    totalReports,
    highRiskReports,
    topCategory,
    latestReport,
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold text-slate-100 tracking-tight"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Safety{' '}
            <span className="gradient-text">
              Intelligence
            </span>
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Real-time safety analytics from community reports
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
          <span
            className="w-2 h-2 rounded-full bg-emerald-400"
            style={{
              boxShadow: '0 0 8px rgba(52,211,153,0.5)',
            }}
          />
          Data Connected
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              delay: index * 0.05,
            }}
            className="stat-card group"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${stat.gradient}`}
              >
                <stat.icon className="w-5 h-5 text-white" />
              </div>

              <span
                className={`text-xs font-semibold ${
                  stat.positive
                    ? 'text-emerald-400'
                    : 'text-slate-500'
                }`}
              >
                {stat.positive && (
                  <ArrowUpRight className="w-3 h-3 inline mr-1" />
                )}
                {stat.change}
              </span>
            </div>

            <p
              className="text-2xl font-bold text-slate-100"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {loading ? '—' : stat.value}
            </p>

            <p className="text-sm text-slate-500 mt-1">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Trends + Categories */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:col-span-2 glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-slate-200">
                Incident Trends
              </h2>

              <p className="text-sm text-slate-500 mt-0.5">
                Monthly reports stored in the system
              </p>
            </div>

            <span className="text-xs text-slate-600">
              {currentYear}
            </span>
          </div>

          <div className="flex items-end gap-1.5 h-52">
            {incidentTrend.map((item) => {
              const height =
                item.incidents > 0
                  ? (item.incidents / maxIncidents) * 100
                  : 0;

              return (
                <div
                  key={item.month}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div className="w-full flex items-end h-44 relative group">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.6 }}
                      className="w-full rounded-t-md"
                      style={{
                        background:
                          'linear-gradient(to top, #8B5CF6, #A855F7)',
                        opacity:
                          item.incidents > 0 ? 0.85 : 0.15,
                      }}
                    />

                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block px-2 py-1 rounded-md text-[10px] text-white bg-slate-900 whitespace-nowrap">
                      {item.incidents} report
                      {item.incidents === 1 ? '' : 's'}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-600">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>

          {totalReports === 0 && (
            <p className="text-xs text-slate-600 text-center mt-3">
              Report history will appear here after submissions.
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="mb-6">
            <h2 className="text-base font-semibold text-slate-200">
              Category Breakdown
            </h2>

            <p className="text-sm text-slate-500 mt-0.5">
              Reports by incident type
            </p>
          </div>

          <div className="space-y-4">
            {categoryBreakdown.map((category) => {
              const maxCount = Math.max(
                1,
                ...categoryBreakdown.map(
                  (item) => item.count
                )
              );

              const width =
                category.count > 0
                  ? (category.count / maxCount) * 100
                  : 0;

              return (
                <div key={category.category}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-slate-300">
                      {category.category}
                    </span>

                    <span className="text-sm font-semibold text-slate-200">
                      {category.count}
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-800/50 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full rounded-full"
                      style={{
                        background:
                          categoryColors[category.key],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Insights + Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-5 h-5 text-violet-400" />

            <h2 className="text-base font-semibold text-slate-200">
              Safety Insights
            </h2>

            <span className="ml-auto px-2 py-0.5 rounded-md text-[10px] font-semibold text-violet-300 bg-violet-500/10 border border-violet-500/20">
              DATA DERIVED
            </span>
          </div>

          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-xl"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    insight.type === 'warning'
                      ? 'bg-amber-500/10'
                      : 'bg-emerald-500/10'
                  }`}
                >
                  <insight.icon
                    className={`w-4 h-4 ${
                      insight.type === 'warning'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  />
                </div>

                <p className="text-sm text-slate-400 leading-relaxed">
                  {insight.text}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Radio className="w-5 h-5 text-rose-400" />

            <h2 className="text-base font-semibold text-slate-200">
              Live Alert Feed
            </h2>

            <span className="ml-auto text-[10px] font-semibold text-rose-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              LIVE
            </span>
          </div>

          {alerts.length > 0 ? (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {alerts.map((alert) => {
                const risk =
                  alert.risk_level?.toLowerCase() || 'low';

                return (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-violet-500/5 transition-colors"
                  >
                    <span
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{
                        backgroundColor:
                          riskColors[risk] || '#8B5CF6',
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200">
                        {alert.title}
                      </p>

                      <p className="text-xs text-slate-500 mt-0.5">
                        {alert.description}
                      </p>

                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] text-slate-600 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {alert.zone || 'Unknown zone'}
                        </span>

                        <span className="text-[10px] text-slate-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(
                            alert.created_at
                          ).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                        severityStyles[risk] || ''
                      }`}
                    >
                      {risk}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-10 text-center">
              <Radio className="w-8 h-8 text-slate-700 mx-auto mb-3" />

              <p className="text-sm text-slate-500">
                No active alerts
              </p>

              <p className="text-xs text-slate-600 mt-1">
                Active safety alerts will appear here.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Reports */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-violet-500/10">
          <div>
            <h2 className="text-base font-semibold text-slate-200">
              Recent Safety Reports
            </h2>

            <p className="text-sm text-slate-500 mt-0.5">
              Latest anonymous submissions
            </p>
          </div>

          <span className="text-xs text-slate-600">
            {totalReports} total
          </span>
        </div>

        {reports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-violet-500/[0.03]">
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">
                    Category
                  </th>

                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">
                    Location
                  </th>

                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3 hidden md:table-cell">
                    Zone
                  </th>

                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">
                    Severity
                  </th>

                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3 hidden lg:table-cell">
                    AI Risk
                  </th>

                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3 hidden lg:table-cell">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-violet-500/5">
                {reports.slice(0, 10).map((report) => {
                  const severity =
                    report.severity?.toLowerCase() || 'low';

                  const risk = Math.min(
                    100,
                    Math.max(
                      0,
                      (report.ai_risk_score || 0) * 100
                    )
                  );

                  return (
                    <tr
                      key={report.id}
                      className="hover:bg-violet-500/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-200 capitalize">
                          {report.category || 'Other'}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-400 flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-violet-400/50" />
                          {report.location_name ||
                            'Not specified'}
                        </span>
                      </td>

                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-sm text-slate-500">
                          {report.zone || 'Not specified'}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`text-[10px] font-semibold px-2.5 py-1 rounded-md border ${
                            severityStyles[severity] || ''
                          }`}
                        >
                          {severity}
                        </span>
                      </td>

                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-slate-800/50 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${risk}%`,
                                background:
                                  risk > 80
                                    ? '#F43F5E'
                                    : risk > 60
                                    ? '#FBBF24'
                                    : '#34D399',
                              }}
                            />
                          </div>

                          <span className="text-xs text-slate-500">
                            {risk.toFixed(0)}%
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className="text-xs text-slate-500 capitalize">
                          {report.status || 'pending'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <ShieldAlert className="w-8 h-8 text-slate-700 mx-auto mb-3" />

            <p className="text-sm text-slate-500">
              No safety reports yet
            </p>

            <p className="text-xs text-slate-600 mt-1">
              Anonymous reports will appear here after submission.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}