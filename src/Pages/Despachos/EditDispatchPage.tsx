import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useEffect } from "react";
import { useForm, type Path } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  getListReturnRoute,
  getReturnRoute,
} from "@/features/common/navigation/route-state";
import { useUpdateDispatch } from "@/features/despachos/api/dispatch.mutations";
import { useDispatch } from "@/features/despachos/api/dispatch.queries";
import { toUpdateDispatchPayload } from "@/features/despachos/common/dispatch.mappers";
import { DispatchBodegaFormSelect } from "@/features/despachos/components/dispatch-selects";
import {
  dispatchPlanningSchema,
  type DispatchPlanningFormValues,
} from "@/features/despachos/schemas/dispatch.schemas";
import {
  AppForm,
  AppFormInput,
  AppFormSubmit,
  AppFormTextarea,
} from "@/ui/components/app/form";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

function toLocalDateTime(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export default function EditDispatchPage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const id = Number(params.id);
  const detailUrl = "/marcas-gt/despachos/" + id;
  const backTo = getReturnRoute(location.state, detailUrl);
  const listFrom = getListReturnRoute(location.state, "/marcas-gt/despachos");

  const query = useDispatch(id);
  const mutation = useUpdateDispatch();

  const form = useForm<DispatchPlanningFormValues>({
    resolver: zodResolver(dispatchPlanningSchema),
    defaultValues: {
      pedidoId: null,
      bodegaId: null,
      programadoEn: "",
      observaciones: "",
      detalles: [],
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (!query.data) return;

    form.reset({
      pedidoId: query.data.pedido.id,
      bodegaId: query.data.bodega.id,
      programadoEn: toLocalDateTime(query.data.tiempos.programadoEn),
      observaciones: query.data.observaciones ?? "",
      detalles: query.data.detalles.map((line) => ({
        pedidoDetalleId: line.pedidoDetalleId,
        cantidadProgramada: String(line.despacho.cantidadProgramada),
        observaciones: line.observaciones ?? "",
      })),
    });
  }, [form, query.data]);

  const onSubmit = async (values: DispatchPlanningFormValues) => {
    if (!query.data?.acciones.puedeEditar) return;

    await mutation.mutateAsync({
      id,
      payload: toUpdateDispatchPayload(values),
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
          title="Editar planificación"
          description={query.data?.numero}
          backTo={backTo}
          backLabel="Volver al despacho"
        />

        <AppDataState
          isLoading={query.isLoading}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && !query.data}
          emptyTitle="Despacho no encontrado"
        >
          {query.data?.acciones.puedeEditar ? (
            <AppForm form={form} onSubmit={onSubmit}>
              <AppStack gap="md">
                <AppCard
                  title="Planificación"
                  description="Sólo puede editarse mientras la orden permanezca pendiente y sin operaciones."
                  size="sm"
                >
                  <div className="grid gap-3 md:grid-cols-2">
                    <DispatchBodegaFormSelect<DispatchPlanningFormValues>
                      name="bodegaId"
                      label="Bodega"
                      required
                    />
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

                <AppCard title="Cantidades programadas" size="sm">
                  <AppStack gap="sm">
                    {query.data.detalles.map((line, index) => (
                      <div
                        key={line.id}
                        className="grid gap-3 rounded-md border border-[hsl(var(--app-border))] p-3 xl:grid-cols-[minmax(220px,2fr)_140px_minmax(180px,1fr)]"
                      >
                        <div>
                          <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                            Producto
                          </p>
                          <p className="mt-1 text-sm font-medium">
                            {line.producto.codigo} · {line.producto.nombre}
                          </p>
                        </div>
                        <AppFormInput<DispatchPlanningFormValues>
                          name={("detalles." + index + ".cantidadProgramada") as Path<DispatchPlanningFormValues>}
                          label="Programar"
                          type="number"
                          min={1}
                          inputMode="numeric"
                          required
                        />
                        <AppFormInput<DispatchPlanningFormValues>
                          name={("detalles." + index + ".observaciones") as Path<DispatchPlanningFormValues>}
                          label="Observación"
                          maxLength={500}
                        />
                      </div>
                    ))}
                  </AppStack>
                </AppCard>

                <div className="flex justify-end gap-2">
                  <AppButton asChild variant="secondary">
                    <Link to={backTo}>Cancelar</Link>
                  </AppButton>
                  <AppFormSubmit<DispatchPlanningFormValues>
                    leftIcon={<Save />}
                    loadingText="Guardando..."
                    disableWhenInvalid
                  >
                    Guardar cambios
                  </AppFormSubmit>
                </div>
              </AppStack>
            </AppForm>
          ) : query.data ? (
            <AppCard
              title="La planificación ya no puede editarse"
              description="Sólo las órdenes pendientes y sin operaciones admiten cambios."
              size="sm"
            />
          ) : null}
        </AppDataState>
      </AppStack>
    </AppContainer>
  );
}
