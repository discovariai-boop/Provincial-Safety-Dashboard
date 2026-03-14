'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Globe, Clock, LogOut, AlertTriangle, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Language {
  code: string;
  name: string;
}

interface TopBarProps {
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  languages: Language[];
  onSignOut: () => void;
  role: string;
}

const TopBar: React.FC<TopBarProps> = ({
  sidebarOpen,
  onSidebarToggle,
  language,
  onLanguageChange,
  languages,
  onSignOut,
  role,
}) => {
  const { user } = useAuth();
  const [time, setTime] = React.useState<string>(new Date().toLocaleTimeString());
  const [riskIndex, setRiskIndex] = React.useState<number>(42);
  const [showLanguageMenu, setShowLanguageMenu] = React.useState(false);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getRiskColor = (risk: number) => {
    if (risk > 70) return 'from-red-500 to-red-600';
    if (risk > 50) return 'from-orange-500 to-orange-600';
    return 'from-green-500 to-emerald-600';
  };

  const getRiskLabel = (risk: number) => {
    if (risk > 70) return 'High Risk';
    if (risk > 50) return 'Elevated';
    return 'Normal';
  };

  return (
    <div className="h-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 backdrop-blur-lg flex items-center justify-between px-6 gap-4 fixed top-0 right-0 left-0 z-50">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSidebarToggle}
          className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-slate-300" />
        </motion.button>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <h1 className="text-lg font-bold text-white hidden sm:block">LPISTH Premier Command Centre</h1>
        </div>
      </div>

      {/* Center Section - Real-time Metrics */}
      <div className="hidden lg:flex items-center gap-6">
        {/* Clock */}
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-slate-300 font-mono">{time}</span>
          <span className="text-xs text-slate-500">SAST</span>
        </div>

        {/* National Risk Index Gauge */}
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-700/30 border border-slate-600/50 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">Risk Index</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-2 bg-black/20 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${getRiskColor(riskIndex)} transition-all duration-500`}
                  style={{ width: `${riskIndex}%` }}
                ></div>
              </div>
              <span className={`text-sm font-bold bg-gradient-to-r ${getRiskColor(riskIndex)} bg-clip-text text-transparent`}>
                {riskIndex}%
              </span>
            </div>
          </div>
          <span className="text-xs text-slate-400 ml-2">{getRiskLabel(riskIndex)}</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Language Selector */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className="flex items-center gap-2 px-3 py-2 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 rounded-lg transition-colors text-sm text-slate-300"
          >
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline uppercase">{language}</span>
            <ChevronDown className="w-3 h-3" />
          </motion.button>

          {showLanguageMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden z-10 min-w-[150px]"
            >
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setShowLanguageMenu(false);
                  }}
                  className={`w-full px-4 py-2 text-sm text-left hover:bg-slate-700 transition-colors ${
                    language === lang.code ? 'bg-blue-500/20 text-blue-300' : 'text-slate-300'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* User Info */}
        {user && (
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-700/30 border border-slate-600/50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <span className="text-xs font-bold text-white">{user.email?.[0].toUpperCase() || 'U'}</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs text-slate-400">Role</span>
              <span className="text-sm font-semibold text-white capitalize">{role}</span>
            </div>
          </div>
        )}

        {/* Sign Out */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSignOut}
          className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default TopBar;
