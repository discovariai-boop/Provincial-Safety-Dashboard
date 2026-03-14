'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader, Zap, AlertCircle, TrendingUp } from 'lucide-react';

interface QueryResponse {
  query: string;
  analysis: string;
  metrics: Record<string, number | string>;
  recommendation: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  highlightedLocations: string[];
  charts: {
    type: 'line' | 'bar' | 'pie';
    data: any[];
    title: string;
  }[];
}

interface AIAnalysisEngineProps {
  onQueryResponse: (response: QueryResponse) => void;
  sensorData?: any[];
  lightData?: any[];
  weatherData?: any;
  crimeData?: any[];
}

const parseQuery = (query: string): QueryResponse => {
  const lowerQuery = query.toLowerCase();
  let severity: 'critical' | 'high' | 'medium' | 'low' = 'medium';
  let recommendation = '';
  let analysis = '';
  const metrics: Record<string, number | string> = {};
  const highlightedLocations: string[] = [];
  const charts = [];

  // Parse N1 queries
  if (lowerQuery.includes('n1')) {
    highlightedLocations.push('N1');
    if (lowerQuery.includes('congestion') || lowerQuery.includes('delay')) {
      severity = 'high';
      analysis = 'N1 corridor showing elevated congestion levels. Current average wait time: 8.2 minutes. Smart lights in adaptive mode handling surge traffic.';
      metrics['avg_wait'] = '8.2 min';
      metrics['vehicles_per_hour'] = 1847;
      metrics['congestion_index'] = 78;
      recommendation = 'Activate dynamic green extension protocol at Polokwane junction. Extend southbound green by 15 seconds.';
      charts.push({
        type: 'line',
        title: 'N1 Traffic Flow (Last 6 Hours)',
        data: [
          { time: '12:00', vehicles: 1200, wait: 4.2 },
          { time: '13:00', vehicles: 1450, wait: 5.8 },
          { time: '14:00', vehicles: 1847, wait: 8.2 },
          { time: '15:00', vehicles: 1620, wait: 6.5 },
          { time: '16:00', vehicles: 1350, wait: 5.1 },
          { time: '18:00', vehicles: 980, wait: 3.8 },
        ],
      });
    }
  }

  // Parse R81 queries
  if (lowerQuery.includes('r81')) {
    highlightedLocations.push('R81');
    if (lowerQuery.includes('sensor') || lowerQuery.includes('pothole')) {
      analysis = 'R81 corridor: 4 roadside sensors active, 2 critical detections. Pothole detected at km 42.3. Acoustic sensors detecting abnormal noise patterns.';
      metrics['active_sensors'] = 4;
      metrics['critical_detections'] = 2;
      metrics['potholes'] = 1;
      severity = 'high';
      recommendation = 'Dispatch maintenance team to km 42.3. Alert nearby drivers via smart signs.';
    }
  }

  // Parse rain/weather queries
  if (lowerQuery.includes('rain') || lowerQuery.includes('weather')) {
    analysis = 'Weather correlation analysis: Rain increases accident risk by 47% in current conditions. Sensor detections confirm 23% increase in vehicle spacing.';
    metrics['accident_risk_increase'] = '47%';
    metrics['sensor_anomalies'] = 23;
    severity = 'high';
    recommendation = 'Reduce speed limits by 10km/h on affected routes. Activate additional traffic monitoring.';
  }

  // Parse sensor battery queries
  if (lowerQuery.includes('battery') || lowerQuery.includes('low power')) {
    analysis = 'Sensor health status: 2 sensors with low battery (< 20%) detected. Capricorn district affected: R101 junction sensor at 12% battery.';
    metrics['low_battery_sensors'] = 2;
    metrics['battery_percentage'] = 12;
    highlightedLocations.push('Capricorn', 'R101');
    severity = 'medium';
    recommendation = 'Schedule battery replacement for R101 sensor within 24 hours.';
  }

  // Parse traffic light queries
  if (lowerQuery.includes('light') || lowerQuery.includes('timing')) {
    analysis = 'Smart traffic light analysis: 12 intersections currently in adaptive mode. Polokwane CBD showing optimal performance (94% efficiency). Tzaneen junction needs manual override.';
    metrics['adaptive_mode'] = 12;
    metrics['efficiency'] = '94%';
    metrics['manual_overrides_needed'] = 1;
    charts.push({
      type: 'bar',
      title: 'Traffic Light Performance by Municipality',
      data: [
        { name: 'Polokwane', efficiency: 94 },
        { name: 'Tzaneen', efficiency: 71 },
        { name: 'Musina', efficiency: 88 },
        { name: 'Mokopane', efficiency: 79 },
      ],
    });
  }

  // Parse comparison queries
  if (lowerQuery.includes('compare') || lowerQuery.includes('vs')) {
    analysis = 'Comparative analysis complete. Sensor data correlates with citizen SOS reports at 89% accuracy. 3 incidents detected by sensors before citizen reports.';
    metrics['correlation'] = '89%';
    metrics['advance_detections'] = 3;
    severity = 'medium';
    recommendation = 'Continue dual-source monitoring. Sensors provide 4-minute advance warning on average.';
  }

  // Default response if no specific keywords
  if (!analysis) {
    analysis = 'AI analysis processing query. Current system status: All sensors online and healthy. Smart lights operating in adaptive mode across 12 intersections. Average response time: 2.3 seconds. No critical alerts at this moment.';
    metrics['sensors_online'] = 48;
    metrics['lights_active'] = 12;
    metrics['response_time'] = '2.3s';
    severity = 'low';
    recommendation = 'System operating normally. Continue standard monitoring protocol.';
  }

  return {
    query,
    analysis,
    metrics,
    recommendation,
    severity,
    highlightedLocations,
    charts,
  };
};

