'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, AlertTriangle, Cloud } from 'lucide-react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AICrimePanelProps {
  dateRange: 'today' | 'week' | 'month';
}

const AICrimePanel: React.FC<AICrimePanelProps> = ({ dateRange }) => {
  const crimeData = [
    { time: '00:00', predicted: 2, actual: 1 },
    { time: '06:00', predicted: 5, actual: 4 },
    { time: '12:00', predicted: 8, actual: 9 },
    { time: '18:00', predicted: 12, actual: 11 },
    { time: '24:00', predicted: 3, actual: 2 },
  ];

  const infraData = [
    { facility: 'Power Grid', status: 95, type: 'Operational' },
    { facility: 'Water System', status: 88, type: 'Normal' },
    { facility: 'Bridges', status: 92, type: 'Safe' },
    { facility: 'Roads', status: 78, type: 'Maintenance' },
  ];

  const predictions = [
    { location: 'R81 Corridor', risk: 78, timeframe: 'Next 6 hours', confidence: 94 },
    { location: 'Polokwane CBD', risk: 45, timeframe: 'Next 24 hours', confidence: 87 },
    { location: 'N1 Highway', risk: 62, timeframe: 'Next 12 hours', confidence: 91 },
  ];

  return (
    <div className="space-y-6">
      {/* AI Crime Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          AI Crime Predictions
        </h3>
        <div className="mb-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <p className="text-sm text-purple-300">
            <span className="font-semibold">Next 6 hours:</span> Expected 8-12 incidents across province (78% confidence)
          </p>
        </div>
        <div className="space-y-3">
          {predictions.map((pred, idx) => (
            <div key={idx} className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-sm text-white">{pred.location}</p>
                  <p className="text-xs text-slate-400">{pred.timeframe}</p>
                </div>
                <span className={`text-sm font-bold ${pred.risk > 70 ? 'text-red-400' : pred.risk > 50 ? 'text-orange-400' : 'text-yellow-400'}`}>
                  {pred.risk}% risk
                </span>
              </div>
              <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                <div
                  className={`h-full ${pred.risk > 70 ? 'bg-red-500' : pred.risk > 50 ? 'bg-orange-500' : 'bg-yellow-500'}`}
                  style={{ width: `${pred.risk}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-400 mt-2">{pred.confidence}% confidence</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Infrastructure Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          Infrastructure Monitoring
        </h3>
        <div className="space-y-3">
          {infraData.map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-sm text-white">{item.facility}</p>
                  <p className="text-xs text-slate-400">{item.type}</p>
                </div>
                <span className="text-sm font-bold text-green-400">{item.status}%</span>
              </div>
              <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                  style={{ width: `${item.status}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Weather & Disease Risk */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Cloud className="w-5 h-5 text-blue-400" />
          Alerts
        </h3>
        <div className="space-y-2">
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-300"><span className="font-semibold">Weather:</span> Heavy rainfall expected 18:00-22:00</p>
          </div>
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-300"><span className="font-semibold">Disease:</span> Minor respiratory illness detected in Polokwane</p>
          </div>
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-sm text-green-300"><span className="font-semibold">Status:</span> Province-wide systems nominal</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AICrimePanel;
