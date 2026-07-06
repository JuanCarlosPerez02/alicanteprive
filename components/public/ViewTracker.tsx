'use client';

import { useEffect } from 'react';

// Fire-and-forget view counter. Runs client-side so it works on ISR/SSG
// pages; sessionStorage keeps repeat navigations within a session from
// inflating the count.
export default function ViewTracker({ propiedadId }: { propiedadId: string }) {
  useEffect(() => {
    const key = `vt-${propiedadId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
    fetch('/api/vistas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: propiedadId }),
      keepalive: true,
    }).catch(() => {});
  }, [propiedadId]);

  return null;
}
