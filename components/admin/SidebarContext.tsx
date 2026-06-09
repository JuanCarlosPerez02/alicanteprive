'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface SidebarCtx {
  open: boolean;
  toggle: () => void;
  close: () => void;
}

const SidebarContext = createContext<SidebarCtx>({
  open: true,
  toggle: () => {},
  close: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('adminSidebar');
    if (saved !== null) {
      setOpen(saved === 'open');
    } else {
      setOpen(window.innerWidth >= 768);
    }
  }, []);

  const toggle = useCallback(() => {
    setOpen((v) => {
      const next = !v;
      localStorage.setItem('adminSidebar', next ? 'open' : 'closed');
      return next;
    });
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    localStorage.setItem('adminSidebar', 'closed');
  }, []);

  return (
    <SidebarContext.Provider value={{ open, toggle, close }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
