'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock, MapPin } from 'lucide-react';

interface PredictionAlert {
  id: string;
  type: 'crime' | 'disease' | 'infrastructure' | 'weather';
  location: string;
  risk: number;
  timeframe: string;
  description: string;
  confidence: number;
  icon: React.ReactNode;
  color: string;
}

const PredictiveAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<PredictionAlert[]>([
    {
      id: '1',
      type: 'crime',
      location: 'R81 Corridor (Polokwane-Tzaneen)',
      risk: 78,
      timeframe: 'Next 6 hours',
      description: 'Heightened theft activity predicted based on historical patterns and current incidents',
      confidence: 94,
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'from-red-500/20 to-red-600/20',
    },
    {
      id: '2',
      type: 'infrastructure',
      location: 'N1 Bridge near Musina',
      risk: 45,
      timeframe: 'Next 72 hours',
      description: 'Structural monitoring shows increased stress. Preventive maintenance recommended.',
      confidence: 87,
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'from-orange-500/20 to-orange-600/20',
    },
    {
      id: '3',
      type: 'disease',
      location: 'Polokwane CBD',
      risk: 23,
      timeframe: 'Next 2 weeks',
      description: 'Minor respiratory illness increase detected. Hospital capacity adequate.',
      confidence: 76,
      icon: <Clock className="w-5 h-5" />,
      color: 'from-yellow-500/20 to-yellow-600/20',
    },
    {
      id: '4',
      type: 'weather',
      location: 'Northern Limpopo',
      risk: 62,
      timeframe: 'Next 24 hours',
      description: 'Heavy rainfall predicted. Potential flash floods in low-lying areas.',
      confidence: 91,
      icon: <MapPin className="w-5 h-5" />,
      color: 'from-blue-500/20 to-blue-600/20',
    },
  ]);

  const prevAlertsRef = useRef<PredictionAlert[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Simulate real-time updates for demonstration
    const interval = setInterval(() => {
      const newAlert: PredictionAlert = {
        id: `alert-${Date.now()}`,
        type: Math.random() > 0.5 ? 'crime' : 'weather',
        location: `Simulated Location ${Math.floor(Math.random() * 100)}`,
        risk: Math.floor(Math.random() * 100),
        timeframe: 'Just now',
        description: 'Simulated alert for demonstration purposes.',
        confidence: Math.floor(Math.random() * 100),
        icon: Math.random() > 0.5 ? <AlertTriangle className="w-5 h-5" /> : <MapPin className="w-5 h-5" />,
        color: Math.random() > 0.5 ? 'from-red-500/20 to-red-600/20' : 'from-blue-500/20 to-blue-600/20',
      };
      setAlerts(prevAlerts => [newAlert, ...prevAlerts.slice(0, 3)]); // Keep only latest 4 alerts
    }, 5000); // Add a new alert every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const currentAlertIds = new Set(alerts.map(alert => alert.id));
    const prevAlertIds = new Set(prevAlertsRef.current.map(alert => alert.id));

    // Find newly added alerts
    const newAlerts = alerts.filter(alert => !prevAlertIds.has(alert.id));

    newAlerts.forEach(alert => {
      if (alert.risk > 70 && audioRef.current) {
        audioRef.current.play().catch(e => console.error("Error playing sound:", e));
      }
    });

    prevAlertsRef.current = alerts;
  }, [alerts]);

  return (
    <div className="space-y-4">
      <audio ref={audioRef} src="/alert.mp3" preload="auto" />

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Predictive Analytics</h3>
        <span className="text-xs font-medium text-slate-400">AI-powered forecasts</span>
      </div>

      <div className="space-y-3">
        {alerts.map((alert, idx) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-gradient-to-r ${alert.color} backdrop-blur-lg border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all`}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="mt-1 text-white/60">{alert.icon}</div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm text-white capitalize">
                    {alert.type.replace('_', ' ')} Alert
                  </h4>
                  <span className="text-xs font-semibold text-white px-3 py-1 bg-white/10 rounded-full">
                    {alert.confidence}% confidence
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-2">{alert.description}</p>

                <div className="grid grid-cols-2 gap-2">
                  <div className="text-xs text-slate-400">
                    <span className="font-medium">Risk Level:</span>
                    <div className="mt-1 h-2 bg-black/20 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${alert.risk > 70 ? 'from-red-500 to-red-600' : alert.risk > 40 ? 'from-yellow-500 to-orange-500' : 'from-green-500 to-emerald-500'}`}
                        style={{ width: `${alert.risk}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-semibold mt-1">{alert.risk}%</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    <span className="font-medium">Location:</span>
                    <p className="mt-1 font-semibold">{alert.location}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>{alert.timeframe}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PredictiveAlerts;
