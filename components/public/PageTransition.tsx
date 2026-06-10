'use client';

import { usePathname } from 'next/navigation';

// Re-keyed on every route change so the entrance animation replays on each
// navigation. Header/Footer live outside this wrapper, so they stay put.
// Query-only changes (filters) keep the same pathname → no replay.
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  );
}
