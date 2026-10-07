import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, LocateFixed } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  getListReturnRoute,
  getReturnRoute,
} from "@/features/common/navigation/route-state";
import { useIdempotencyKey } from "@/features/common/utils/idempotency";
import { useFinalizeDelivery } from "@/features/entregas/api/delivery.mutations";
import { useDelivery } from "@/features/entregas/api/delivery.queries";
import {
  DELIVERY_FAILURE_REASONS,
  DELIVERY_FAILURE_REASON_LABELS,
} from "@/features/entregas/common/delivery.constants";
import { getCurrentPosition } from "@/features/entregas/common/delivery-geolocation";
import { toFinalizeDeliveryPayload } from "@/features/entregas/common/delivery.mappers";
import {
  finalizeDeliverySchema,
  type FinalizeDeliveryFormValues,
} from "@/features/entregas/schemas/delivery.schemas";
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

const resultOptions = [
  { value: "ENTREGADA", label: "Entregada completa" },
  { value: "PARCIAL", label: "Entrega parcial" },
  { value: "RECHAZADA", label: "Rechazada" },
  { value: "NO_ENTREGADA", label: "No entregada" },
] as const;

export default function FinalizeDeliveryPage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const id = Number(params.id);
  const detailUrl = "/marcas-gt/entregas/" + id;
  const backTo = getReturnRoute(location.state, detailUrl);
  const listFrom = getListReturnRoute(location.state, "/marcas-gt/entregas");
  const key = useIdempotencyKey("delivery-finalize");
  const query = useDelivery(id);
  const mutation = useFinalizeDelivery();
  const [locating, setLocating] = useState(false);

  const suggestedResult = useMemo(() => {
    if (!query.data) return "ENTREGADA" as const;
    const { unidadesCargadas, unidadesEntregadas, unidadesRechazadas } =
      query.data.resultado;
    if (
      unidadesCargadas > 0 &&
      unidadesEntregadas === unidadesCargadas &&
      unidadesRechazadas === 0
    ) {
      return "ENTREGADA" as const;
    }
    if (unidadesEntregadas > 0 && unidadesEntregadas < unidadesCargadas) {
      return "PARCIAL" as const;
    }
    if (unidadesEntregadas === 0 && unidadesRechazadas > 0) {
      return "RECHAZADA" as const;
    }
    return "NO_ENTREGADA" as const;
  }, [query.data]);

  const form = useForm<FinalizeDeliveryFormValues>({
    resolver: zodResolver(finalizeDeliverySchema),
    defaultValues: {
      resultado: "ENTREGADA",
      receptorNombre: "",
      receptorDocumento: "",
      latitud: "",
      longitud: "",
      motivoNoEntrega: null,
      detalleNoEntrega: "",
      observaciones: "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (!query.data) return;
    form.reset({
      resultado: suggestedResult,
      receptorNombre: query.data.receptor.nombre ?? "",
      receptorDocumento: query.data.receptor.documento ?? "",
      latitud:
        query.data.ubicacion.entrega?.latitud != null
          ? String(query.data.ubicacion.entrega.latitud)
          : "",
      longitud:
        query.data.ubicacion.entrega?.longitud != null
          ? String(query.data.ubicacion.entrega.longitud)
          : "",
      motivoNoEntrega: query.data.motivoNoEntrega ?? null,
      detalleNoEntrega: query.data.detalleNoEntrega ?? "",
      observaciones: query.data.observaciones ?? "",
    });
  }, [query.data?.id, suggestedResult]);

  const result = useWatch({ control: form.control, name: "resultado" });
  const failureReason = useWatch({
    control: form.control,
    name: "motivoNoEntrega",
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
      toast.error(error instanceof Error ? error.message : "No se pudo obtener la ubicación.");
    } finally {
      setLocating(false);
    }
  };

  const onSubmit = async (values: FinalizeDeliveryFormValues) => {
    if (!query.data?.acciones.puedeFinalizar) return;

    const data = query.data;
    if (data.transporte?.envio.modalidad === "INTERNO") {
      if (!values.latitud.trim() || !values.longitud.trim()) {
        toast.error("Una entrega interna requiere ubicación GPS.");
        return;
      }
    }

    if (values.resultado === "ENTREGADA") {
      if (!values.receptorNombre?.trim()) {
        toast.error("Una entrega completa requiere nombre del receptor.");
        return;
      }
      if (
        data.resultado.unidadesEntregadas !== data.resultado.unidadesCargadas ||
        data.resultado.unidadesRechazadas !== 0
      ) {
        toast.error("ENTREGADA requiere aceptar toda la carga.");
        return;
      }
      if (!data.evidencias.tieneFirma && data.evidencias.fotos === 0) {
        toast.error("Agrega una firma o fotografía antes de finalizar.");
        return;
      }
    }

    if (values.resultado === "PARCIAL") {
      if (!values.receptorNombre?.trim()) {
        toast.error("Una entrega parcial requiere nombre del receptor.");
        return;
      }
      if (
        data.resultado.unidadesEntregadas <= 0 ||
        data.resultado.unidadesEntregadas >= data.resultado.unidadesCargadas
      ) {
        toast.error("PARCIAL requiere entregar una parte de la carga.");
        return;
      }
      if (data.evidencias.total === 0) {
        toast.error("Una entrega parcial requiere evidencia.");
        return;
      }
    }

    if (
      values.resultado === "RECHAZADA" &&
      (data.resultado.unidadesEntregadas !== 0 ||
        data.resultado.unidadesRechazadas <= 0)
    ) {
      toast.error("RECHAZADA requiere cero entregadas y al menos una rechazada.");
      return;
    }

    if (
      values.resultado === "NO_ENTREGADA" &&
      (data.resultado.unidadesEntregadas !== 0 ||
        data.resultado.unidadesRechazadas !== 0)
    ) {
      toast.error("NO_ENTREGADA no admite cantidades entregadas o rechazadas.");
      return;
    }

    await mutation.mutateAsync({
      id,
      payload: toFinalizeDeliveryPayload(values, key),
    });
    navigate(detailUrl, {
      replace: true,
      state: { from: listFrom },
    });
  };

  return (
    <AppContainer size="lg" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Finalizar entrega"
          description={
            query.data
              ? "Entrega #" + query.data.id + " · " + query.data.cliente.nombreCompleto
              : undefined
          }
          backTo={backTo}
          backLabel="Volver a la entrega"
        />

        <AppDataState
          isLoading={query.isLoading}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && !query.data}
          emptyTitle="Entrega no encontrada"
        >
          {query.data ? (
            <AppForm form={form} onSubmit={onSubmit}>
              <AppStack gap="md">
                <AppAlert
                  tone="warning"
                  title="Cierre terminal"
                  description="Al finalizar se sincronizan Pedido y Transporte. La parada quedará atendida incluso si el resultado es rechazada o no entregada."
                />

                <AppCard title="Resultado final" size="sm">
                  <div className="grid gap-3 md:grid-cols-2">
                    <AppFormSingleSelect<FinalizeDeliveryFormValues, string>
                      name="resultado"
                      label="Resultado"
                      options={[...resultOptions]}
                      required
                    />
                    <div className="rounded-md border border-[hsl(var(--app-border))] p-3 text-sm">
                      <p>
                        Cargadas: <strong>{query.data.resultado.unidadesCargadas}</strong>
                      </p>
                      <p>
                        Entregadas: <strong>{query.data.resultado.unidadesEntregadas}</strong>
                      </p>
                      <p>
                        Rechazadas: <strong>{query.data.resultado.unidadesRechazadas}</strong>
                      </p>
                    </div>

                    {(result === "ENTREGADA" || result === "PARCIAL") ? (
                      <>
                        <AppFormInput<FinalizeDeliveryFormValues>
                          name="receptorNombre"
                          label="Nombre del receptor"
                          maxLength={160}
                          required
                        />
                        <AppFormInput<FinalizeDeliveryFormValues>
                          name="receptorDocumento"
                          label="Documento del receptor"
                          maxLength={80}
                        />
                      </>
                    ) : null}

                    {result === "NO_ENTREGADA" ? (
                      <>
                        <AppFormSingleSelect<FinalizeDeliveryFormValues, string>
                          name="motivoNoEntrega"
                          label="Motivo de no entrega"
                          options={DELIVERY_FAILURE_REASONS.map((value) => ({
                            value,
                            label: DELIVERY_FAILURE_REASON_LABELS[value],
                          }))}
                          required
                        />
                        {failureReason === "OTRO" ? (
                          <AppFormInput<FinalizeDeliveryFormValues>
                            name="detalleNoEntrega"
                            label="Detalle del motivo"
                            maxLength={1000}
                            required
                          />
                        ) : null}
                      </>
                    ) : null}
                  </div>
                </AppCard>

                <AppCard title="Ubicación final" size="sm">
                  <div className="grid gap-3 md:grid-cols-2">
                    <AppFormInput<FinalizeDeliveryFormValues>
                      name="latitud"
                      label="Latitud"
                      type="number"
                      step="any"
                    />
                    <AppFormInput<FinalizeDeliveryFormValues>
                      name="longitud"
                      label="Longitud"
                      type="number"
                      step="any"
                    />
                  </div>
                  <div className="mt-3">
                    <AppButton
                      type="button"
                      variant="secondary"
                      size="sm"
                      leftIcon={<LocateFixed />}
                      disabled={locating}
                      onClick={() => void locate()}
                    >
                      {locating ? "Obteniendo ubicación..." : "Usar ubicación actual"}
                    </AppButton>
                  </div>
                </AppCard>

                <AppCard title="Observaciones" size="sm">
                  <AppFormTextarea<FinalizeDeliveryFormValues>
                    name="observaciones"
                    label="Observaciones finales"
                    rows={4}
                    maxLength={1500}
                  />
                </AppCard>

                <div className="flex justify-end gap-2">
                  <AppButton asChild variant="secondary">
                    <Link to={backTo}>Cancelar</Link>
                  </AppButton>
                  <AppFormSubmit<FinalizeDeliveryFormValues>
                    leftIcon={<CheckCircle2 />}
                    loadingText="Finalizando..."
                    disableWhenInvalid
                    disabled={!query.data.acciones.puedeFinalizar}
                  >
                    Finalizar entrega
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
