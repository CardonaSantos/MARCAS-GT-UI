import type {
  CancelDispatchPayload,
  CreateDispatchPayload,
  RegisterDispatchOutputPayload,
  StartDispatchPreparationPayload,
  UpdateDispatchPayload,
  UpdateDispatchPreparationPayload,
} from "../api/dispatch.types";
import type {
  DispatchCancelFormValues,
  DispatchOutputFormValues,
  DispatchPlanningFormValues,
  DispatchPreparationFormValues,
  DispatchStartPreparationFormValues,
} from "../schemas/dispatch.schemas";

function requiredId(value: number | null, field: string) {
  if (!value) {
    throw new Error("Falta seleccionar " + field + ".");
  }
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

function planningLines(values: DispatchPlanningFormValues) {
  return values.detalles
    .map((line) => ({
      pedidoDetalleId: line.pedidoDetalleId,
      cantidadProgramada: Number(line.cantidadProgramada),
      observaciones: nullableText(line.observaciones),
    }))
    .filter((line) => line.cantidadProgramada > 0);
}

export function toCreateDispatchPayload(
  values: DispatchPlanningFormValues,
): CreateDispatchPayload {
  return {
    pedidoId: requiredId(values.pedidoId, "el pedido"),
    bodegaId: requiredId(values.bodegaId, "la bodega"),
    programadoEn: toIsoDateTime(values.programadoEn),
    observaciones: nullableText(values.observaciones),
    detalles: planningLines(values),
  };
}

export function toUpdateDispatchPayload(
  values: DispatchPlanningFormValues,
): UpdateDispatchPayload {
  return {
    bodegaId: requiredId(values.bodegaId, "la bodega"),
    programadoEn: toIsoDateTime(values.programadoEn),
    observaciones: nullableText(values.observaciones),
    detalles: planningLines(values),
  };
}

export function toStartPreparationPayload(
  values: DispatchStartPreparationFormValues,
  key: string,
): StartDispatchPreparationPayload {
  return {
    claveIdempotencia: key,
    observaciones: nullableText(values.observaciones),
    ocurridaEn: toIsoDateTime(values.ocurridaEn),
  };
}

export function toUpdatePreparationPayload(
  values: DispatchPreparationFormValues,
): UpdateDispatchPreparationPayload {
  return {
    detalles: values.detalles.map((line) => ({
      detalleId: line.detalleId,
      cantidadPreparada: Number(line.cantidadPreparada),
      observaciones: nullableText(line.observaciones),
    })),
  };
}

export function toRegisterOutputPayload(
  values: DispatchOutputFormValues,
  key: string,
): RegisterDispatchOutputPayload {
  return {
    claveIdempotencia: key,
    observaciones: nullableText(values.observaciones),
    ocurridaEn: toIsoDateTime(values.ocurridaEn),
    detalles: values.detalles
      .map((line) => ({
        detalleId: line.detalleId,
        cantidad: Number(line.cantidad),
      }))
      .filter((line) => line.cantidad > 0),
  };
}

export function toCancelDispatchPayload(
  values: DispatchCancelFormValues,
  key: string,
): CancelDispatchPayload {
  return {
    motivo: values.motivo.trim(),
    claveIdempotencia: key,
    ocurridaEn: toIsoDateTime(values.ocurridaEn),
  };
}
