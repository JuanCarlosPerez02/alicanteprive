'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { CheckCircle } from 'lucide-react';
import { Link } from '@/i18n/navigation';

const TIPOS = ['piso', 'casa', 'atico', 'villa', 'chalet', 'adosado', 'duplex', 'estudio', 'local'];

const schema = z.object({
  nombre: z.string().min(2),
  email: z.string().email(),
  telefono: z.string().min(6),
  direccion: z.string().min(3),
  tipo: z.string().min(1),
  metros: z.string().optional(),
  detalles: z.string().optional(),
  aceptaPrivacidad: z.boolean().refine((v) => v === true),
});

type FormData = z.infer<typeof schema>;

export default function VenderForm() {
  const t = useTranslations('sell');
  const tc = useTranslations('contact');
  const tTypes = useTranslations('types');
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { tipo: 'piso' },
  });

  async function onSubmit(data: FormData) {
    setServerError('');
    try {
      const res = await fetch('/api/vender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
      reset();
    } catch {
      setServerError(tc('error'));
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <CheckCircle className="w-10 h-10 text-emerald-500" />
        <p className="font-heading text-lg font-semibold">{t('success')}</p>
      </div>
    );
  }

  const inputClass =
    'w-full px-3 py-2.5 border border-border rounded-sm bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition placeholder:text-muted-foreground';
  const errorClass = 'text-destructive text-xs mt-1';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">{tc('name')} *</label>
          <input {...register('nombre')} className={inputClass} placeholder="María García" />
          {errors.nombre && <p className={errorClass}>{tc('required')}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">{tc('phone')} *</label>
          <input {...register('telefono')} type="tel" className={inputClass} placeholder="+34 600 000 000" />
          {errors.telefono && <p className={errorClass}>{tc('required')}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">{tc('email')} *</label>
        <input {...register('email')} type="email" className={inputClass} placeholder="maria@ejemplo.com" />
        {errors.email && <p className={errorClass}>{tc('email_invalid')}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">{t('address')} *</label>
        <input {...register('direccion')} className={inputClass} placeholder={t('address_placeholder')} />
        {errors.direccion && <p className={errorClass}>{tc('required')}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">{t('type')} *</label>
          <select {...register('tipo')} className={inputClass}>
            {TIPOS.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tTypes(tipo as Parameters<typeof tTypes>[0])}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">{t('sqm')}</label>
          <input {...register('metros')} type="number" min={0} className={inputClass} placeholder="120" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">{t('details')}</label>
        <textarea
          {...register('detalles')}
          rows={4}
          className={inputClass}
          placeholder={t('details_placeholder')}
        />
      </div>

      <div>
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            {...register('aceptaPrivacidad')}
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 accent-primary cursor-pointer"
          />
          <span className="text-xs text-muted-foreground leading-relaxed">
            {tc('privacy_before')}{' '}
            <Link href="/politica-privacidad" className="underline hover:text-gold transition-colors">
              {tc('privacy_link')}
            </Link>.
          </span>
        </label>
        {errors.aceptaPrivacidad && (
          <p className="text-destructive text-xs mt-1">{tc('privacy_required')}</p>
        )}
      </div>

      {serverError && <p className="text-destructive text-sm text-center">{serverError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-sm text-sm hover:opacity-90 disabled:opacity-60 transition"
      >
        {isSubmitting ? tc('sending') : t('send')}
      </button>
    </form>
  );
}
