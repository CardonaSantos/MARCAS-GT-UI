export type TrackingSessionStatus = "ACTIVA" | "FINALIZADA" | "EXPIRADA";

export interface TrackingEmployee {
  id: number;
  nombre: string;
  correo?: string | null;
  telefono?: string | null;
  rol: string;
  avatarUrl?: string | null;
  activo?: boolean;
}

export interface TrackingPosition {
  latitud: number;
  longitud: number;
  precision: number | null;
  velocidad: number | null;
  bateria: number | null;
  capturadoEn: string | null;
  recibidoEn: string;
}

export interface TrackingRealtimeView {
  tecnico: TrackingEmployee;
  usuario: TrackingEmployee;
  tracking: {
    sesionId: number;
    asistenciaId: number;
    estado: TrackingSessionStatus;
    iniciadoEn: string;
    ultimoHeartbeatEn: string;
    minutosSesionActual: number;
  };
  jornada: {
    fecha: string;
    horaEntrada: string;
    horaSalida: string | null;
    sesionesTotal: number;
    sesionesFinalizadas: number;
    sesionesExpiradas: number;
    minutosTracking: number;
    minutosJornadaConfirmados: number;
    minutosSinTrackingConfirmados: number;
  };
  ubicacion: TrackingPosition | null;
  actividad: {
    ticketsEnProceso: Array<{ id: number; titulo: string | null; estado: string; prioridad: string }>;
    visitasActivas: Array<{ id: number; clienteId: number; inicio: string; motivoVisita: string | null; tipoVisita: string | null }>;
    enviosActivos: Array<{ id: number; numero: string; estado: string; salidaEn: string | null; entregaEstimadaEn: string | null }>;
  };
}

export interface TrackingHistoryFilters {
  page: number;
  limit: number;
  search?: string;
  usuarioId?: number;
  fechaDesde?: string;
  fechaHasta?: string;
  estadoSesion?: TrackingSessionStatus;
}

export interface TrackingHistoryItem {
  asistenciaId: number;
  fecha: string;
  horaEntrada: string;
  horaSalida: string | null;
  tecnico: TrackingEmployee;
  usuario: TrackingEmployee;
  tracking: {
    sesionesTotal: number;
    sesionesFinalizadas: number;
    sesionesExpiradas: number;
    haySesionActiva: boolean;
    primeraActivacion: string | null;
    ultimaFinalizacion: string | null;
    ultimoHeartbeatEn: string | null;
    minutosTracking: number;
  };
}

export interface TrackingPage<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TrackingSessionDetail {
  id: number;
  estado: TrackingSessionStatus;
  iniciadoEn: string;
  finalizadoEn: string | null;
  ultimoHeartbeatEn: string;
  duracionMinutos: number;
  puntosRegistrados: number;
  bateriaInicial: number | null;
  bateriaFinal: number | null;
  primeraUbicacion: Pick<TrackingPosition, "latitud" | "longitud" | "capturadoEn"> | null;
  ultimaUbicacion: Pick<TrackingPosition, "latitud" | "longitud" | "capturadoEn"> | null;
}

export interface TrackingAttendanceDetail {
  asistencia: { id: number; fecha: string; horaEntrada: string; horaSalida: string | null };
  tecnico: TrackingEmployee;
  usuario: TrackingEmployee;
  resumen: {
    sesionesTotal: number;
    sesionesFinalizadas: number;
    sesionesExpiradas: number;
    haySesionActiva: boolean;
    primeraActivacion: string | null;
    ultimaFinalizacion: string | null;
    ultimoHeartbeatEn: string | null;
    minutosTracking: number;
    minutosJornada: number | null;
    minutosSinTracking: number | null;
  };
  sesiones: TrackingSessionDetail[];
}

export interface TrackingLocation extends TrackingPosition {
  id: number;
  sesionTrackingId: number | null;
}

export function trackingDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("es-GT", {
        timeZone: "America/Guatemala", dateStyle: "medium", timeStyle: "short",
      }).format(date);
}

export function trackingBusinessDate(value: string | null | undefined): string {
  if (!value) return "—";
  const parts = value.slice(0, 10).split("-");
  return parts.length === 3 ? parts[2] + "/" + parts[1] + "/" + parts[0] : "—";
}

export function trackingDuration(minutes: number | null | undefined): string {
  if (minutes === null || minutes === undefined) return "—";
  const safe = Math.max(0, Math.floor(minutes));
  return Math.floor(safe / 60) + " h " + (safe % 60) + " min";
}

export function trackingCoordinateValid(position: {latitud: number; longitud: number} | null | undefined): boolean {
  return Boolean(position && Number.isFinite(position.latitud) && Number.isFinite(position.longitud) &&
    Math.abs(position.latitud) <= 90 && Math.abs(position.longitud) <= 180);
}
