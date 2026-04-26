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

interface HeatmapPoint {
  id: string;
  grid_lat: number;
  grid_lng: number;
  risk_score: number;
  incident_count: number;
  category: string;
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

export default function Heatmap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<HeatmapPoint | null>(null);
  const [filter, setFilter] = useState('all');
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const [heatmapRes, alertsRes] = await Promise.all([
          supabase.from('heatmap_data').select('*').eq('period', 'monthly'),
          supabase.from('alerts').select('*').eq('is_active', true).order('created_at', { ascending: false }),
        ]);
        if (heatmapRes.data?.length) setHeatmapData(heatmapRes.data);
        if (alertsRes.data?.length) setAlerts(alertsRes.data);
      } catch {
        // fallback
      }
    }
    fetchData();
  }, []);

  // Fallback data
  const points = heatmapData.length ? heatmapData : [
    { id: '1', grid_lat: 28.6139, grid_lng: 77.2090, risk_score: 0.82, incident_count: 15, category: 'harassment' },
    { id: '2', grid_lat: 28.6320, grid_lng: 77.2180, risk_score: 0.94, incident_count: 8, category: 'stalking' },
    { id: '3', grid_lat: 28.5672, grid_lng: 77.3210, risk_score: 0.65, incident_count: 12, category: 'harassment' },
    { id: '4', grid_lat: 28.6350, grid_lng: 77.2250, risk_score: 0.97, incident_count: 5, category: 'assault' },
    { id: '5', grid_lat: 28.6508, grid_lng: 77.2330, risk_score: 0.78, incident_count: 9, category: 'harassment' },
    { id: '6', grid_lat: 28.6100, grid_lng: 77.2400, risk_score: 0.85, incident_count: 7, category: 'stalking' },
    { id: '7', grid_lat: 28.5700, grid_lng: 77.3200, risk_score: 0.76, incident_count: 4, category: 'harassment' },
    { id: '8', grid_lat: 28.6280, grid_lng: 77.2170, risk_score: 0.58, incident_count: 3, category: 'voyeurism' },
    { id: '9', grid_lat: 28.5480, grid_lng: 77.2700, risk_score: 0.71, incident_count: 6, category: 'harassment' },
    { id: '10', grid_lat: 28.4089, grid_lng: 77.3120, risk_score: 0.91, incident_count: 4, category: 'stalking' },
    { id: '11', grid_lat: 28.6800, grid_lng: 77.2100, risk_score: 0.55, incident_count: 5, category: 'harassment' },
    { id: '12', grid_lat: 28.6300, grid_lng: 77.1950, risk_score: 0.89, incident_count: 7, category: 'assault' },
    { id: '13', grid_lat: 28.6150, grid_lng: 77.2300, risk_score: 0.48, incident_count: 3, category: 'harassment' },
    { id: '14', grid_lat: 28.5600, grid_lng: 77.3100, risk_score: 0.79, incident_count: 5, category: 'stalking' },
    { id: '15', grid_lat: 28.6200, grid_lng: 77.2500, risk_score: 0.62, incident_count: 4, category: 'harassment' },
  ];

  const alertList = alerts.length ? alerts : [
    { id: '1', title: 'High Risk Zone: Connaught Place', zone: 'Central Delhi', risk_level: 'critical', description: 'Multiple harassment reports', created_at: new Date().toISOString() },
    { id: '2', title: 'Stalking Pattern: Rajiv Chowk', zone: 'Central Delhi', risk_level: 'critical', description: 'AI detected serial pattern', created_at: new Date().toISOString() },
    { id: '3', title: 'Moderate Risk: Sector 18', zone: 'Noida', risk_level: 'high', description: 'Elevated evening incidents', created_at: new Date().toISOString() },
    { id: '4', title: 'Patrol Active: India Gate', zone: 'Central Delhi', risk_level: 'high', description: 'Police patrol deployed', created_at: new Date().toISOString() },
    { id: '5', title: 'New Pattern: Expressway', zone: 'Noida-GN', risk_level: 'critical', description: 'Vehicle stalking increasing', created_at: new Date().toISOString() },
  ];

  // Draw cyber-intelligence map
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const filteredPoints = filter === 'all' ? points : points.filter(p => p.category === filter);

    const animate = () => {
      timeRef.current += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark grid background
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Map lat/lng to canvas
      const lats = filteredPoints.map(p => p.grid_lat);
      const lngs = filteredPoints.map(p => p.grid_lng);
      const minLat = Math.min(...lats) - 0.02;
      const maxLat = Math.max(...lats) + 0.02;
      const minLng = Math.min(...lngs) - 0.02;
      const maxLng = Math.max(...lngs) + 0.02;

      const toX = (lng: number) => ((lng - minLng) / (maxLng - minLng)) * (canvas.width - 80) + 40;
      const toY = (lat: number) => ((maxLat - lat) / (maxLat - minLat)) * (canvas.height - 80) + 40;

      // Draw heatmap zones (glowing circles)
      filteredPoints.forEach((point) => {
        const x = toX(point.grid_lng);
        const y = toY(point.grid_lat);
        const radius = 30 + point.risk_score * 40;
        const pulse = Math.sin(timeRef.current * 2 + point.risk_score * 10) * 5;

        // Outer glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius + pulse);
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

        // Center dot
        const dotColor = point.risk_score > 0.8 ? '#F43F5E' : point.risk_score > 0.6 ? '#F97316' : '#FBBF24';
        ctx.fillStyle = dotColor;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Pulse ring
        const ringRadius = 8 + (Math.sin(timeRef.current * 3 + point.risk_score * 5) + 1) * 8;
        ctx.strokeStyle = dotColor;
        ctx.globalAlpha = 0.3 - (ringRadius - 8) / 40;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x, y, ringRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Label
        ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
        ctx.font = '10px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(`${(point.risk_score * 100).toFixed(0)}%`, x, y - 12);
      });

      // Draw connections between nearby high-risk points
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.08)';
      ctx.lineWidth = 0.5;
      filteredPoints.forEach((p1, i) => {
        filteredPoints.forEach((p2, j) => {
          if (j <= i) return;
          const dist = Math.sqrt(Math.pow(p1.grid_lat - p2.grid_lat, 2) + Math.pow(p1.grid_lng - p2.grid_lng, 2));
          if (dist < 0.05 && p1.risk_score > 0.7 && p2.risk_score > 0.7) {
            ctx.beginPath();
            ctx.moveTo(toX(p1.grid_lng), toY(p1.grid_lat));
            ctx.lineTo(toX(p2.grid_lng), toY(p2.grid_lat));
            ctx.stroke();
          }
        });
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [points, filter]);

  // Handle canvas click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const lats = points.map(p => p.grid_lat);
    const lngs = points.map(p => p.grid_lng);
    const minLat = Math.min(...lats) - 0.02;
    const maxLat = Math.max(...lats) + 0.02;
    const minLng = Math.min(...lngs) - 0.02;
    const maxLng = Math.max(...lngs) + 0.02;

    const toX = (lng: number) => ((lng - minLng) / (maxLng - minLng)) * (canvas.width - 80) + 40;
    const toY = (lat: number) => ((maxLat - lat) / (maxLat - minLat)) * (canvas.height - 80) + 40;

    const filteredPoints = filter === 'all' ? points : points.filter(p => p.category === filter);

    for (const point of filteredPoints) {
      const px = toX(point.grid_lng);
      const py = toY(point.grid_lat);
      const dist = Math.sqrt(Math.pow(clickX - px, 2) + Math.pow(clickY - py, 2));
      if (dist < 30) {
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
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Risk <span className="gradient-text">Heatmap</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Cyber-intelligence risk visualization with real-time threat mapping</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(139,92,246,0.15)' }}>
            {['all', 'harassment', 'stalking', 'assault'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                  filter === f ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
                style={filter === f ? { background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' } : {}}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:col-span-3 glass-card overflow-hidden relative"
          style={{ minHeight: '500px' }}
        >
          {/* Map controls */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <button className="w-9 h-9 rounded-lg flex items-center justify-center glass-card hover:border-violet-500/30 transition-colors">
              <Crosshair className="w-4 h-4 text-violet-400" />
            </button>
            <button className="w-9 h-9 rounded-lg flex items-center justify-center glass-card hover:border-violet-500/30 transition-colors">
              <Layers className="w-4 h-4 text-violet-400" />
            </button>
            <button className="w-9 h-9 rounded-lg flex items-center justify-center glass-card hover:border-violet-500/30 transition-colors">
              <Filter className="w-4 h-4 text-violet-400" />
            </button>
          </div>

          {/* Legend */}
          <div className="absolute top-4 right-4 z-10 glass-card p-3">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Risk Level</p>
            <div className="space-y-1.5">
              {[
                { label: 'Critical', color: '#F43F5E' },
                { label: 'High', color: '#F97316' },
                { label: 'Medium', color: '#FBBF24' },
                { label: 'Low', color: '#34D399' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}50` }} />
                  <span className="text-[10px] text-slate-400">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Canvas */}
          <div className="w-full h-[500px] relative">
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-crosshair"
              onClick={handleCanvasClick}
            />
          </div>

          {/* Selected point detail */}
          {selectedPoint && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-4 z-10 glass-card p-4 w-72"
              style={{ background: 'rgba(7, 2, 15, 0.9)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-200 capitalize">{selectedPoint.category}</span>
                <button onClick={() => setSelectedPoint(null)} className="text-slate-500 hover:text-slate-300 text-xs">Close</button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Risk Score</span>
                  <span className="text-sm font-bold" style={{ color: selectedPoint.risk_score > 0.8 ? '#F43F5E' : selectedPoint.risk_score > 0.6 ? '#F97316' : '#FBBF24' }}>
                    {(selectedPoint.risk_score * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Incidents</span>
                  <span className="text-sm font-semibold text-slate-200">{selectedPoint.incident_count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Coordinates</span>
                  <span className="text-xs text-slate-400">{selectedPoint.grid_lat.toFixed(4)}, {selectedPoint.grid_lng.toFixed(4)}</span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Alert sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5 space-y-4"
        >
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-rose-400" />
            <h2 className="text-sm font-semibold text-slate-200">Active Alerts</h2>
            <span className="ml-auto flex items-center gap-1 text-[10px] font-semibold text-rose-400">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 glow-pulse" />
              LIVE
            </span>
          </div>

          <div className="space-y-3">
            {alertList.map((alert, i) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="p-3 rounded-xl hover:bg-violet-500/5 transition-colors cursor-pointer"
                style={{ borderLeft: `2px solid ${riskColors[alert.risk_level] || '#8B5CF6'}` }}
              >
                <p className="text-xs font-medium text-slate-200 leading-snug">{alert.title}</p>
                <p className="text-[10px] text-slate-500 mt-1">{alert.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {alert.zone}
                  </span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${severityColors[alert.risk_level] || ''}`}>
                    {alert.risk_level}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Zone stats */}
          <div className="pt-4 border-t border-violet-500/10 space-y-3">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Zone Summary</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.1)' }}>
                <p className="text-lg font-bold text-rose-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>3</p>
                <p className="text-[10px] text-slate-500">Critical Zones</p>
              </div>
              <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.1)' }}>
                <p className="text-lg font-bold text-orange-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>2</p>
                <p className="text-[10px] text-slate-500">High Risk</p>
              </div>
              <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.1)' }}>
                <p className="text-lg font-bold text-amber-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>5</p>
                <p className="text-[10px] text-slate-500">Medium Risk</p>
              </div>
              <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.1)' }}>
                <p className="text-lg font-bold text-emerald-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>8</p>
                <p className="text-[10px] text-slate-500">Safe Zones</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
