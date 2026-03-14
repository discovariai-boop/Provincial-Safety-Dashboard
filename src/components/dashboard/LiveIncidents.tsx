'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Users, MapPin, Clock, Phone, Volume2 } from 'lucide-react';
import { onSnapshot, collection, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Incident {
  id: string;
  type: 'sos' | 'voice_command' | 'family_alert' | 'medical' | 'break_in';
  severity: 'critical' | 'high' | 'medium' | 'low';
  latitude: number;
  longitude: number;
  description: string;
  timestamp: Date;
  videoUrl?: string;
  familyAlerts?: number;
  department: string;
  status: 'new' | 'assigned' | 'responding' | 'resolved';
}

const LiveIncidentsFeed: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'incidents'),
      where('timestamp', '>=', new Date(Date.now() - 24 * 60 * 60 * 1000)),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newIncidents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as Incident[];
      setIncidents(newIncidents.slice(0, 20));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sos':
        return <AlertCircle className="w-5 h-5" />;
      case 'voice_command':
        return <Volume2 className="w-5 h-5" />;
      case 'family_alert':
        return <Users className="w-5 h-5" />;
      case 'medical':
        return <Phone className="w-5 h-5" />;
      case 'break_in':
        return <MapPin className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          Live Incident Feed
        </h3>
        <span className="text-xs font-medium text-slate-400">
          {incidents.length} active incidents
        </span>
      </div>

      {/* Incidents List */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {incidents.map((incident, idx) => (
          <motion.div
            key={incident.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`border rounded-lg p-4 backdrop-blur-lg transition-all duration-300 hover:border-white/20 cursor-pointer ${getSeverityColor(
              incident.severity
            )}`}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="mt-1">{getTypeIcon(incident.type)}</div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-semibold text-sm capitalize">
                    {incident.type.replace('_', ' ')}
                  </h4>
                  <span className="text-xs font-medium px-2 py-1 bg-white/10 rounded whitespace-nowrap">
                    {incident.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-3">{incident.description}</p>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <MapPin className="w-3 h-3" />
                    <span>{incident.latitude.toFixed(3)}, {incident.longitude.toFixed(3)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{incident.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-blue-500/30 hover:bg-blue-500/50 border border-blue-500/50 text-blue-300 text-xs font-semibold py-2 rounded transition-colors"
                  >
                    Dispatch Now
                  </motion.button>
                  {incident.videoUrl && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-purple-500/30 hover:bg-purple-500/50 border border-purple-500/50 text-purple-300 text-xs font-semibold py-2 rounded transition-colors"
                    >
                      View Video (20s)
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LiveIncidentsFeed;
