'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

interface Props {
  lat: number;
  lng: number;
  titulo: string;
}

export default function PropertyMap({ lat, lng, titulo }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<import('leaflet').Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    import('leaflet').then((L) => {
      if (!mapRef.current || mapInstance.current) return;

      const map = L.map(mapRef.current, {
        center: [lat, lng],
        zoom: 15,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      // Gold dot marker — avoids default icon path issues with bundlers
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:22px;height:22px;background:oklch(0.74 0.09 82);border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.35)" title="${titulo}"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      L.marker([lat, lng], { icon }).addTo(map);
      mapInstance.current = map;
    });

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, [lat, lng, titulo]);

  return (
    <div
      ref={mapRef}
      className="w-full h-72 rounded-sm border border-border overflow-hidden"
      style={{ zIndex: 0 }}
    />
  );
}
