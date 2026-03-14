'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="w-20 h-20 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-slate-400 mb-8 max-w-md">
          Your role does not have permission to access the Premier Command Centre. Contact your administrator for access.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500/30 hover:bg-blue-500/50 border border-blue-500/50 text-blue-300 rounded-lg transition-colors"
        >
          <Home className="w-4 h-4" />
          Return to Login
        </Link>
      </motion.div>
    </div>
  );
};

export default UnauthorizedPage;
