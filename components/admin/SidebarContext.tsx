'use client';

import { createContext, useContext, useCallback, useSyncExternalStore } from 'react';

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

const KEY = 'adminSidebar';
const EVENT = 'adminSidebar:change';

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

function getSnapshot(): boolean {
  const saved = localStorage.getItem(KEY);
  if (saved !== null) return saved === 'open';
  return window.innerWidth >= 768;
}

// Server render has no localStorage/window — default to open and let the client
// reconcile to the stored value on hydration.
function getServerSnapshot(): boolean {
  return true;
}

function setStored(open: boolean) {
  localStorage.setItem(KEY, open ? 'open' : 'closed');
  // Same-tab writes don't fire `storage`, so notify subscribers explicitly.
  window.dispatchEvent(new Event(EVENT));
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const open = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => setStored(!getSnapshot()), []);
  const close = useCallback(() => setStored(false), []);

  return (
    <SidebarContext.Provider value={{ open, toggle, close }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
