'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, X, Search } from 'lucide-react';

export interface SearchSelectOption {
  id: string;
  label: string;
  sub?: string;
}

interface Props {
  value: string;
  onChange: (id: string) => void;
  options: SearchSelectOption[];
  placeholder?: string;
  emptyLabel?: string;
  disabled?: boolean;
}

interface DropdownPos {
  top: number;
  left: number;
  width: number;
}

export default function SearchSelect({
  value,
  onChange,
  options,
  placeholder = 'Buscar…',
  emptyLabel = '— Ninguno —',
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<DropdownPos | null>(null);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.id === value);

  const filtered = search.trim()
    ? options.filter(
        (o) =>
          o.label.toLowerCase().includes(search.toLowerCase()) ||
          o.sub?.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  // Viewport coords for a position:fixed portal. The admin shell scrolls an
  // inner container (window never scrolls), so document coords would leave the
  // panel stranded on screen while the trigger scrolls away.
  function computePos(): DropdownPos | null {
    const r = containerRef.current?.getBoundingClientRect();
    return r ? { top: r.bottom + 4, left: r.left, width: r.width } : null;
  }

  function openDropdown() {
    const p = computePos();
    if (!p) return;
    setPos(p);
    setOpen(true);
  }

  function closeDropdown() {
    setOpen(false);
    setPos(null);
    setSearch('');
  }

  function handleToggle() {
    if (open) closeDropdown();
    else openDropdown();
  }

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        containerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) return;
      closeDropdown();
    }
    if (open) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
  }, [open]);

  // Keep the panel glued to the trigger while any ancestor scrolls or the
  // window resizes. capture:true also catches inner scroll containers
  // (the admin shell's <main> scrolls; the window itself never does).
  useEffect(() => {
    if (!open) return;
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const p = computePos();
        if (p) setPos(p);
      });
    };
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open]);

  function select(id: string) {
    onChange(id);
    closeDropdown();
  }

  const dropdown = open && pos ? (
    <div
      ref={dropdownRef}
      style={{
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        width: pos.width,
        zIndex: 9999,
      }}
      className="bg-background border border-border rounded-sm shadow-lg"
    >
      <div className="p-2 border-b border-border">
        <div className="flex items-center gap-2 px-2 py-1.5 border border-border rounded-sm bg-muted/30 focus-within:ring-2 focus-within:ring-ring transition">
          <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={placeholder}
            className="flex-1 text-sm bg-transparent outline-none"
          />
          {search && (
            <button type="button" onClick={() => setSearch('')} className="text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="max-h-56 overflow-y-auto py-1">
        <button
          type="button"
          onClick={() => select('')}
          className={`w-full text-left px-3 py-2 text-sm transition-colors ${
            !value ? 'text-primary font-medium bg-primary/5' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          {emptyLabel}
        </button>

        {filtered.length === 0 ? (
          <p className="px-3 py-3 text-sm text-muted-foreground text-center">Sin resultados</p>
        ) : (
          filtered.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => select(o.id)}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                value === o.id ? 'text-primary font-medium bg-primary/5' : 'hover:bg-muted hover:text-foreground'
              }`}
            >
              <span className="block truncate">{o.label}</span>
              {o.sub && <span className="block text-xs text-muted-foreground truncate">{o.sub}</span>}
            </button>
          ))
        )}
      </div>
    </div>
  ) : null;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        className="w-full border border-border rounded-sm px-3 py-2 text-sm bg-background flex items-center justify-between gap-2 focus:outline-none focus:ring-2 focus:ring-ring transition disabled:opacity-50 disabled:cursor-not-allowed text-left min-h-[38px]"
      >
        <div className="flex-1 min-w-0">
          {selected ? (
            <>
              <span className="block truncate">{selected.label}</span>
              {selected.sub && <span className="block text-xs text-muted-foreground truncate">{selected.sub}</span>}
            </>
          ) : (
            <span className="text-muted-foreground truncate">{emptyLabel}</span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {value && !disabled && (
            <span
              role="button"
              tabIndex={-1}
              onClick={(e) => { e.stopPropagation(); select(''); }}
              className="p-0.5 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Limpiar"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {typeof window !== 'undefined' && dropdown && createPortal(dropdown, document.body)}
    </div>
  );
}
