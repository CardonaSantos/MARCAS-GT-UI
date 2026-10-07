import { toast } from "sonner";

import { API } from "@/API/api";
import { marcasQueryKeys } from "@/API/queryKeys";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { getApiErrorMessage } from "@/lib/api-error";

import type {
  AddPaymentProofPayload,
  ApplyPaymentPayload,
  CreatePaymentBankPayload,
  PaymentActionPayload,
  PaymentBankAdmin,
  PaymentDetail,
  PaymentReasonActionPayload,
  RegisterPaymentPayload,
  UpdatePaymentBankPayload,
} from "./payment.types";

const paymentInvalidations = [
  marcasQueryKeys.pagos.all,
  marcasQueryKeys.pedidos.all,
  marcasQueryKeys.creditos.all,
  marcasQueryKeys.facturacion.all,
];

function mutationError(error: unknown) {
  toast.error(getApiErrorMessage(error));
}

export function useRegisterPayment() {
  return API.useMutation<PaymentDetail, RegisterPaymentPayload>({
    method: "POST",
    endpoint: marcasEndpoints.pagos.root,
    invalidateKeys: paymentInvalidations,
    options: {
      onSuccess: () => toast.success("Pago registrado."),
      onError: mutationError,
    },
  });
}

export function useAddPaymentProof() {
  return API.useMutation<
    PaymentDetail,
    { id: number; payload: AddPaymentProofPayload }
  >({
    method: "POST",
    endpoint: ({ id }) => marcasEndpoints.pagos.proofs(id),
    body: ({ payload }) => payload,
    invalidateKeys: paymentInvalidations,
    options: {
      onSuccess: () => toast.success("Comprobante registrado."),
      onError: mutationError,
    },
  });
}

export function useVerifyPayment() {
  return API.useMutation<
    PaymentDetail,
    { id: number; payload: PaymentActionPayload }
  >({
    method: "POST",
    endpoint: ({ id }) => marcasEndpoints.pagos.verify(id),
    body: ({ payload }) => payload,
    invalidateKeys: paymentInvalidations,
    options: {
      onSuccess: () => toast.success("Pago verificado."),
      onError: mutationError,
    },
  });
}

export function useRejectPayment() {
  return API.useMutation<
    PaymentDetail,
    { id: number; payload: PaymentReasonActionPayload }
  >({
    method: "POST",
    endpoint: ({ id }) => marcasEndpoints.pagos.reject(id),
    body: ({ payload }) => payload,
    invalidateKeys: paymentInvalidations,
    options: {
      onSuccess: () => toast.success("Pago rechazado."),
      onError: mutationError,
    },
  });
}

export function useApplyPayment() {
  return API.useMutation<
    PaymentDetail,
    { id: number; payload: ApplyPaymentPayload }
  >({
    method: "POST",
    endpoint: ({ id }) => marcasEndpoints.pagos.applications(id),
    body: ({ payload }) => payload,
    invalidateKeys: paymentInvalidations,
    options: {
      onSuccess: () => toast.success("Pago aplicado a la cuenta por cobrar."),
      onError: mutationError,
    },
  });
}

export function useReversePaymentApplication() {
  return API.useMutation<
    PaymentDetail,
    {
      paymentId: number;
      applicationId: number;
      payload: PaymentReasonActionPayload;
    }
  >({
    method: "POST",
    endpoint: ({ paymentId, applicationId }) =>
      marcasEndpoints.pagos.revertApplication(paymentId, applicationId),
    body: ({ payload }) => payload,
    invalidateKeys: paymentInvalidations,
    options: {
      onSuccess: () => toast.success("Aplicación revertida."),
      onError: mutationError,
    },
  });
}

export function useVoidPayment() {
  return API.useMutation<
    PaymentDetail,
    { id: number; payload: PaymentReasonActionPayload }
  >({
    method: "POST",
    endpoint: ({ id }) => marcasEndpoints.pagos.cancel(id),
    body: ({ payload }) => payload,
    invalidateKeys: paymentInvalidations,
    options: {
      onSuccess: () => toast.success("Pago anulado."),
      onError: mutationError,
    },
  });
}


export function useCreatePaymentBank() {
  return API.useMutation<PaymentBankAdmin, CreatePaymentBankPayload>({
    method: "POST",
    endpoint: marcasEndpoints.pagos.banks,
    invalidateKeys: [marcasQueryKeys.pagos.all],
    options: {
      onSuccess: () => toast.success("Banco registrado."),
      onError: mutationError,
    },
  });
}

export function useUpdatePaymentBank() {
  return API.useMutation<
    PaymentBankAdmin,
    { id: number; payload: UpdatePaymentBankPayload }
  >({
    method: "PATCH",
    endpoint: ({ id }) => marcasEndpoints.pagos.bank(id),
    body: ({ payload }) => payload,
    invalidateKeys: [marcasQueryKeys.pagos.all],
    options: {
      onSuccess: () => toast.success("Banco actualizado."),
      onError: mutationError,
    },
  });
}
