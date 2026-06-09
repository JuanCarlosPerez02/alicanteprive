'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

interface Props {
  id: string;
  redirectTo: string;
}

export default function MensajeDeleteButton({ id, redirectTo }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    await fetch(`/api/admin/mensajes/${id}`, { method: 'DELETE' });
    router.push(redirectTo);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={loading}
        className="p-1.5 hover:bg-red-50 hover:text-destructive rounded-sm transition-colors disabled:opacity-50"
        title="Eliminar mensaje"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="¿Eliminar este mensaje?"
        description="Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        loading={loading}
      />
    </>
  );
}
