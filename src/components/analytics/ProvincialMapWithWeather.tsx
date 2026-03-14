'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Cloud, Wind, Droplets, AlertTriangle, Layers } from 'lucide-react';

interface WeatherLayer {
  name: 'rain' | 'wind' | 'visibility' | 'lightning';
  active: boolean;
  color: string;
}

interface ProvincialMapWithWeatherProps {
  selectedDistrict: string | null;
  onDistrictSelect: (district: string | null) => void;
  weatherIntensity: number;
}

const limpopoGeoJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Capricorn', id: 'capricorn', incidents: 12, weather_risk: 72 },
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
      properties: { name: 'Sekhukhune', id: 'sekhukhune', incidents: 8, weather_risk: 58 },
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
      properties: { name: 'Waterberg', id: 'waterberg', incidents: 5, weather_risk: 38 },
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
      properties: { name: 'Mopani', id: 'mopani', incidents: 10, weather_risk: 65 },
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
      properties: { name: 'Vhembe', id: 'vhembe', incidents: 6, weather_risk: 48 },
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

const sampleIncidents = [
  { id: 1, lat: -23.9, lng: 29.4, type: 'accident', severity: 'high', cause: 'rain' },
  { id: 2, lat: -24.0, lng: 29.3, type: 'accident', severity: 'critical', cause: 'rain' },
  { id: 3, lat: -23.85, lng: 29.5, type: 'flooding', severity: 'medium', cause: 'rain' },
  { id: 4, lat: -24.15, lng: 29.1, type: 'powerline', severity: 'high', cause: 'wind' },
];

const WeatherMapControl: React.FC<{
  weatherLayers: WeatherLayer[];
  onLayerToggle: (layer: WeatherLayer['name']) => void;
}> = ({ weatherLayers, onLayerToggle }) => {
  return (
    <div className="absolute top-4 right-4 z-50 bg-slate-800/90 backdrop-blur-lg border border-slate-600/50 rounded-lg p-3 flex flex-col gap-2">
      <p className="text-xs font-semibold text-slate-300 mb-2">Weather Layers</p>
      {weatherLayers.map(layer => (
        <label key={layer.name} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer hover:text-white transition-colors">
          <input
            type="checkbox"
            checked={layer.active}
            onChange={() => onLayerToggle(layer.name)}
            className="w-4 h-4 rounded"
          />
          <span className="capitalize">{layer.name}</span>
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: layer.color }}></div>
        </label>
      ))}
    </div>
  );
};

const ProvincialMapWithWeather: React.FC<ProvincialMapWithWeatherProps> = ({
  selectedDistrict,
  onDistrictSelect,
  weatherIntensity,
}) => {
  const [weatherLayers, setWeatherLayers] = useState<WeatherLayer[]>([
    { name: 'rain', active: true, color: '#3b82f6' },
    { name: 'wind', active: false, color: '#f59e0b' },
    { name: 'visibility', active: false, color: '#8b5cf6' },
    { name: 'lightning', active: false, color: '#fbbf24' },
  ]);

  const [selectedIncident, setSelectedIncident] = useState<typeof sampleIncidents[0] | null>(null);

  const handleLayerToggle = (layerName: WeatherLayer['name']) => {
    setWeatherLayers(prev =>
      prev.map(layer =>
        layer.name === layerName ? { ...layer, active: !layer.active } : layer
      )
    );
  };

  const handleGeoJSONClick = (feature: any) => {
    const districtId = feature.properties.id;
    onDistrictSelect(selectedDistrict === districtId ? null : districtId);
  };

  const styleFeature = (feature: any) => {
    const isSelected = selectedDistrict === feature.properties.id;
    const weatherRisk = feature.properties.weather_risk;
    let color = '#10b981';
    if (weatherRisk > 70) color = '#ef4444';
    else if (weatherRisk > 50) color = '#f59e0b';

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
      transition={{ delay: 0.2 }}
      className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl p-6 overflow-hidden"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Cloud className="w-5 h-5" />
        Live Provincial Map with Weather Overlay
      </h3>

      <div className="h-96 rounded-lg overflow-hidden border border-slate-600/50 relative">
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

          {/* Rain Intensity Overlay */}
          {weatherLayers.find(l => l.name === 'rain')?.active && (
            <GeoJSON
              data={limpopoGeoJSON as any}
              style={() => ({
                fillColor: '#3b82f6',
                weight: 0,
                opacity: 0,
                fillOpacity: 0.15,
              })}
            />
          )}

          {/* District Boundaries */}
          <GeoJSON
            data={limpopoGeoJSON as any}
            style={(feature: any) => styleFeature(feature)}
            onEachFeature={(feature, layer) => {
              layer.on('click', () => handleGeoJSONClick(feature));
              const risk = feature.properties.weather_risk;
              layer.bindPopup(`
                <div class="text-sm">
                  <p class="font-bold">${feature.properties.name}</p>
                  <p>Weather Risk: ${risk}%</p>
                  <p>Incidents: ${feature.properties.incidents}</p>
                </div>
              `);
            }}
          />

          {/* Weather-Related Incident Markers */}
          {sampleIncidents.map(incident => {
            const typeIcon: Record<string, string> = {
              accident: '🚗',
              flooding: '💧',
              powerline: '⚡',
            };
            
            const isWeatherRelated = weatherLayers.find(l => l.name === incident.cause)?.active ?? true;
            
            if (!isWeatherRelated) return null;

            return (
              <Marker
                key={incident.id}
                position={[incident.lat, incident.lng]}
                icon={L.divIcon({
                  className: 'animate-pulse',
                  html: `
                    <div class="w-4 h-4 rounded-full flex items-center justify-center text-xs" 
                         style="background-color: ${incident.severity === 'critical' ? '#ef4444' : '#f59e0b'}; 
                                 box-shadow: 0 0 12px ${incident.severity === 'critical' ? '#ef4444' : '#f59e0b'};">
                      ${typeIcon[incident.type]}
                    </div>
                  `,
                })}
              >
                <Popup>
                  <div className="text-xs">
                    <p className="font-bold capitalize">{incident.type}</p>
                    <p className="text-slate-600">Severity: {incident.severity}</p>
                    <p className="text-slate-600">Cause: {incident.cause}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          <WeatherMapControl weatherLayers={weatherLayers} onLayerToggle={handleLayerToggle} />
        </MapContainer>
      </div>

      {/* District Quick Select */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
        {limpopoGeoJSON.features.map(feature => (
          <motion.button
            key={feature.properties.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDistrictSelect(feature.properties.id)}
            className={`p-2 rounded-lg text-xs font-semibold transition-all ${
              selectedDistrict === feature.properties.id
                ? 'bg-blue-500/30 border border-blue-500/50 text-blue-300'
                : 'bg-slate-700/30 border border-slate-600/30 text-slate-300 hover:border-slate-500/50'
            }`}
          >
            <p>{feature.properties.name}</p>
            <p className="text-xs opacity-75">Risk: {feature.properties.weather_risk}%</p>
          </motion.button>
        ))}
      </div>

      {/* Weather Impact Alert for Selected District */}
      <AnimatePresence>
        {selectedDistrict && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg"
          >
            <p className="text-sm text-amber-300 font-semibold">
              Weather Impact on {limpopoGeoJSON.features.find(f => f.properties.id === selectedDistrict)?.properties.name}
            </p>
            <p className="text-xs text-amber-200/80 mt-1">
              {weatherIntensity > 50
                ? `High weather risk (${weatherIntensity}%) - Expect delays and increased incident response times`
                : `Moderate weather risk (${weatherIntensity}%) - Monitor road conditions`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProvincialMapWithWeather;
