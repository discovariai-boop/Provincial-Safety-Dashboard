'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Settings, Download, RefreshCw, Clock, AlertTriangle } from 'lucide-react';
import AnalyticsKPISection from '@/components/analytics/AnalyticsKPISection';
import ProvincialMap from '@/components/analytics/ProvincialMap';
import DistrictTable from '@/components/analytics/DistrictTable';
import AICrimePanel from '@/components/analytics/AICrimePanel';
import LiveEventsTicker from '@/components/analytics/LiveEventsTicker';
import WeatherImpactPanel from '@/components/analytics/WeatherImpactPanel';
import ProvincialMapWithWeather from '@/components/analytics/ProvincialMapWithWeather';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';

type DateRange = 'today' | 'week' | 'month';

const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const { role } = useRole();
  const [dateRange, setDateRange] = useState<DateRange>('week');
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [realTimeToggle, setRealTimeToggle] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString());
  const [riskIndex, setRiskIndex] = useState<number>(42);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [weatherIntensity, setWeatherIntensity] = useState(68);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-refresh every 8 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const timer = setInterval(() => {
      setLastRefresh(new Date());
    }, 8000);
    return () => clearInterval(timer);
  }, [autoRefresh]);

  const getRiskColor = (risk: number) => {
    if (risk > 70) return 'from-red-500 to-red-600';
    if (risk > 50) return 'from-orange-500 to-orange-600';
    return 'from-green-500 to-emerald-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 pb-12">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Hero Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Provincial Analytics</h1>
              <p className="text-slate-400 text-sm mt-1">Real-time Limpopo activity • Auto-refresh every 8s</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-300 font-mono">{currentTime}</span>
                <span className="text-xs text-slate-500">SAST</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-700/30 border border-slate-600/50 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400">Risk Index</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-black/20 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${getRiskColor(riskIndex)} transition-all`}
                        style={{ width: `${riskIndex}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-bold bg-gradient-to-r ${getRiskColor(riskIndex)} bg-clip-text text-transparent`}>
                      {riskIndex}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Last Refresh Info */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Last refresh: {lastRefresh.toLocaleTimeString()}
            </span>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="w-4 h-4"
                />
                Auto-refresh
              </label>
            </div>
          </div>
        </motion.div>

        {/* Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 bg-gradient-to-r from-slate-700/30 to-slate-800/30 backdrop-blur-lg border border-slate-600/30 rounded-lg p-4 flex items-center justify-between flex-wrap gap-4"
        >
          {/* Date Range Picker */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <div className="flex gap-2">
              {(['today', 'week', 'month'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    dateRange === range
                      ? 'bg-blue-500/30 border border-blue-500/50 text-blue-300'
                      : 'bg-slate-700/20 border border-slate-600/30 text-slate-400 hover:border-slate-500/50'
                  }`}
                >
                  {range === 'today' ? 'Today' : range === 'week' ? 'Last 7 Days' : 'Last 30 Days'}
                </button>
              ))}
            </div>
          </div>

          {/* District Filter */}
          <select
            value={selectedDistrict || ''}
            onChange={(e) => setSelectedDistrict(e.target.value || null)}
            className="px-3 py-1 bg-slate-800/50 border border-slate-600/50 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-blue-500/50"
          >
            <option value="">All Districts</option>
            <option value="capricorn">Capricorn</option>
            <option value="sekhukhune">Sekhukhune</option>
            <option value="waterberg">Waterberg</option>
            <option value="mopani">Mopani</option>
            <option value="vhembe">Vhembe</option>
          </select>

          {/* Real-time Toggle */}
          <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={realTimeToggle}
              onChange={(e) => setRealTimeToggle(e.target.checked)}
              className="w-4 h-4"
            />
            Real-time Data
          </label>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLastRefresh(new Date())}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400 hover:text-slate-300"
            >
              <RefreshCw className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500/30 hover:bg-blue-500/50 border border-blue-500/50 text-blue-300 rounded-lg transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="space-y-8">
          {/* Weather Impact Panel (NEW) */}
          <WeatherImpactPanel />

          {/* KPI Section */}
          <AnalyticsKPISection dateRange={dateRange} />

          {/* Live Events Ticker */}
          <LiveEventsTicker realTime={realTimeToggle} />

          {/* Map + Crime Panel Row (with Weather Overlay) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ProvincialMapWithWeather 
                selectedDistrict={selectedDistrict} 
                onDistrictSelect={setSelectedDistrict}
                weatherIntensity={weatherIntensity}
              />
            </div>
            <AICrimePanel dateRange={dateRange} />
          </div>

          {/* District Table */}
          <DistrictTable selectedDistrict={selectedDistrict} onDistrictSelect={setSelectedDistrict} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
