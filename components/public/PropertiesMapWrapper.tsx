'use client';

import dynamic from 'next/dynamic';
import type { MapProperty } from './PropertiesMapView';

const PropertiesMapView = dynamic(
  () => import('./PropertiesMapView'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[560px] bg-muted/30 rounded-sm border border-border animate-pulse" />
    ),
  }
);

export default function PropertiesMapWrapper({ properties }: { properties: MapProperty[] }) {
  return <PropertiesMapView properties={properties} />;
}
