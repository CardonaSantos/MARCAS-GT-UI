import { API } from "@/API/api";
import { marcasEndpoints } from "@/API/routes/endpoints";
import type { ReceiptKind, ReceiptPreview, ReceiptRecord } from "./receipt.types";

export const receiptKeys = {
  all: ["comprobantes"] as const,
  preview: (kind: ReceiptKind, id: number, operationId?: number) =>
    ["comprobantes", "preview", kind, id, operationId ?? null] as const,
  detail: (id: number) => ["comprobantes", "detail", id] as const,
};

export function useReceiptPreview(kind: ReceiptKind, id: number, operationId?: number) {
  return API.useQuery<ReceiptPreview>({
    queryKey: receiptKeys.preview(kind, id, operationId),
    endpoint: kind === "SALIDA_DESPACHO"
      ? marcasEndpoints.comprobantes.dispatchPreview(id, operationId ?? 0)
      : marcasEndpoints.comprobantes.deliveryPreview(id),
    options: {
      enabled: Number.isSafeInteger(id) && id > 0 &&
        (kind === "ENTREGA" || (Number.isSafeInteger(operationId) && (operationId ?? 0) > 0)),
      staleTime: 20_000,
      retry: (failureCount, error) => error.status >= 500 && failureCount < 1,
    },
  });
}

export function useIssuedReceipt(id: number) {
  return API.useQuery<ReceiptRecord>({
    queryKey: receiptKeys.detail(id),
    endpoint: marcasEndpoints.comprobantes.detail(id),
    options: { enabled: Number.isSafeInteger(id) && id > 0 },
  });
}
