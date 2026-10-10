import type {
  AddPaymentProofPayload,
  ApplyPaymentPayload,
  RegisterPaymentPayload,
} from "../api/payment.types";
import type {
  ApplyPaymentFormValues,
  PaymentProofFormValues,
  RegisterPaymentFormValues,
} from "../schemas/payment.schemas";

function optionalText(value?: string | null) {
  const normalized = value?.trim() ?? "";
  return normalized || undefined;
}

export function toRegisterPaymentPayload(
  values: RegisterPaymentFormValues,
  key: string,
  concepto?: "ANTICIPO" | "CUOTA",
): RegisterPaymentPayload {
  const fechaPago = optionalText(values.fechaPago);

  return {
    clienteId: values.clienteId,
    metodo: values.metodo,
    moneda: values.moneda.trim().toUpperCase(),
    monto: Number(values.monto).toFixed(2),
    claveIdempotencia: key,
    ...(concepto ? { concepto } : {}),
    ...(values.pedidoId ? { pedidoId: values.pedidoId } : {}),
    ...(values.bancoId ? { bancoId: values.bancoId } : {}),
    ...(optionalText(values.referencia)
      ? { referencia: optionalText(values.referencia) }
      : {}),
    ...(fechaPago
      ? { fechaPago: new Date(fechaPago).toISOString() }
      : {}),
    ...(optionalText(values.observaciones)
      ? { observaciones: optionalText(values.observaciones) }
      : {}),
  };
}

export function toPaymentProofPayload(
  values: PaymentProofFormValues,
  key: string,
): AddPaymentProofPayload {
  const size =
    values.size?.trim() && Number.isInteger(Number(values.size))
      ? Number(values.size)
      : undefined;

  return {
    url: values.url.trim(),
    claveIdempotencia: key,
    ...(optionalText(values.key) ? { key: optionalText(values.key) } : {}),
    ...(optionalText(values.mimeType)
      ? { mimeType: optionalText(values.mimeType) }
      : {}),
    ...(size !== undefined ? { size } : {}),
    ...(optionalText(values.descripcion)
      ? { descripcion: optionalText(values.descripcion) }
      : {}),
  };
}

export function toApplyPaymentPayload(
  values: ApplyPaymentFormValues,
  key: string,
): ApplyPaymentPayload {
  return {
    cuentaPorCobrarId: values.cuentaPorCobrarId,
    monto: Number(values.monto).toFixed(2),
    claveIdempotencia: key,
  };
}
