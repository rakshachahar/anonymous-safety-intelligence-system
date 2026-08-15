import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Search,
  Brain,
  TrendingUp,
  Flag,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Report {
  id: string;
  category: string;
  description: string;
  severity: string;
  location_name: string;
  zone: string;
  status: string;
  ai_risk_score: number;
  ai_insight: string;
  created_at: string;
}

const severityColors: Record<string, string> = {
  critical: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  high: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

const statusInfo: Record<
  string,
  {
    label: string;
    color: string;
    icon: typeof CheckCircle;
  }
> = {
  pending: {
    label: 'Pending',
    color: 'text-amber-400',
    icon: Clock,
  },
  verified: {
    label: 'Verified',
    color: 'text-emerald-400',
    icon: CheckCircle,
  },
  investigating: {
    label: 'Investigating',
    color: 'text-blue-400',
    icon: Search,
  },
  resolved: {
    label: 'Resolved',
    color: 'text-slate-400',
    icon: CheckCircle,
  },
  dismissed: {
    label: 'Dismissed',
    color: 'text-slate-500',
    icon: XCircle,
  },
};

const statusFilters = [
  'all',
  'pending',
  'verified',
  'investigating',
  'resolved',
];

export default function Admin() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);

    const { error } = await supabase
      .from('safety_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setReports([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleStatusChange = async (
    reportId: string,
    newStatus: string
  ) => {
    const { error } = await supabase
      .from('safety_reports')
      .update({ status: newStatus })
      .eq('id', reportId);

    if (error) {
      alert(`Could not update report: ${error.message}`);
      return;
    }

    setReports((current) =>
      current.map((report) =>
        report.id === reportId
          ? { ...report, status: newStatus }
          : report
      )
    );

    setSelectedReport((current) =>
      current?.id === reportId
        ? { ...current, status: newStatus }
        : current
    );
  };

  const filteredReports = reports.filter((report) => {
    if (filter !== 'all' && report.status !== filter) {
      return false;
    }

    if (!searchQuery.trim()) {
      return true;
    }

    const query = searchQuery.toLowerCase();

    return (
      report.category?.toLowerCase().includes(query) ||
      report.location_name?.toLowerCase().includes(query) ||
      report.zone?.toLowerCase().includes(query) ||
      report.description?.toLowerCase().includes(query)
    );
  });

  const statusCounts = {
    all: reports.length,
    pending: reports.filter((r) => r.status === 'pending').length,
    verified: reports.filter((r) => r.status === 'verified').length,
    investigating: reports.filter(
      (r) => r.status === 'investigating'
    ).length,
    resolved: reports.filter((r) => r.status === 'resolved').length,
  };

  const avgRiskScore =
    reports.length > 0
      ? reports.reduce(
          (sum, report) => sum + (report.ai_risk_score || 0),
          0
        ) / reports.length
      : 0;

  const stats = [
    {
      label: 'Total Reports',
      value: reports.length,
      icon: Flag,
      color: '#8B5CF6',
    },
    {
      label: 'Pending Review',
      value: statusCounts.pending,
      icon: Clock,
      color: '#FBBF24',
    },
    {
      label: 'Avg Risk Score',
      value: `${Math.round(avgRiskScore * 100)}%`,
      icon: TrendingUp,
      color: '#EC4899',
    },
    {
      label: 'Verified',
      value: statusCounts.verified,
      icon: CheckCircle,
      color: '#34D399',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold text-slate-100 tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Command <span className="gradient-text">Center</span>
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Safety intelligence monitoring and report moderation
          </p>
        </div>

        <span
          className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400 px-3 py-1.5 rounded-lg w-fit"
          style={{
            background: 'rgba(52,211,153,0.1)',
            border: '1px solid rgba(52,211,153,0.2)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full bg-emerald-400"
            style={{ boxShadow: '0 0 8px rgba(52,211,153,0.5)' }}
          />
          System Online
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{
                  background: `${stat.color}15`,
                  border: `1px solid ${stat.color}25`,
                }}
              >
                <stat.icon
                  className="w-4 h-4"
                  style={{ color: stat.color }}
                />
              </div>

              <div>
                <p
                  className="text-lg font-bold text-slate-100"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {stat.value}
                </p>

                <p className="text-[10px] text-slate-500">
                  {stat.label}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div
          className="flex items-center gap-1 p-1 rounded-xl overflow-x-auto"
          style={{
            background: 'rgba(15,23,42,0.6)',
            border: '1px solid rgba(139,92,246,0.15)',
          }}
        >
          {statusFilters.map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize whitespace-nowrap ${
                filter === key
                  ? 'text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              style={
                filter === key
                  ? {
                      background:
                        'linear-gradient(135deg, #8B5CF6, #EC4899)',
                    }
                  : {}
              }
            >
              {key} (
              {statusCounts[key as keyof typeof statusCounts]})
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400/40" />

          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10 py-2"
          />
        </div>
      </div>

      {/* Reports */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden"
      >
        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Loading reports...
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="p-10 text-center">
            <Flag className="w-8 h-8 text-slate-600 mx-auto mb-3" />

            <p className="text-sm text-slate-400">
              {reports.length === 0
                ? 'No safety reports have been submitted yet.'
                : 'No reports match your current filter.'}
            </p>

            {reports.length === 0 && (
              <p className="text-xs text-slate-600 mt-1">
                Reports submitted through SafeVoice will appear here.
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  style={{
                    background: 'rgba(139, 92, 246, 0.03)',
                  }}
                >
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                    Report
                  </th>

                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                    Location
                  </th>

                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">
                    Severity
                  </th>

                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">
                    AI Risk
                  </th>

                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                    Status
                  </th>

                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">
                    Time
                  </th>

                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-violet-500/5">
                {filteredReports.map((report, index) => {
                  const currentStatus =
                    statusInfo[report.status] || statusInfo.pending;

                  const StatusIcon = currentStatus.icon;

                  return (
                    <motion.tr
                      key={report.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-violet-500/5 transition-colors cursor-pointer"
                      onClick={() => setSelectedReport(report)}
                    >
                      <td className="px-5 py-4">
                        <span className="text-sm font-medium text-slate-200 capitalize">
                          {report.category}
                        </span>

                        <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[200px]">
                          {report.description}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-400 flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-violet-400/50" />
                          {report.location_name || 'Unknown'}
                        </span>
                      </td>

                      <td className="px-5 py-4 hidden md:table-cell">
                        <span
                          className={`text-[10px] font-semibold px-2.5 py-1 rounded-md border ${
                            severityColors[report.severity] || ''
                          }`}
                        >
                          {report.severity}
                        </span>
                      </td>

                      <td className="px-5 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-14 h-1.5 rounded-full bg-slate-800/50 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${Math.min(
                                  (report.ai_risk_score || 0) * 100,
                                  100
                                )}%`,
                                background:
                                  (report.ai_risk_score || 0) > 0.8
                                    ? '#F43F5E'
                                    : (report.ai_risk_score || 0) >
                                        0.6
                                      ? '#FBBF24'
                                      : '#34D399',
                              }}
                            />
                          </div>

                          <span className="text-xs text-slate-500">
                            {Math.round(
                              (report.ai_risk_score || 0) * 100
                            )}
                            %
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`text-xs font-medium ${currentStatus.color} flex items-center gap-1`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {currentStatus.label}
                        </span>
                      </td>

                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="text-xs text-slate-500">
                          {new Date(
                            report.created_at
                          ).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div
                          className="flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {report.status === 'pending' && (
                            <>
                              <button
                                onClick={() =>
                                  handleStatusChange(
                                    report.id,
                                    'verified'
                                  )
                                }
                                className="p-1.5 rounded-lg hover:bg-emerald-500/10 transition-colors"
                                title="Verify"
                              >
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                              </button>

                              <button
                                onClick={() =>
                                  handleStatusChange(
                                    report.id,
                                    'investigating'
                                  )
                                }
                                className="p-1.5 rounded-lg hover:bg-blue-500/10 transition-colors"
                                title="Investigate"
                              >
                                <Search className="w-4 h-4 text-blue-400" />
                              </button>

                              <button
                                onClick={() =>
                                  handleStatusChange(
                                    report.id,
                                    'dismissed'
                                  )
                                }
                                className="p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                                title="Dismiss"
                              >
                                <XCircle className="w-4 h-4 text-rose-400" />
                              </button>
                            </>
                          )}

                          {(report.status === 'verified' ||
                            report.status === 'investigating') && (
                            <button
                              onClick={() =>
                                handleStatusChange(
                                  report.id,
                                  'resolved'
                                )
                              }
                              className="p-1.5 rounded-lg hover:bg-emerald-500/10 transition-colors"
                              title="Resolve"
                            >
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
            }}
            onClick={() => setSelectedReport(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card p-6 w-full max-w-lg"
              style={{
                background: 'rgba(7, 2, 15, 0.95)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-200 capitalize">
                  {selectedReport.category} Report
                </h3>

                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-slate-500 hover:text-slate-300"
                >
                  Close
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">
                    Description
                  </p>

                  <p className="text-sm text-slate-300">
                    {selectedReport.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">
                      Location
                    </p>

                    <p className="text-sm text-slate-300 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-violet-400" />
                      {selectedReport.location_name || 'Unknown'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 mb-1">
                      Zone
                    </p>

                    <p className="text-sm text-slate-300">
                      {selectedReport.zone || 'Unknown'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 mb-1">
                      Severity
                    </p>

                    <span
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-md border ${
                        severityColors[selectedReport.severity] || ''
                      }`}
                    >
                      {selectedReport.severity}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 mb-1">
                      AI Risk Score
                    </p>

                    <p
                      className="text-sm font-bold"
                      style={{
                        color:
                          (selectedReport.ai_risk_score || 0) > 0.8
                            ? '#F43F5E'
                            : (selectedReport.ai_risk_score || 0) >
                                0.6
                              ? '#FBBF24'
                              : '#34D399',
                      }}
                    >
                      {Math.round(
                        (selectedReport.ai_risk_score || 0) * 100
                      )}
                      %
                    </p>
                  </div>
                </div>

                {selectedReport.ai_insight && (
                  <div
                    className="p-3 rounded-xl"
                    style={{
                      background: 'rgba(139,92,246,0.05)',
                      border:
                        '1px solid rgba(139,92,246,0.15)',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Brain className="w-4 h-4 text-violet-400" />

                      <span className="text-xs font-semibold text-violet-300">
                        AI Insight
                      </span>
                    </div>

                    <p className="text-xs text-slate-400">
                      {selectedReport.ai_insight}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-violet-500/10">
                  <p className="text-xs text-slate-500 mr-auto">
                    Update Status:
                  </p>

                  {[
                    'pending',
                    'verified',
                    'investigating',
                    'resolved',
                    'dismissed',
                  ].map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        handleStatusChange(
                          selectedReport.id,
                          status
                        )
                      }
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-medium capitalize transition-all ${
                        selectedReport.status === status
                          ? 'text-white'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                      style={
                        selectedReport.status === status
                          ? {
                              background:
                                'linear-gradient(135deg, #8B5CF6, #EC4899)',
                            }
                          : {
                              background:
                                'rgba(15,23,42,0.6)',
                              border:
                                '1px solid rgba(139,92,246,0.15)',
                            }
                      }
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}