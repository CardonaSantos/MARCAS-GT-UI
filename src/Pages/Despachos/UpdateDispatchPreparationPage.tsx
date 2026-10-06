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
import { useUpdateDispatchPreparation } from "@/features/despachos/api/dispatch.mutations";
import { useDispatch } from "@/features/despachos/api/dispatch.queries";
import { toUpdatePreparationPayload } from "@/features/despachos/common/dispatch.mappers";
import {
  dispatchPreparationSchema,
  type DispatchPreparationFormValues,
} from "@/features/despachos/schemas/dispatch.schemas";
import {
  AppForm,
  AppFormInput,
  AppFormSubmit,
} from "@/ui/components/app/form";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function UpdateDispatchPreparationPage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const id = Number(params.id);
  const detailUrl = "/marcas-gt/despachos/" + id;
  const backTo = getReturnRoute(location.state, detailUrl);
  const listFrom = getListReturnRoute(location.state, "/marcas-gt/despachos");

  const query = useDispatch(id);
  const mutation = useUpdateDispatchPreparation();

  const form = useForm<DispatchPreparationFormValues>({
    resolver: zodResolver(dispatchPreparationSchema),
    defaultValues: { detalles: [] },
    mode: "onTouched",
  });

  useEffect(() => {
    if (!query.data) return;
    form.reset({
      detalles: query.data.detalles.map((line) => ({
        detalleId: line.id,
        cantidadPreparada: String(line.despacho.cantidadPreparada),
        observaciones: line.observaciones ?? "",
      })),
    });
  }, [form, query.data]);

  const onSubmit = async (values: DispatchPreparationFormValues) => {
    if (!query.data?.acciones.puedeActualizarPreparacion) return;

    let invalid = false;
    values.detalles.forEach((line, index) => {
      const source = query.data?.detalles.find(
        (item) => item.id === line.detalleId,
      );
      const quantity = Number(line.cantidadPreparada);
      if (
        source &&
        (quantity < source.despacho.cantidadDespachada ||
          quantity > source.despacho.cantidadProgramada)
      ) {
        invalid = true;
        form.setError(
          ("detalles." +
            index +
            ".cantidadPreparada") as Path<DispatchPreparationFormValues>,
          {
            type: "validate",
            message:
              "Debe estar entre " +
              source.despacho.cantidadDespachada +
              " y " +
              source.despacho.cantidadProgramada +
              ".",
          },
        );
      }
    });
    if (invalid) return;

    await mutation.mutateAsync({
      id,
      payload: toUpdatePreparationPayload(values),
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
          title="Actualizar preparación"
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
          {query.data?.acciones.puedeActualizarPreparacion ? (
            <AppForm form={form} onSubmit={onSubmit}>
              <AppStack gap="md">
                <AppCard
                  title="Picking físico"
                  description="Registra cuánto se ha preparado realmente por línea. No se modifica el stock real hasta registrar la salida."
                  size="sm"
                >
                  <AppStack gap="sm">
                    {query.data.detalles.map((line, index) => (
                      <div
                        key={line.id}
                        className="grid gap-3 rounded-md border border-[hsl(var(--app-border))] p-3 xl:grid-cols-[minmax(230px,2fr)_110px_110px_150px_minmax(180px,1fr)]"
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
                            Programada
                          </p>
                          <p className="mt-1 text-sm font-medium">
                            {line.despacho.cantidadProgramada}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                            Ya despachada
                          </p>
                          <p className="mt-1 text-sm font-medium">
                            {line.despacho.cantidadDespachada}
                          </p>
                        </div>
                        <AppFormInput<DispatchPreparationFormValues>
                          name={
                            ("detalles." +
                              index +
                              ".cantidadPreparada") as Path<DispatchPreparationFormValues>
                          }
                          label="Preparada"
                          type="number"
                          min={line.despacho.cantidadDespachada}
                          max={line.despacho.cantidadProgramada}
                          inputMode="numeric"
                          required
                        />
                        <AppFormInput<DispatchPreparationFormValues>
                          name={
                            ("detalles." +
                              index +
                              ".observaciones") as Path<DispatchPreparationFormValues>
                          }
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
                  <AppFormSubmit<DispatchPreparationFormValues>
                    leftIcon={<Save />}
                    loadingText="Guardando..."
                    disableWhenInvalid
                  >
                    Guardar preparación
                  </AppFormSubmit>
                </div>
              </AppStack>
            </AppForm>
          ) : query.data ? (
            <AppCard
              title="No se puede actualizar la preparación"
              description="La orden debe estar en estado PREPARANDO."
              size="sm"
            />
          ) : null}
        </AppDataState>
      </AppStack>
    </AppContainer>
  );
}
