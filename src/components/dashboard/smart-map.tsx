'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { type Incident } from '@/lib/data';
import { useEffect } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Car, Siren, Users } from 'lucide-react';

// Workaround for default icon paths in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function getIncidentIcon(type: string) {
    if (type.includes("Crash")) return <Car className="h-4 w-4 text-white" />;
    if (type.includes("Heist")) return <Siren className="h-4 w-4 text-white" />;
    if (type.includes("Robbery")) return <Users className="h-4 w-4 text-white" />;
    return <Siren className="h-4 w-4 text-white" />;
}

const createCustomIcon = (incident: Incident) => {
    const iconMarkup = renderToStaticMarkup(getIncidentIcon(incident.type));
    
    let bgColor = 'bg-gray-500';
    if(incident.priority === 'Critical') bgColor = 'bg-destructive';
    if(incident.priority === 'Medium') bgColor = 'bg-yellow-500';

    return L.divIcon({
      html: `<div class="relative flex items-center justify-center w-8 h-8 rounded-full ${bgColor} border-2 border-white shadow-lg animate-pulse-slow">
               ${iconMarkup}
               <div class="absolute inset-0 rounded-full ${bgColor} opacity-50 animate-pulse-glow"></div>
             </div>`,
      className: 'bg-transparent border-none',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
};

function MapController({ selectedCoords }: { selectedCoords: [number, number] | null }) {
    const map = useMap();
    useEffect(() => {
        if (selectedCoords) {
            map.flyTo(selectedCoords, 14, {
                animate: true,
                duration: 1
            });
        }
    }, [selectedCoords, map]);
    return null;
}

export default function SmartMap({ incidents, selectedCoords }: { incidents: Incident[], selectedCoords: [number, number] | null }) {
  const position: [number, number] = [-23.90, 29.45]; // Approx center of Limpopo

  return (
    <MapContainer center={position} zoom={9} scrollWheelZoom={true} className="h-full w-full z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <MapController selectedCoords={selectedCoords} />
      {incidents.map((incident) => (
        <Marker key={incident.id} position={incident.coords} icon={createCustomIcon(incident)}>
          <Popup>
            <div className="font-bold">{incident.type}</div>
            <div>{incident.location}</div>
            <div>Priority: {incident.priority}</div>
            <div>Status: {incident.status}</div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
