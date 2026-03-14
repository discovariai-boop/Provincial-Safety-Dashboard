'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Award, BarChart3 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsKPISectionProps {
  dateRange: 'today' | 'week' | 'month';
}

const AnalyticsKPISection: React.FC<AnalyticsKPISectionProps> = ({ dateRange }) => {
  const [animatedUsers, setAnimatedUsers] = useState(0);
  const totalUsers = 12847;

  useEffect(() => {
    let current = 0;
    const increment = totalUsers / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= totalUsers) {
        setAnimatedUsers(totalUsers);
        clearInterval(timer);
      } else {
        setAnimatedUsers(Math.floor(current));
      }
    }, 30);
    return () => clearInterval(timer);
  }, []);

  const dailyActiveData = [
    { time: '00:00', users: 234 },
    { time: '04:00', users: 189 },
    { time: '08:00', users: 1245 },
    { time: '12:00', users: 2834 },
    { time: '16:00', users: 3456 },
    { time: '20:00', users: 2100 },
  ];

  const cityEngagementData = [
    { city: 'Polokwane', engagement: 4500 },
    { city: 'Tzaneen', engagement: 2300 },
    { city: 'Musina', engagement: 1800 },
    { city: 'Nylstroom', engagement: 1200 },
    { city: 'Mokopane', engagement: 900 },
  ];

  const cohortData = [
    { name: 'Today New', value: 342, color: '#3b82f6' },
    { name: 'Returning', value: 2598, color: '#10b981' },
  ];

  return (
    <div className="space-y-6">
      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Active Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl p-6 hover:border-blue-500/50 transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-slate-400 font-medium">Total Active Users</p>
              <h3 className="text-4xl font-bold text-white mt-2">{animatedUsers.toLocaleString()}</h3>
              <p className="text-xs text-green-400 mt-2">↑ 12% vs last week</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
          </div>
        </motion.div>

        {/* Daily Active Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl p-6 hover:border-green-500/50 transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-slate-400 font-medium">Daily Active Users</p>
              <h3 className="text-4xl font-bold text-white mt-2">2,940</h3>
              <p className="text-xs text-green-400 mt-2">↑ 8% today</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
          </div>
        </motion.div>

        {/* Engagement Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl p-6 hover:border-amber-500/50 transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-slate-400 font-medium">Avg. Engagement</p>
              <h3 className="text-4xl font-bold text-white mt-2">87%</h3>
              <p className="text-xs text-amber-400 mt-2">↑ 3% vs target</p>
            </div>
            <div className="p-3 bg-amber-500/20 rounded-lg">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
          </div>
        </motion.div>

        {/* Response Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl p-6 hover:border-red-500/50 transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-slate-400 font-medium">Avg Response Time</p>
              <h3 className="text-4xl font-bold text-white mt-2">4m 32s</h3>
              <p className="text-xs text-red-400 mt-2">↓ 12% improvement</p>
            </div>
            <div className="p-3 bg-red-500/20 rounded-lg">
              <BarChart3 className="w-5 h-5 text-red-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Active Users Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">24-Hour Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyActiveData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.3)" />
              <XAxis dataKey="time" stroke="rgba(148,163,184,0.6)" />
              <YAxis stroke="rgba(148,163,184,0.6)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15,23,42,0.9)',
                  border: '1px solid rgba(100,116,139,0.5)',
                  borderRadius: '8px',
                  color: '#e2e8f0',
                }}
              />
              <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Cohort Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Cohort Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={cohortData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {cohortData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15,23,42,0.9)',
                  border: '1px solid rgba(100,116,139,0.5)',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {cohortData.map(item => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="text-white font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* City Engagement Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Top 5 Cities by Engagement</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={cityEngagementData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.3)" />
            <XAxis dataKey="city" stroke="rgba(148,163,184,0.6)" />
            <YAxis stroke="rgba(148,163,184,0.6)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15,23,42,0.9)',
                border: '1px solid rgba(100,116,139,0.5)',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="engagement" fill="#f59e0b" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default AnalyticsKPISection;
