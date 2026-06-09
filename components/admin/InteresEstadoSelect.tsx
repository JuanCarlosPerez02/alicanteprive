'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ESTADOS = [
  'nuevo', 'contactado', 'visita_pendiente', 'visito',
  'no_visito', 'descartado', 'cerrado',
] as const;

const LABELS: Record<string, string> = {
  nuevo: 'Nuevo',
  contactado: 'Contactado',
  visita_pendiente: 'Visita pendiente',
  visito: 'Visitó',
  no_visito: 'No visitó',
  descartado: 'Descartado',
  cerrado: 'Cerrado',
};

const COLORS: Record<string, string> = {
  nuevo: 'text-blue-700',
  contactado: 'text-yellow-700',
  visita_pendiente: 'text-orange-700',
  visito: 'text-purple-700',
  no_visito: 'text-gray-600',
  descartado: 'text-red-600',
  cerrado: 'text-emerald-700',
};

interface Props {
  id: string;
  current: string;
}

export default function InteresEstadoSelect({ id, current }: Props) {
  const [value, setValue] = useState(current);
  const router = useRouter();

  async function handleChange(next: string) {
    setValue(next);
    await fetch(`/api/admin/intereses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: next }),
    });
    router.refresh();
  }

  return (
    <select
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      className={`text-xs font-semibold border-none bg-transparent focus:outline-none cursor-pointer ${COLORS[value] ?? ''}`}
    >
      {ESTADOS.map((e) => (
        <option key={e} value={e}>{LABELS[e]}</option>
      ))}
    </select>
  );
}
