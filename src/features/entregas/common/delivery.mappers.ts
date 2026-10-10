import type {
  FinalizeDeliveryPayload,
  StartDeliveryPayload,
  UpdateDeliveryResultPayload,
} from "../api/delivery.types";
import type {
  DeliveryResultFormValues,
  FinalizeDeliveryFormValues,
  StartDeliveryFormValues,
} from "../schemas/delivery.schemas";

function optionalNumber(value?: string | null) {
  const normalized = value?.trim() ?? "";
  if (!normalized) return undefined;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function optionalText(value?: string | null) {
  const normalized = value?.trim() ?? "";
  return normalized || undefined;
}

export function toStartDeliveryPayload(
  values: StartDeliveryFormValues,
  key: string,
): StartDeliveryPayload {
  const latitud = optionalNumber(values.latitud);
  const longitud = optionalNumber(values.longitud);
  return {
    claveIdempotencia: key,
    ...(latitud !== undefined ? { latitud } : {}),
    ...(longitud !== undefined ? { longitud } : {}),
  };
}

export function toUpdateDeliveryResultPayload(
  values: DeliveryResultFormValues,
): UpdateDeliveryResultPayload {
  const latitud = optionalNumber(values.latitud);
  const longitud = optionalNumber(values.longitud);

  return {
    ...(optionalText(values.receptorNombre)
      ? { receptorNombre: optionalText(values.receptorNombre) }
      : {}),
    ...(optionalText(values.receptorDocumento)
      ? { receptorDocumento: optionalText(values.receptorDocumento) }
      : {}),
    ...(latitud !== undefined ? { latitud } : {}),
    ...(longitud !== undefined ? { longitud } : {}),
    ...(optionalText(values.observaciones)
      ? { observaciones: optionalText(values.observaciones) }
      : {}),
    detalles: values.detalles.map((line) => ({
      detalleId: line.detalleId,
      cantidadEntregada: Number(line.cantidadEntregada),
      cantidadRechazada: Number(line.cantidadRechazada),
      ...(optionalText(line.motivoRechazo)
        ? { motivoRechazo: optionalText(line.motivoRechazo) }
        : {}),
    })),
  };
}

export function toFinalizeDeliveryPayload(
  values: FinalizeDeliveryFormValues,
  key: string,
): FinalizeDeliveryPayload {
  const latitud = optionalNumber(values.latitud);
  const longitud = optionalNumber(values.longitud);

  return {
    resultado: values.resultado,
    ...(optionalText(values.receptorNombre)
      ? { receptorNombre: optionalText(values.receptorNombre) }
      : {}),
    ...(optionalText(values.receptorDocumento)
      ? { receptorDocumento: optionalText(values.receptorDocumento) }
      : {}),
    ...(latitud !== undefined ? { latitud } : {}),
    ...(longitud !== undefined ? { longitud } : {}),
    ...(values.motivoNoEntrega
      ? { motivoNoEntrega: values.motivoNoEntrega }
      : {}),
    ...(optionalText(values.detalleNoEntrega)
      ? { detalleNoEntrega: optionalText(values.detalleNoEntrega) }
      : {}),
    ...(optionalText(values.observaciones)
      ? { observaciones: optionalText(values.observaciones) }
      : {}),
    claveIdempotencia: key,
  };
}
