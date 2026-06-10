'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Trash2, Star, StarOff, Upload } from 'lucide-react';
import type { PropiedadFoto } from '@/types';
import ConfirmDialog from './ConfirmDialog';

interface Props {
  propiedadId: string;
  initialFotos: PropiedadFoto[];
}

export default function FotoManager({ propiedadId, initialFotos }: Props) {
  const [fotos, setFotos] = useState<PropiedadFoto[]>(
    [...initialFotos].sort((a, b) => a.orden - b.orden)
  );
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirmFoto, setConfirmFoto] = useState<{ id: string; url: string } | null>(null);

  async function uploadFiles(files: FileList) {
    setUploading(true);
    const maxOrden = fotos.length > 0 ? Math.max(...fotos.map((f) => f.orden)) : 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const form = new FormData();
      form.append('file', file);
      form.append('propiedadId', propiedadId);
      form.append('orden', String(maxOrden + i + 1));

      const res = await fetch('/api/admin/fotos', { method: 'POST', body: form });
      if (res.ok) {
        const { foto } = await res.json();
        setFotos((prev) => [...prev, foto]);
      }
    }
    setUploading(false);
  }

  async function deleteFoto(id: string, url: string) {
    await fetch(`/api/admin/fotos/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    setFotos((prev) => prev.filter((f) => f.id !== id));
  }

  async function togglePortada(id: string) {
    const newFotos = fotos.map((f) => ({ ...f, es_portada: f.id === id }));
    setFotos(newFotos);

    await Promise.all(
      newFotos.map((f) =>
        fetch(`/api/admin/fotos/${f.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ es_portada: f.es_portada }),
        })
      )
    );
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
  }

  return (
    <div className="space-y-4">
      {/* Upload zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-sm p-8 text-center cursor-pointer transition-colors
          ${dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30'}`}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm font-medium">
          {uploading ? 'Subiendo...' : 'Arrastra fotos aquí o haz clic para seleccionar'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP — máx. 5MB por foto</p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
      </div>

      {/* Grid */}
      {fotos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {fotos.map((foto) => (
            <div key={foto.id} className="group relative rounded-sm overflow-hidden border border-border bg-muted aspect-[4/3]">
              <Image
                src={foto.url}
                alt=""
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover"
              />

              {/* Portada badge */}
              {foto.es_portada && (
                <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded">
                  Portada
                </span>
              )}

              {/* Actions overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => togglePortada(foto.id)}
                  title={foto.es_portada ? 'Quitar portada' : 'Marcar como portada'}
                  className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                >
                  {foto.es_portada
                    ? <StarOff className="w-4 h-4 text-primary" />
                    : <Star className="w-4 h-4 text-primary" />}
                </button>
                <button
                  onClick={() => setConfirmFoto({ id: foto.id, url: foto.url })}
                  title="Eliminar"
                  className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {fotos.length === 0 && !uploading && (
        <p className="text-sm text-muted-foreground text-center py-4">No hay fotos todavía</p>
      )}

      <ConfirmDialog
        open={confirmFoto !== null}
        onOpenChange={(o) => { if (!o) setConfirmFoto(null); }}
        title="¿Eliminar esta foto?"
        description="Esta acción no se puede deshacer."
        onConfirm={() => confirmFoto && deleteFoto(confirmFoto.id, confirmFoto.url)}
      />
    </div>
  );
}
