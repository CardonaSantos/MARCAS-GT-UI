import { zodResolver } from "@hookform/resolvers/zod";
import { PackageCheck } from "lucide-react";
import { useEffect } from "react";
import { useForm, type Path } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  getListReturnRoute,
  getReturnRoute,
} from "@/features/common/navigation/route-state";
import { useIdempotencyKey } from "@/features/common/utils/idempotency";
import { useConfirmShipmentLoad } from "@/features/transporte/api/transport.mutations";
import { useShipment } from "@/features/transporte/api/transport.queries";
import { toConfirmLoadPayload } from "@/features/transporte/common/transport.mappers";
import {
  shipmentLoadSchema,
  type ShipmentLoadFormValues,
} from "@/features/transporte/schemas/transport.schemas";
import {
  AppForm,
  AppFormInput,
  AppFormSubmit,
} from "@/ui/components/app/form";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function ConfirmShipmentLoadPage() {
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
  const key = useIdempotencyKey("transport-load");
  const query = useShipment(id);
  const mutation = useConfirmShipmentLoad();

  const form = useForm<ShipmentLoadFormValues>({
    resolver: zodResolver(shipmentLoadSchema),
    defaultValues: { lineas: [] },
    mode: "onTouched",
  });

  useEffect(() => {
    if (!query.data) return;
    form.reset({
      lineas: query.data.paradas.flatMap((stop) =>
        stop.cargas.map((line) => ({
          cargaDetalleId: line.id,
          cantidadCargada: String(
            line.cantidadCargada > 0
              ? line.cantidadCargada
              : line.cantidadPlanificada,
          ),
        })),
      ),
    });
  }, [query.data?.id]);

  const flatIndex = new Map<number, number>();
  let index = 0;
  for (const stop of query.data?.paradas ?? []) {
    for (const line of stop.cargas) {
      flatIndex.set(line.id, index);
      index += 1;
    }
  }

  const onSubmit = async (values: ShipmentLoadFormValues) => {
    if (!query.data?.acciones.puedeConfirmarCarga) return;
    await mutation.mutateAsync({
      id,
      payload: toConfirmLoadPayload(values, key),
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
          title="Confirmar carga"
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
                  title="La carga debe existir físicamente"
                  description="El backend valida que cada cantidad no exceda lo planificado ni lo ya despachado físicamente desde Bodega."
                />

                {query.data.paradas.map((stop) => (
                  <AppCard
                    key={stop.id}
                    title={
                      "Parada " +
                      stop.secuencia +
                      " · " +
                      stop.ordenDespacho.numero
                    }
                    description={stop.destino.destinatario}
                    size="sm"
                  >
                    <AppStack gap="sm">
                      {stop.cargas.map((line) => {
                        const lineIndex = flatIndex.get(line.id);
                        if (lineIndex === undefined) return null;
                        return (
                          <div
                            key={line.id}
                            className="grid gap-3 md:grid-cols-[1fr_120px_160px] md:items-end"
                          >
                            <div>
                              <p className="text-sm font-medium">
                                {line.producto.codigoProducto} ·{" "}
                                {line.producto.nombre}
                              </p>
                              <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                                Planificada: {line.cantidadPlanificada}
                              </p>
                            </div>
                            <span className="pb-2 text-xs text-[hsl(var(--app-muted-foreground))]">
                              Máx. {line.cantidadPlanificada}
                            </span>
                            <AppFormInput<ShipmentLoadFormValues>
                              name={
                                ("lineas." +
                                  lineIndex +
                                  ".cantidadCargada") as Path<ShipmentLoadFormValues>
                              }
                              label="Cantidad cargada"
                              type="number"
                              min={1}
                              max={line.cantidadPlanificada}
                              inputMode="numeric"
                            />
                          </div>
                        );
                      })}
                    </AppStack>
                  </AppCard>
                ))}

                <div className="flex justify-end gap-2">
                  <AppButton asChild variant="secondary">
                    <Link to={backTo}>Cancelar</Link>
                  </AppButton>
                  <AppFormSubmit<ShipmentLoadFormValues>
                    leftIcon={<PackageCheck />}
                    loadingText="Confirmando..."
                    disableWhenInvalid
                    disabled={!query.data.acciones.puedeConfirmarCarga}
                  >
                    Confirmar carga
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
