import { zodResolver } from "@hookform/resolvers/zod";
import { Play } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  getListReturnRoute,
  getReturnRoute,
} from "@/features/common/navigation/route-state";
import { useIdempotencyKey } from "@/features/common/utils/idempotency";
import { useStartDispatchPreparation } from "@/features/despachos/api/dispatch.mutations";
import {
  useDispatch,
  useDispatchOperationsByDispatch,
} from "@/features/despachos/api/dispatch.queries";
import { toStartPreparationPayload } from "@/features/despachos/common/dispatch.mappers";
import {
  dispatchStartPreparationSchema,
  type DispatchStartPreparationFormValues,
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

export default function StartDispatchPreparationPage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const id = Number(params.id);
  const detailUrl = "/marcas-gt/despachos/" + id;
  const backTo = getReturnRoute(location.state, detailUrl);
  const listFrom = getListReturnRoute(location.state, "/marcas-gt/despachos");
  const key = useIdempotencyKey("dispatch-preparation");

  const query = useDispatch(id);
  const failedOperationsQuery = useDispatchOperationsByDispatch(id, {
    page: 1,
    limit: 100,
    estado: "FALLIDA",
  });
  const mutation = useStartDispatchPreparation();

  const form = useForm<DispatchStartPreparationFormValues>({
    resolver: zodResolver(dispatchStartPreparationSchema),
    defaultValues: {
      observaciones: "",
      ocurridaEn: "",
    },
    mode: "onTouched",
  });

  const blockedByFailure = (failedOperationsQuery.data?.data ?? []).some(
    (operation) => operation.tipo === "RESERVA_PREPARACION",
  );

  const onSubmit = async (values: DispatchStartPreparationFormValues) => {
    if (
      !query.data?.acciones.puedeIniciarPreparacion ||
      blockedByFailure
    ) {
      return;
    }

    await mutation.mutateAsync({
      id,
      payload: toStartPreparationPayload(values, key),
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
          title="Iniciar preparación"
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
                    description="Reintenta la operación fallida desde la pestaña Operaciones antes de iniciar otra reserva de preparación."
                  />
                ) : null}

                <AppAlert
                  tone="info"
                  title="Esta acción reserva inventario"
                  description="Al iniciar preparación, Despachos crea la operación RESERVA_PREPARACION, reserva cada línea en Inventario y sincroniza el Pedido a EN_PREPARACION."
                />

                <AppCard title="Datos de la operación" size="sm">
                  <AppStack gap="md">
                    <AppFormInput<DispatchStartPreparationFormValues>
                      name="ocurridaEn"
                      label="Fecha/hora operativa"
                      type="datetime-local"
                      description="Opcional. Si se omite, el servidor utiliza la hora actual."
                    />
                    <AppFormTextarea<DispatchStartPreparationFormValues>
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
                  <AppFormSubmit<DispatchStartPreparationFormValues>
                    leftIcon={<Play />}
                    loadingText="Reservando..."
                    disableWhenInvalid
                    disabled={
                      !query.data.acciones.puedeIniciarPreparacion ||
                      blockedByFailure
                    }
                  >
                    Iniciar preparación
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
