'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

interface Props { id: string; referencia: string; }

export default function PropiedadDeleteButton({ id, referencia }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    await fetch(`/api/admin/propiedades/${id}`, { method: 'DELETE' });
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={loading}
        className="p-1.5 hover:bg-red-50 hover:text-destructive rounded-sm transition-colors disabled:opacity-50"
        title="Eliminar"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={`¿Eliminar la propiedad ${referencia}?`}
        description="Se eliminarán también todas sus fotos e intereses. Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        loading={loading}
      />
    </>
  );
}
