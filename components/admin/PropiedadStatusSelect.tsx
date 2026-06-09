'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ESTADOS = ['disponible', 'reservada', 'vendida', 'alquilada', 'oculta'] as const;

const COLORS: Record<string, string> = {
  disponible: 'text-emerald-700',
  reservada: 'text-amber-700',
  vendida: 'text-gray-600',
  alquilada: 'text-blue-700',
  oculta: 'text-red-600',
};

interface Props { id: string; current: string; }

export default function PropiedadStatusSelect({ id, current }: Props) {
  const [value, setValue] = useState(current);
  const router = useRouter();

  async function handleChange(next: string) {
    setValue(next);
    await fetch(`/api/admin/propiedades/${id}`, {
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
      className={`text-xs font-semibold border-none bg-transparent focus:outline-none cursor-pointer capitalize ${COLORS[value] ?? ''}`}
    >
      {ESTADOS.map((e) => (
        <option key={e} value={e}>{e}</option>
      ))}
    </select>
  );
}
