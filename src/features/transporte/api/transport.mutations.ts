import { toast } from "sonner";

import { API } from "@/API/api";
import { marcasQueryKeys } from "@/API/queryKeys";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { getApiErrorMessage } from "@/lib/api-error";

import type {
  AssignShipmentPayload,
  CancelShipmentPayload,
  ConfirmShipmentLoadPayload,
  CreateCarrierPayload,
  CreateDriverPayload,
  CreateShipmentPayload,
  CreateVehiclePayload,
  DeactivateTransportResourcePayload,
  ReportShipmentIncidentPayload,
  ResolveShipmentIncidentPayload,
  ShipmentObservationPayload,
  StartShipmentRoutePayload,
} from "./transport.types";

const transportInvalidations = [
  marcasQueryKeys.transporte.all,
  marcasQueryKeys.despachos.all,
  marcasQueryKeys.bodegas.all,
];

function mutationError(error: unknown) {
  toast.error(getApiErrorMessage(error));
}

export function useCreateShipment() {
  return API.useMutation<
    { id: number; numero: string },
    CreateShipmentPayload
  >({
    method: "POST",
    endpoint: marcasEndpoints.transporte.shipments.root,
    invalidateKeys: transportInvalidations,
    options: {
      onSuccess: () => toast.success("Envío logístico creado."),
      onError: mutationError,
    },
  });
}

export function useAssignShipment() {
  return API.useMutation<void, { id: number; payload: AssignShipmentPayload }>({
    method: "POST",
    endpoint: ({ id }) => marcasEndpoints.transporte.shipments.assign(id),
    body: ({ payload }) => payload,
    invalidateKeys: transportInvalidations,
    options: {
      onSuccess: () => toast.success("Recursos asignados al envío."),
      onError: mutationError,
    },
  });
}

export function useConfirmShipmentLoad() {
  return API.useMutation<
    void,
    { id: number; payload: ConfirmShipmentLoadPayload }
  >({
    method: "POST",
    endpoint: ({ id }) => marcasEndpoints.transporte.shipments.confirmLoad(id),
    body: ({ payload }) => payload,
    invalidateKeys: transportInvalidations,
    options: {
      onSuccess: () => toast.success("Carga del envío confirmada."),
      onError: mutationError,
    },
  });
}

export function useStartShipmentRoute() {
  return API.useMutation<
    void,
    { id: number; payload: StartShipmentRoutePayload }
  >({
    method: "POST",
    endpoint: ({ id }) => marcasEndpoints.transporte.shipments.startRoute(id),
    body: ({ payload }) => payload,
    invalidateKeys: [
      ...transportInvalidations,
      marcasQueryKeys.tracking.all,
    ],
    options: {
      onSuccess: () => toast.success("Ruta iniciada."),
      onError: mutationError,
    },
  });
}

export function useCancelShipment() {
  return API.useMutation<
    void,
    { id: number; payload: CancelShipmentPayload }
  >({
    method: "POST",
    endpoint: ({ id }) => marcasEndpoints.transporte.shipments.cancel(id),
    body: ({ payload }) => payload,
    invalidateKeys: transportInvalidations,
    options: {
      onSuccess: () => toast.success("Envío cancelado."),
      onError: mutationError,
    },
  });
}

export function useAddShipmentObservation() {
  return API.useMutation<
    void,
    { id: number; payload: ShipmentObservationPayload }
  >({
    method: "POST",
    endpoint: ({ id }) => marcasEndpoints.transporte.shipments.observations(id),
    body: ({ payload }) => payload,
    invalidateKeys: [marcasQueryKeys.transporte.all],
    options: {
      onSuccess: () => toast.success("Observación registrada."),
      onError: mutationError,
    },
  });
}

export function useReportShipmentIncident() {
  return API.useMutation<
    { id: number },
    { id: number; payload: ReportShipmentIncidentPayload }
  >({
    method: "POST",
    endpoint: ({ id }) => marcasEndpoints.transporte.shipments.incidents(id),
    body: ({ payload }) => payload,
    invalidateKeys: [marcasQueryKeys.transporte.all],
    options: {
      onSuccess: () => toast.success("Incidencia reportada."),
      onError: mutationError,
    },
  });
}

export function useResolveShipmentIncident() {
  return API.useMutation<
    void,
    {
      id: number;
      incidentId: number;
      payload: ResolveShipmentIncidentPayload;
    }
  >({
    method: "POST",
    endpoint: ({ id, incidentId }) =>
      marcasEndpoints.transporte.shipments.resolveIncident(id, incidentId),
    body: ({ payload }) => payload,
    invalidateKeys: [marcasQueryKeys.transporte.all],
    options: {
      onSuccess: () => toast.success("Incidencia resuelta."),
      onError: mutationError,
    },
  });
}

export function useCreateTransportCarrier() {
  return API.useMutation<{ id: number }, CreateCarrierPayload>({
    method: "POST",
    endpoint: marcasEndpoints.transporte.carriers.root,
    invalidateKeys: [marcasQueryKeys.transporte.all],
    options: {
      onSuccess: () => toast.success("Transportista creado."),
      onError: mutationError,
    },
  });
}

export function useCreateTransportVehicle() {
  return API.useMutation<{ id: number }, CreateVehiclePayload>({
    method: "POST",
    endpoint: marcasEndpoints.transporte.vehicles.root,
    invalidateKeys: [marcasQueryKeys.transporte.all],
    options: {
      onSuccess: () => toast.success("Vehículo creado."),
      onError: mutationError,
    },
  });
}

export function useCreateTransportDriver() {
  return API.useMutation<{ id: number }, CreateDriverPayload>({
    method: "POST",
    endpoint: marcasEndpoints.transporte.drivers.root,
    invalidateKeys: [marcasQueryKeys.transporte.all],
    options: {
      onSuccess: () => toast.success("Conductor creado."),
      onError: mutationError,
    },
  });
}

export function useDeactivateTransportCarrier() {
  return API.useMutation<
    void,
    { id: number; payload: DeactivateTransportResourcePayload }
  >({
    method: "POST",
    endpoint: ({ id }) => marcasEndpoints.transporte.carriers.deactivate(id),
    body: ({ payload }) => payload,
    invalidateKeys: [marcasQueryKeys.transporte.all],
    options: {
      onSuccess: () => toast.success("Transportista desactivado."),
      onError: mutationError,
    },
  });
}

export function useDeactivateTransportVehicle() {
  return API.useMutation<
    void,
    { id: number; payload: DeactivateTransportResourcePayload }
  >({
    method: "POST",
    endpoint: ({ id }) => marcasEndpoints.transporte.vehicles.deactivate(id),
    body: ({ payload }) => payload,
    invalidateKeys: [marcasQueryKeys.transporte.all],
    options: {
      onSuccess: () => toast.success("Vehículo desactivado."),
      onError: mutationError,
    },
  });
}

export function useDeactivateTransportDriver() {
  return API.useMutation<
    void,
    { id: number; payload: DeactivateTransportResourcePayload }
  >({
    method: "POST",
    endpoint: ({ id }) => marcasEndpoints.transporte.drivers.deactivate(id),
    body: ({ payload }) => payload,
    invalidateKeys: [marcasQueryKeys.transporte.all],
    options: {
      onSuccess: () => toast.success("Conductor desactivado."),
      onError: mutationError,
    },
  });
}
