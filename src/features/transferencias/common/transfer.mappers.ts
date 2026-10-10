import type {
  CreateTransferPayload,
  TransferDetail,
  TransferDraft,
} from "../api/transfer.types";

export function validateTransferDraft(
  draft: TransferDraft,
  options: { requireProducts?: boolean } = {},
) {
  const errors: string[] = [];

  if (!draft.bodegaOrigenId) errors.push("Selecciona la bodega origen.");
  if (!draft.bodegaDestinoId) errors.push("Selecciona la bodega destino.");

  if (
    draft.bodegaOrigenId &&
    draft.bodegaDestinoId &&
    draft.bodegaOrigenId === draft.bodegaDestinoId
  ) {
    errors.push("La bodega origen y destino deben ser diferentes.");
  }

  if (options.requireProducts && draft.detalles.length === 0) {
    errors.push("Agrega al menos un producto.");
  }

  const seen = new Set<number>();

  draft.detalles.forEach((line, index) => {
    if (!line.productoId) {
      errors.push("Selecciona el producto de la línea " + (index + 1) + ".");
    } else if (seen.has(line.productoId)) {
      errors.push("El producto de la línea " + (index + 1) + " está repetido.");
    } else {
      seen.add(line.productoId);
    }

    const quantity = Number(line.cantidadSolicitada);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      errors.push(
        "La cantidad de la línea " +
          (index + 1) +
          " debe ser un entero mayor que cero.",
      );
    }
  });

  return errors;
}

export function toTransferPayload(
  draft: TransferDraft,
): CreateTransferPayload {
  return {
    bodegaOrigenId: draft.bodegaOrigenId!,
    bodegaDestinoId: draft.bodegaDestinoId!,
    observaciones: draft.observaciones.trim() || null,
    detalles: draft.detalles.map((line) => ({
      productoId: line.productoId!,
      cantidadSolicitada: Number(line.cantidadSolicitada),
      observaciones: line.observaciones.trim() || null,
    })),
  };
}

export function transferDetailToDraft(
  transfer: TransferDetail,
): TransferDraft {
  return {
    bodegaOrigenId: transfer.bodegaOrigen.id,
    bodegaDestinoId: transfer.bodegaDestino.id,
    observaciones: transfer.observaciones ?? "",
    detalles: transfer.detalles.map((line) => ({
      productoId: line.producto.id,
      cantidadSolicitada: String(line.cantidadSolicitada),
      observaciones: line.observaciones ?? "",
    })),
  };
}
