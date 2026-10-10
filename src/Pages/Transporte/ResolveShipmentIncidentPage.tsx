import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  getListReturnRoute,
  getReturnRoute,
} from "@/features/common/navigation/route-state";
import { useIdempotencyKey } from "@/features/common/utils/idempotency";
import { useResolveShipmentIncident } from "@/features/transporte/api/transport.mutations";
import { useShipmentIncidents } from "@/features/transporte/api/transport.queries";
import { toResolveIncidentPayload } from "@/features/transporte/common/transport.mappers";
import {
  resolveShipmentIncidentSchema,
  type ResolveShipmentIncidentFormValues,
} from "@/features/transporte/schemas/transport.schemas";
import {
  AppForm,
  AppFormSubmit,
  AppFormTextarea,
} from "@/ui/components/app/form";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function ResolveShipmentIncidentPage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const id = Number(params.id);
  const incidentId = Number(params.incidentId);
  const detailUrl = "/marcas-gt/transporte/envios/" + id;
  const backTo = getReturnRoute(location.state, detailUrl + "?tab=incidencias");
  const listFrom = getListReturnRoute(
    location.state,
    "/marcas-gt/transporte/envios",
  );
  const key = useIdempotencyKey("transport-incident-resolution");
  const query = useShipmentIncidents(id, { page: 1, limit: 100 });
  const mutation = useResolveShipmentIncident();
  const incident = (query.data?.data ?? []).find(
    (item) => item.id === incidentId,
  );

  const form = useForm<ResolveShipmentIncidentFormValues>({
    resolver: zodResolver(resolveShipmentIncidentSchema),
    defaultValues: { resolucion: "" },
    mode: "onTouched",
  });

  const onSubmit = async (values: ResolveShipmentIncidentFormValues) => {
    if (!incident || incident.estado === "RESUELTA") return;
    await mutation.mutateAsync({
      id,
      incidentId,
      payload: toResolveIncidentPayload(values, key),
    });
    navigate(detailUrl + "?tab=incidencias", {
      replace: true,
      state: { from: listFrom },
    });
  };

  return (
    <AppContainer size="lg" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Resolver incidencia"
          description={incident ? incident.descripcion : undefined}
          backTo={backTo}
          backLabel="Volver al envío"
        />

        <AppDataState
          isLoading={query.isLoading}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && !incident}
          emptyTitle="Incidencia no encontrada"
        >
          {incident ? (
            <AppForm form={form} onSubmit={onSubmit}>
              <AppStack gap="md">
                {incident.estado === "RESUELTA" ? (
                  <AppAlert
                    tone="success"
                    title="Incidencia ya resuelta"
                    description={incident.resolucion ?? "Sin detalle de resolución."}
                  />
                ) : null}
                <AppCard title="Resolución" size="sm">
                  <AppFormTextarea<ResolveShipmentIncidentFormValues>
                    name="resolucion"
                    label="Detalle de resolución"
                    rows={6}
                    maxLength={1500}
                    required
                  />
                </AppCard>
                <div className="flex justify-end gap-2">
                  <AppButton asChild variant="secondary">
                    <Link to={backTo}>Volver</Link>
                  </AppButton>
                  <AppFormSubmit<ResolveShipmentIncidentFormValues>
                    leftIcon={<CheckCircle2 />}
                    loadingText="Resolviendo..."
                    disableWhenInvalid
                    disabled={incident.estado === "RESUELTA"}
                  >
                    Resolver incidencia
                  </AppFormSubmit>
                </div>
              </AppStack>
            </AppForm>
          ) : null}
        </AppDataState>
      </AppStack>
    </AppContainer>
  );
}
