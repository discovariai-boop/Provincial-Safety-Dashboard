'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup, FeatureGroup } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, X } from 'lucide-react';

interface MapLayerToggle {
  name: string;
  active: boolean;
  color: string;
}

const limpopoGeoJSON = {
  type: 'FeatureCollection' as const,
  features: [
    {
      type: 'Feature',
      properties: { name: 'Capricorn', vehicles: 2847, incidents: 12 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [29.0, -24.5],
            [29.5, -24.5],
            [29.5, -24.0],
            [29.0, -24.0],
            [29.0, -24.5],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Sekhukhune', vehicles: 1643, incidents: 8 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [29.5, -24.5],
            [30.0, -24.5],
            [30.0, -24.0],
            [29.5, -24.0],
            [29.5, -24.5],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Waterberg', vehicles: 891, incidents: 5 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [28.5, -24.0],
            [29.0, -24.0],
            [29.0, -23.5],
            [28.5, -23.5],
            [28.5, -24.0],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Mopani', vehicles: 2156, incidents: 10 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [30.0, -24.0],
            [30.5, -24.0],
            [30.5, -23.5],
            [30.0, -23.5],
            [30.0, -24.0],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Vhembe', vehicles: 1234, incidents: 6 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [30.0, -23.5],
            [30.5, -23.5],
            [30.5, -23.0],
            [30.0, -23.0],
            [30.0, -23.5],
          ],
        ],
      },
    },
  ],
};

const mockSensorLocations = [
  { lat: -24.25, lng: 29.25, id: 's1', type: 'lidar', status: 'online', name: 'N1 Polokwane' },
  { lat: -24.3, lng: 29.6, id: 's2', type: 'pothole', status: 'online', name: 'R81 km42' },
  { lat: -24.15, lng: 30.2, id: 's3', type: 'speed', status: 'maintenance', name: 'R101 Tzaneen' },
  { lat: -24.2, lng: 29.4, id: 's4', type: 'vehicle_count', status: 'online', name: 'N1 Capricorn' },
  { lat: -23.7, lng: 30.3, id: 's5', type: 'acoustic', status: 'offline', name: 'Mopani Main' },
];

const mockLightLocations = [
  { lat: -24.25, lng: 29.25, id: 'tl1', phase: 'green', timing: 42, name: 'Polokwane CBD' },
  { lat: -24.3, lng: 29.6, id: 'tl2', phase: 'red', timing: 28, name: 'Tzaneen R101' },
  { lat: -24.15, lng: 30.15, id: 'tl3', phase: 'green', timing: 35, name: 'Musina N1' },
  { lat: -24.32, lng: 29.48, id: 'tl4', phase: 'yellow', timing: 5, name: 'Mokopane Central' },
];

interface ProvincialMapWithSensorsProps {
  highlightedLocations?: string[];
}

const ProvincialMapWithSensors: React.FC<ProvincialMapWithSensorsProps> = ({ highlightedLocations = [] }) => {
  const [mapLayers, setMapLayers] = useState<MapLayerToggle[]>([
    { name: 'Roadside Sensors', active: true, color: '#06b6d4' },
    { name: 'Smart Traffic Lights', active: true, color: '#fbbf24' },
    { name: 'Incidents', active: true, color: '#ef4444' },
  ]);

  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  const toggleLayer = (name: string) => {
    setMapLayers(prev =>
      prev.map(layer => (layer.name === name ? { ...layer, active: !layer.active } : layer))
    );
  };

  const styleFeature = (feature: any) => {
    const highlighted = highlightedLocations.includes(feature.properties.name);
    return {
      fillColor: highlighted ? '#3b82f6' : '#1f2937',
      weight: highlighted ? 3 : 1,
      opacity: 0.7,
      color: highlighted ? '#60a5fa' : '#4b5563',
      fillOpacity: highlighted ? 0.3 : 0.1,
    };
  };

  const onEachFeature = (feature: any, layer: any) => {
    layer.bindPopup(
      `<div style="color: white; font-size: 12px;">
        <strong>${feature.properties.name}</strong><br/>
        Vehicles: ${feature.properties.vehicles}<br/>
        Incidents: ${feature.properties.incidents}
      </div>`,
      { className: 'bg-slate-800 border border-slate-600' }
    );
  };

  const getSensorColor = (status: string) => {
    switch (status) {
      case 'online':
        return '#10b981';
      case 'offline':
        return '#ef4444';
      case 'maintenance':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'green':
        return '#10b981';
      case 'red':
        return '#ef4444';
      case 'yellow':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl overflow-hidden"
    >
      {/* Layer Controls */}
      <div className="p-4 bg-slate-800/50 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span className="text-sm font-semibold text-white">Map Layers</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {mapLayers.map(layer => (
            <motion.button
              key={layer.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleLayer(layer.name)}
              className={`text-xs px-3 py-1 rounded-full border transition-all ${
                layer.active
                  ? 'bg-opacity-30 border-opacity-50'
                  : 'bg-opacity-10 border-opacity-20 opacity-60'
              }`}
              style={{
                backgroundColor: `${layer.color}33`,
                borderColor: layer.color,
              }}
            >
              {layer.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div style={{ height: '500px', width: '100%' }}>
        <MapContainer center={[-24.2, 29.5]} zoom={8} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          {/* GeoJSON District Boundaries */}
          <GeoJSON data={limpopoGeoJSON} style={styleFeature} onEachFeature={onEachFeature} />

          {/* Roadside Sensors */}
          {mapLayers.find(l => l.name === 'Roadside Sensors')?.active &&
            mockSensorLocations.map(sensor => (
              <CircleMarker
                key={sensor.id}
                center={[sensor.lat, sensor.lng]}
                radius={8}
                fillColor={getSensorColor(sensor.status)}
                color={getSensorColor(sensor.status)}
                weight={2}
                opacity={1}
                fillOpacity={0.7}
              >
                <Popup>
                  <div style={{ color: 'white', fontSize: '12px' }}>
                    <strong>{sensor.name}</strong><br />
                    Type: {sensor.type.replace('_', ' ')}<br />
                    Status: {sensor.status}
                  </div>
                </Popup>
              </CircleMarker>
            ))}

          {/* Smart Traffic Lights */}
          {mapLayers.find(l => l.name === 'Smart Traffic Lights')?.active &&
            mockLightLocations.map(light => (
              <CircleMarker
                key={light.id}
                center={[light.lat, light.lng]}
                radius={10}
                fillColor={getPhaseColor(light.phase)}
                color={getPhaseColor(light.phase)}
                weight={3}
                opacity={1}
                fillOpacity={0.6}
              >
                <Popup>
                  <div style={{ color: 'white', fontSize: '12px' }}>
                    <strong>{light.name}</strong><br />
                    Phase: {light.phase}<br />
                    Timing: {light.timing}s
                  </div>
                </Popup>
              </CircleMarker>
            ))}
        </MapContainer>
      </div>

      {/* Info Panel */}
      {highlightedLocations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-blue-500/10 border-t border-blue-500/30"
        >
          <p className="text-sm text-blue-300">
            <strong>Highlighted:</strong> {highlightedLocations.join(', ')}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProvincialMapWithSensors;
