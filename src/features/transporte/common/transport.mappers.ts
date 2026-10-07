import type {
  AssignShipmentPayload,
  CancelShipmentPayload,
  ConfirmShipmentLoadPayload,
  CreateCarrierPayload,
  CreateDriverPayload,
  CreateShipmentPayload,
  CreateVehiclePayload,
  ReportShipmentIncidentPayload,
  ResolveShipmentIncidentPayload,
  ShipmentPlanningStop,
  StartShipmentRoutePayload,
} from "../api/transport.types";
import type {
  CarrierFormValues,
  DriverFormValues,
  ResolveShipmentIncidentFormValues,
  ShipmentCancelFormValues,
  ShipmentExternalAssignmentFormValues,
  ShipmentIncidentFormValues,
  ShipmentInternalAssignmentFormValues,
  ShipmentLoadFormValues,
  ShipmentPlanningFormValues,
  ShipmentRouteFormValues,
  VehicleFormValues,
} from "../schemas/transport.schemas";

function requiredId(value: number | null, field: string) {
  if (!value) throw new Error("Falta seleccionar " + field + ".");
  return value;
}

function nullableText(value?: string | null) {
  const normalized = value?.trim() ?? "";
  return normalized || null;
}

function toIsoDateTime(value?: string | null) {
  const normalized = value?.trim() ?? "";
  if (!normalized) return null;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function optionalNumber(value?: string | null) {
  const normalized = value?.trim() ?? "";
  if (!normalized) return undefined;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function toCreateShipmentPayload(
  values: ShipmentPlanningFormValues,
  paradas: ShipmentPlanningStop[],
): CreateShipmentPayload {
  const costo = optionalNumber(values.costo);
  return {
    bodegaId: requiredId(values.bodegaId, "la bodega"),
    modalidad: values.modalidad,
    salidaProgramadaEn: toIsoDateTime(values.salidaProgramadaEn),
    entregaEstimadaEn: toIsoDateTime(values.entregaEstimadaEn),
    guia: nullableText(values.guia),
    ...(costo !== undefined ? { costo } : {}),
    trackingUrl: nullableText(values.trackingUrl),
    comprobanteUrl: nullableText(values.comprobanteUrl),
    observaciones: nullableText(values.observaciones),
    paradas,
  };
}

export function toInternalAssignmentPayload(
  values: ShipmentInternalAssignmentFormValues,
  key: string,
): AssignShipmentPayload {
  return {
    vehiculoId: requiredId(values.vehiculoId, "el vehículo"),
    conductorId: requiredId(values.conductorId, "el conductor"),
    responsableId: requiredId(values.responsableId, "el responsable"),
    claveIdempotencia: key,
  };
}

export function toExternalAssignmentPayload(
  values: ShipmentExternalAssignmentFormValues,
  key: string,
): AssignShipmentPayload {
  return {
    transportistaId: requiredId(values.transportistaId, "el transportista"),
    claveIdempotencia: key,
  };
}

export function toConfirmLoadPayload(
  values: ShipmentLoadFormValues,
  key: string,
): ConfirmShipmentLoadPayload {
  return {
    claveIdempotencia: key,
    lineas: values.lineas.map((line) => ({
      cargaDetalleId: line.cargaDetalleId,
      cantidadCargada: Number(line.cantidadCargada),
    })),
  };
}

export function toStartRoutePayload(
  values: ShipmentRouteFormValues,
  key: string,
): StartShipmentRoutePayload {
  return {
    claveIdempotencia: key,
    ...(optionalNumber(values.latitud) !== undefined
      ? { latitud: optionalNumber(values.latitud) }
      : {}),
    ...(optionalNumber(values.longitud) !== undefined
      ? { longitud: optionalNumber(values.longitud) }
      : {}),
  };
}

export function toCancelShipmentPayload(
  values: ShipmentCancelFormValues,
  key: string,
): CancelShipmentPayload {
  return {
    motivo: values.motivo.trim(),
    claveIdempotencia: key,
  };
}

export function toIncidentPayload(
  values: ShipmentIncidentFormValues,
  key: string,
): ReportShipmentIncidentPayload {
  const latitud = optionalNumber(values.latitud);
  const longitud = optionalNumber(values.longitud);
  return {
    tipo: values.tipo,
    severidad: values.severidad,
    descripcion: values.descripcion.trim(),
    ...(latitud !== undefined ? { latitud } : {}),
    ...(longitud !== undefined ? { longitud } : {}),
    claveIdempotencia: key,
  };
}

export function toResolveIncidentPayload(
  values: ResolveShipmentIncidentFormValues,
  key: string,
): ResolveShipmentIncidentPayload {
  return {
    resolucion: values.resolucion.trim(),
    claveIdempotencia: key,
  };
}

export function toCreateCarrierPayload(
  values: CarrierFormValues,
): CreateCarrierPayload {
  return {
    codigo: nullableText(values.codigo),
    tipo: values.tipo,
    nombre: values.nombre.trim(),
    telefono: nullableText(values.telefono),
    correo: nullableText(values.correo),
  };
}

export function toCreateVehiclePayload(
  values: VehicleFormValues,
): CreateVehiclePayload {
  const capacidadKg = optionalNumber(values.capacidadKg);
  return {
    ...(values.transportistaId
      ? { transportistaId: values.transportistaId }
      : {}),
    placa: values.placa.trim(),
    marca: nullableText(values.marca),
    modelo: nullableText(values.modelo),
    ...(capacidadKg !== undefined ? { capacidadKg } : {}),
  };
}

export function toCreateDriverPayload(
  values: DriverFormValues,
): CreateDriverPayload {
  return {
    ...(values.transportistaId
      ? { transportistaId: values.transportistaId }
      : {}),
    nombre: values.nombre.trim(),
    telefono: nullableText(values.telefono),
    licencia: nullableText(values.licencia),
  };
}
