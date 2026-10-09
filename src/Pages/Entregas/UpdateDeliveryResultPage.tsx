import { zodResolver } from "@hookform/resolvers/zod";
import { LocateFixed, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm, type Path } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { createIdempotencyKey } from "@/features/common/utils/idempotency";
import {
  getListReturnRoute,
  getReturnRoute,
} from "@/features/common/navigation/route-state";
import { useUpdateDeliveryResult } from "@/features/entregas/api/delivery.mutations";
import { useDelivery } from "@/features/entregas/api/delivery.queries";
import { getCurrentPosition } from "@/features/entregas/common/delivery-geolocation";
import { toUpdateDeliveryResultPayload } from "@/features/entregas/common/delivery.mappers";
import {
  deliveryResultSchema,
  type DeliveryResultFormValues,
} from "@/features/entregas/schemas/delivery.schemas";
import {
  AppForm,
  AppFormInput,
  AppFormSubmit,
  AppFormTextarea,
} from "@/ui/components/app/form";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function UpdateDeliveryResultPage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const id = Number(params.id);
  const detailUrl = "/marcas-gt/entregas/" + id;
  const backTo = getReturnRoute(location.state, detailUrl);
  const listFrom = getListReturnRoute(location.state, "/marcas-gt/entregas");
  const query = useDelivery(id);
  const mutation = useUpdateDeliveryResult();
  const [locating, setLocating] = useState(false);
  const submitKey = useRef(createIdempotencyKey("delivery-attention-result"));

  const form = useForm<DeliveryResultFormValues>({
    resolver: zodResolver(deliveryResultSchema),
    defaultValues: {
      receptorNombre: "",
      receptorDocumento: "",
      latitud: "",
      longitud: "",
      observaciones: "",
      detalles: [],
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (!query.data) return;
    form.reset({
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
      observaciones: query.data.observaciones ?? "",
      detalles: query.data.detalles.map((line) => ({
        detalleId: line.id,
        cantidadEntregada: String(line.entregadoIntento),
        cantidadRechazada: String(line.rechazadoIntento),
        motivoRechazo: line.motivoRechazo ?? "",
      })),
    });
  }, [query.data?.id]);

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

  const onSubmit = async (values: DeliveryResultFormValues) => {
    if (!query.data?.acciones.puedeEditarResultado) return;

    for (const [index, valuesLine] of values.detalles.entries()) {
      const source = query.data.detalles[index];
      const delivered = Number(valuesLine.cantidadEntregada);
      const rejected = Number(valuesLine.cantidadRechazada);

      if (delivered + rejected > source.cargadoIntento) {
        toast.error(
          source.producto.nombre +
            ": entregada + rechazada no puede superar " +
            source.cargadoIntento +
            ".",
        );
        return;
      }
      if (rejected > 0 && !valuesLine.motivoRechazo?.trim()) {
        toast.error(
          source.producto.nombre + ": indica el motivo de rechazo.",
        );
        return;
      }
    }

    // Si aún no hay GPS, intentamos capturarlo una sola vez al confirmar.
    // El permiso puede denegarse: no se pierde el resultado físico capturado.
    let coordinates = values;
    if (!values.latitud.trim() && !values.longitud.trim()) {
      try {
        setLocating(true);
        const gps = await getCurrentPosition();
        coordinates = {
          ...values,
          latitud: String(gps.latitud),
          longitud: String(gps.longitud),
        };
      } catch {
        toast.warning("No se obtuvo GPS. Puedes reintentar o finalizar después con ubicación.");
      } finally {
        setLocating(false);
      }
    }

    await mutation.mutateAsync({
      id,
      payload: {
        ...toUpdateDeliveryResultPayload(coordinates),
        claveIdempotencia: submitKey.current,
      },
    });
    navigate(detailUrl, {
      replace: true,
      state: { from: listFrom },
    });
  };

  return (
    <AppContainer size="xl" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title={query.data?.estado === "PENDIENTE"
            ? "Atender y registrar resultado"
            : "Editar resultado"}
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
                  tone="info"
                  title="Atención y resultado físico"
                  description={query.data.estado === "PENDIENTE"
                    ? "Al guardar se iniciará automáticamente la atención, se registrarán las cantidades y se intentará capturar GPS. Después podrás adjuntar firma o fotografía y finalizar."
                    : "Actualiza lo recibido y rechazado. La atención ya está iniciada."}
                />

                <AppCard title="Receptor y ubicación" size="sm">
                  <div className="grid gap-3 md:grid-cols-2">
                    <AppFormInput<DeliveryResultFormValues>
                      name="receptorNombre"
                      label="Nombre del receptor"
                      maxLength={160}
                    />
                    <AppFormInput<DeliveryResultFormValues>
                      name="receptorDocumento"
                      label="Documento"
                      maxLength={80}
                    />
                    <AppFormInput<DeliveryResultFormValues>
                      name="latitud"
                      label="Latitud"
                      type="number"
                      step="any"
                    />
                    <AppFormInput<DeliveryResultFormValues>
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
                        disabled={locating}
                        onClick={() => void locate()}
                      >
                        {locating ? "Obteniendo ubicación..." : "Usar ubicación actual"}
                      </AppButton>
                    </div>
                  </div>
                </AppCard>

                {query.data.detalles.map((line, index) => (
                  <AppCard
                    key={line.id}
                    title={line.producto.codigo + " · " + line.producto.nombre}
                    description={"Carga disponible en este intento: " + line.cargadoIntento}
                    size="sm"
                  >
                    <div className="grid gap-3 md:grid-cols-3">
                      <AppFormInput<DeliveryResultFormValues>
                        name={
                          ("detalles." +
                            index +
                            ".cantidadEntregada") as Path<DeliveryResultFormValues>
                        }
                        label="Cantidad entregada"
                        type="number"
                        min={0}
                        max={line.cargadoIntento}
                        inputMode="numeric"
                      />
                      <AppFormInput<DeliveryResultFormValues>
                        name={
                          ("detalles." +
                            index +
                            ".cantidadRechazada") as Path<DeliveryResultFormValues>
                        }
                        label="Cantidad rechazada"
                        type="number"
                        min={0}
                        max={line.cargadoIntento}
                        inputMode="numeric"
                      />
                      <AppFormInput<DeliveryResultFormValues>
                        name={
                          ("detalles." +
                            index +
                            ".motivoRechazo") as Path<DeliveryResultFormValues>
                        }
                        label="Motivo de rechazo"
                        maxLength={500}
                      />
                    </div>
                  </AppCard>
                ))}

                <AppCard title="Observaciones" size="sm">
                  <AppFormTextarea<DeliveryResultFormValues>
                    name="observaciones"
                    label="Observaciones del intento"
                    rows={4}
                    maxLength={1500}
                  />
                </AppCard>

                <div className="flex justify-end gap-2">
                  <AppButton asChild variant="secondary">
                    <Link to={backTo}>Cancelar</Link>
                  </AppButton>
                  <AppFormSubmit<DeliveryResultFormValues>
                    leftIcon={<Save />}
                    loadingText="Guardando..."
                    disableWhenInvalid
                    disabled={!query.data.acciones.puedeEditarResultado || locating}
                  >
                    {query.data.estado === "PENDIENTE" ? "Guardar atención y resultado" : "Guardar cambios"}
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
