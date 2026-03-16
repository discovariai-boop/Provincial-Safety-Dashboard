'use client';

import { useEffect, useRef, ReactNode } from 'react';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons (Vite/Next.js breaks Leaflet's image paths)
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface StableMapProps {
  center: LatLngExpression; // Make center required
  zoom: number; // Make zoom required
  children?: ReactNode;
  className?: string;
}

export default function StableMap({
  center,
  zoom,
  children,
  className = 'h-[500px] w-full rounded-2xl',
}: StableMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Prevent double-init
    if (mapRef.current) {
      mapRef.current.setView(center, zoom);
      mapRef.current.invalidateSize(); // Refresh size if needed
      return;
    }

    // Initialize only once
    const map = L.map(containerRef.current).setView(center, zoom);
    mapRef.current = map;

    // Add default tile layer (you can override in props)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center, zoom]); // Re-init only if center/zoom change dramatically

  return (
    <div ref={containerRef} className={className}>
      {/* Children (markers, layers, etc.) are added via props.children */}
      {children}
    </div>
  );
}
