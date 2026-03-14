'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface ProvincialMapProps {
  selectedDistrict: string | null;
  onDistrictSelect: (district: string | null) => void;
}

// Limpopo Province GeoJSON (simplified districts)
const limpopoGeoJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Capricorn', id: 'capricorn', incidents: 12, responseTime: '4:32', risk: 67 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [29.3, -23.8],
            [29.5, -23.8],
            [29.5, -24.0],
            [29.3, -24.0],
            [29.3, -23.8],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Sekhukhune', id: 'sekhukhune', incidents: 8, responseTime: '5:12', risk: 52 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [29.0, -24.1],
            [29.2, -24.1],
            [29.2, -24.3],
            [29.0, -24.3],
            [29.0, -24.1],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Waterberg', id: 'waterberg', incidents: 5, responseTime: '4:58', risk: 38 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [28.7, -24.0],
            [28.9, -24.0],
            [28.9, -24.2],
            [28.7, -24.2],
            [28.7, -24.0],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Mopani', id: 'mopani', incidents: 10, responseTime: '5:45', risk: 61 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [29.6, -23.5],
            [29.8, -23.5],
            [29.8, -23.7],
            [29.6, -23.7],
            [29.6, -23.5],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Vhembe', id: 'vhembe', incidents: 6, responseTime: '6:15', risk: 45 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [30.0, -23.0],
            [30.2, -23.0],
            [30.2, -23.2],
            [30.0, -23.2],
            [30.0, -23.0],
          ],
        ],
      },
    },
  ],
};

// Sample incident markers
const sampleIncidents = [
  { id: 1, lat: -23.9, lng: 29.4, type: 'crime', severity: 'high' },
  { id: 2, lat: -24.0, lng: 29.3, type: 'medical', severity: 'critical' },
  { id: 3, lat: -23.85, lng: 29.5, type: 'traffic', severity: 'medium' },
  { id: 4, lat: -24.15, lng: 29.1, type: 'infrastructure', severity: 'low' },
];

// Custom map control component
const MapControl: React.FC<{
  onLayerToggle: (layer: string) => void;
  activeLayers: Record<string, boolean>;
}> = ({ onLayerToggle, activeLayers }) => {
  const map = useMap();

  return (
    <div className="absolute top-4 right-4 z-50 bg-slate-800/80 backdrop-blur-lg border border-slate-600/50 rounded-lg p-3 flex flex-col gap-2">
      {(['Crime Hotspots', 'Traffic', 'Medical', 'Infrastructure'] as const).map(layer => (
        <label key={layer} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer hover:text-white transition-colors">
          <input
            type="checkbox"
            checked={activeLayers[layer] ?? true}
            onChange={() => onLayerToggle(layer)}
            className="w-4 h-4 rounded"
          />
          <span>{layer}</span>
        </label>
      ))}
    </div>
  );
};

const ProvincialMap: React.FC<ProvincialMapProps> = ({ selectedDistrict, onDistrictSelect }) => {
  const [activeLayers, setActiveLayers] = useState({
    'Crime Hotspots': true,
    'Traffic': true,
    'Medical': true,
    'Infrastructure': true,
  });

  const handleLayerToggle = (layer: string) => {
    setActiveLayers(prev => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  };

  const handleGeoJSONClick = (feature: any) => {
    const districtId = feature.properties.id;
    onDistrictSelect(selectedDistrict === districtId ? null : districtId);
  };

  const styleFeature = (feature: any) => {
    const isSelected = selectedDistrict === feature.properties.id;
    const riskLevel = feature.properties.risk;
    let color = '#10b981'; // green
    if (riskLevel > 60) color = '#ef4444'; // red
    else if (riskLevel > 40) color = '#f59e0b'; // amber

    return {
      fillColor: isSelected ? '#3b82f6' : color,
      weight: isSelected ? 3 : 1,
      opacity: 0.7,
      color: isSelected ? '#60a5fa' : '#333',
      fillOpacity: isSelected ? 0.3 : 0.2,
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl p-6 overflow-hidden"
    >
      <h3 className="text-lg font-semibold text-white mb-4">Live Provincial Map</h3>
      <div className="h-96 rounded-lg overflow-hidden border border-slate-600/50">
        <MapContainer
          center={[-23.9, 29.4]}
          zoom={8}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          {/* District boundaries */}
          <GeoJSON
            data={limpopoGeoJSON as any}
            style={(feature: any) => styleFeature(feature)}
            onEachFeature={(feature, layer) => {
              layer.on('click', () => handleGeoJSONClick(feature));
              layer.bindPopup(`
                <div class="text-sm">
                  <p class="font-bold">${feature.properties.name}</p>
                  <p>Incidents: ${feature.properties.incidents}</p>
                  <p>Response: ${feature.properties.responseTime}</p>
                  <p>Risk: ${feature.properties.risk}%</p>
                </div>
              `);
            }}
          />

          {/* Incident markers */}
          {sampleIncidents.map(incident => {
            const typeColor: Record<string, string> = {
              crime: '#ef4444',
              medical: '#3b82f6',
              traffic: '#f59e0b',
              infrastructure: '#8b5cf6',
            };
            return (
              <Marker
                key={incident.id}
                position={[incident.lat, incident.lng]}
                icon={L.divIcon({
                  className: `animate-pulse`,
                  html: `
                    <div class="w-3 h-3 rounded-full" style="background-color: ${typeColor[incident.type]}; box-shadow: 0 0 8px ${typeColor[incident.type]};">
                    </div>
                  `,
                })}
              >
                <Popup>
                  <div className="text-xs">
                    <p className="font-bold capitalize">{incident.type}</p>
                    <p className="text-slate-600">Severity: {incident.severity}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          <MapControl onLayerToggle={handleLayerToggle} activeLayers={activeLayers} />
        </MapContainer>
      </div>

      {/* District Info Cards */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
        {limpopoGeoJSON.features.map(feature => (
          <button
            key={feature.properties.id}
            onClick={() => onDistrictSelect(feature.properties.id)}
            className={`p-2 rounded-lg text-xs font-semibold transition-all ${
              selectedDistrict === feature.properties.id
                ? 'bg-blue-500/30 border border-blue-500/50 text-blue-300'
                : 'bg-slate-700/30 border border-slate-600/30 text-slate-300 hover:border-slate-500/50'
            }`}
          >
            <p>{feature.properties.name}</p>
            <p className="text-xs opacity-75">{feature.properties.incidents} incidents</p>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default ProvincialMap;
