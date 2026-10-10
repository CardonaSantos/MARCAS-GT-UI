import { zodResolver } from "@hookform/resolvers/zod";
import { XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  getListReturnRoute,
  getReturnRoute,
} from "@/features/common/navigation/route-state";
import { useIdempotencyKey } from "@/features/common/utils/idempotency";
import { useCancelDispatch } from "@/features/despachos/api/dispatch.mutations";
import {
  useDispatch,
  useDispatchOperationsByDispatch,
} from "@/features/despachos/api/dispatch.queries";
import { toCancelDispatchPayload } from "@/features/despachos/common/dispatch.mappers";
import {
  dispatchCancelSchema,
  type DispatchCancelFormValues,
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

export default function CancelDispatchPage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const id = Number(params.id);
  const detailUrl = "/marcas-gt/despachos/" + id;
  const backTo = getReturnRoute(location.state, detailUrl);
  const listFrom = getListReturnRoute(location.state, "/marcas-gt/despachos");
  const key = useIdempotencyKey("dispatch-cancel");

  const query = useDispatch(id);
  const failedOperationsQuery = useDispatchOperationsByDispatch(id, {
    page: 1,
    limit: 100,
    estado: "FALLIDA",
  });
  const mutation = useCancelDispatch();

  const form = useForm<DispatchCancelFormValues>({
    resolver: zodResolver(dispatchCancelSchema),
    defaultValues: {
      motivo: "",
      ocurridaEn: "",
    },
    mode: "onTouched",
  });

  const blockedByFailure = (failedOperationsQuery.data?.data ?? []).some(
    (operation) => operation.tipo === "LIBERACION_RESERVA",
  );

  const onSubmit = async (values: DispatchCancelFormValues) => {
    if (!query.data?.acciones.puedeCancelar || blockedByFailure) return;

    await mutation.mutateAsync({
      id,
      payload: toCancelDispatchPayload(values, key),
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
          title="Cancelar despacho"
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
                    title="Primero resuelve la operación fallida"
                    description="Si existe una saga fallida de liberación, debe reintentarse antes de crear otra cancelación."
                  />
                ) : null}

                <AppAlert
                  tone="warning"
                  title="Cancelación operativa"
                  description="Si la preparación ya reservó inventario, el backend genera LIBERACION_RESERVA y sólo cancela después de reconciliar Inventario y Pedido. Una orden con salida física no puede cancelarse."
                />

                <AppCard title="Motivo" size="sm">
                  <AppStack gap="md">
                    <AppFormTextarea<DispatchCancelFormValues>
                      name="motivo"
                      label="Motivo de cancelación"
                      rows={5}
                      maxLength={500}
                      required
                    />
                    <AppFormInput<DispatchCancelFormValues>
                      name="ocurridaEn"
                      label="Fecha/hora operativa"
                      type="datetime-local"
                    />
                  </AppStack>
                </AppCard>

                <div className="flex justify-end gap-2">
                  <AppButton asChild variant="secondary">
                    <Link to={backTo}>Volver</Link>
                  </AppButton>
                  <AppFormSubmit<DispatchCancelFormValues>
                    variant="danger"
                    leftIcon={<XCircle />}
                    loadingText="Cancelando..."
                    disableWhenInvalid
                    disabled={
                      !query.data.acciones.puedeCancelar ||
                      blockedByFailure
                    }
                  >
                    Cancelar despacho
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
