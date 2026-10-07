import { toast } from "sonner";

import { API } from "@/API/api";
import { marcasQueryKeys } from "@/API/queryKeys";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { getApiErrorMessage } from "@/lib/api-error";

import type {
  AddCreditDocumentPayload,
  AddCreditReferencePayload,
  ActivateCreditPaymentPlanPayload,
  ApproveCreditPayload,
  CreateCreditApplicationPayload,
  CreateCreditPaymentPlanPayload,
  CreateCreditPolicyPayload,
  CreditDetail,
  CreditPaymentPlanResponse,
  CreditPolicy,
  CreditPolicyStatusPayload,
  CreditReasonPayload,
  ReviewCreditDocumentPayload,
  ReviewCreditReferencePayload,
  ReviewCreditRequirementPayload,
  UpdateCreditApplicationPayload,
  UpdateCreditPaymentPlanPayload,
  UpdateCreditPolicyPayload,
  UpdateCreditReferencePayload,
} from "./credit.types";

function mutationError(error: unknown) {
  toast.error(getApiErrorMessage(error));
}

const creditInvalidations = [
  marcasQueryKeys.creditos.all,
  marcasQueryKeys.pedidos.all,
];

export function useCreateCreditApplication() {
  return API.useMutation<CreditDetail, CreateCreditApplicationPayload>({
    method: "POST",
    endpoint: marcasEndpoints.creditos.applications.root,
    invalidateKeys: creditInvalidations,
    options: {
      onSuccess: () => toast.success("Solicitud de crédito creada."),
      onError: mutationError,
    },
  });
}

export function useUpdateCreditApplication() {
  return API.useMutation<
    CreditDetail,
    { id: number; payload: UpdateCreditApplicationPayload }
  >({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.creditos.applications.detail(id),
    body: ({ payload }) => payload,
    invalidateKeys: creditInvalidations,
    options: {
      onSuccess: () => toast.success("Solicitud actualizada."),
      onError: mutationError,
    },
  });
}

export function useSubmitCreditApplication() {
  return API.useMutation<CreditDetail, { id: number }>({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.creditos.applications.submit(id),
    body: () => undefined,
    invalidateKeys: creditInvalidations,
    options: {
      onSuccess: () => toast.success("Expediente enviado a revisión."),
      onError: mutationError,
    },
  });
}

export function useCancelCreditApplication() {
  return API.useMutation<
    { operation: unknown; solicitud: CreditDetail },
    { id: number; payload: CreditReasonPayload }
  >({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.creditos.applications.cancel(id),
    body: ({ payload }) => payload,
    invalidateKeys: creditInvalidations,
    options: {
      onSuccess: () => toast.success("Solicitud cancelada."),
      onError: mutationError,
    },
  });
}

export function useAddCreditReference() {
  return API.useMutation<
    { result: unknown; solicitud: CreditDetail },
    { id: number; payload: AddCreditReferencePayload }
  >({
    method: "POST",
    endpoint: ({ id }) => marcasEndpoints.creditos.applications.references(id),
    body: ({ payload }) => payload,
    invalidateKeys: creditInvalidations,
    options: {
      onSuccess: () => toast.success("Referencia agregada."),
      onError: mutationError,
    },
  });
}

export function useUpdateCreditReference() {
  return API.useMutation<
    CreditDetail,
    { id: number; referenceId: number; payload: UpdateCreditReferencePayload }
  >({
    method: "PATCH",
    endpoint: ({ id, referenceId }) =>
      marcasEndpoints.creditos.applications.reference(id, referenceId),
    body: ({ payload }) => payload,
    invalidateKeys: creditInvalidations,
    options: {
      onSuccess: () => toast.success("Referencia actualizada."),
      onError: mutationError,
    },
  });
}

export function useReviewCreditReference() {
  return API.useMutation<
    CreditDetail,
    {
      id: number;
      referenceId: number;
      payload: ReviewCreditReferencePayload;
    }
  >({
    method: "PATCH",
    endpoint: ({ id, referenceId }) =>
      marcasEndpoints.creditos.applications.reviewReference(id, referenceId),
    body: ({ payload }) => payload,
    invalidateKeys: creditInvalidations,
    options: {
      onSuccess: () => toast.success("Referencia revisada."),
      onError: mutationError,
    },
  });
}

export function useAddCreditDocument() {
  return API.useMutation<
    { result: unknown; solicitud: CreditDetail },
    { id: number; payload: AddCreditDocumentPayload }
  >({
    method: "POST",
    endpoint: ({ id }) => marcasEndpoints.creditos.applications.documents(id),
    body: ({ payload }) => payload,
    invalidateKeys: creditInvalidations,
    options: {
      onSuccess: () => toast.success("Documento registrado."),
      onError: mutationError,
    },
  });
}

export function useReviewCreditDocument() {
  return API.useMutation<
    CreditDetail,
    {
      id: number;
      documentId: number;
      payload: ReviewCreditDocumentPayload;
    }
  >({
    method: "PATCH",
    endpoint: ({ id, documentId }) =>
      marcasEndpoints.creditos.applications.reviewDocument(id, documentId),
    body: ({ payload }) => payload,
    invalidateKeys: creditInvalidations,
    options: {
      onSuccess: () => toast.success("Documento revisado."),
      onError: mutationError,
    },
  });
}

