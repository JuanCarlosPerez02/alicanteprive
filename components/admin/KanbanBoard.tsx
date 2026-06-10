'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { GripVertical, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import type { Propiedad } from '@/types';

type Estado = 'disponible' | 'reservada' | 'vendida' | 'alquilada' | 'oculta';

const COLUMNS: { estado: Estado; label: string; color: string }[] = [
  { estado: 'disponible', label: 'Disponible', color: '#22c55e' },
  { estado: 'reservada', label: 'Reservada', color: '#f59e0b' },
  { estado: 'vendida', label: 'Vendida', color: '#3b82f6' },
  { estado: 'alquilada', label: 'Alquilada', color: '#8b5cf6' },
  { estado: 'oculta', label: 'Oculta', color: '#9ca3af' },
];

type ByEstado = Record<Estado, Propiedad[]>;

function getTitulo(titulo: unknown) {
  const t = titulo as Record<string, string> | null;
  if (!t) return 'Sin título';
  return t.es || t.en || Object.values(t)[0] || 'Sin título';
}

function getCover(p: Propiedad) {
  const fotos = p.propiedad_fotos ?? [];
  return fotos.find((f) => f.es_portada)?.url ?? fotos[0]?.url ?? null;
}

// Pure visual card used in DragOverlay
function CardShell({ p }: { p: Propiedad }) {
  const cover = getCover(p);
  const titulo = getTitulo(p.titulo);
  return (
    <div className="bg-card border border-border rounded-sm shadow-lg w-52">
      {cover && (
        <div className="relative w-full h-14">
          <Image src={cover} alt="" fill sizes="208px" className="object-cover rounded-t-sm" />
        </div>
      )}
      <div className="p-3">
        <p className="text-[10px] font-mono text-muted-foreground mb-1">{p.referencia}</p>
        <p className="text-sm font-medium line-clamp-2 leading-snug mb-1">{titulo}</p>
        <p className="text-xs text-muted-foreground capitalize mb-2">{p.tipo}</p>
        <p className="text-sm font-bold text-primary">{formatPrice(p.precio, 'es')}</p>
      </div>
    </div>
  );
}

function KanbanCard({ p, locale }: { p: Propiedad; locale: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    isDragging,
  } = useDraggable({ id: p.id });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  const cover = getCover(p);
  const titulo = getTitulo(p.titulo);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-card border border-border rounded-sm shadow-sm group transition-shadow ${
        isDragging ? 'opacity-20' : 'hover:shadow-md'
      }`}
    >
      {cover && (
        <div className="relative w-full h-14 pointer-events-none">
          <Image src={cover} alt="" fill sizes="256px" className="object-cover rounded-t-sm" />
        </div>
      )}
      <div className="p-3">
        <div className="flex items-start gap-1">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-mono text-muted-foreground leading-none mb-1.5">
              {p.referencia}
            </p>
            <p className="text-sm font-medium leading-snug line-clamp-2 mb-1">{titulo}</p>
            <p className="text-xs text-muted-foreground capitalize">{p.tipo}</p>
            <p className="text-sm font-bold text-primary mt-1.5">
              {formatPrice(p.precio, 'es')}
            </p>
          </div>
          {/* Drag handle — only this triggers drag */}
          <button
            ref={setActivatorNodeRef}
            {...listeners}
            {...attributes}
            className="flex-shrink-0 mt-0.5 p-1 rounded text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted transition-colors cursor-grab active:cursor-grabbing touch-none"
            title="Arrastrar"
            tabIndex={-1}
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>
        </div>
        <Link
          href={`/${locale}/admin/propiedades/${p.id}`}
          className="mt-2.5 flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          Ver / editar
        </Link>
      </div>
    </div>
  );
}

function KanbanColumn({
  estado,
  label,
  color,
  cards,
  locale,
}: {
  estado: Estado;
  label: string;
  color: string;
  cards: Propiedad[];
  locale: string;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: estado });

  return (
    <div
      className={`flex-shrink-0 w-52 flex flex-col rounded-sm border bg-muted/20 transition-colors ${
        isOver ? 'bg-primary/5 border-primary/40' : 'border-border'
      }`}
      style={{ borderTopWidth: 3, borderTopColor: color }}
    >
      <div className="px-3 py-2.5 flex items-center justify-between border-b border-border">
        <span className="text-sm font-semibold">{label}</span>
        <span className="text-xs font-bold bg-background border border-border rounded-full px-2 py-0.5 tabular-nums">
          {cards.length}
        </span>
      </div>

      <div ref={setNodeRef} className="flex-1 p-2 space-y-2 min-h-[320px]">
        {cards.map((p) => (
          <KanbanCard key={p.id} p={p} locale={locale} />
        ))}
        {cards.length === 0 && (
          <div className="h-16 border-2 border-dashed border-border/60 rounded-sm flex items-center justify-center">
            <p className="text-xs text-muted-foreground">Arrastra aquí</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface Props {
  propiedades: Propiedad[];
  locale: string;
}

export default function KanbanBoard({ propiedades, locale }: Props) {
  const [byEstado, setByEstado] = useState<ByEstado>(() => {
    const init: ByEstado = {
      disponible: [],
      reservada: [],
      vendida: [],
      alquilada: [],
      oculta: [],
    };
    propiedades.forEach((p) => {
      const col = p.estado as Estado;
      if (init[col]) init[col].push(p);
    });
    return init;
  });

  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  const activePropiedad = activeId
    ? Object.values(byEstado).flat().find((p) => p.id === activeId) ?? null
    : null;

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id as string);
  }

  async function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null);
    if (!over) return;

    const draggedId = active.id as string;
    const newEstado = over.id as Estado;

    let oldEstado: Estado | null = null;
    let draggedProp: Propiedad | null = null;

    for (const [estado, props] of Object.entries(byEstado) as [Estado, Propiedad[]][]) {
      const found = props.find((p) => p.id === draggedId);
      if (found) { draggedProp = found; oldEstado = estado; break; }
    }

    if (!draggedProp || !oldEstado || oldEstado === newEstado) return;

    // Optimistic update
    setByEstado((prev) => {
      const next = { ...prev };
      next[oldEstado!] = next[oldEstado!].filter((p) => p.id !== draggedId);
      next[newEstado] = [{ ...draggedProp!, estado: newEstado }, ...next[newEstado]];
      return next;
    });

    const res = await fetch(`/api/admin/propiedades/${draggedId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: newEstado }),
    });

    if (!res.ok) {
      // Revert on error
      setByEstado((prev) => {
        const next = { ...prev };
        next[newEstado] = next[newEstado].filter((p) => p.id !== draggedId);
        next[oldEstado!] = [draggedProp!, ...next[oldEstado!]];
        return next;
      });
    }
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-6 min-h-[500px]">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.estado}
            estado={col.estado}
            label={col.label}
            color={col.color}
            cards={byEstado[col.estado]}
            locale={locale}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={null}>
        {activePropiedad ? (
          <div className="rotate-1 opacity-95 cursor-grabbing">
            <CardShell p={activePropiedad} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
