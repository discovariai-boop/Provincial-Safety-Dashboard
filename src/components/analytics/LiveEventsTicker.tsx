'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Phone, Volume2, Users, X } from 'lucide-react';

interface Event {
  id: string;
  type: 'sos' | 'voice_command' | 'family_alert';
  time: string;
  location: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

interface LiveEventsTickerProps {
  realTime: boolean;
}

const LiveEventsTicker: React.FC<LiveEventsTickerProps> = ({ realTime }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    // Simulate live events
    const mockEvents: Event[] = [
      {
        id: '1',
        type: 'sos',
        time: '10:32 AM',
        location: 'Polokwane CBD',
        description: 'SOS hold triggered - potential house break-in',
        severity: 'critical',
      },
      {
        id: '2',
        type: 'voice_command',
        time: '10:28 AM',
        location: 'Tzaneen North',
        description: 'Voice command: "Send Ambulance"',
        severity: 'high',
      },
      {
        id: '3',
        type: 'family_alert',
        time: '10:15 AM',
        location: 'Musina',
        description: 'Family alert flash - family members notified',
        severity: 'medium',
      },
      {
        id: '4',
        type: 'sos',
        time: '10:05 AM',
        location: 'Mokopane',
        description: 'SOS hold activated - responders en route',
        severity: 'high',
      },
    ];

    setEvents(mockEvents);

    if (realTime) {
      const interval = setInterval(() => {
        setEvents(prev => {
          const newEvent: Event = {
            id: Date.now().toString(),
            type: ['sos', 'voice_command', 'family_alert'][Math.floor(Math.random() * 3)] as any,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            location: ['Polokwane', 'Tzaneen', 'Musina', 'Mokopane'][Math.floor(Math.random() * 4)],
            description: 'Live citizen event triggered',
            severity: ['critical', 'high', 'medium'][Math.floor(Math.random() * 3)] as any,
          };
          return [newEvent, ...prev.slice(0, 9)];
        });
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [realTime]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sos':
        return <AlertCircle className="w-4 h-4" />;
      case 'voice_command':
        return <Volume2 className="w-4 h-4" />;
      case 'family_alert':
        return <Users className="w-4 h-4" />;
      default:
        return <Phone className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 border-red-500/50 text-red-300';
      case 'high':
        return 'bg-orange-500/20 border-orange-500/50 text-orange-300';
      case 'medium':
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300';
      default:
        return 'bg-blue-500/20 border-blue-500/50 text-blue-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          Latest Events & Triggers
        </h3>
        <span className="text-xs text-slate-400">Real-time feed</span>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {events.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedEvent(event)}
              className={`p-4 rounded-lg border cursor-pointer transition-all hover:border-white/30 ${getSeverityColor(
                event.severity
              )}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">{getTypeIcon(event.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-semibold text-sm capitalize">
                      {event.type.replace('_', ' ')}
                    </p>
                    <span className="text-xs opacity-75">{event.time}</span>
                  </div>
                  <p className="text-sm opacity-90">{event.description}</p>
                  <p className="text-xs opacity-75 mt-1">{event.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Event Detail Panel */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-white capitalize">
                  {selectedEvent.type.replace('_', ' ')}
                </h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Location</p>
                  <p className="text-white font-semibold">{selectedEvent.location}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Time Triggered</p>
                  <p className="text-white font-semibold">{selectedEvent.time}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Description</p>
                  <p className="text-white">{selectedEvent.description}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Severity</p>
                  <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${getSeverityColor(
                    selectedEvent.severity
                  )}`}>
                    {selectedEvent.severity.toUpperCase()}
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-700 flex gap-2">
                  <button className="flex-1 bg-blue-500/30 hover:bg-blue-500/50 border border-blue-500/50 text-blue-300 font-semibold py-2 rounded-lg transition-colors">
                    View Video
                  </button>
                  <button className="flex-1 bg-green-500/30 hover:bg-green-500/50 border border-green-500/50 text-green-300 font-semibold py-2 rounded-lg transition-colors">
                    Dispatch
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LiveEventsTicker;
