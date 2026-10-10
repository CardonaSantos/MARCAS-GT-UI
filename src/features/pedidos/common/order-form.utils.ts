import type { ProductSelectable } from "@/features/common/catalogs/catalog.types";

import type { OrderFormValues } from "../schemas/order.schemas";

function money(value: string | number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function quantity(value: string) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 0;
}

export function orderDraftLineAmounts(
  line: OrderFormValues["detalles"][number],
  products: ProductSelectable[],
) {
  const product = products.find((item) => item.id === line.productoId);
  const unit = product ? money(product.precio) : 0;
  const qty = quantity(line.cantidadSolicitada);
  const gross = unit * qty;
  const discount = money(line.descuento || 0);
  const net = Math.max(gross - discount, 0);

  return {
    unit,
    quantity: qty,
    gross,
    discount,
    net,
  };
}

export function orderDraftTotals(
  lines: OrderFormValues["detalles"],
  products: ProductSelectable[],
) {
  return lines.reduce(
    (acc, line) => {
      const amounts = orderDraftLineAmounts(line, products);
      acc.subtotal += amounts.gross;
      acc.discount += amounts.discount;
      acc.total += amounts.net;
      acc.units += amounts.quantity;
      return acc;
    },
    {
      subtotal: 0,
      discount: 0,
      total: 0,
      units: 0,
    },
  );
}

export function validateOrderDraftDiscounts(
  lines: OrderFormValues["detalles"],
  products: ProductSelectable[],
) {
  return lines.flatMap((line, index) => {
    const amounts = orderDraftLineAmounts(line, products);

    if (amounts.discount > amounts.gross) {
      return [
        {
          index,
          message: "El descuento no puede superar el monto bruto de la línea.",
        },
      ];
    }

    return [];
  });
}
