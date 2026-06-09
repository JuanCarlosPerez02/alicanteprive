'use client';

import { useEffect } from 'react';
import { Menu } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { useSidebar } from './SidebarContext';

interface Props {
  locale: string;
  unreadMensajes: number;
  children: React.ReactNode;
}

export default function AdminShell({ locale, unreadMensajes, children }: Props) {
  const { open, toggle, close } = useSidebar();

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    return () => { document.documentElement.style.overflow = ''; };
  }, []);

  return (
    <div className="flex h-dvh overflow-hidden bg-muted/30">
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={close}
          aria-hidden
        />
      )}

      <AdminSidebar locale={locale} unreadMensajes={unreadMensajes} />

      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Mobile top bar */}
        <div className="md:hidden sticky top-0 z-30 flex items-center h-12 px-4 bg-primary text-primary-foreground border-b border-primary-foreground/10">
          <button
            onClick={toggle}
            className="p-1.5 rounded-sm hover:bg-primary-foreground/10 transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="ml-3 font-heading text-sm font-semibold">Alicante Privé</span>
        </div>

        <div className="p-4 md:p-6 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
