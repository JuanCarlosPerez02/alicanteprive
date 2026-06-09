'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Circle } from 'lucide-react';

interface Props {
  id: string;
  leido: boolean;
}

export default function MensajeMarkReadButton({ id, leido }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [optimistic, setOptimistic] = useState(leido);

  async function toggle() {
    const next = !optimistic;
    setOptimistic(next);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/mensajes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leido: next }),
      });
      if (!res.ok) setOptimistic(!next);
      else router.refresh();
    } catch {
      setOptimistic(!next);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-sm border transition-colors disabled:opacity-50 whitespace-nowrap ${
        optimistic
          ? 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-300'
          : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      {optimistic ? (
        <><CheckCircle className="w-3.5 h-3.5" />{loading ? '…' : 'Leído — desmarcar'}</>
      ) : (
        <><Circle className="w-3.5 h-3.5" />{loading ? '…' : 'Marcar leído'}</>
      )}
    </button>
  );
}
