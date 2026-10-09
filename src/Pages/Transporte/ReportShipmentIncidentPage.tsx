import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, LocateFixed } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getCurrentPosition } from "@/features/common/utils/geolocation";
import {
  getListReturnRoute,
  getReturnRoute,
} from "@/features/common/navigation/route-state";
import { useIdempotencyKey } from "@/features/common/utils/idempotency";
import { useReportShipmentIncident } from "@/features/transporte/api/transport.mutations";
import { useShipment } from "@/features/transporte/api/transport.queries";
import {
  INCIDENT_SEVERITIES,
  INCIDENT_SEVERITY_LABELS,
  INCIDENT_TYPES,
  INCIDENT_TYPE_LABELS,
} from "@/features/transporte/common/transport.constants";
import { toIncidentPayload } from "@/features/transporte/common/transport.mappers";
import {
  shipmentIncidentSchema,
  type ShipmentIncidentFormValues,
} from "@/features/transporte/schemas/transport.schemas";
import {
  AppForm,
  AppFormInput,
  AppFormSingleSelect,
  AppFormSubmit,
  AppFormTextarea,
} from "@/ui/components/app/form";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function ReportShipmentIncidentPage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const id = Number(params.id);
  const detailUrl = "/marcas-gt/transporte/envios/" + id;
  const backTo = getReturnRoute(location.state, detailUrl);
  const listFrom = getListReturnRoute(
    location.state,
    "/marcas-gt/transporte/envios",
  );
  const key = useIdempotencyKey("transport-incident");
  const query = useShipment(id);
  const mutation = useReportShipmentIncident();
  const [locating, setLocating] = useState(false);

  const form = useForm<ShipmentIncidentFormValues>({
    resolver: zodResolver(shipmentIncidentSchema),
    defaultValues: {
      tipo: "OTRO",
      severidad: "MEDIA",
      descripcion: "",
      latitud: "",
      longitud: "",
    },
    mode: "onTouched",
  });

  const locate = async () => {
    try {
      setLocating(true);
      const position = await getCurrentPosition();
      form.setValue("latitud", String(position.latitud), {
        shouldDirty: true,
        shouldValidate: true,
      });
      form.setValue("longitud", String(position.longitud), {
        shouldDirty: true,
        shouldValidate: true,
      });
      toast.success("Ubicación actual capturada.");
    } catch (error) {
      toast.error(error instanceof Error
        ? error.message
        : "No se pudo obtener la ubicación.");
    } finally {
      setLocating(false);
    }
  };

  const onSubmit = async (values: ShipmentIncidentFormValues) => {
    if (!query.data?.acciones.puedeReportarIncidencia) return;
    await mutation.mutateAsync({
      id,
      payload: toIncidentPayload(values, key),
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
          title="Reportar incidencia"
          description={query.data?.numero}
          backTo={backTo}
          backLabel="Volver al envío"
        />

        <AppDataState
          isLoading={query.isLoading}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && !query.data}
          emptyTitle="Envío no encontrado"
        >
          {query.data ? (
            <AppForm form={form} onSubmit={onSubmit}>
              <AppStack gap="md">
                <AppAlert
                  tone="warning"
                  title="Incidencia de ruta"
                  description="El envío pasará a INCIDENCIA hasta que las incidencias abiertas sean resueltas."
                />
                <AppCard title="Datos de la incidencia" size="sm">
                  <div className="grid gap-3 md:grid-cols-2">
                    <AppFormSingleSelect<ShipmentIncidentFormValues, string>
                      name="tipo"
                      label="Tipo"
                      options={INCIDENT_TYPES.map((value) => ({
                        value,
                        label: INCIDENT_TYPE_LABELS[value],
                      }))}
                      required
                    />
                    <AppFormSingleSelect<ShipmentIncidentFormValues, string>
                      name="severidad"
                      label="Severidad"
                      options={INCIDENT_SEVERITIES.map((value) => ({
                        value,
                        label: INCIDENT_SEVERITY_LABELS[value],
                      }))}
                      required
                    />
                    <div className="md:col-span-2">
                      <AppFormTextarea<ShipmentIncidentFormValues>
                        name="descripcion"
                        label="Descripción"
                        rows={5}
                        maxLength={1500}
                        required
                      />
                    </div>
                    <AppFormInput<ShipmentIncidentFormValues>
                      name="latitud"
                      label="Latitud"
                      type="number"
                      step="any"
                    />
                    <AppFormInput<ShipmentIncidentFormValues>
                      name="longitud"
                      label="Longitud"
                      type="number"
                      step="any"
                    />
                    <div className="md:col-span-2">
                      <AppButton
                        type="button"
                        variant="secondary"
                        size="sm"
                        leftIcon={<LocateFixed />}
                        disabled={locating || mutation.isPending}
                        onClick={() => void locate()}
                      >
                        {locating ? "Obteniendo ubicación..." : "Usar ubicación actual"}
                      </AppButton>
                      <p className="mt-2 text-xs text-[hsl(var(--app-muted-foreground))]">
                        Ubicación opcional del incidente; se captura solo cuando la solicitas.
                      </p>
                    </div>
                  </div>
                </AppCard>
                <div className="flex justify-end gap-2">
                  <AppButton asChild variant="secondary">
                    <Link to={backTo}>Cancelar</Link>
                  </AppButton>
                  <AppFormSubmit<ShipmentIncidentFormValues>
                    variant="danger"
                    leftIcon={<AlertTriangle />}
                    loadingText="Reportando..."
                    disableWhenInvalid
                    disabled={!query.data.acciones.puedeReportarIncidencia}
                  >
                    Reportar incidencia
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
