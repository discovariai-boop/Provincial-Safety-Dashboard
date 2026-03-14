'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, Clock, AlertTriangle, LogOut } from 'lucide-react';
import TopBar from '@/components/dashboard/TopBar';
import Sidebar from '@/components/dashboard/Sidebar2';
import MainContent from '@/components/dashboard/MainContent';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [language, setLanguage] = useState<'en' | 'st' | 'tn' | 'ts' | 'af' | 'zu'>('en');
  const [activeSection, setActiveSection] = useState('overview');
  const { signOut } = useAuth();
  const { role } = useRole();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'st', name: 'Sepedi' },
    { code: 'tn', name: 'Setswana' },
    { code: 'ts', name: 'Xitsonga' },
    { code: 'af', name: 'Afrikaans' },
    { code: 'zu', name: 'isiZulu' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"none\" fill-rule=\"evenodd\"><g fill=\"%23ffffff\" fill-opacity=\"0.05\"><path d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/></g></g></svg>')] opacity-20"></div>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <Sidebar 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            role={role}
          />
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar 
          sidebarOpen={sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          language={language}
          onLanguageChange={(lang) => setLanguage(lang as typeof language)}
          languages={languages}
          onSignOut={handleSignOut}
          role={role}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <MainContent 
            activeSection={activeSection}
            language={language}
            role={role}
          />
        </div>
      </div>
    </div>
  );
}
