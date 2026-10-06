import { zodResolver } from "@hookform/resolvers/zod";
import { XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  getListReturnRoute,
  getReturnRoute,
} from "@/features/common/navigation/route-state";
import { useCancelOrder } from "@/features/pedidos/api/order.mutations";
import { useOrder } from "@/features/pedidos/api/order.queries";
import {
  cancelOrderSchema,
  type CancelOrderFormValues,
} from "@/features/pedidos/schemas/order.schemas";
import {
  AppForm,
  AppFormSubmit,
  AppFormTextarea,
} from "@/ui/components/app/form";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function CancelOrderPage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const id = Number(params.id);
  const detailUrl = "/marcas-gt/pedidos/" + id;
  const backTo = getReturnRoute(location.state, detailUrl);
  const listFrom = getListReturnRoute(location.state, "/marcas-gt/pedidos");

  const query = useOrder(id);
  const mutation = useCancelOrder();

  const form = useForm<CancelOrderFormValues>({
    resolver: zodResolver(cancelOrderSchema),
    defaultValues: { motivo: "" },
    mode: "onTouched",
  });

  const onSubmit = async (values: CancelOrderFormValues) => {
    if (!query.data?.acciones.puedeCancelar) return;

    await mutation.mutateAsync({
      id,
      payload: { motivo: values.motivo.trim() },
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
          title="Cancelar pedido"
          description={query.data?.numero}
          backTo={backTo}
          backState={{ from: listFrom }}
          backLabel="Volver al detalle"
        />

        <AppDataState
          isLoading={query.isLoading}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && !query.data}
          emptyTitle="Pedido no encontrado"
        >
          {query.data?.acciones.puedeCancelar ? (
            <AppForm form={form} onSubmit={onSubmit}>
              <AppStack gap="md">
                <AppCard
                  title="Motivo de cancelación"
                  description="El pedido sólo puede cancelarse en BORRADOR o PENDIENTE_VALIDACION. El motivo quedará auditado."
                  icon={<XCircle />}
                  size="sm"
                >
                  <AppFormTextarea<CancelOrderFormValues>
                    name="motivo"
                    label="Motivo"
                    required
                    maxLength={500}
                    rows={5}
                    placeholder="Describe por qué se cancela el pedido."
                  />
                </AppCard>

                <div className="flex justify-end gap-2">
                  <AppButton asChild variant="secondary">
                    <Link to={backTo} state={{ from: listFrom }}>
                      Volver
                    </Link>
                  </AppButton>

                  <AppFormSubmit<CancelOrderFormValues>
                    variant="danger"
                    leftIcon={<XCircle />}
                    loadingText="Cancelando..."
                    disableWhenInvalid
                  >
                    Cancelar pedido
                  </AppFormSubmit>
                </div>
              </AppStack>
            </AppForm>
          ) : query.data ? (
            <AppCard
              title="El pedido no puede cancelarse"
              description="El estado actual ya no permite cancelar este pedido."
              size="sm"
            />
          ) : null}
        </AppDataState>
      </AppStack>
    </AppContainer>
  );
}
