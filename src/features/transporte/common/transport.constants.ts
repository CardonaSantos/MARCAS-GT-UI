import type {
  DriverState,
  ShipmentIncidentSeverity,
  ShipmentIncidentState,
  ShipmentIncidentType,
  ShipmentMode,
  ShipmentSortField,
  ShipmentState,
  VehicleState,
} from "../api/transport.types";

export const SHIPMENT_STATES = [
  "PROGRAMADO",
  "ASIGNADO",
  "CARGADO",
  "EN_RUTA",
  "ENTREGADO_PARCIAL",
  "COMPLETADO",
  "INCIDENCIA",
  "CANCELADO",
] as const satisfies readonly ShipmentState[];

export const SHIPMENT_STATE_LABELS: Record<ShipmentState, string> = {
  PROGRAMADO: "Programado",
  ASIGNADO: "Asignado",
  CARGADO: "Cargado",
  EN_RUTA: "En ruta",
  ENTREGADO_PARCIAL: "Entregado parcial",
  COMPLETADO: "Completado",
  INCIDENCIA: "Incidencia",
  CANCELADO: "Cancelado",
};

export const SHIPMENT_STATE_TONES = {
  PROGRAMADO: "warning",
  ASIGNADO: "info",
  CARGADO: "primary",
  EN_RUTA: "primary",
  ENTREGADO_PARCIAL: "warning",
  COMPLETADO: "success",
  INCIDENCIA: "danger",
  CANCELADO: "danger",
} as const;

export const SHIPMENT_MODES = [
  "INTERNO",
  "EXTERNO",
] as const satisfies readonly ShipmentMode[];

export const SHIPMENT_MODE_LABELS: Record<ShipmentMode, string> = {
  INTERNO: "Interno",
  EXTERNO: "Externo",
};

export const SHIPMENT_SORT_FIELDS = [
  "creadoEn",
  "numero",
  "estado",
  "salidaProgramadaEn",
  "salidaEn",
] as const satisfies readonly ShipmentSortField[];

export const VEHICLE_STATES = [
  "DISPONIBLE",
  "RESERVADO",
  "EN_RUTA",
  "MANTENIMIENTO",
  "FUERA_SERVICIO",
  "INACTIVO",
] as const satisfies readonly VehicleState[];

export const VEHICLE_STATE_LABELS: Record<VehicleState, string> = {
  DISPONIBLE: "Disponible",
  RESERVADO: "Reservado",
  EN_RUTA: "En ruta",
  MANTENIMIENTO: "Mantenimiento",
  FUERA_SERVICIO: "Fuera de servicio",
  INACTIVO: "Inactivo",
};

export const DRIVER_STATES = [
  "DISPONIBLE",
  "ASIGNADO",
  "EN_RUTA",
  "INACTIVO",
] as const satisfies readonly DriverState[];

export const DRIVER_STATE_LABELS: Record<DriverState, string> = {
  DISPONIBLE: "Disponible",
  ASIGNADO: "Asignado",
  EN_RUTA: "En ruta",
  INACTIVO: "Inactivo",
};

export const INCIDENT_TYPES = [
  "AVERIA",
  "ACCIDENTE",
  "TRAFICO",
  "BLOQUEO_RUTA",
  "SEGURIDAD",
  "DOCUMENTACION",
  "CLIENTE_NO_DISPONIBLE",
  "DIRECCION_INCORRECTA",
  "MERCADERIA",
  "OTRO",
] as const satisfies readonly ShipmentIncidentType[];

export const INCIDENT_TYPE_LABELS: Record<ShipmentIncidentType, string> = {
  AVERIA: "Avería",
  ACCIDENTE: "Accidente",
  TRAFICO: "Tráfico",
  BLOQUEO_RUTA: "Bloqueo de ruta",
  SEGURIDAD: "Seguridad",
  DOCUMENTACION: "Documentación",
  CLIENTE_NO_DISPONIBLE: "Cliente no disponible",
  DIRECCION_INCORRECTA: "Dirección incorrecta",
  MERCADERIA: "Mercadería",
  OTRO: "Otro",
};

export const INCIDENT_SEVERITIES = [
  "BAJA",
  "MEDIA",
  "ALTA",
  "CRITICA",
] as const satisfies readonly ShipmentIncidentSeverity[];

export const INCIDENT_SEVERITY_LABELS: Record<
  ShipmentIncidentSeverity,
  string
> = {
  BAJA: "Baja",
  MEDIA: "Media",
  ALTA: "Alta",
  CRITICA: "Crítica",
};

export const INCIDENT_SEVERITY_TONES = {
  BAJA: "neutral",
  MEDIA: "warning",
  ALTA: "danger",
  CRITICA: "danger",
} as const;

export const INCIDENT_STATES = [
  "ABIERTA",
  "EN_ATENCION",
  "RESUELTA",
] as const satisfies readonly ShipmentIncidentState[];

export const INCIDENT_STATE_LABELS: Record<ShipmentIncidentState, string> = {
  ABIERTA: "Abierta",
  EN_ATENCION: "En atención",
  RESUELTA: "Resuelta",
};

export const INCIDENT_STATE_TONES = {
  ABIERTA: "danger",
  EN_ATENCION: "warning",
  RESUELTA: "success",
} as const;

export const TRANSPORT_DETAIL_TABS = [
  "resumen",
  "paradas",
  "incidencias",
  "actividad",
  "tracking",
] as const;

export type TransportDetailTab = (typeof TRANSPORT_DETAIL_TABS)[number];

export const TRANSPORT_READ_ROLES = [
  "ADMIN",
  "BODEGA",
  "CONTABILIDAD",
  "VENDEDOR",
  "REPARTIDOR",
] as const;

export const TRANSPORT_PLANNER_ROLES = ["ADMIN", "BODEGA"] as const;

export const TRANSPORT_CATALOG_READ_ROLES = [
  "ADMIN",
  "BODEGA",
  "CONTABILIDAD",
] as const;
