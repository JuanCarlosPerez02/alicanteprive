import Link from 'next/link';
import type { MatchResult } from '@/types';

interface Props {
  matches: MatchResult[];
  locale: string;
  propiedadId: string;
}

export default function MatchingTab({ matches, locale, propiedadId }: Props) {
  const fromParam = encodeURIComponent(`/${locale}/admin/propiedades/${propiedadId}`);
  if (matches.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-muted-foreground">
        No hay clientes potenciales con un perfil compatible (puntuación mínima 60)
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {matches.map(({ contacto, score, criteriosCumplidos }) => (
        <div key={contacto.id} className="flex items-center gap-4 p-4 rounded-sm border border-border hover:border-primary/30 transition-colors">
          {/* Score circle */}
          <div className={`flex-shrink-0 w-14 h-14 rounded-full flex flex-col items-center justify-center text-white font-bold
            ${score >= 90 ? 'bg-emerald-600' : score >= 75 ? 'bg-primary' : 'bg-amber-500'}`}>
            <span className="text-lg leading-none">{score}</span>
            <span className="text-[10px] font-normal opacity-80">pts</span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <Link
              href={`/${locale}/admin/contactos/${contacto.id}?from=${fromParam}`}
              className="font-semibold hover:text-primary transition-colors"
            >
              {contacto.nombre}
            </Link>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5 text-xs text-muted-foreground">
              {contacto.email && <span>{contacto.email}</span>}
              {contacto.telefono && <span>{contacto.telefono}</span>}
            </div>
            {criteriosCumplidos.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {criteriosCumplidos.map((c) => (
                  <span key={c} className="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] rounded font-medium">
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>

          <Link
            href={`/${locale}/admin/contactos/${contacto.id}?from=${fromParam}`}
            className="flex-shrink-0 text-xs text-primary font-semibold hover:underline"
          >
            Ver perfil →
          </Link>
        </div>
      ))}
    </div>
  );
}
