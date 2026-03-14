'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Ambulance, Car, Zap } from 'lucide-react';
import { X, LayoutDashboard, Map, BarChart3, Settings } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  role: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange, role }) => {
  const menuItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard, roles: ['premier', 'national_executive', 'minister', 'director', 'commander', 'chief', 'admin', 'analyst'] },
    { id: 'map', label: 'Provincial Smart Map', icon: Map, roles: ['premier', 'national_executive', 'minister', 'director', 'commander', 'chief', 'admin'] },
    { id: 'incidents', label: 'Live Incidents', icon: AlertCircle, roles: ['premier', 'national_executive', 'minister', 'director', 'commander', 'chief', 'admin'] },
    { id: 'metrics', label: 'Performance Metrics', icon: BarChart3, roles: ['premier', 'national_executive', 'minister', 'director', 'admin'] },
    { id: 'traffic', label: 'Smart Traffic Control', icon: Zap, roles: ['premier', 'national_executive', 'chief', 'commander'] },
    { id: 'predictions', label: 'AI Predictions', icon: AlertCircle, roles: ['premier', 'national_executive', 'minister', 'director', 'admin', 'analyst'] },
    { id: 'settings', label: 'Settings & Reports', icon: Settings, roles: ['premier', 'national_executive', 'admin'] },
  ];

  const notifications = {
    incidents: 12,
    alerts: 3,
    tasks: 5,
  };

  return (
    <motion.div
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      exit={{ x: -280 }}
      className="fixed left-0 top-20 h-[calc(100vh-80px)] w-72 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-700/50 backdrop-blur-lg overflow-y-auto z-40"
    >
      {/* Sidebar Content */}
      <div className="p-6 space-y-6">
        {/* Logo Section */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-700/50">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Office of the</p>
            <h3 className="font-bold text-white">Premier</h3>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-blue-400">{notifications.incidents}</p>
            <p className="text-xs text-slate-400 mt-1">Incidents</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-red-400">{notifications.alerts}</p>
            <p className="text-xs text-slate-400 mt-1">Alerts</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-amber-400">{notifications.tasks}</p>
            <p className="text-xs text-slate-400 mt-1">Tasks</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-2 mb-3">Navigation</p>
          {menuItems.map((item) => {
            const hasAccess = item.roles.includes(role);
            if (!hasAccess) return null;

            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeSection === item.id
                    ? 'bg-blue-500/30 border border-blue-500/50 text-blue-300'
                    : 'text-slate-300 hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        {/* System Status */}
        <div className="pt-4 border-t border-slate-700/50 space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-2 mb-3">System Status</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-slate-300">Firebase Connected</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-slate-300">Map Service Active</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="text-slate-300">AI Model Loading</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