export function useReviewCreditRequirement() {
  return API.useMutation<
    CreditDetail,
    {
      id: number;
      requirementId: number;
      payload: ReviewCreditRequirementPayload;
    }
  >({
    method: "PATCH",
    endpoint: ({ id, requirementId }) =>
      marcasEndpoints.creditos.applications.reviewRequirement(
        id,
        requirementId,
      ),
    body: ({ payload }) => payload,
    invalidateKeys: creditInvalidations,
    options: {
      onSuccess: () => toast.success("Requisito revisado."),
      onError: mutationError,
    },
  });
}

export function useApproveCreditApplication() {
  return API.useMutation<
    { operation: unknown; solicitud: CreditDetail },
    { id: number; payload: ApproveCreditPayload }
  >({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.creditos.applications.approve(id),
    body: ({ payload }) => payload,
    invalidateKeys: creditInvalidations,
    options: {
      onSuccess: () => toast.success("Crédito aprobado."),
      onError: mutationError,
    },
  });
}

export function useRejectCreditApplication() {
  return API.useMutation<
    { operation: unknown; solicitud: CreditDetail },
    { id: number; payload: CreditReasonPayload }
  >({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.creditos.applications.reject(id),
    body: ({ payload }) => payload,
    invalidateKeys: creditInvalidations,
    options: {
      onSuccess: () => toast.success("Solicitud rechazada."),
      onError: mutationError,
    },
  });
}

export function useRetryCreditIntegration() {
  return API.useMutation<
    { operation: unknown; solicitud: CreditDetail },
    { id: number }
  >({
    method: "POST",
    endpoint: ({ id }) =>
      marcasEndpoints.creditos.applications.retryIntegration(id),
    body: () => undefined,
    invalidateKeys: creditInvalidations,
    options: {
      onSuccess: () => toast.success("Integración reintentada."),
      onError: mutationError,
    },
  });
}

export function useCreateCreditPolicy() {
  return API.useMutation<CreditPolicy, CreateCreditPolicyPayload>({
    method: "POST",
    endpoint: marcasEndpoints.creditos.policies.root,
    invalidateKeys: [marcasQueryKeys.creditos.all],
    options: {
      onSuccess: () => toast.success("Política de crédito creada."),
      onError: mutationError,
    },
  });
}

export function useUpdateCreditPolicy() {
  return API.useMutation<
    CreditPolicy,
    { id: number; payload: UpdateCreditPolicyPayload }
  >({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.creditos.policies.detail(id),
    body: ({ payload }) => payload,
    invalidateKeys: [marcasQueryKeys.creditos.all],
    options: {
      onSuccess: () => toast.success("Política actualizada."),
      onError: mutationError,
    },
  });
}

export function useSetCreditPolicyStatus() {
  return API.useMutation<
    CreditPolicy,
    { id: number; payload: CreditPolicyStatusPayload }
  >({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.creditos.policies.status(id),
    body: ({ payload }) => payload,
    invalidateKeys: [marcasQueryKeys.creditos.all],
    options: {
      onSuccess: (_, variables) =>
        toast.success(
          variables.payload.activo
            ? "Política activada."
            : "Política desactivada.",
        ),
      onError: mutationError,
    },
  });
}


const creditPlanInvalidations = [
  marcasQueryKeys.creditos.all,
  marcasQueryKeys.pagos.all,
  marcasQueryKeys.facturacion.all,
];

export function useCreateCreditPaymentPlan() {
  return API.useMutation<
    CreditPaymentPlanResponse,
    { id: number; payload: CreateCreditPaymentPlanPayload }
  >({
    method: "POST",
    endpoint: ({ id }) => marcasEndpoints.creditos.paymentPlan(id),
    body: ({ payload }) => payload,
    invalidateKeys: creditPlanInvalidations,
    options: {
      onSuccess: () => toast.success("Plan de pagos guardado en borrador."),
      onError: mutationError,
    },
  });
}

export function useUpdateCreditPaymentPlan() {
  return API.useMutation<
    CreditPaymentPlanResponse,
    { id: number; payload: UpdateCreditPaymentPlanPayload }
  >({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.creditos.paymentPlan(id),
    body: ({ payload }) => payload,
    invalidateKeys: creditPlanInvalidations,
    options: {
      onSuccess: () => toast.success("Plan de pagos actualizado."),
      onError: mutationError,
    },
  });
}

export function useActivateCreditPaymentPlan() {
  return API.useMutation<
    CreditPaymentPlanResponse,
    { id: number; payload: ActivateCreditPaymentPlanPayload }
  >({
    method: "POST",
    endpoint: ({ id }) => marcasEndpoints.creditos.activatePaymentPlan(id),
    body: ({ payload }) => payload,
    invalidateKeys: creditPlanInvalidations,
    options: {
      onSuccess: () =>
        toast.success("Plan activado y cuentas por cobrar generadas."),
      onError: mutationError,
    },
  });
}
