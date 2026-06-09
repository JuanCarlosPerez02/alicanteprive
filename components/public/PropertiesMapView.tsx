'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

export interface MapProperty {
  id: string;
  referencia: string;
  titulo: string;
  precio: number;
  operacion: string;
  zona: string | null;
  lat: number;
  lng: number;
  coverUrl: string | null;
  locale: string;
}

interface Props {
  properties: MapProperty[];
}

const fmtPrice = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
}).format;

const BATCH_SIZE = 10; // markers added per animation frame

export default function PropertiesMapView({ properties }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<import('leaflet').Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    let cancelled = false;
    let rafHandle = 0;

    import('leaflet').then((L) => {
      if (cancelled || !mapRef.current || mapInstance.current) return;

      const avgLat = properties.reduce((s, p) => s + p.lat, 0) / properties.length;
      const avgLng = properties.reduce((s, p) => s + p.lng, 0) / properties.length;

      const map = L.map(mapRef.current, {
        center: [avgLat || 38.345, avgLng || -0.481],
        zoom: 12,
        scrollWheelZoom: true,
        // Prefer canvas rendering for better performance with many markers
        preferCanvas: false,
      });

      mapInstance.current = map;

      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
        }
      ).addTo(map);

      // Build marker data upfront (pure JS, no DOM) so the batched loop is fast
      type MarkerData = { lat: number; lng: number; iconHtml: string; popupHtml: string };
      const markerData: MarkerData[] = properties.map((p) => ({
        lat: p.lat,
        lng: p.lng,
        iconHtml: `<div style="transform:translate(-50%,-100%);display:inline-block;text-align:center;"><div style="background:#1a2747;color:#fff;padding:5px 10px;border-radius:4px;font-size:12px;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.35);border:1.5px solid #c9a84c;line-height:1.2;cursor:pointer;letter-spacing:.01em;">${fmtPrice(p.precio)}</div><div style="width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-top:7px solid #1a2747;margin:0 auto;"></div></div>`,
        popupHtml: `<div style="width:220px;font-family:system-ui,-apple-system,sans-serif;overflow:hidden;border-radius:4px;">${p.coverUrl ? `<img src="${p.coverUrl}" alt="${p.titulo}" style="width:100%;height:110px;object-fit:cover;border-radius:3px 3px 0 0;display:block;" loading="lazy"/>` : ''}<div style="padding:10px 12px 12px;">${p.zona ? `<p style="font-size:10px;color:#888;text-transform:uppercase;letter-spacing:.05em;margin:0 0 3px;">${p.zona}</p>` : ''}<p style="font-size:13px;font-weight:600;line-height:1.35;margin:0 0 6px;color:#111;">${p.titulo}</p><p style="font-size:15px;font-weight:700;color:#1a2747;margin:0 0 10px;">${fmtPrice(p.precio)}${p.operacion === 'alquiler' ? '<span style="font-size:11px;font-weight:400;color:#888;">/mes</span>' : ''}</p><a href="/${p.locale}/propiedades/${p.referencia}" style="display:inline-block;padding:5px 14px;background:#c9a84c;color:#1a2747;font-size:11px;font-weight:700;text-decoration:none;border-radius:2px;letter-spacing:.03em;">Ver propiedad</a></div></div>`,
      }));

      // Add markers in batches per animation frame so the main thread stays responsive
      let idx = 0;
      function addBatch() {
        if (cancelled) return;
        const end = Math.min(idx + BATCH_SIZE, markerData.length);
        for (; idx < end; idx++) {
          const d = markerData[idx];
          const icon = L.divIcon({ className: '', html: d.iconHtml, iconSize: [0, 0], iconAnchor: [0, 0] });
          const marker = L.marker([d.lat, d.lng], { icon });
          marker.bindPopup(d.popupHtml, { maxWidth: 240, offset: [0, -10] });
          marker.addTo(map);
        }
        if (idx < markerData.length) {
          rafHandle = requestAnimationFrame(addBatch);
        } else if (markerData.length > 1) {
          // Fit bounds once all markers are placed
          const bounds = L.latLngBounds(markerData.map((d) => [d.lat, d.lng] as [number, number]));
          map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
        }
      }
      rafHandle = requestAnimationFrame(addBatch);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafHandle);
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, [properties]);

  if (properties.length === 0) {
    return (
      <div className="flex items-center justify-center h-[560px] bg-muted/30 rounded-sm border border-border text-muted-foreground text-sm">
        No hay propiedades con coordenadas para mostrar en el mapa
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className="w-full rounded-sm border border-border"
      style={{ height: 560, zIndex: 0 }}
    />
  );
}
