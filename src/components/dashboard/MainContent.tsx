'use client';

import React from 'react';
import { motion } from 'framer-motion';
import KPISection from './KPISection';
import SmartMap from './SmartMap';
import LiveIncidentsFeed from './LiveIncidents';
import PredictiveAlerts from './PredictiveAlerts';
import AIAssistant from './AIAssistant';

interface MainContentProps {
  activeSection: string;
  language: string;
  role: string;
}

const MainContent: React.FC<MainContentProps> = ({ activeSection, language, role }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="pt-24 pb-8 px-6 max-w-7xl mx-auto"
    >
      {/* Dashboard Overview */}
      {activeSection === 'overview' && (
        <motion.div variants={itemVariants} className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h2>
            <p className="text-slate-400">Real-time provincial safety metrics and status</p>
          </div>
          <KPISection />
        </motion.div>
      )}

      {/* Provincial Smart Map */}
      {activeSection === 'map' && (
        <motion.div variants={itemVariants} className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Provincial Smart Map</h2>
            <p className="text-slate-400">Interactive map with real-time incident tracking and resource deployment</p>
          </div>
          <SmartMap />
        </motion.div>
      )}

      {/* Live Incidents */}
      {activeSection === 'incidents' && (
        <motion.div variants={itemVariants} className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Live Incident Feed</h2>
            <p className="text-slate-400">Real-time stream of all provincial alerts and SOS calls</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <LiveIncidentsFeed />
            </div>
            <div>
              <PredictiveAlerts />
            </div>
          </div>
        </motion.div>
      )}

      {/* Performance Metrics */}
      {activeSection === 'metrics' && (
        <motion.div variants={itemVariants} className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Performance Metrics</h2>
            <p className="text-slate-400">Detailed analytics on response times, compliance, and service delivery</p>
          </div>
          <KPISection />
        </motion.div>
      )}

      {/* Smart Traffic Control */}
      {activeSection === 'traffic' && (
        <motion.div variants={itemVariants} className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Smart Traffic Control</h2>
            <p className="text-slate-400">Manage traffic lights and emergency vehicle routing</p>
          </div>
          <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl p-8 text-center">
            <p className="text-slate-400 mb-4">Traffic control system initializing...</p>
            <SmartMap />
          </div>
        </motion.div>
      )}

      {/* AI Predictions */}
      {activeSection === 'predictions' && (
        <motion.div variants={itemVariants} className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">AI Predictive Analytics</h2>
            <p className="text-slate-400">Machine learning forecasts for crime, infrastructure, and health risks</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PredictiveAlerts />
            </div>
            <div>
              <AIAssistant />
            </div>
          </div>
        </motion.div>
      )}

      {/* Settings & Reports */}
      {activeSection === 'settings' && (
        <motion.div variants={itemVariants} className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Settings & Reports</h2>
            <p className="text-slate-400">System configuration and automated report generation</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Export Reports</h3>
              <button className="w-full bg-blue-500/30 hover:bg-blue-500/50 border border-blue-500/50 text-blue-300 font-semibold py-3 rounded-lg transition-colors mb-3">
                Generate PDF Report
              </button>
              <button className="w-full bg-green-500/30 hover:bg-green-500/50 border border-green-500/50 text-green-300 font-semibold py-3 rounded-lg transition-colors">
                Export to CSV
              </button>
            </div>
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">System Preferences</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm text-slate-300">Enable notifications</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm text-slate-300">Dark mode (always on)</span>
                </label>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MainContent;
