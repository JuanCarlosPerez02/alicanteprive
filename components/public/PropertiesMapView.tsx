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

const BATCH_SIZE = 10;

// Strip Leaflet's default popup chrome so our custom card is the only layer.
// Injected once per page — guarded by the id check.
function injectPopupStyles() {
  if (document.getElementById('ap-popup-styles')) return;
  const el = document.createElement('style');
  el.id = 'ap-popup-styles';
  el.textContent = `
    .ap-popup .leaflet-popup-content-wrapper {
      padding: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
      border: none !important;
      border-radius: 0 !important;
    }
    .ap-popup .leaflet-popup-content {
      margin: 0 !important;
      line-height: normal !important;
    }
    .ap-popup .leaflet-popup-tip-container { display: none !important; }
    .ap-popup .leaflet-popup-close-button  { display: none !important; }
  `;
  document.head.appendChild(el);
}

function buildPopupHtml(p: MapProperty): string {
  const opLabel = p.operacion === 'alquiler' ? 'ALQUILER' : 'VENTA';
  const priceStr = p.operacion === 'alquiler'
    ? `${fmtPrice(p.precio)}<span style="font-size:11px;font-weight:500;color:#666;margin-left:2px;">/mes</span>`
    : fmtPrice(p.precio);

  const imageArea = p.coverUrl
    ? `<img src="${p.coverUrl}" alt="${p.titulo}" loading="lazy"
         style="width:100%;height:145px;object-fit:cover;display:block;"/>`
    : `<div style="height:145px;background:linear-gradient(145deg,#1a2747 0%,#0d1629 100%);
         display:flex;align-items:center;justify-content:center;">
         <span style="color:#c9a84c;font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;">
           Alicante Privé
         </span>
       </div>`;

  return `
    <div style="
      width:268px;
      border-radius:10px;
      overflow:hidden;
      background:#fff;
      box-shadow:0 16px 40px rgba(0,0,0,.22),0 4px 12px rgba(0,0,0,.12);
      font-family:system-ui,-apple-system,sans-serif;
    ">
      <!-- Image + badges -->
      <div style="position:relative;">
        ${imageArea}
        <!-- dark gradient so badges are always legible -->
        <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.38) 0%,transparent 50%);pointer-events:none;"></div>
        <!-- Reference pill (top-left) -->
        <div style="
          position:absolute;top:9px;left:9px;
          background:rgba(26,39,71,.80);
          color:#c9a84c;
          font-size:10px;font-weight:700;
          padding:3px 10px;
          border-radius:20px;
          letter-spacing:.09em;
          -webkit-backdrop-filter:blur(6px);
          backdrop-filter:blur(6px);
        ">REF. ${p.referencia}</div>
        <!-- Operación pill (top-right) -->
        <div style="
          position:absolute;top:9px;right:9px;
          background:#c9a84c;
          color:#1a2747;
          font-size:9px;font-weight:800;
          padding:3px 10px;
          border-radius:20px;
          letter-spacing:.07em;
        ">${opLabel}</div>
      </div>

      <!-- Content -->
      <div style="padding:13px 15px 15px;">
        ${p.zona
          ? `<p style="font-size:10px;color:#aaa;text-transform:uppercase;letter-spacing:.08em;margin:0 0 4px;">${p.zona}</p>`
          : ''}
        <p style="
          font-size:13px;font-weight:600;color:#111;
          line-height:1.4;margin:0 0 9px;
          display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
        ">${p.titulo}</p>
        <p style="font-size:20px;font-weight:800;color:#1a2747;margin:0 0 13px;letter-spacing:-.02em;">
          ${priceStr}
        </p>
        <a href="/${p.locale}/propiedades/${p.referencia}"
           style="
             display:block;text-align:center;
             padding:10px 0;
             background:#1a2747;color:#c9a84c;
             font-size:11px;font-weight:700;
             text-decoration:none;
             border-radius:5px;
             letter-spacing:.07em;
           ">Ver propiedad &nbsp;&rarr;</a>
      </div>
    </div>
  `;
}

export default function PropertiesMapView({ properties }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<import('leaflet').Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    let cancelled = false;
    let rafHandle = 0;

    import('leaflet').then((L) => {
      if (cancelled || !mapRef.current || mapInstance.current) return;

      injectPopupStyles();

      const avgLat = properties.reduce((s, p) => s + p.lat, 0) / properties.length;
      const avgLng = properties.reduce((s, p) => s + p.lng, 0) / properties.length;

      const map = L.map(mapRef.current, {
        center: [avgLat || 38.345, avgLng || -0.481],
        zoom: 12,
        scrollWheelZoom: true,
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

      type MarkerData = { lat: number; lng: number; iconHtml: string; popupHtml: string };
      const markerData: MarkerData[] = properties.map((p) => ({
        lat: p.lat,
        lng: p.lng,
        iconHtml: `
          <div style="transform:translate(-50%,-100%);display:inline-block;text-align:center;">
            <div style="
              background:#1a2747;color:#fff;
              padding:5px 10px;border-radius:4px;
              font-size:12px;font-weight:700;
              white-space:nowrap;
              box-shadow:0 2px 8px rgba(0,0,0,.35);
              border:1.5px solid #c9a84c;
              line-height:1.2;cursor:pointer;letter-spacing:.01em;
            ">${fmtPrice(p.precio)}</div>
            <div style="
              width:0;height:0;
              border-left:7px solid transparent;
              border-right:7px solid transparent;
              border-top:7px solid #1a2747;
              margin:0 auto;
            "></div>
          </div>`,
        popupHtml: buildPopupHtml(p),
      }));

      let idx = 0;
      function addBatch() {
        if (cancelled) return;
        const end = Math.min(idx + BATCH_SIZE, markerData.length);
        for (; idx < end; idx++) {
          const d = markerData[idx];
          const icon = L.divIcon({ className: '', html: d.iconHtml, iconSize: [0, 0], iconAnchor: [0, 0] });
          const marker = L.marker([d.lat, d.lng], { icon });
          marker.bindPopup(d.popupHtml, { maxWidth: 290, offset: [0, 4], className: 'ap-popup' });
          marker.addTo(map);
        }
        if (idx < markerData.length) {
          rafHandle = requestAnimationFrame(addBatch);
        } else if (markerData.length > 1) {
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