const AIAnalysisEngine: React.FC<AIAnalysisEngineProps> = ({
  onQueryResponse,
  sensorData,
  lightData,
  weatherData,
  crimeData,
}) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<QueryResponse[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    const result = parseQuery(query);
    setResponse(result);
    setHistory(prev => [result, ...prev].slice(0, 5));
    onQueryResponse(result);
    setQuery('');
    setLoading(false);
  };

  const suggestedQueries = [
    'Show N1 congestion analysis',
    'Which sensors have low battery?',
    'Compare rain impact vs sensor data',
    'Analyze smart lights performance',
    'R81 pothole detection status',
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'from-red-500 to-red-600 text-red-100';
      case 'high':
        return 'from-orange-500 to-orange-600 text-orange-100';
      case 'medium':
        return 'from-yellow-500 to-yellow-600 text-yellow-100';
      default:
        return 'from-green-500 to-green-600 text-green-100';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl p-6"
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-purple-400" />
          AI Analysis Engine
        </h3>
        <p className="text-sm text-slate-400">Ask anything about sensors, traffic lights, weather, and safety</p>
      </div>

      {/* Query Input */}
      <form onSubmit={handleQuery} className="mb-6">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., 'Show N1 congestion with sensors on map'"
            className="flex-1 bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading || !query.trim()}
            className="px-4 py-3 bg-purple-500/30 hover:bg-purple-500/50 border border-purple-500/50 text-purple-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Analyze
          </motion.button>
        </div>
      </form>

      {/* Suggested Queries */}
      <div className="mb-6">
        <p className="text-xs text-slate-400 mb-2 font-semibold">Try asking:</p>
        <div className="flex flex-wrap gap-2">
          {suggestedQueries.map((q, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setQuery(q);
                setTimeout(() => inputRef.current?.focus(), 0);
              }}
              className="text-xs px-3 py-1 bg-slate-700/30 border border-slate-600/30 text-slate-300 hover:border-purple-500/50 rounded-full transition-colors"
            >
              {q}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Response Panel */}
      <AnimatePresence>
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4 border-t border-slate-700/50 pt-6"
          >
            {/* Severity Badge */}
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r ${getSeverityColor(response.severity)} font-semibold text-sm`}>
              {response.severity === 'critical' || response.severity === 'high' ? (
                <AlertCircle className="w-4 h-4" />
              ) : (
                <TrendingUp className="w-4 h-4" />
              )}
              {response.severity.toUpperCase()}
            </div>

            {/* Analysis Text */}
            <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4">
              <p className="text-sm text-slate-200 leading-relaxed mb-4">{response.analysis}</p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(response.metrics).map(([key, value]) => (
                  <div key={key} className="bg-slate-800/50 rounded p-2">
                    <p className="text-xs text-slate-400 capitalize">{key.replace(/_/g, ' ')}</p>
                    <p className="text-lg font-bold text-white mt-1">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendation */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="text-sm font-semibold text-green-300 mb-1">Recommendation</p>
              <p className="text-sm text-green-200/80">{response.recommendation}</p>
            </div>

            {/* Highlighted Locations */}
            {response.highlightedLocations.length > 0 && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-300 mb-2">Map Highlights</p>
                <div className="flex flex-wrap gap-2">
                  {response.highlightedLocations.map((loc, idx) => (
                    <span
                      key={idx}
                      className="inline-block px-3 py-1 bg-blue-500/20 border border-blue-500/50 text-blue-300 text-xs rounded-full"
                    >
                      {loc}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Query History */}
      {history.length > 1 && (
        <div className="mt-8 border-t border-slate-700/50 pt-4">
          <p className="text-xs text-slate-400 font-semibold mb-3">Recent Queries</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {history.slice(1).map((h, idx) => (
              <motion.button
                key={idx}
                whileHover={{ x: 4 }}
                onClick={() => {
                  setQuery(h.query);
                  setResponse(h);
                }}
                className="w-full text-left text-sm p-2 rounded bg-slate-800/30 border border-slate-700/30 text-slate-300 hover:border-slate-600/50 transition-colors"
              >
                <p className="truncate">{h.query}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {h.highlightedLocations.join(', ') || 'General analysis'}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AIAnalysisEngine;
