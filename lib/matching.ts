import { haversineKm } from './haversine';
import type { Propiedad, Contacto, MatchResult } from '@/types';

const WEIGHTS = {
  operacion: 30,
  tipo: 15,
  presupuesto: 20,
  metros: 10,
  habitaciones: 10,
  zona: 15,
};

const SCORE_THRESHOLD = 60;

export function calcularMatch(propiedad: Propiedad, contacto: Contacto): MatchResult {
  const pref = contacto.preferencias;
  let score = 0;
  const criteriosCumplidos: string[] = [];

  // Operación (filtro duro + puntuación)
  if (pref.operacion && pref.operacion !== propiedad.operacion) {
    return { contacto, score: 0, criteriosCumplidos: [] };
  }
  if (pref.operacion === propiedad.operacion) {
    score += WEIGHTS.operacion;
    criteriosCumplidos.push('operacion');
  }

  // Tipo
  if (pref.tipo && pref.tipo.length > 0 && pref.tipo.includes(propiedad.tipo)) {
    score += WEIGHTS.tipo;
    criteriosCumplidos.push('tipo');
  }

  // Presupuesto
  if (pref.presupuesto_max != null) {
    if (propiedad.precio <= pref.presupuesto_max) {
      score += WEIGHTS.presupuesto;
      criteriosCumplidos.push('presupuesto');
    } else if (propiedad.precio <= pref.presupuesto_max * 1.1) {
      score += Math.round(WEIGHTS.presupuesto * 0.4);
      criteriosCumplidos.push('presupuesto_parcial');
    }
  }

  // Metros
  if (pref.metros_min != null && propiedad.metros != null) {
    if (propiedad.metros >= pref.metros_min) {
      score += WEIGHTS.metros;
      criteriosCumplidos.push('metros');
    }
  }

  // Habitaciones
  if (pref.habitaciones_min != null && propiedad.habitaciones != null) {
    if (propiedad.habitaciones >= pref.habitaciones_min) {
      score += WEIGHTS.habitaciones;
      criteriosCumplidos.push('habitaciones');
    }
  }

  // Zona geográfica (Haversine)
  if (
    pref.zonas_preferidas &&
    pref.zonas_preferidas.length > 0 &&
    propiedad.lat != null &&
    propiedad.lng != null
  ) {
    let bestZonaScore = 0;
    let bestZonaLabel = '';

    for (const zona of pref.zonas_preferidas) {
      const distKm = haversineKm(zona.lat, zona.lng, propiedad.lat, propiedad.lng);
      if (distKm <= zona.radio_km) {
        const zonaScore = WEIGHTS.zona * (1 - distKm / zona.radio_km);
        if (zonaScore > bestZonaScore) {
          bestZonaScore = zonaScore;
          bestZonaLabel = `zona (${distKm.toFixed(1)} km)`;
        }
      }
    }

    if (bestZonaScore > 0) {
      score += Math.round(bestZonaScore);
      criteriosCumplidos.push(bestZonaLabel);
    }
  }

  return { contacto, score: Math.min(100, score), criteriosCumplidos };
}

export function buscarClientesPotenciales(
  propiedad: Propiedad,
  contactos: Contacto[],
  umbral = SCORE_THRESHOLD
): MatchResult[] {
  return contactos
    .filter((c) => c.preferencias.activo)
    .map((c) => calcularMatch(propiedad, c))
    .filter((r) => r.score >= umbral)
    .sort((a, b) => b.score - a.score);
}
