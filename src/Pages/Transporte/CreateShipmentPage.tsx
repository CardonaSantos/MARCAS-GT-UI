import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useCreateShipment } from "@/features/transporte/api/transport.mutations";
import { useShipmentCandidates } from "@/features/transporte/api/transport.queries";
import type {
  ShipmentCandidate,
  ShipmentPlanningStop,
} from "@/features/transporte/api/transport.types";
import {
  SHIPMENT_MODES,
  SHIPMENT_MODE_LABELS,
} from "@/features/transporte/common/transport.constants";
import { toCreateShipmentPayload } from "@/features/transporte/common/transport.mappers";
import { TransportBodegaFormSelect } from "@/features/transporte/components/transport-selects";
import {
  shipmentPlanningSchema,
  type ShipmentPlanningFormValues,
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
import { AppInput } from "@/ui/components/app/primitives/app-input";
import { AppSearchInput } from "@/ui/components/app/primitives/app-search-input";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

type SelectedStop = {
  candidate: ShipmentCandidate;
  quantities: Record<number, number>;
};

export default function CreateShipmentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const backTo = getReturnRoute(
    location.state,
    "/marcas-gt/transporte/envios",
  );
  const [search, setSearch] = useState("");
  const [serverSearch, setServerSearch] = useState("");
  const [stops, setStops] = useState<SelectedStop[]>([]);
  const [planningError, setPlanningError] = useState<string | null>(null);

  const form = useForm<ShipmentPlanningFormValues>({
    resolver: zodResolver(shipmentPlanningSchema),
    defaultValues: {
      bodegaId: null,
      modalidad: "INTERNO",
      salidaProgramadaEn: "",
      entregaEstimadaEn: "",
      guia: "",
      costo: "",
      trackingUrl: "",
      comprobanteUrl: "",
      observaciones: "",
    },
    mode: "onTouched",
  });

  const bodegaId = useWatch({ control: form.control, name: "bodegaId" });

  const candidatesQuery = useShipmentCandidates({
    page: 1,
    limit: 100,
    search: serverSearch || undefined,
    bodegaId: bodegaId ?? undefined,
  });

  useEffect(() => {
    setStops([]);
    setPlanningError(null);
  }, [bodegaId]);

  const selectedIds = useMemo(
    () => new Set(stops.map((stop) => stop.candidate.despacho.id)),
    [stops],
  );

  const addCandidate = (candidate: ShipmentCandidate) => {
    setStops((current) => [
      ...current,
      {
        candidate,
        quantities: Object.fromEntries(
          candidate.lineas
            .filter((line) => line.cantidadPlanificable > 0)
            .map((line) => [
              line.ordenDespachoDetalleId,
              line.cantidadPlanificable,
            ]),
        ),
      },
    ]);
    setPlanningError(null);
  };

  const moveStop = (index: number, direction: -1 | 1) => {
    setStops((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const updateQuantity = (
    stopIndex: number,
    detailId: number,
    value: number,
    max: number,
  ) => {
    setStops((current) =>
      current.map((stop, index) =>
        index === stopIndex
          ? {
              ...stop,
              quantities: {
                ...stop.quantities,
                [detailId]: Math.max(0, Math.min(max, value || 0)),
              },
            }
          : stop,
      ),
    );
  };

  const mutation = useCreateShipment();

  const onSubmit = async (values: ShipmentPlanningFormValues) => {
    const paradas: ShipmentPlanningStop[] = stops
      .map((stop, index) => ({
        ordenDespachoId: stop.candidate.despacho.id,
        secuencia: index + 1,
        cargas: stop.candidate.lineas
          .map((line) => ({
            ordenDespachoDetalleId: line.ordenDespachoDetalleId,
            cantidadPlanificada:
              stop.quantities[line.ordenDespachoDetalleId] ?? 0,
          }))
          .filter((line) => line.cantidadPlanificada > 0),
      }))
      .filter((stop) => stop.cargas.length > 0);

    if (!paradas.length) {
      setPlanningError("Agrega al menos un despacho con carga planificada.");
      return;
    }

    const created = await mutation.mutateAsync(
      toCreateShipmentPayload(values, paradas),
    );

    navigate("/marcas-gt/transporte/envios/" + created.id, {
      replace: true,
      state: { from: backTo },
    });
  };

  return (
    <AppContainer size="xl" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Nuevo envío"
          description="Agrupa despachos de una misma bodega en una ruta logística."
          backTo={backTo}
          backLabel="Volver a transporte"
        />

        <AppForm form={form} onSubmit={onSubmit}>
          <AppStack gap="md">
            <AppCard title="Planificación" size="sm">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <TransportBodegaFormSelect<ShipmentPlanningFormValues>
                  name="bodegaId"
                  label="Bodega"
                  placeholder="Seleccionar bodega"
                  required
                />
                <AppFormSingleSelect<ShipmentPlanningFormValues, string>
                  name="modalidad"
                  label="Modalidad"
                  options={SHIPMENT_MODES.map((value) => ({
                    value,
                    label: SHIPMENT_MODE_LABELS[value],
                  }))}
                  required
                />
                <AppFormInput<ShipmentPlanningFormValues>
                  name="salidaProgramadaEn"
                  label="Salida programada"
                  type="datetime-local"
                />
                <AppFormInput<ShipmentPlanningFormValues>
                  name="entregaEstimadaEn"
                  label="Entrega estimada"
                  type="datetime-local"
                />
                <AppFormInput<ShipmentPlanningFormValues>
                  name="guia"
                  label="Guía"
                  maxLength={120}
                />
                <AppFormInput<ShipmentPlanningFormValues>
                  name="costo"
                  label="Costo"
                  type="number"
                  min={0}
                  step="0.01"
                />
                <AppFormInput<ShipmentPlanningFormValues>
                  name="trackingUrl"
                  label="URL de tracking"
                  maxLength={500}
                />
                <AppFormInput<ShipmentPlanningFormValues>
                  name="comprobanteUrl"
                  label="URL de comprobante"
                  maxLength={500}
                />
                <div className="md:col-span-2 xl:col-span-4">
                  <AppFormTextarea<ShipmentPlanningFormValues>
                    name="observaciones"
                    label="Observaciones"
                    rows={3}
                    maxLength={1000}
                  />
                </div>
              </div>
            </AppCard>

            <AppCard
              title="Despachos candidatos"
              description="Sólo se muestran despachos preparados con unidades todavía planificables."
              size="sm"
            >
              {!bodegaId ? (
                <AppAlert
                  tone="info"
                  title="Selecciona una bodega"
                  description="Los despachos del envío deben pertenecer a una misma bodega."
                />
              ) : (
                <AppStack gap="sm">
                  <AppSearchInput
                    value={search}
                    onValueChange={setSearch}
                    onDebouncedChange={setServerSearch}
                    placeholder="Buscar despacho, pedido o cliente..."
                  />
                  {(candidatesQuery.data?.data ?? []).map((candidate) => {
                    const available = candidate.lineas.reduce(
                      (sum, line) => sum + line.cantidadPlanificable,
                      0,
                    );
                    const selected = selectedIds.has(candidate.despacho.id);
                    return (
                      <div
                        key={candidate.despacho.id}
                        className="flex flex-col gap-2 rounded-md border border-[hsl(var(--app-border))] p-3 md:flex-row md:items-center md:justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {candidate.despacho.numero} ·{" "}
                            {candidate.despacho.pedido.numero}
                          </p>
                          <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                            {[candidate.despacho.cliente.nombre, candidate.despacho.cliente.apellido]
                              .filter(Boolean)
                              .join(" ")}
                            {" · "}
                            {available} unidades planificables
                          </p>
                        </div>
                        <AppButton
                          type="button"
                          variant="secondary"
                          size="sm"
                          disabled={selected || available <= 0}
                          leftIcon={<Plus />}
                          onClick={() => addCandidate(candidate)}
                        >
                          {selected ? "Agregado" : "Agregar parada"}
                        </AppButton>
                      </div>
                    );
                  })}
                </AppStack>
              )}
            </AppCard>

            <AppCard
              title="Ruta y carga planificada"
              description="El orden de las tarjetas define la secuencia de paradas."
              size="sm"
            >
              {stops.length === 0 ? (
                <AppAlert
                  tone="info"
                  title="Sin paradas"
                  description="Agrega uno o más despachos candidatos."
                />
              ) : (
                <AppStack gap="sm">
                  {stops.map((stop, stopIndex) => (
                    <div
                      key={stop.candidate.despacho.id}
                      className="rounded-md border border-[hsl(var(--app-border))] p-3"
                    >
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold">
                            Parada {stopIndex + 1} ·{" "}
                            {stop.candidate.despacho.numero}
                          </p>
                          <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                            {[stop.candidate.despacho.cliente.nombre, stop.candidate.despacho.cliente.apellido]
                              .filter(Boolean)
                              .join(" ")}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <AppButton
                            type="button"
                            variant="ghost"
                            size="xs"
                            disabled={stopIndex === 0}
                            onClick={() => moveStop(stopIndex, -1)}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </AppButton>
                          <AppButton
                            type="button"
                            variant="ghost"
                            size="xs"
                            disabled={stopIndex === stops.length - 1}
                            onClick={() => moveStop(stopIndex, 1)}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </AppButton>
                          <AppButton
                            type="button"
                            variant="ghost"
                            size="xs"
                            onClick={() =>
                              setStops((current) =>
                                current.filter((_, index) => index !== stopIndex),
                              )
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </AppButton>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {stop.candidate.lineas
                          .filter((line) => line.cantidadPlanificable > 0)
                          .map((line) => (
                            <div
                              key={line.ordenDespachoDetalleId}
                              className="grid gap-2 md:grid-cols-[1fr_120px_140px] md:items-center"
                            >
                              <div>
                                <p className="text-sm">
                                  {line.producto.codigoProducto} ·{" "}
                                  {line.producto.nombre}
                                </p>
                                <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                                  Preparada {line.cantidadPreparada} · Despachada{" "}
                                  {line.cantidadDespachada} · Planificable{" "}
                                  {line.cantidadPlanificable}
                                </p>
                              </div>
                              <span className="text-xs text-[hsl(var(--app-muted-foreground))]">
                                Máx. {line.cantidadPlanificable}
                              </span>
                              <AppInput
                                type="number"
                                min={0}
                                max={line.cantidadPlanificable}
                                value={
                                  stop.quantities[line.ordenDespachoDetalleId] ??
                                  0
                                }
                                onChange={(event) =>
                                  updateQuantity(
                                    stopIndex,
                                    line.ordenDespachoDetalleId,
                                    Number(event.target.value),
                                    line.cantidadPlanificable,
                                  )
                                }
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </AppStack>
              )}
            </AppCard>

            {planningError ? (
              <AppAlert tone="danger" title="Planificación incompleta" description={planningError} />
            ) : null}

            <div className="flex justify-end gap-2">
              <AppButton asChild variant="secondary">
                <Link to={backTo}>Cancelar</Link>
              </AppButton>
              <AppFormSubmit<ShipmentPlanningFormValues>
                leftIcon={<Save />}
                loadingText="Creando..."
                disableWhenInvalid
              >
                Crear envío
              </AppFormSubmit>
            </div>
          </AppStack>
        </AppForm>
      </AppStack>
    </AppContainer>
  );
}
