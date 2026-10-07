import { toast } from "sonner";

import { API } from "@/API/api";
import { marcasQueryKeys } from "@/API/queryKeys";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { getApiErrorMessage } from "@/lib/api-error";

import type {
  CompanyFiscalProfilePayload,
  CreateInvoicePayload,
  CustomerFiscalProfilePayload,
  DiscardInvoicePayload,
  EstablishmentFiscalPayload,
  InvoiceDetail,
  PrepareInvoicePayload,
  PrepareInvoiceResponse,
  ProductFiscalProfilePayload,
} from "./billing.types";

const billingInvalidations = [
  marcasQueryKeys.facturacion.all,
  marcasQueryKeys.entregas.all,
  marcasQueryKeys.pedidos.all,
];

function mutationError(error: unknown) {
  toast.error(getApiErrorMessage(error));
}

export function useCreateInvoice() {
  return API.useMutation<InvoiceDetail, CreateInvoicePayload>({
    method: "POST",
    endpoint: marcasEndpoints.facturacion.invoices.root,
    invalidateKeys: billingInvalidations,
    options: {
      onSuccess: () => toast.success("Factura borrador creada."),
      onError: mutationError,
    },
  });
}

export function usePrepareInvoice() {
  return API.useMutation<
    PrepareInvoiceResponse,
    { id: number; payload: PrepareInvoicePayload }
  >({
    method: "POST",
    endpoint: ({ id }) => marcasEndpoints.facturacion.invoices.prepare(id),
    body: ({ payload }) => payload,
    invalidateKeys: billingInvalidations,
    options: {
      onSuccess: () =>
        toast.success("Documento fiscal preparado. La certificación FEL sigue pendiente."),
      onError: mutationError,
    },
  });
}

export function useDiscardInvoice() {
  return API.useMutation<
    InvoiceDetail,
    { id: number; payload: DiscardInvoicePayload }
  >({
    method: "POST",
    endpoint: ({ id }) => marcasEndpoints.facturacion.invoices.discard(id),
    body: ({ payload }) => payload,
    invalidateKeys: billingInvalidations,
    options: {
      onSuccess: () => toast.success("Factura borrador descartada."),
      onError: mutationError,
    },
  });
}

export function useUpsertCompanyFiscalProfile() {
  return API.useMutation<Record<string, unknown>, CompanyFiscalProfilePayload>({
    method: "PUT",
    endpoint: marcasEndpoints.facturacion.fiscalConfig.company,
    invalidateKeys: [marcasQueryKeys.facturacion.all],
    options: {
      onSuccess: () => toast.success("Perfil fiscal de empresa actualizado."),
      onError: mutationError,
    },
  });
}

export function useCreateFiscalEstablishment() {
  return API.useMutation<Record<string, unknown>, EstablishmentFiscalPayload>({
    method: "POST",
    endpoint: marcasEndpoints.facturacion.fiscalConfig.establishments,
    invalidateKeys: [marcasQueryKeys.facturacion.all],
    options: {
      onSuccess: () => toast.success("Establecimiento fiscal creado."),
      onError: mutationError,
    },
  });
}

export function useUpsertCustomerFiscalProfile() {
  return API.useMutation<
    Record<string, unknown>,
    { customerId: number; payload: CustomerFiscalProfilePayload }
  >({
    method: "PUT",
    endpoint: ({ customerId }) =>
      marcasEndpoints.facturacion.fiscalConfig.customer(customerId),
    body: ({ payload }) => payload,
    invalidateKeys: [marcasQueryKeys.facturacion.all],
    options: {
      onSuccess: () => toast.success("Perfil fiscal del cliente actualizado."),
      onError: mutationError,
    },
  });
}

export function useUpsertProductFiscalProfile() {
  return API.useMutation<
    Record<string, unknown>,
    { productId: number; payload: ProductFiscalProfilePayload }
  >({
    method: "PUT",
    endpoint: ({ productId }) =>
      marcasEndpoints.facturacion.fiscalConfig.product(productId),
    body: ({ payload }) => payload,
    invalidateKeys: [marcasQueryKeys.facturacion.all],
    options: {
      onSuccess: () => toast.success("Perfil fiscal del producto actualizado."),
      onError: mutationError,
    },
  });
}
