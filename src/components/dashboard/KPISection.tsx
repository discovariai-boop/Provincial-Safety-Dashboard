'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, AlertCircle, Radio, Users, TrendingUp, Wind } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface KPIData {
  policeResponse: { label: string; value: number; unit: string; target: string; trend: number }[];
  ambulanceResponse: { label: string; value: number; unit: string; target: string; trend: number }[];
  falseAlerts: number;
  compliance: number;
  deliveryScore: number;
}

const KPISection: React.FC = () => {
  const [kpiData, setKpiData] = useState<KPIData>({
    policeResponse: [
      { label: 'This Week', value: 4.32, unit: 'min', target: '< 5 min', trend: -12 },
    ],
    ambulanceResponse: [
      { label: 'This Week', value: 6.15, unit: 'min', target: '< 8 min', trend: -8 },
    ],
    falseAlerts: 1.2,
    compliance: 87,
    deliveryScore: 84,
  });

  const chartData = [
    { time: '00:00', police: 4.5, ambulance: 6.2, incidents: 12 },
    { time: '04:00', police: 5.2, ambulance: 7.1, incidents: 8 },
    { time: '08:00', police: 3.8, ambulance: 5.9, incidents: 24 },
    { time: '12:00', police: 4.1, ambulance: 6.3, incidents: 31 },
    { time: '16:00', police: 4.8, ambulance: 7.0, incidents: 28 },
    { time: '20:00', police: 5.1, ambulance: 6.8, incidents: 19 },
  ];

  const departmentData = [
    { name: 'SAPS', value: 32, color: '#3b82f6' },
    { name: 'EMS', value: 28, color: '#ef4444' },
    { name: 'Traffic', value: 22, color: '#f59e0b' },
    { name: 'Health', value: 12, color: '#10b981' },
    { name: 'RAL', value: 6, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Police Response Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="group bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-slate-400 font-medium">Police Response</p>
              <h3 className="text-3xl font-bold text-white mt-2">4m 32s</h3>
              <p className="text-xs text-slate-500 mt-1">Target: &lt; 5 min</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/40 transition-colors">
              <Radio className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400 text-sm font-semibold">↓ 12%</span>
            <span className="text-slate-500 text-xs">vs last week</span>
          </div>
        </motion.div>

        {/* Ambulance Response Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="group bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl p-6 hover:border-red-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-slate-400 font-medium">Ambulance Response</p>
              <h3 className="text-3xl font-bold text-white mt-2">6m 15s</h3>
              <p className="text-xs text-slate-500 mt-1">Target: &lt; 8 min</p>
            </div>
            <div className="p-3 bg-red-500/20 rounded-lg group-hover:bg-red-500/40 transition-colors">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400 text-sm font-semibold">↓ 8%</span>
            <span className="text-slate-500 text-xs">vs last week</span>
          </div>
        </motion.div>

        {/* False Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="group bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl p-6 hover:border-amber-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-slate-400 font-medium">False Alert Rate</p>
              <h3 className="text-3xl font-bold text-white mt-2">1.2%</h3>
              <p className="text-xs text-slate-500 mt-1">Target: &lt; 2%</p>
            </div>
            <div className="p-3 bg-amber-500/20 rounded-lg group-hover:bg-amber-500/40 transition-colors">
              <TrendingUp className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400 text-sm font-semibold">↑ 0.1%</span>
            <span className="text-slate-500 text-xs">vs last week</span>
          </div>
        </motion.div>

        {/* Service Delivery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="group bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl p-6 hover:border-green-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-slate-400 font-medium">Service Delivery</p>
              <h3 className="text-3xl font-bold text-white mt-2">84%</h3>
              <p className="text-xs text-slate-500 mt-1">Target: 85%+</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg group-hover:bg-green-500/40 transition-colors">
              <Users className="w-5 h-5 text-green-400" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400 text-sm font-semibold">↑ 3%</span>
            <span className="text-slate-500 text-xs">vs last week</span>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Response Times Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">24-Hour Response Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.3)" />
              <XAxis dataKey="time" stroke="rgba(148,163,184,0.6)" />
              <YAxis stroke="rgba(148,163,184,0.6)" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(15,23,42,0.9)',
                  border: '1px solid rgba(100,116,139,0.5)',
                  borderRadius: '8px',
                  color: '#e2e8f0'
                }}
              />
              <Legend wrapperStyle={{ color: 'rgba(148,163,184,0.8)' }} />
              <Line type="monotone" dataKey="police" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="ambulance" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Department Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Incidents by Department</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(15,23,42,0.9)',
                  border: '1px solid rgba(100,116,139,0.5)',
                  borderRadius: '8px',
                  color: '#e2e8f0'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default KPISection;
