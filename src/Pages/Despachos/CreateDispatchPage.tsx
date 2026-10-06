import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch, type Path } from "react-hook-form";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  getListReturnRoute,
  getReturnRoute,
} from "@/features/common/navigation/route-state";
import { useCreateDispatch } from "@/features/despachos/api/dispatch.mutations";
import { useDispatchCandidates } from "@/features/despachos/api/dispatch.queries";
import { toCreateDispatchPayload } from "@/features/despachos/common/dispatch.mappers";
import { DispatchBodegaFormSelect } from "@/features/despachos/components/dispatch-selects";
import {
  dispatchPlanningSchema,
  type DispatchPlanningFormValues,
} from "@/features/despachos/schemas/dispatch.schemas";
import { useOrder } from "@/features/pedidos/api/order.queries";
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
import { AppSearchInput } from "@/ui/components/app/primitives/app-search-input";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function CreateDispatchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const backTo = getReturnRoute(location.state, "/marcas-gt/despachos");
  const listFrom = getListReturnRoute(location.state, backTo);

  const initialOrderId = Number(searchParams.get("pedidoId"));
  const validInitialOrderId =
    Number.isInteger(initialOrderId) && initialOrderId > 0
      ? initialOrderId
      : null;

  const initialOrderQuery = useOrder(validInitialOrderId ?? 0);
  const [searchInput, setSearchInput] = useState("");
  const [serverSearch, setServerSearch] = useState("");

  const form = useForm<DispatchPlanningFormValues>({
    resolver: zodResolver(dispatchPlanningSchema),
    defaultValues: {
      pedidoId: validInitialOrderId,
      bodegaId: null,
      programadoEn: "",
      observaciones: "",
      detalles: [],
    },
    mode: "onTouched",
  });

  const pedidoId = useWatch({ control: form.control, name: "pedidoId" });
  const bodegaId = useWatch({ control: form.control, name: "bodegaId" });
  const detalles = useWatch({ control: form.control, name: "detalles" }) ?? [];

  const candidateSearch =
    validInitialOrderId && initialOrderQuery.data
      ? initialOrderQuery.data.numero
      : serverSearch;

  const candidatesQuery = useDispatchCandidates({
    page: 1,
    limit: 100,
    search: candidateSearch || undefined,
    bodegaId: bodegaId ?? undefined,
  });

  const candidate = useMemo(
    () =>
      (candidatesQuery.data?.data ?? []).find(
        (item) => item.pedido.id === pedidoId,
      ) ?? null,
    [candidatesQuery.data, pedidoId],
  );

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: "detalles",
  });

  useEffect(() => {
    if (!candidate) {
      replace([]);
      return;
    }

    replace(
      candidate.lineas
        .filter((line) => line.cantidadPendientePlanificar > 0)
        .map((line) => ({
          pedidoDetalleId: line.pedidoDetalleId,
          cantidadProgramada: String(line.cantidadPendientePlanificar),
          observaciones: "",
        })),
    );
  }, [candidate?.pedido.id, bodegaId, replace]);

  const mutation = useCreateDispatch();

  const onSubmit = async (values: DispatchPlanningFormValues) => {
    if (!candidate) return;

    let invalid = false;
    values.detalles.forEach((line, index) => {
      const source = candidate.lineas.find(
        (item) => item.pedidoDetalleId === line.pedidoDetalleId,
      );
      const quantity = Number(line.cantidadProgramada);
      if (
        quantity > 0 &&
        source &&
        quantity > source.cantidadPendientePlanificar
      ) {
        invalid = true;
        form.setError(("detalles." + index + ".cantidadProgramada") as Path<DispatchPlanningFormValues>, {
          type: "validate",
          message:
            "Máximo planificable: " + source.cantidadPendientePlanificar + ".",
        });
      }
    });

    if (invalid) return;

    const created = await mutation.mutateAsync(
      toCreateDispatchPayload(values),
    );

    navigate("/marcas-gt/despachos/" + created.id, {
      replace: true,
      state: { from: listFrom },
    });
  };

  const candidateOptions = (candidatesQuery.data?.data ?? []).map((item) => ({
    value: item.pedido.id,
    label:
      item.pedido.numero +
      " · " +
      item.cliente.nombreCompleto +
      " · " +
      item.totales.unidadesPendientesPlanificar +
      " pend.",
  }));

  return (
    <AppContainer size="xl" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Nuevo despacho"
          description="Planifica cantidades de un pedido confirmado. La reserva física se realizará al iniciar preparación."
          backTo={backTo}
          backLabel="Volver a despachos"
        />

        <AppForm form={form} onSubmit={onSubmit}>
          <AppStack gap="md">
            <AppCard
              title="Pedido y bodega"
              description="Selecciona el pedido planificable y la bodega responsable."
              size="sm"
            >
              <div className="grid gap-3 md:grid-cols-2">
                <DispatchBodegaFormSelect<DispatchPlanningFormValues>
                  name="bodegaId"
                  label="Bodega"
                  placeholder="Seleccionar bodega"
                  required
                />

                <div className="space-y-2">
                  <AppSearchInput
                    value={searchInput}
                    onValueChange={setSearchInput}
                    onDebouncedChange={setServerSearch}
                    placeholder="Buscar pedido o cliente..."
                  />
                  <AppFormSingleSelect<DispatchPlanningFormValues, number>
                    name="pedidoId"
                    label="Pedido"
                    options={candidateOptions}
                    isLoading={candidatesQuery.isLoading}
                    placeholder="Seleccionar pedido"
                    required
                  />
                </div>

                <AppFormInput<DispatchPlanningFormValues>
                  name="programadoEn"
                  label="Programado para"
                  type="datetime-local"
                />

                <div className="md:col-span-2">
                  <AppFormTextarea<DispatchPlanningFormValues>
                    name="observaciones"
                    label="Observaciones"
                    rows={3}
                    maxLength={1000}
                  />
                </div>
              </div>
            </AppCard>

            {candidate ? (
              <AppCard
                title="Líneas a planificar"
                description={
                  candidate.pedido.numero +
                  " · " +
                  candidate.cliente.nombreCompleto
                }
                size="sm"
              >
                <AppStack gap="sm">
                  {fields.map((field, index) => {
                    const source = candidate.lineas.find(
                      (line) => line.pedidoDetalleId === field.pedidoDetalleId,
                    );
                    const availability = source?.disponibilidadBodega;
                    const requested = Number(
                      detalles[index]?.cantidadProgramada ?? 0,
                    );

                    return (
                      <div
                        key={field.id}
                        className="rounded-md border border-[hsl(var(--app-border))] p-3"
                      >
                        <div className="grid gap-3 xl:grid-cols-[minmax(220px,2fr)_120px_120px_120px_140px]">
                          <div>
                            <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                              Producto
                            </p>
                            <p className="mt-1 text-sm font-medium">
                              {source?.producto.codigo} ·{" "}
                              {source?.producto.nombre}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                              Pend. planificar
                            </p>
                            <p className="mt-1 text-sm font-medium tabular-nums">
                              {source?.cantidadPendientePlanificar ?? 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                              Disponible
                            </p>
                            <p className="mt-1 text-sm font-medium tabular-nums">
                              {availability?.disponible ?? "—"}
                            </p>
                          </div>
                          <AppFormInput<DispatchPlanningFormValues>
                            name={("detalles." + index + ".cantidadProgramada") as Path<DispatchPlanningFormValues>}
                            label="Programar"
                            type="number"
                            min={0}
                            max={source?.cantidadPendientePlanificar}
                            inputMode="numeric"
                          />
                          <AppFormInput<DispatchPlanningFormValues>
                            name={("detalles." + index + ".observaciones") as Path<DispatchPlanningFormValues>}
                            label="Observación"
                            maxLength={500}
                          />
                        </div>

                        {availability && requested > availability.disponible ? (
                          <div className="mt-3">
                            <AppAlert
                              tone="warning"
                              title="Disponibilidad insuficiente hoy"
                              description="La planificación puede guardarse, pero no podrá iniciar preparación hasta contar con stock suficiente."
                            />
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </AppStack>
              </AppCard>
            ) : (
              <AppAlert
                tone="info"
                title="Selecciona un pedido"
                description="Los candidatos son pedidos confirmados o en operación con unidades pendientes de planificar."
              />
            )}

            <div className="flex justify-end gap-2">
              <AppButton asChild variant="secondary">
                <Link to={backTo}>Cancelar</Link>
              </AppButton>
              <AppFormSubmit<DispatchPlanningFormValues>
                leftIcon={<Save />}
                loadingText="Creando..."
                disableWhenInvalid
                disabled={!candidate}
              >
                Crear despacho
              </AppFormSubmit>
            </div>
          </AppStack>
        </AppForm>
      </AppStack>
    </AppContainer>
  );
}
