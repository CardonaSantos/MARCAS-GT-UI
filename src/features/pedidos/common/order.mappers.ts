import type {
  CreateOrderPayload,
  OrderDetail,
  OrderLinePayload,
  UpdateOrderPayload,
} from "../api/order.types";
import type { OrderFormValues } from "../schemas/order.schemas";

function requireId(value: number | null, field: string) {
  if (value === null) {
    throw new Error(`Falta el campo requerido: ${field}`);
  }
  return value;
}

function normalizeOptionalText(value: string) {
  const normalized = value.trim();
  return normalized || null;
}

function toLinePayload(
  line: OrderFormValues["detalles"][number],
): OrderLinePayload {
  return {
    productoId: requireId(line.productoId, "productoId"),
    cantidadSolicitada: Number(line.cantidadSolicitada),
    ...(line.descuento.trim()
      ? { descuento: Number(line.descuento).toFixed(2) }
      : {}),
    observaciones: normalizeOptionalText(line.observaciones),
  };
}

export function toCreateOrderPayload(
  values: OrderFormValues,
): CreateOrderPayload {
  return {
    clienteId: requireId(values.clienteId, "clienteId"),
    vendedorId: requireId(values.vendedorId, "vendedorId"),
    visitaId: values.visitaId,
    condicionPago: values.condicionPago,
    observaciones: normalizeOptionalText(values.observaciones),
    detalles: values.detalles.map(toLinePayload),
  };
}

export function toUpdateOrderPayload(
  values: OrderFormValues,
): UpdateOrderPayload {
  return toCreateOrderPayload(values);
}

export function toOrderFormValues(order: OrderDetail): OrderFormValues {
  return {
    clienteId: order.cliente.id,
    vendedorId: order.vendedor.id,
    visitaId: order.visita?.id ?? null,
    condicionPago: order.condicionPago,
    observaciones: order.observaciones ?? "",
    detalles: order.detalles.map((line) => ({
      productoId: line.producto.id,
      cantidadSolicitada: String(line.cantidadSolicitada),
      descuento:
        Number(line.descuento) > 0 ? Number(line.descuento).toFixed(2) : "",
      observaciones: line.observaciones ?? "",
    })),
  };
}
