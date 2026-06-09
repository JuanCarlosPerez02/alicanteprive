export type OperacionTipo = 'venta' | 'alquiler';

export type PropiedadEstado =
  | 'disponible'
  | 'reservada'
  | 'vendida'
  | 'alquilada'
  | 'oculta';

export type OrigenLead = 'web' | 'idealista' | 'fotocasa' | 'manual' | 'otro';

export type InteresEstado =
  | 'nuevo'
  | 'contactado'
  | 'visita_pendiente'
  | 'visito'
  | 'no_visito'
  | 'descartado'
  | 'cerrado';

export interface PropiedadFoto {
  id: string;
  propiedad_id: string;
  url: string;
  orden: number;
  es_portada: boolean;
  created_at: string;
}

export interface Propiedad {
  id: string;
  referencia: string;
  operacion: OperacionTipo;
  tipo: string;
  titulo: Record<string, string>;
  descripcion: Record<string, string>;
  precio: number;
  zona: string | null;
  direccion: string | null;
  lat: number | null;
  lng: number | null;
  metros: number | null;
  habitaciones: number | null;
  banos: number | null;
  caracteristicas: string[];
  estado: PropiedadEstado;
  destacada: boolean;
  referencia_idealista: string | null;
  referencia_fotocasa: string | null;
  created_at: string;
  updated_at: string;
  propiedad_fotos?: PropiedadFoto[];
}

export interface ZonaPreferida {
  nombre: string;
  lat: number;
  lng: number;
  radio_km: number;
}

export interface PreferenciasContacto {
  activo?: boolean;
  operacion?: OperacionTipo | null;
  tipo?: string[];
  presupuesto_max?: number | null;
  metros_min?: number | null;
  habitaciones_min?: number | null;
  zonas_preferidas?: ZonaPreferida[];
}

export interface Contacto {
  id: string;
  nombre: string;
  email: string | null;
  telefono: string | null;
  origen: OrigenLead;
  notas: string | null;
  preferencias: PreferenciasContacto;
  created_at: string;
  updated_at: string;
}

export interface InteresPropiedad {
  id: string;
  contacto_id: string;
  propiedad_id: string;
  origen: OrigenLead;
  estado: InteresEstado;
  motivo_no_compra: string | null;
  notas: string | null;
  created_at: string;
  updated_at: string;
  contacto?: Contacto;
  propiedad?: Propiedad;
}

export interface Mensaje {
  id: string;
  contacto_id: string | null;
  propiedad_id: string | null;
  origen: OrigenLead;
  texto: string;
  leido: boolean;
  recibido_en: string;
  contacto?: Contacto;
  propiedad?: Propiedad;
}

export interface MatchResult {
  contacto: Contacto;
  score: number;
  criteriosCumplidos: string[];
}
