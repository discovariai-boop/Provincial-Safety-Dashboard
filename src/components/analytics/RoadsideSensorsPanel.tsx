'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, Zap, AlertTriangle, Battery, Signal } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface RoadsideSensorsData {
  id: string;
  location: string;
  type: 'lidar' | 'acoustic' | 'speed' | 'vehicle_count' | 'pothole';
  status: 'online' | 'offline' | 'maintenance';
  lastPing: string;
  battery: number;
  signalStrength: number;
}

const mockSensors: RoadsideSensorsData[] = [
  { id: 's1', location: 'N1 - Polokwane', type: 'lidar', status: 'online', lastPing: '2s ago', battery: 87, signalStrength: 95 },
  { id: 's2', location: 'R81 - km42', type: 'pothole', status: 'online', lastPing: '1s ago', battery: 12, signalStrength: 82 },
  { id: 's3', location: 'R101 - Tzaneen', type: 'speed', status: 'maintenance', lastPing: '45m ago', battery: 0, signalStrength: 0 },
  { id: 's4', location: 'N1 - Capricorn', type: 'vehicle_count', status: 'online', lastPing: '3s ago', battery: 64, signalStrength: 91 },
  { id: 's5', location: 'R81 - Junction', type: 'acoustic', status: 'offline', lastPing: '2h ago', battery: 5, signalStrength: 0 },
  { id: 's6', location: 'Mopani Main Rd', type: 'lidar', status: 'online', lastPing: '2s ago', battery: 78, signalStrength: 88 },
];

const RoadsideSensorsPanel: React.FC = () => {
  const [expandedSensor, setExpandedSensor] = useState<string | null>(null);

  const onlineSensors = mockSensors.filter(s => s.status === 'online').length;
  const offlineSensors = mockSensors.filter(s => s.status === 'offline').length;
  const maintenanceSensors = mockSensors.filter(s => s.status === 'maintenance').length;

  const sensorHealthData = [
    { name: 'Online', value: onlineSensors, fill: '#10b981' },
    { name: 'Offline', value: offlineSensors, fill: '#ef4444' },
    { name: 'Maintenance', value: maintenanceSensors, fill: '#f59e0b' },
  ];

  const sensorPerformanceData = [
    { location: 'N1 Polokwane', reliability: 99, detections: 847 },
    { location: 'R81 km42', reliability: 94, detections: 632 },
    { location: 'R101 Tzaneen', reliability: 78, detections: 451 },
    { location: 'N1 Capricorn', reliability: 96, detections: 923 },
    { location: 'Mopani Main', reliability: 92, detections: 561 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500/20 border-green-500/50 text-green-300';
      case 'offline':
        return 'bg-red-500/20 border-red-500/50 text-red-300';
      case 'maintenance':
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300';
      default:
        return 'bg-slate-500/20 border-slate-500/50 text-slate-300';
    }
  };

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'lidar':
        return '🔴';
      case 'acoustic':
        return '🔊';
      case 'speed':
        return '📊';
      case 'vehicle_count':
        return '🚗';
      case 'pothole':
        return '⚠️';
      default:
        return '📡';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
          <Radio className="w-5 h-5 text-cyan-400" />
          Roadside Sensors Network
        </h3>

        {/* Status Overview */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-green-400">{onlineSensors}</p>
            <p className="text-xs text-slate-400">Online</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-red-400">{offlineSensors}</p>
            <p className="text-xs text-slate-400">Offline</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-yellow-400">{maintenanceSensors}</p>
            <p className="text-xs text-slate-400">Maintenance</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-blue-400">847</p>
            <p className="text-xs text-slate-400">Detections/h</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-purple-400">2.3s</p>
            <p className="text-xs text-slate-400">Avg Response</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-amber-400">94%</p>
            <p className="text-xs text-slate-400">Network Health</p>
          </div>
        </div>
      </div>

      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockSensors.map((sensor, idx) => (
          <motion.div
            key={sensor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
            onClick={() => setExpandedSensor(expandedSensor === sensor.id ? null : sensor.id)}
            className={`bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-lg p-4 cursor-pointer transition-all hover:border-cyan-500/50 ${
              sensor.status !== 'online' ? 'opacity-70' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getSensorIcon(sensor.type)}</span>
                <div>
                  <p className="font-semibold text-white text-sm">{sensor.location}</p>
                  <p className="text-xs text-slate-400 capitalize">{sensor.type.replace('_', ' ')}</p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(sensor.status)}`}>
                {sensor.status}
              </div>
            </div>

            {/* Status Indicators */}
            <div className="space-y-2 border-t border-slate-700/50 pt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Battery</span>
                <div className="flex items-center gap-2">
                  <Battery className="w-3 h-3 text-slate-400" />
                  <span className={sensor.battery < 20 ? 'text-red-400 font-bold' : 'text-slate-300'}>
                    {sensor.battery}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Signal</span>
                <div className="flex items-center gap-2">
                  <Signal className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-300">{sensor.signalStrength}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Last Ping</span>
                <span className="text-slate-300">{sensor.lastPing}</span>
              </div>
            </div>

            {/* Battery Warning */}
            {sensor.battery < 20 && sensor.status === 'online' && (
              <div className="mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-3 h-3" />
                Low battery
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sensor Health Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl p-6"
        >
          <h4 className="text-md font-semibold text-white mb-4">Sensor Health Status</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={sensorHealthData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {sensorHealthData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
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
            {sensorHealthData.map(item => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: item.fill }}></div>
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="text-white font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sensor Performance Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl p-6"
        >
          <h4 className="text-md font-semibold text-white mb-4">Sensor Reliability</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={sensorPerformanceData}>
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
              <Bar dataKey="reliability" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RoadsideSensorsPanel;
