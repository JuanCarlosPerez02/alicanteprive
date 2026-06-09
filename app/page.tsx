import { redirect } from 'next/navigation';

// Root path is always handled by middleware (redirects to /es).
// This component acts as a fallback.
export default function RootPage() {
  redirect('/es');
}
