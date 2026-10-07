import type {
  CreateRequisitionPayload,
  RequisitionDetail,
  RequisitionDraft,
} from "../api/requisition.types";

export function validateRequisitionDraft(
  draft: RequisitionDraft,
  options: { requireProducts?: boolean; requireProvider?: boolean } = {},
) {
  const errors: string[] = [];

  if (!draft.bodegaDestinoId) {
    errors.push("Selecciona una bodega destino.");
  }

  if (options.requireProvider && !draft.proveedorId) {
    errors.push("Selecciona un proveedor.");
  }

  if (options.requireProducts && draft.detalles.length === 0) {
    errors.push("Agrega al menos un producto.");
  }

  const productIds = new Set<number>();
  draft.detalles.forEach((line, index) => {
    if (!line.productoId) {
      errors.push("Selecciona el producto de la línea " + (index + 1) + ".");
    } else if (productIds.has(line.productoId)) {
      errors.push("El producto de la línea " + (index + 1) + " está repetido.");
    } else {
      productIds.add(line.productoId);
    }

    const quantity = Number(line.cantidadSolicitada);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      errors.push(
        "La cantidad de la línea " + (index + 1) + " debe ser un entero mayor que cero.",
      );
    }

    if (line.costoUnitarioEstimado.trim()) {
      const cost = Number(line.costoUnitarioEstimado);
      if (!Number.isFinite(cost) || cost < 0) {
        errors.push("El costo de la línea " + (index + 1) + " no es válido.");
      }
    }
  });

  return errors;
}

export function toRequisitionPayload(
  draft: RequisitionDraft,
): CreateRequisitionPayload {
  return {
    bodegaDestinoId: draft.bodegaDestinoId!,
    proveedorId: draft.proveedorId ?? null,
    observaciones: draft.observaciones.trim() || null,
    detalles: draft.detalles.map((line) => ({
      productoId: line.productoId!,
      cantidadSolicitada: Number(line.cantidadSolicitada),
      ...(line.costoUnitarioEstimado.trim()
        ? {
            costoUnitarioEstimado: Number(
              line.costoUnitarioEstimado,
            ).toFixed(4),
          }
        : {}),
    })),
  };
}

export function requisitionDetailToDraft(
  requisition: RequisitionDetail,
): RequisitionDraft {
  return {
    bodegaDestinoId: requisition.bodega.id,
    proveedorId: requisition.proveedor?.id ?? null,
    observaciones: requisition.observaciones ?? "",
    detalles: requisition.detalles.map((line) => ({
      productoId: line.producto.id,
      cantidadSolicitada: String(line.cantidadSolicitada),
      costoUnitarioEstimado: line.costoUnitarioEstimado ?? "",
    })),
  };
}
