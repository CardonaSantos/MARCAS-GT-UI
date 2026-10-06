import { zodResolver } from "@hookform/resolvers/zod";
import { Truck } from "lucide-react";
import { useEffect } from "react";
import { useForm, type Path } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  getListReturnRoute,
  getReturnRoute,
} from "@/features/common/navigation/route-state";
import { useIdempotencyKey } from "@/features/common/utils/idempotency";
import { useRegisterDispatchOutput } from "@/features/despachos/api/dispatch.mutations";
import {
  useDispatch,
  useDispatchOperationsByDispatch,
} from "@/features/despachos/api/dispatch.queries";
import { toRegisterOutputPayload } from "@/features/despachos/common/dispatch.mappers";
import {
  dispatchOutputSchema,
  type DispatchOutputFormValues,
} from "@/features/despachos/schemas/dispatch.schemas";
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

export default function RegisterDispatchOutputPage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const id = Number(params.id);
  const detailUrl = "/marcas-gt/despachos/" + id;
  const backTo = getReturnRoute(location.state, detailUrl);
  const listFrom = getListReturnRoute(location.state, "/marcas-gt/despachos");
  const key = useIdempotencyKey("dispatch-output");

  const query = useDispatch(id);
  const failedOperationsQuery = useDispatchOperationsByDispatch(id, {
    page: 1,
    limit: 100,
    estado: "FALLIDA",
  });
  const mutation = useRegisterDispatchOutput();

  const form = useForm<DispatchOutputFormValues>({
    resolver: zodResolver(dispatchOutputSchema),
    defaultValues: {
      observaciones: "",
      ocurridaEn: "",
      detalles: [],
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (!query.data) return;
    form.reset({
      observaciones: "",
      ocurridaEn: "",
      detalles: query.data.detalles.map((line) => ({
        detalleId: line.id,
        cantidad: String(line.despacho.pendienteDespachar),
      })),
    });
  }, [form, query.data]);

  const blockedByFailure = (failedOperationsQuery.data?.data ?? []).some(
    (operation) => operation.tipo === "SALIDA_DESPACHO",
  );

  const onSubmit = async (values: DispatchOutputFormValues) => {
    if (!query.data?.acciones.puedeDespachar || blockedByFailure) return;

    let invalid = false;
    values.detalles.forEach((line, index) => {
      const source = query.data?.detalles.find(
        (item) => item.id === line.detalleId,
      );
      const quantity = Number(line.cantidad);
      if (
        source &&
        quantity > source.despacho.pendienteDespachar
      ) {
        invalid = true;
        form.setError(
          ("detalles." + index + ".cantidad") as Path<DispatchOutputFormValues>,
          {
            type: "validate",
            message:
              "Máximo disponible para salida: " +
              source.despacho.pendienteDespachar +
              ".",
          },
        );
      }
    });
    if (invalid) return;

    await mutation.mutateAsync({
      id,
      payload: toRegisterOutputPayload(values, key),
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
          title="Registrar salida física"
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
          {query.data ? (
            <AppForm form={form} onSubmit={onSubmit}>
              <AppStack gap="md">
                {blockedByFailure ? (
                  <AppAlert
                    tone="danger"
                    title="Existe una operación fallida pendiente"
                    description="Reintenta la SALIDA_DESPACHO fallida desde Operaciones. No se permite crear otra salida con una clave nueva."
                  />
                ) : null}

                <AppAlert
                  tone="warning"
                  title="Esta acción mueve inventario real"
                  description="La salida aplica la reserva, reduce stock real y reservado, crea SALIDA_DESPACHO y sincroniza cantidadDespachada del Pedido."
                />

                <AppCard title="Salida" size="sm">
                  <AppStack gap="sm">
                    {query.data.detalles.map((line, index) => (
                      <div
                        key={line.id}
                        className="grid gap-3 rounded-md border border-[hsl(var(--app-border))] p-3 xl:grid-cols-[minmax(230px,2fr)_110px_110px_150px]"
                      >
                        <div>
                          <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                            Producto
                          </p>
                          <p className="mt-1 text-sm font-medium">
                            {line.producto.codigo} · {line.producto.nombre}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                            Preparada
                          </p>
                          <p className="mt-1 text-sm font-medium">
                            {line.despacho.cantidadPreparada}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                            Pendiente
                          </p>
                          <p className="mt-1 text-sm font-medium">
                            {line.despacho.pendienteDespachar}
                          </p>
                        </div>
                        <AppFormInput<DispatchOutputFormValues>
                          name={
                            ("detalles." +
                              index +
                              ".cantidad") as Path<DispatchOutputFormValues>
                          }
                          label="Salida"
                          type="number"
                          min={0}
                          max={line.despacho.pendienteDespachar}
                          inputMode="numeric"
                        />
                      </div>
                    ))}

                    <AppFormInput<DispatchOutputFormValues>
                      name="ocurridaEn"
                      label="Fecha/hora de salida"
                      type="datetime-local"
                    />

                    <AppFormTextarea<DispatchOutputFormValues>
                      name="observaciones"
                      label="Observaciones"
                      rows={4}
                      maxLength={1000}
                    />
                  </AppStack>
                </AppCard>

                <div className="flex justify-end gap-2">
                  <AppButton asChild variant="secondary">
                    <Link to={backTo}>Cancelar</Link>
                  </AppButton>
                  <AppFormSubmit<DispatchOutputFormValues>
                    leftIcon={<Truck />}
                    loadingText="Registrando salida..."
                    disableWhenInvalid
                    disabled={
                      !query.data.acciones.puedeDespachar ||
                      blockedByFailure
                    }
                  >
                    Registrar salida
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
