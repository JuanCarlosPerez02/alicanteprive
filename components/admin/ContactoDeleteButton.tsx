'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

interface Props {
  id: string;
  nombre: string;
  redirectOnDelete?: string;
}

export default function ContactoDeleteButton({ id, nombre, redirectOnDelete }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    await fetch(`/api/admin/contactos/${id}`, { method: 'DELETE' });
    if (redirectOnDelete) {
      router.push(redirectOnDelete);
    } else {
      router.refresh();
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={loading}
        className="p-1.5 hover:bg-red-50 hover:text-destructive rounded-sm transition-colors disabled:opacity-50"
        title="Eliminar contacto"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={`¿Eliminar el contacto "${nombre}"?`}
        description="Se eliminarán también todos sus intereses registrados. Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        loading={loading}
      />
    </>
  );
}
