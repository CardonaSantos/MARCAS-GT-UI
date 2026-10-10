import type {
  AdjustInventoryPayload,
  CancelReservationPayload,
  RegisterInventoryEntryPayload,
  RegisterInventoryReturnPayload,
  ReservationMutationPayload,
  ReserveInventoryPayload,
} from "../api/inventory.types";
import type {
  AdjustInventoryFormValues,
  CancelReservationFormValues,
  RegisterInventoryEntryFormValues,
  RegisterInventoryReturnFormValues,
  ReservationMutationFormValues,
  ReserveInventoryFormValues,
} from "../schemas/inventory.schemas";

function requiredId(value: number | null, field: string) {
  if (value === null) {
    throw new Error(`Falta el campo requerido: ${field}`);
  }

  return value;
}

function nullableText(value: string) {
  const normalized = value.trim();
  return normalized ? normalized : null;
}

function referencePayload(values: {
  referenciaTipo: string;
  referenciaId: string;
}) {
  const referenciaTipo = values.referenciaTipo.trim();
  const referenciaId = values.referenciaId.trim();

  if (!referenciaTipo || !referenciaId) {
    return {};
  }

  return {
    referenciaTipo,
    referenciaId: Number(referenciaId),
  };
}

export function toRegisterEntryPayload(
  values: RegisterInventoryEntryFormValues,
  claveIdempotencia: string,
): RegisterInventoryEntryPayload {
  return {
    bodegaId: requiredId(values.bodegaId, "bodegaId"),
    productoId: requiredId(values.productoId, "productoId"),
    cantidad: Number(values.cantidad),
    costoUnitario: values.costoUnitario.trim(),
    proveedorId: values.proveedorId,
    observaciones: nullableText(values.observaciones),
    ...referencePayload(values),
    claveIdempotencia,
  };
}

export function toAdjustInventoryPayload(
  values: AdjustInventoryFormValues,
  claveIdempotencia: string,
): AdjustInventoryPayload {
  return {
    bodegaId: requiredId(values.bodegaId, "bodegaId"),
    productoId: requiredId(values.productoId, "productoId"),
    tipo: values.tipo,
    cantidad: Number(values.cantidad),
    costoUnitario: nullableText(values.costoUnitario),
    motivo: values.motivo.trim(),
    claveIdempotencia,
  };
}

export function toRegisterReturnPayload(
  values: RegisterInventoryReturnFormValues,
  claveIdempotencia: string,
): RegisterInventoryReturnPayload {
  return {
    bodegaId: requiredId(values.bodegaId, "bodegaId"),
    productoId: requiredId(values.productoId, "productoId"),
    cantidad: Number(values.cantidad),
    costoUnitario: nullableText(values.costoUnitario),
    observaciones: nullableText(values.observaciones),
    ...referencePayload(values),
    claveIdempotencia,
  };
}

export function toReserveInventoryPayload(
  values: ReserveInventoryFormValues,
  claveIdempotencia: string,
): ReserveInventoryPayload {
  return {
    pedidoDetalleId: requiredId(values.pedidoDetalleId, "pedidoDetalleId"),
    bodegaId: requiredId(values.bodegaId, "bodegaId"),
    cantidad: Number(values.cantidad),
    claveIdempotencia,
  };
}

export function toReservationMutationPayload(
  values: ReservationMutationFormValues,
  claveIdempotencia: string,
): ReservationMutationPayload {
  return {
    cantidad: Number(values.cantidad),
    observaciones: nullableText(values.observaciones),
    ...referencePayload(values),
    claveIdempotencia,
  };
}

export function toCancelReservationPayload(
  values: CancelReservationFormValues,
  claveIdempotencia: string,
): CancelReservationPayload {
  return {
    motivo: values.motivo.trim(),
    ...referencePayload(values),
    claveIdempotencia,
  };
}
