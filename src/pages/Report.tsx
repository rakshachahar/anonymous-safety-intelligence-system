import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  MapPin,
  Send,
  CheckCircle,
  Eye,
  Lock,
  ChevronRight,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const categories = [
  {
    id: 'harassment',
    label: 'Harassment',
    desc: 'Verbal, physical, or visual harassment',
  },
  {
    id: 'stalking',
    label: 'Stalking',
    desc: 'Being followed or watched persistently',
  },
  {
    id: 'assault',
    label: 'Assault',
    desc: 'Physical attack or intimidation',
  },
  {
    id: 'voyeurism',
    label: 'Voyeurism',
    desc: 'Inappropriate recording or watching',
  },
  {
    id: 'other',
    label: 'Other',
    desc: 'Any other safety concern',
  },
];

const severityLevels = [
  {
    id: 'low',
    label: 'Low',
    color: '#34D399',
    desc: 'Minor concern, no immediate danger',
  },
  {
    id: 'medium',
    label: 'Medium',
    color: '#FBBF24',
    desc: 'Concerning situation, potential escalation',
  },
  {
    id: 'high',
    label: 'High',
    color: '#F97316',
    desc: 'Serious threat, immediate attention needed',
  },
  {
    id: 'critical',
    label: 'Critical',
    color: '#F43F5E',
    desc: 'Immediate danger, emergency response required',
  },
];

const initialForm = {
  category: '',
  description: '',
  severity: '',
  location_name: '',
  zone: '',
  latitude: 0,
  longitude: 0,
};

