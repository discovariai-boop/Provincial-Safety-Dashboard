'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SmartTrafficLight {
  id: string;
  location: string;
  currentPhase: 'green' | 'yellow' | 'red';
  timing: number;
  adaptiveMode: boolean;
  vehiclesWaiting: number;
  averageWaitTime: number;
  violationCount: number;
}

const mockTrafficLights: SmartTrafficLight[] = [
  {
    id: 'tl1',
    location: 'Polokwane CBD - Main St',
    currentPhase: 'green',
    timing: 42,
    adaptiveMode: true,
    vehiclesWaiting: 34,
    averageWaitTime: 4.2,
    violationCount: 2,
  },
  {
    id: 'tl2',
    location: 'Tzaneen Junction - R101',
    currentPhase: 'red',
    timing: 28,
    adaptiveMode: false,
    vehiclesWaiting: 67,
    averageWaitTime: 8.5,
    violationCount: 7,
  },
  {
    id: 'tl3',
    location: 'Musina - N1 Ramp',
    currentPhase: 'green',
    timing: 35,
    adaptiveMode: true,
    vehiclesWaiting: 28,
    averageWaitTime: 3.8,
    violationCount: 1,
  },
  {
    id: 'tl4',
    location: 'Mokopane - Central',
    currentPhase: 'yellow',
    timing: 5,
    adaptiveMode: true,
    vehiclesWaiting: 45,
    averageWaitTime: 5.2,
    violationCount: 4,
  },
];

const SmartTrafficLightsPanel: React.FC = () => {
  const [selectedLight, setSelectedLight] = useState<string | null>(null);

  const phaseColor = (phase: string) => {
    switch (phase) {
      case 'green':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'yellow':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'red':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  const adaptiveData = [
    { time: '12:00', waitTime: 4.2, throughput: 156 },
    { time: '13:00', waitTime: 5.8, throughput: 142 },
    { time: '14:00', waitTime: 6.2, throughput: 138 },
    { time: '15:00', waitTime: 4.5, throughput: 168 },
    { time: '16:00', waitTime: 3.8, throughput: 175 },
    { time: '17:00', waitTime: 7.2, throughput: 132 },
  ];

  const performanceByIntersection = mockTrafficLights.map(light => ({
    location: light.location.split(' - ')[1] || 'Location',
    efficiency: Math.round(100 - (light.averageWaitTime * 10)),
    violations: light.violationCount,
  }));

  const totalAdaptiveMode = mockTrafficLights.filter(l => l.adaptiveMode).length;
  const avgWaitTime = (mockTrafficLights.reduce((sum, l) => sum + l.averageWaitTime, 0) / mockTrafficLights.length).toFixed(1);
  const totalViolations = mockTrafficLights.reduce((sum, l) => sum + l.violationCount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-amber-400" />
          Smart Traffic Lights Control
        </h3>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-blue-400">{totalAdaptiveMode}</p>
            <p className="text-xs text-slate-400">Adaptive Mode</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-purple-400">{avgWaitTime}s</p>
            <p className="text-xs text-slate-400">Avg Wait Time</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-red-400">{totalViolations}</p>
            <p className="text-xs text-slate-400">Violations Today</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-green-400">94%</p>
            <p className="text-xs text-slate-400">System Health</p>
          </div>
        </div>
      </div>

      {/* Traffic Lights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockTrafficLights.map((light, idx) => (
          <motion.div
            key={light.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
            onClick={() => setSelectedLight(selectedLight === light.id ? null : light.id)}
            className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-lg p-4 cursor-pointer transition-all hover:border-amber-500/50"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-white text-sm">{light.location}</p>
                {light.adaptiveMode && (
                  <p className="text-xs text-cyan-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    Adaptive Mode Active
                  </p>
                )}
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border ${phaseColor(light.currentPhase)}`}>
                {light.timing}s
              </div>
            </div>

            {/* Traffic Light Indicator */}
            <div className="flex gap-2 mb-4 py-3 px-3 bg-slate-800/50 rounded">
              <div className={`w-4 h-4 rounded-full ${light.currentPhase === 'green' ? 'bg-green-500 animate-pulse' : 'bg-slate-700'}`}></div>
              <div className={`w-4 h-4 rounded-full ${light.currentPhase === 'yellow' ? 'bg-yellow-500 animate-pulse' : 'bg-slate-700'}`}></div>
              <div className={`w-4 h-4 rounded-full ${light.currentPhase === 'red' ? 'bg-red-500 animate-pulse' : 'bg-slate-700'}`}></div>
            </div>

            {/* Metrics */}
            <div className="space-y-2 border-t border-slate-700/50 pt-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Vehicles Waiting</span>
                <span className="text-white font-semibold">{light.vehiclesWaiting}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Avg Wait Time</span>
                <span className="text-white font-semibold">{light.averageWaitTime.toFixed(1)}s</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Violations</span>
                <span className={light.violationCount > 5 ? 'text-red-400 font-semibold' : 'text-green-400 font-semibold'}>
                  {light.violationCount}
                </span>
              </div>
            </div>

            {/* Manual Override Alert */}
            {!light.adaptiveMode && (
              <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-xs text-yellow-300 flex items-center gap-2">
                <AlertCircle className="w-3 h-3" />
                Manual mode - Consider enabling adaptive
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wait Time Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl p-6"
        >
          <h4 className="text-md font-semibold text-white mb-4">Wait Time vs Throughput (Today)</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={adaptiveData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.2)" />
              <XAxis dataKey="time" stroke="rgba(148,163,184,0.6)" />
              <YAxis stroke="rgba(148,163,184,0.6)" yAxisId="left" />
              <YAxis stroke="rgba(148,163,184,0.6)" yAxisId="right" orientation="right" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15,23,42,0.9)',
                  border: '1px solid rgba(100,116,139,0.5)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="waitTime" stroke="#ef4444" strokeWidth={2} name="Wait Time (s)" />
              <Line yAxisId="right" type="monotone" dataKey="throughput" stroke="#10b981" strokeWidth={2} name="Throughput (vehicles)" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Efficiency by Intersection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl p-6"
        >
          <h4 className="text-md font-semibold text-white mb-4">Efficiency by Intersection</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={performanceByIntersection}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.2)" />
              <XAxis dataKey="location" stroke="rgba(148,163,184,0.6)" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="rgba(148,163,184,0.6)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15,23,42,0.9)',
                  border: '1px solid rgba(100,116,139,0.5)',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="efficiency" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SmartTrafficLightsPanel;
