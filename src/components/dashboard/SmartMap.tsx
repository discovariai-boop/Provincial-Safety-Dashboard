'use client';

import React, { useState } from 'react';
import { Marker, Popup, LayerGroup, Circle } from 'react-leaflet';
import { motion } from 'framer-motion';
import { AlertTriangle, Ambulance, Car, Zap } from 'lucide-react';
import LeafletMapWrapper from '@/components/LeafletMapWrapper';

interface MapLayer {
  id: string;
  name: string;
  enabled: boolean;
  color: string;
  icon: React.ReactNode;
}

const DashboardSmartMap: React.FC = () => {
  const [layers, setLayers] = useState<MapLayer[]>([
    { id: 'crime', name: 'Crime Hotspots', enabled: true, color: '#ef4444', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'traffic', name: 'Traffic Congestion', enabled: true, color: '#f59e0b', icon: <Car className="w-4 h-4" /> },
    { id: 'medical', name: 'Medical Facilities', enabled: true, color: '#3b82f6', icon: <Ambulance className="w-4 h-4" /> },
    { id: 'power', name: 'Power Grid', enabled: false, color: '#fbbf24', icon: <Zap className="w-4 h-4" /> },
  ]);

  const polokwanePosition: [number, number] = [-23.9045, 29.4688];

  const crimeHotspots = [
    { lat: -23.85, lng: 29.42, intensity: 'high', incidents: 45 },
    { lat: -23.92, lng: 29.50, intensity: 'medium', incidents: 28 },
    { lat: -23.95, lng: 29.40, intensity: 'low', incidents: 12 },
  ];

  const hospitals = [
    { lat: -23.9003, lng: 29.4316, name: 'Polokwane General Hospital', capacity: 85 },
    { lat: -23.92, lng: 29.45, name: 'Medicross Polokwane', capacity: 45 },
  ];

  const toggleLayer = (id: string) => {
    setLayers(layers.map(l => l.id === id ? { ...l, enabled: !l.enabled } : l));
  };

  return (
    <div className="space-y-4">
      {/* Layer Controls */}
      <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-white mb-4">Map Layers</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {layers.map(layer => (
            <motion.button
              key={layer.id}
              onClick={() => toggleLayer(layer.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                layer.enabled
                  ? 'bg-blue-500/30 border border-blue-500/50 text-blue-300'
                  : 'bg-slate-700/30 border border-slate-600/50 text-slate-400'
              }`}
            >
              {layer.icon}
              <span className="text-xs font-medium">{layer.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl overflow-hidden h-[500px]">
        <LeafletMapWrapper center={polokwanePosition} zoom={10}>
          <Marker position={polokwanePosition}>
            <Popup>Polokwane</Popup>
          </Marker>

          {/* Crime Hotspots */}
          {layers.find(l => l.id === 'crime')?.enabled && (
            <LayerGroup>
              {crimeHotspots.map((hotspot, idx) => (
                <Circle
                  key={`crime-${idx}`}
                  center={[hotspot.lat, hotspot.lng]}
                  radius={hotspot.intensity === 'high' ? 1500 : hotspot.intensity === 'medium' ? 1000 : 500}
                  pathOptions={{
                    color: '#ef4444',
                    fillColor: '#ef4444',
                    fillOpacity: hotspot.intensity === 'high' ? 0.4 : hotspot.intensity === 'medium' ? 0.3 : 0.2,
                    weight: 2,
                  }}
                >
                  <Popup>
                    <div className="text-sm font-semibold">
                      {hotspot.intensity.toUpperCase()} Risk - {hotspot.incidents} incidents
                    </div>
                  </Popup>
                </Circle>
              ))}
            </LayerGroup>
          )}

          {/* Medical Facilities */}
          {layers.find(l => l.id === 'medical')?.enabled && (
            <LayerGroup>
              {hospitals.map((hospital, idx) => (
                <Marker key={`hospital-${idx}`} position={[hospital.lat, hospital.lng]}>
                  <Popup>
                    <div>
                      <p className="font-semibold">{hospital.name}</p>
                      <p className="text-sm">Capacity: {hospital.capacity}%</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          )}
        </LeafletMapWrapper>
      </div>

      {/* Map Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {layers.filter(l => l.enabled).map(layer => (
          <div key={layer.id} className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: layer.color }}></div>
              <span className="text-xs font-medium text-slate-300">{layer.name}</span>
            </div>
            <p className="text-xs text-slate-500">Live data • Auto-refresh</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSmartMap;