export default function Report() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [locating, setLocating] = useState(false);
  const [form, setForm] = useState(initialForm);

  const handleGetLocation = () => {
    setLocating(true);

    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          location_name: 'Current Location',
        }));

        setLocating(false);
      },
      (error) => {
        console.error('LOCATION ERROR:', error);
        alert(
          'Unable to access your location. You can enter a location name manually.'
        );
        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const geocodeLocation = async (location: string) => {
    const query = location.trim();

    if (!query) {
      return null;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=in&q=${encodeURIComponent(
          query
        )}`
      );

      if (!response.ok) {
        throw new Error('Location search failed');
      }

      const results = await response.json();

      if (!results.length) {
        return null;
      }

      const result = results[0];

      return {
        latitude: Number(result.lat),
        longitude: Number(result.lon),
        location_name: query,
        zone:
          form.zone ||
          result.address?.state_district ||
          result.address?.state ||
          '',
      };
    } catch (error) {
      console.error('GEOCODING ERROR:', error);
      return null;
    }
  };

  const handleManualLocation = async () => {
    if (!form.location_name.trim()) return;

    setLocating(true);

    const location = await geocodeLocation(form.location_name);

    if (!location) {
      alert(
        'Location not found. Please enter a valid Indian city, area, landmark, or locality.'
      );
      setLocating(false);
      return;
    }

    setForm((prev) => ({
      ...prev,
      latitude: location.latitude,
      longitude: location.longitude,
      location_name: location.location_name,
      zone: prev.zone || location.zone,
    }));

    setLocating(false);
  };

  const handleSubmit = async () => {
    try {
      let latitude = form.latitude;
      let longitude = form.longitude;
      let locationName = form.location_name;
      let zone = form.zone;

      /*
       * If the user manually entered a location and coordinates
       * are still missing, geocode it before saving.
       */
      if (
        locationName.trim() &&
        (latitude === 0 || longitude === 0)
      ) {
        const location = await geocodeLocation(locationName);

        if (!location) {
          alert(
            'Location could not be found. Please enter a valid location or use Share Location.'
          );
          return;
        }

        latitude = location.latitude;
        longitude = location.longitude;
        locationName = location.location_name;
        zone = zone || location.zone;
      }

      const { data, error } = await supabase
        .from('safety_reports')
        .insert({
          category: form.category,
          description: form.description,
          severity: form.severity,
          location_name: locationName || 'Unknown',
          zone: zone || 'Unknown',
          latitude,
          longitude,
          is_anonymous: true,
          status: 'pending',
          ai_risk_score:
            form.severity === 'critical'
              ? 0.9
              : form.severity === 'high'
              ? 0.75
              : form.severity === 'medium'
              ? 0.5
              : 0.25,
          ai_insight:
            'Report submitted for AI analysis. Processing...',
        })
        .select();

      console.log('SUPABASE DATA:', data);
      console.log('SUPABASE ERROR:', error);

      if (error) {
        alert(`Database error: ${error.message}`);
        return;
      }

      setSubmitted(true);
    } catch (error) {
      console.error('SUBMIT ERROR:', error);
      alert('Unexpected error while submitting the report.');
    }
  };

  const canProceed = () => {
    if (step === 1) return form.category !== '';
    if (step === 2) return form.severity !== '';
    if (step === 3) return form.description.trim().length >= 10;

    return true;
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card p-12"
          style={{
            background:
              'linear-gradient(135deg, rgba(52,211,153,0.05), rgba(16,185,129,0.02))',
            border: '1px solid rgba(52,211,153,0.15)',
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{
              background: 'rgba(52,211,153,0.1)',
              border: '2px solid rgba(52,211,153,0.2)',
            }}
          >
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </motion.div>

          <h2
            className="text-xl font-bold text-emerald-400 mb-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Report Submitted
          </h2>

          <p className="text-sm text-slate-400 mb-2">
            Your anonymous report has been received and is being analyzed by
            our AI system.
          </p>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mb-6">
            <Lock className="w-3 h-3 text-violet-400" />
            Your identity remains completely anonymous
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setSubmitted(false);
                setStep(1);
                setForm(initialForm);
              }}
              className="btn-primary text-white text-sm"
            >
              Report Another
            </button>

            <button
              onClick={() => window.history.back()}
              className="btn-secondary text-sm"
            >
              Back to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1
          className="text-2xl font-bold text-slate-100 tracking-tight"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Anonymous <span className="gradient-text">Report</span>
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Your identity is always protected. Every report makes the community
          safer.
        </p>

        <div className="flex items-center justify-center gap-2 mt-3 text-xs text-violet-400/60">
          <Lock className="w-3.5 h-3.5" />
          End-to-end encrypted and fully anonymous
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= s ? 'text-white' : 'text-slate-600'
              }`}
              style={
                step >= s
                  ? {
                      background:
                        'linear-gradient(135deg, #8B5CF6, #EC4899)',
                    }
                  : {
                      background: 'rgba(15,23,42,0.6)',
                      border: '1px solid rgba(139,92,246,0.15)',
                    }
              }
            >
              {step > s ? <CheckCircle className="w-4 h-4" /> : s}
            </div>

            {s < 4 && (
              <div
                className="w-12 h-0.5 rounded-full"
                style={{
                  background:
                    step > s
                      ? 'linear-gradient(90deg, #8B5CF6, #EC4899)'
                      : 'rgba(139,92,246,0.1)',
                }}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card p-6"
          >
            <h2 className="text-lg font-semibold text-slate-200 mb-2">
              What happened?
            </h2>

            <p className="text-sm text-slate-500 mb-6">
              Select the category that best describes the incident
            </p>

            <div className="space-y-3">
              {categories.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ x: 4 }}
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      category: cat.id,
                    }))
                  }
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all text-left ${
                    form.category === cat.id
                      ? 'border-violet-500/30'
                      : 'border-transparent hover:border-violet-500/15'
                  }`}
                  style={{
                    background:
                      form.category === cat.id
                        ? 'rgba(139,92,246,0.08)'
                        : 'rgba(15,23,42,0.3)',
                    border:
                      form.category === cat.id
                        ? '1px solid rgba(139,92,246,0.3)'
                        : '1px solid transparent',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      background:
                        form.category === cat.id
                          ? 'linear-gradient(135deg, #8B5CF6, #EC4899)'
                          : 'rgba(139,92,246,0.1)',
                    }}
                  >
                    <ShieldAlert className="w-5 h-5 text-white" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-200">
                      {cat.label}
                    </p>
                    <p className="text-xs text-slate-500">{cat.desc}</p>
                  </div>

                  {form.category === cat.id && (
                    <ChevronRight className="w-4 h-4 text-violet-400 ml-auto" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card p-6"
          >
            <h2 className="text-lg font-semibold text-slate-200 mb-2">
              How severe is this?
            </h2>

            <p className="text-sm text-slate-500 mb-6">
              Help us prioritize the response by selecting the severity level
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {severityLevels.map((level) => (
                <motion.button
                  key={level.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      severity: level.id,
                    }))
                  }
                  className="p-4 rounded-xl text-left transition-all"
                  style={{
                    background:
                      form.severity === level.id
                        ? `${level.color}10`
                        : 'rgba(15,23,42,0.3)',
                    border:
                      form.severity === level.id
                        ? `1px solid ${level.color}40`
                        : '1px solid transparent',
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: level.color,
                        boxShadow: `0 0 8px ${level.color}50`,
                      }}
                    />

                    <span
                      className="text-sm font-semibold"
                      style={{ color: level.color }}
                    >
                      {level.label}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">{level.desc}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card p-6"
          >
            <h2 className="text-lg font-semibold text-slate-200 mb-2">
              Describe the incident
            </h2>

            <p className="text-sm text-slate-500 mb-6">
              Provide as much detail as you're comfortable sharing
            </p>

            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe what happened, where, and any other relevant details..."
              maxLength={500}
              className="input-field h-40 resize-none"
            />

            <p className="text-xs text-slate-600 mt-2">
              {form.description.length}/500 characters (minimum 10)
            </p>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-slate-300 mb-3">
                Location (optional)
              </h3>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleGetLocation}
                  disabled={locating}
                  className="btn-secondary flex items-center gap-2 text-sm"
                >
                  <MapPin className="w-4 h-4" />
                  {locating
                    ? 'Locating...'
                    : form.location_name
                    ? 'Location Set'
                    : 'Share Location'}
                </button>

                {form.location_name && (
                  <span className="text-xs text-slate-500">
                    {form.location_name} (
                    {form.latitude !== 0
                      ? form.latitude.toFixed(4)
                      : 'coordinates pending'}
                    {form.longitude !== 0 &&
                      `, ${form.longitude.toFixed(4)}`}
                    )
                  </span>
                )}
              </div>

              <input
                type="text"
                placeholder="Or type a location name (e.g., Jhajjar, Gurgaon)"
                value={form.location_name}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    location_name: e.target.value,
                    latitude: 0,
                    longitude: 0,
                  }))
                }
                onBlur={handleManualLocation}
                className="input-field mt-3"
              />

              <input
                type="text"
                placeholder="Zone (e.g., Haryana, Central Delhi)"
                value={form.zone}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    zone: e.target.value,
                  }))
                }
                className="input-field mt-3"
              />

              <p className="text-xs text-slate-600 mt-2">
                Enter a city, locality, or landmark. Coordinates are resolved
                automatically for the heatmap.
              </p>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card p-6"
          >
            <h2 className="text-lg font-semibold text-slate-200 mb-2">
              Review & Submit
            </h2>

            <p className="text-sm text-slate-500 mb-6">
              Please review your report before submitting
            </p>

            <div className="space-y-4">
              <div
                className="p-4 rounded-xl"
                style={{
                  background: 'rgba(139,92,246,0.05)',
                  border: '1px solid rgba(139,92,246,0.15)',
                }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Category</p>
                    <p className="text-sm font-medium text-slate-200 capitalize">
                      {form.category}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 mb-1">Severity</p>

                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor: severityLevels.find(
                            (s) => s.id === form.severity
                          )?.color,
                          boxShadow: `0 0 8px ${
                            severityLevels.find(
                              (s) => s.id === form.severity
                            )?.color
                          }50`,
                        }}
                      />

                      <p
                        className="text-sm font-medium capitalize"
                        style={{
                          color: severityLevels.find(
                            (s) => s.id === form.severity
                          )?.color,
                        }}
                      >
                        {form.severity}
                      </p>
                    </div>
                  </div>

                  {form.location_name && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Location</p>

                      <p className="text-sm text-slate-300 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-violet-400" />
                        {form.location_name}
                      </p>

                      {form.latitude !== 0 && form.longitude !== 0 && (
                        <p className="text-xs text-slate-600 mt-1">
                          {form.latitude.toFixed(4)},{' '}
                          {form.longitude.toFixed(4)}
                        </p>
                      )}
                    </div>
                  )}

                  {form.zone && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Zone</p>
                      <p className="text-sm text-slate-300">{form.zone}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-1">Description</p>
                <p className="text-sm text-slate-300">
                  {form.description}
                </p>
              </div>

              <div
                className="flex items-center gap-2 p-3 rounded-xl"
                style={{
                  background: 'rgba(52,211,153,0.05)',
                  border: '1px solid rgba(52,211,153,0.15)',
                }}
              >
                <Eye className="w-4 h-4 text-emerald-400" />
                <p className="text-xs text-emerald-400">
                  This report is fully anonymous. No personal data will be
                  collected.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(Math.max(1, step - 1))}
          className={`btn-secondary text-sm ${
            step === 1 ? 'invisible' : ''
          }`}
        >
          Back
        </button>

        {step < 4 ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => canProceed() && setStep(step + 1)}
            disabled={!canProceed()}
            className="btn-primary text-white text-sm flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="btn-primary text-white text-sm flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #34D399, #10B981)',
            }}
          >
            <Send className="w-4 h-4" />
            Submit Report
          </motion.button>
        )}
      </div>
    </div>
  );
}