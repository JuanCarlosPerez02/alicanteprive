'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { CheckCircle } from 'lucide-react';

const schema = z.object({
  nombre: z.string().min(2),
  email: z.string().email(),
  telefono: z.string().optional(),
  mensaje: z.string().min(5),
});

type FormData = z.infer<typeof schema>;

interface Props {
  propiedadId?: string;
  propiedadReferencia?: string;
}

export default function ContactForm({ propiedadId, propiedadReferencia }: Props) {
  const t = useTranslations('contact');
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setServerError('');
    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, propiedadId, propiedadReferencia }),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
      reset();
    } catch {
      setServerError(t('error'));
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
      <div>
        <label className="block text-sm font-medium mb-1.5">{t('name')} *</label>
        <input {...register('nombre')} className={inputClass} placeholder="María García" />
        {errors.nombre && <p className={errorClass}>{t('required')}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">{t('email')} *</label>
        <input {...register('email')} type="email" className={inputClass} placeholder="maria@ejemplo.com" />
        {errors.email && <p className={errorClass}>{t('email_invalid')}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">{t('phone')}</label>
        <input {...register('telefono')} type="tel" className={inputClass} placeholder="+34 600 000 000" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">{t('message')} *</label>
        <textarea
          {...register('mensaje')}
          rows={4}
          className={inputClass}
          placeholder={t('message_placeholder')}
        />
        {errors.mensaje && <p className={errorClass}>{t('required')}</p>}
      </div>

      {serverError && <p className="text-destructive text-sm text-center">{serverError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-sm text-sm hover:opacity-90 disabled:opacity-60 transition"
      >
        {isSubmitting ? t('sending') : t('send')}
      </button>
    </form>
  );
}
