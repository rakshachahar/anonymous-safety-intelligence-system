import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Radio,
  Layers,
  Filter,
  Crosshair,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SafetyReport {
  id: string;
  category: string;
  severity: string;
  latitude: number;
  longitude: number;
  location_name: string;
  zone: string;
  created_at: string;
}

interface HeatmapPoint {
  id: string;
  latitude: number;
  longitude: number;
  risk_score: number;
  category: string;
  location_name: string;
  zone: string;
}

interface Alert {
  id: string;
  title: string;
  zone: string;
  risk_level: string;
  description: string;
  created_at: string;
}

const riskColors: Record<string, string> = {
  critical: '#F43F5E',
  high: '#F97316',
  medium: '#FBBF24',
  low: '#34D399',
};

const severityColors: Record<string, string> = {
  critical: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  high: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

const severityScore: Record<string, number> = {
  critical: 0.95,
  high: 0.8,
  medium: 0.6,
  low: 0.3,
};

export default function Heatmap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reports, setReports] = useState<SafetyReport[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<HeatmapPoint | null>(null);
  const [filter, setFilter] = useState('all');
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const [reportsRes, alertsRes] = await Promise.all([
          supabase
            .from('safety_reports')
            .select(
              'id, category, severity, latitude, longitude, location_name, zone, created_at'
            )
            .order('created_at', { ascending: false }),

          supabase
            .from('alerts')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false }),
        ]);

        if (!reportsRes.error) {
          setReports(reportsRes.data || []);
        }

        if (!alertsRes.error) {
          setAlerts(alertsRes.data || []);
        }
      } catch {
        setReports([]);
        setAlerts([]);
      }
    }

    fetchData();
  }, []);

  /*
    Only reports with real coordinates are plotted.

    Reports where latitude/longitude are 0 are still stored in Supabase,
    but cannot be placed accurately on the geographic visualization.
  */
  const points: HeatmapPoint[] = reports
    .filter(
      report =>
        Number.isFinite(Number(report.latitude)) &&
        Number.isFinite(Number(report.longitude)) &&
        Number(report.latitude) !== 0 &&
        Number(report.longitude) !== 0
    )
    .map(report => ({
      id: report.id,
      latitude: Number(report.latitude),
      longitude: Number(report.longitude),
      risk_score: severityScore[report.severity?.toLowerCase()] ?? 0.5,
      category: report.category || 'other',
      location_name:
        report.location_name || report.zone || 'Unknown location',
      zone: report.zone || '',
    }));

  const filteredPoints =
    filter === 'all'
      ? points
      : points.filter(
          point => point.category.toLowerCase() === filter.toLowerCase()
        );

  const reportsWithLocation = points.length;
  const reportsWithoutLocation = reports.length - reportsWithLocation;

  const criticalZones = alerts.filter(
    alert => alert.risk_level === 'critical'
  ).length;

  const highRiskZones = alerts.filter(
    alert => alert.risk_level === 'high'
  ).length;

  const mediumRiskZones = alerts.filter(
    alert => alert.risk_level === 'medium'
  ).length;

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || filteredPoints.length === 0) {
      return;
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();

      if (!rect) return;

      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();

      if (!rect) return;

      const width = rect.width;
      const height = rect.height;

      timeRef.current += 0.01;

      ctx.clearRect(0, 0, width, height);

      // Background grid
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.04)';
      ctx.lineWidth = 1;

      const gridSize = 40;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const lats = filteredPoints.map(point => point.latitude);
      const lngs = filteredPoints.map(point => point.longitude);

      const minLat = Math.min(...lats) - 0.02;
      const maxLat = Math.max(...lats) + 0.02;
      const minLng = Math.min(...lngs) - 0.02;
      const maxLng = Math.max(...lngs) + 0.02;

      const latRange = maxLat - minLat || 1;
      const lngRange = maxLng - minLng || 1;

      const toX = (lng: number) =>
        ((lng - minLng) / lngRange) * (width - 80) + 40;

      const toY = (lat: number) =>
        ((maxLat - lat) / latRange) * (height - 80) + 40;

      filteredPoints.forEach(point => {
        const x = toX(point.longitude);
        const y = toY(point.latitude);

        const radius = 30 + point.risk_score * 40;

        const pulse =
          Math.sin(timeRef.current * 2 + point.risk_score * 10) * 5;

        const gradient = ctx.createRadialGradient(
          x,
          y,
          0,
          x,
          y,
          radius + pulse
        );

        if (point.risk_score > 0.8) {
          gradient.addColorStop(0, 'rgba(244, 63, 94, 0.3)');
          gradient.addColorStop(0.5, 'rgba(244, 63, 94, 0.1)');
          gradient.addColorStop(1, 'rgba(244, 63, 94, 0)');
        } else if (point.risk_score > 0.6) {
          gradient.addColorStop(0, 'rgba(249, 115, 22, 0.25)');
          gradient.addColorStop(0.5, 'rgba(249, 115, 22, 0.08)');
          gradient.addColorStop(1, 'rgba(249, 115, 22, 0)');
        } else {
          gradient.addColorStop(0, 'rgba(251, 191, 36, 0.2)');
          gradient.addColorStop(0.5, 'rgba(251, 191, 36, 0.06)');
          gradient.addColorStop(1, 'rgba(251, 191, 36, 0)');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius + pulse, 0, Math.PI * 2);
        ctx.fill();

        const dotColor =
          point.risk_score > 0.8
            ? '#F43F5E'
            : point.risk_score > 0.6
              ? '#F97316'
              : '#FBBF24';

        ctx.fillStyle = dotColor;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();

        const ringRadius =
          8 +
          (Math.sin(timeRef.current * 3 + point.risk_score * 5) + 1) * 8;

        ctx.strokeStyle = dotColor;
        ctx.globalAlpha = 0.3 - (ringRadius - 8) / 40;
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.arc(x, y, ringRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.globalAlpha = 1;

        ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
        ctx.font = '10px Inter';
        ctx.textAlign = 'center';

        ctx.fillText(
          `${Math.round(point.risk_score * 100)}%`,
          x,
          y - 14
        );
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [filteredPoints]);

  const handleCanvasClick = (
    event: React.MouseEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;

    if (!canvas || filteredPoints.length === 0) return;

    const rect = canvas.getBoundingClientRect();

    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const lats = filteredPoints.map(point => point.latitude);
    const lngs = filteredPoints.map(point => point.longitude);

    const minLat = Math.min(...lats) - 0.02;
    const maxLat = Math.max(...lats) + 0.02;
    const minLng = Math.min(...lngs) - 0.02;
    const maxLng = Math.max(...lngs) + 0.02;

    const latRange = maxLat - minLat || 1;
    const lngRange = maxLng - minLng || 1;

    const toX = (lng: number) =>
      ((lng - minLng) / lngRange) * (rect.width - 80) + 40;

    const toY = (lat: number) =>
      ((maxLat - lat) / latRange) * (rect.height - 80) + 40;

    for (const point of filteredPoints) {
      const x = toX(point.longitude);
      const y = toY(point.latitude);

      const distance = Math.sqrt(
        Math.pow(clickX - x, 2) + Math.pow(clickY - y, 2)
      );

      if (distance < 35) {
        setSelectedPoint(point);
        return;
      }
    }

    setSelectedPoint(null);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold text-slate-100 tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Risk <span className="gradient-text">Heatmap</span>
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Safety risk visualization from stored community reports
          </p>
        </div>

        <div
          className="flex items-center gap-1 p-1 rounded-xl"
          style={{
            background: 'rgba(15,23,42,0.6)',
            border: '1px solid rgba(139,92,246,0.15)',
          }}
        >
          {['all', 'harassment', 'stalking', 'assault'].map(item => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                filter === item
                  ? 'text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              style={
                filter === item
                  ? {
                      background:
                        'linear-gradient(135deg, #8B5CF6, #EC4899)',
                    }
                  : {}
              }
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:col-span-3 glass-card overflow-hidden relative"
        >

          {/* Map controls */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <button
              className="w-9 h-9 rounded-lg flex items-center justify-center glass-card"
              title="Location view"
            >
              <Crosshair className="w-4 h-4 text-violet-400" />
            </button>

            <button
              className="w-9 h-9 rounded-lg flex items-center justify-center glass-card"
              title="Layers"
            >
              <Layers className="w-4 h-4 text-violet-400" />
            </button>

            <button
              className="w-9 h-9 rounded-lg flex items-center justify-center glass-card"
              title="Filter"
            >
              <Filter className="w-4 h-4 text-violet-400" />
            </button>
          </div>

          {/* Legend */}
          <div className="absolute top-4 right-4 z-10 glass-card p-3">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Risk Level
            </p>

            <div className="space-y-1.5">
              {[
                ['Critical', '#F43F5E'],
                ['High', '#F97316'],
                ['Medium', '#FBBF24'],
                ['Low', '#34D399'],
              ].map(([label, color]) => (
                <div key={label} className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />

                  <span className="text-[10px] text-slate-400">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Canvas */}
          <div className="w-full h-[500px] relative">
            {filteredPoints.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-center z-10">
                <div>
                  <MapPin className="w-8 h-8 text-slate-600 mx-auto mb-3" />

                  <p className="text-sm text-slate-400">
                    No mapped reports for this filter
                  </p>

                  <p className="text-xs text-slate-600 mt-1">
                    Reports need valid latitude and longitude coordinates.
                  </p>
                </div>
              </div>
            )}

            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-crosshair"
              onClick={handleCanvasClick}
            />
          </div>

          {/* Selected report */}
          {selectedPoint && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-4 z-10 glass-card p-4 w-72"
              style={{ background: 'rgba(7, 2, 15, 0.92)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-200 capitalize">
                  {selectedPoint.category}
                </span>

                <button
                  onClick={() => setSelectedPoint(null)}
                  className="text-slate-500 hover:text-slate-300 text-xs"
                >
                  Close
                </button>
              </div>

              <div className="space-y-2">

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Risk Score
                  </span>

                  <span
                    className="text-sm font-bold"
                    style={{
                      color:
                        selectedPoint.risk_score > 0.8
                          ? '#F43F5E'
                          : selectedPoint.risk_score > 0.6
                            ? '#F97316'
                            : '#FBBF24',
                    }}
                  >
                    {Math.round(selectedPoint.risk_score * 100)}%
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">
                    Location
                  </span>

                  <span className="text-xs text-slate-400 text-right">
                    {selectedPoint.location_name}
                  </span>
                </div>

                {selectedPoint.zone && (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">
                      Zone
                    </span>

                    <span className="text-xs text-slate-400 text-right">
                      {selectedPoint.zone}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">
                    Coordinates
                  </span>

                  <span className="text-xs text-slate-400">
                    {selectedPoint.latitude.toFixed(4)},{' '}
                    {selectedPoint.longitude.toFixed(4)}
                  </span>
                </div>

              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Right panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5 space-y-4"
        >

          {/* Active alerts */}
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-rose-400" />

            <h2 className="text-sm font-semibold text-slate-200">
              Active Alerts
            </h2>

            <span className="ml-auto text-[10px] font-semibold text-rose-400">
              {alerts.length > 0 ? 'LIVE' : 'NONE'}
            </span>
          </div>

          <div className="space-y-3">
            {alerts.length === 0 ? (
              <p className="text-xs text-slate-500">
                No active safety alerts.
              </p>
            ) : (
              alerts.map(alert => (
                <div
                  key={alert.id}
                  className="p-3 rounded-xl"
                  style={{
                    borderLeft: `2px solid ${
                      riskColors[alert.risk_level] || '#8B5CF6'
                    }`,
                  }}
                >
                  <p className="text-xs font-medium text-slate-200">
                    {alert.title}
                  </p>

                  <p className="text-[10px] text-slate-500 mt-1">
                    {alert.description}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {alert.zone}
                    </span>

                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                        severityColors[alert.risk_level] || ''
                      }`}
                    >
                      {alert.risk_level}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Data status */}
          <div className="pt-4 border-t border-violet-500/10">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Location Coverage
            </h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Total reports
                </span>

                <span className="text-sm font-semibold text-slate-200">
                  {reports.length}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Mapped reports
                </span>

                <span className="text-sm font-semibold text-emerald-400">
                  {reportsWithLocation}
                </span>
              </div>

              {reportsWithoutLocation > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Without coordinates
                  </span>

                  <span className="text-sm font-semibold text-amber-400">
                    {reportsWithoutLocation}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Zone summary */}
          <div className="pt-4 border-t border-violet-500/10 space-y-3">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Alert Summary
            </h3>

            <div className="grid grid-cols-2 gap-2">

              <div className="p-3 rounded-xl text-center bg-rose-500/5">
                <p className="text-lg font-bold text-rose-400">
                  {criticalZones}
                </p>

                <p className="text-[10px] text-slate-500">
                  Critical
                </p>
              </div>

              <div className="p-3 rounded-xl text-center bg-orange-500/5">
                <p className="text-lg font-bold text-orange-400">
                  {highRiskZones}
                </p>

                <p className="text-[10px] text-slate-500">
                  High Risk
                </p>
              </div>

              <div className="p-3 rounded-xl text-center bg-amber-500/5">
                <p className="text-lg font-bold text-amber-400">
                  {mediumRiskZones}
                </p>

                <p className="text-[10px] text-slate-500">
                  Medium
                </p>
              </div>

              <div className="p-3 rounded-xl text-center bg-emerald-500/5">
                <p className="text-lg font-bold text-emerald-400">
                  {points.filter(point => point.risk_score < 0.6).length}
                </p>

                <p className="text-[10px] text-slate-500">
                  Lower Risk
                </p>
              </div>

            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}