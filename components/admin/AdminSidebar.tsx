'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Building2, Users, MessageSquare,
  LogOut, Kanban, BarChart2, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useSidebar } from './SidebarContext';

interface NavLink {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
  badge?: number;
}

interface Props {
  locale: string;
  unreadMensajes: number;
}

export default function AdminSidebar({ locale, unreadMensajes }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { open, toggle } = useSidebar();

  const links: NavLink[] = [
    { href: `/${locale}/admin`, label: 'Inicio', icon: LayoutDashboard, exact: true },
    { href: `/${locale}/admin/propiedades`, label: 'Propiedades', icon: Building2 },
    { href: `/${locale}/admin/contactos`, label: 'Contactos', icon: Users },
    { href: `/${locale}/admin/mensajes`, label: 'Mensajes', icon: MessageSquare, badge: unreadMensajes },
    { href: `/${locale}/admin/kanban`, label: 'Kanban', icon: Kanban },
    { href: `/${locale}/admin/analiticas`, label: 'Analíticas', icon: BarChart2 },
  ];

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${locale}/admin/login`);
    router.refresh();
  }

  return (
    <aside
      className={`
        shrink-0 bg-primary text-primary-foreground flex flex-col h-full
        fixed top-0 left-0 z-50 w-56
        transition-transform duration-200 ease-in-out
        md:relative md:z-auto md:translate-x-0
        md:transition-[width] md:duration-200
        ${open ? 'translate-x-0 md:w-56' : '-translate-x-full md:w-14'}
      `}
    >
      {/* Logo */}
      <div
        className={`border-b border-primary-foreground/10 transition-[padding] duration-200 ${
          open ? 'px-6 py-7' : 'px-3 py-5 flex justify-center'
        }`}
      >
        {open ? (
          <>
            <p className="text-gold text-[10px] tracking-[0.3em] uppercase font-sans mb-0.5">Admin</p>
            <p className="font-heading text-lg font-semibold leading-tight">Alicante Privé</p>
          </>
        ) : (
          <span className="text-gold font-heading text-xl font-bold">A</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {links.map((link) => {
          const isActive = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          const badge = link.badge ?? 0;

          return (
            <Link
              key={link.href}
              href={link.href}
              title={!open ? link.label : undefined}
              className={`flex items-center gap-3 rounded-sm text-sm font-medium transition-colors ${
                open ? 'px-3 py-2.5' : 'py-2.5 justify-center'
              } ${
                isActive
                  ? 'bg-primary-foreground/10 text-primary-foreground'
                  : 'text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/5'
              }`}
            >
              <span className="relative shrink-0">
                <link.icon className="w-4 h-4" />
                {badge > 0 && !open && (
                  <span className="absolute -top-1.5 -right-1.5 w-2 h-2 bg-gold rounded-full" />
                )}
              </span>
              {open && (
                <>
                  <span className="flex-1 truncate">{link.label}</span>
                  {badge > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full bg-gold text-primary text-[10px] font-bold leading-none">
                      {badge > 99 ? '99+' : badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout + collapse toggle */}
      <div className="px-2 py-4 border-t border-primary-foreground/10 space-y-0.5">
        <button
          onClick={handleLogout}
          title={!open ? 'Cerrar sesión' : undefined}
          className={`flex items-center gap-3 w-full rounded-sm text-sm font-medium text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/5 transition-colors ${
            open ? 'px-3 py-2.5' : 'py-2.5 justify-center'
          }`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {open && 'Cerrar sesión'}
        </button>

        <button
          onClick={toggle}
          title={open ? 'Colapsar menú' : 'Expandir menú'}
          className={`flex items-center gap-3 w-full rounded-sm text-sm font-medium text-primary-foreground/40 hover:text-primary-foreground hover:bg-primary-foreground/5 transition-colors ${
            open ? 'px-3 py-2.5' : 'py-2.5 justify-center'
          }`}
        >
          {open ? (
            <ChevronLeft className="w-4 h-4 shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 shrink-0" />
          )}
          {open && <span className="text-xs">Colapsar</span>}
        </button>
      </div>
    </aside>
  );
}
