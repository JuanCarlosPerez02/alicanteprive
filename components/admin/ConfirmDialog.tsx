'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  loading?: boolean;
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Eliminar',
  onConfirm,
  loading,
}: Props) {
  function handleConfirm() {
    onOpenChange(false);
    onConfirm();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => onOpenChange(o)}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <DialogClose
            render={
              <button className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-sm transition-colors" />
            }
          >
            Cancelar
          </DialogClose>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2 bg-destructive text-white text-sm font-semibold rounded-sm hover:opacity-90 disabled:opacity-50 transition"
          >
            {loading ? 'Eliminando…' : confirmLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
