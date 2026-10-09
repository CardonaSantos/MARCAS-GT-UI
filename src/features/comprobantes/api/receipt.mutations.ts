import { API } from "@/API/api";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { receiptKeys } from "./receipt.queries";
import type { ReceiptAction, ReceiptActionResponse, ReceiptKind, ReceiptRecord } from "./receipt.types";

interface IssueVariables { kind: ReceiptKind; id: number; operationId?: number }
export function useIssueReceipt() {
  return API.useMutation<ReceiptRecord, IssueVariables>({
    method: "POST",
    endpoint: ({ kind, id, operationId }) => kind === "SALIDA_DESPACHO"
      ? marcasEndpoints.comprobantes.dispatchIssue(id, operationId ?? 0)
      : marcasEndpoints.comprobantes.deliveryIssue(id),
    body: () => ({}),
    invalidateKeys: (_, variables) => [
      receiptKeys.preview(variables.kind, variables.id, variables.operationId),
      receiptKeys.all,
    ],
  });
}
interface ActionVariables {
  id: number; accion: ReceiptAction; canal?: string; claveIdempotencia: string;
}
export function useRecordReceiptAction() {
  return API.useMutation<ReceiptActionResponse, ActionVariables>({
    method: "POST",
    endpoint: ({ id }) => marcasEndpoints.comprobantes.action(id),
    body: ({ accion, canal, claveIdempotencia }) => ({ accion, canal, claveIdempotencia }),
  });
}
