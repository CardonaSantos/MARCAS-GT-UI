import {
  Banknote,
  CheckCircle2,
  Pencil,
  Send,
  Truck,
  WalletCards,
  XCircle,
} from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";

import { useStore } from "@/Context/ContextSucursal";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useUrlTabState } from "@/features/common/navigation/use-url-tab-state";
import {
  useConfirmOrder,
  useRequestOrderValidation,
} from "@/features/pedidos/api/order.mutations";
import { useOrder } from "@/features/pedidos/api/order.queries";
import {
  ORDER_DETAIL_TABS,
  ORDER_STATE_LABELS,
  ORDER_STATE_TONES,
  type OrderDetailTab,
} from "@/features/pedidos/common/order.constants";
import { OrderActivity } from "@/features/pedidos/components/order-activity";
import { OrderDetailSummary } from "@/features/pedidos/components/order-detail-summary";
import { OrderOperationsPanel } from "@/features/pedidos/components/order-operations-panel";
import { OrderProductTable } from "@/features/pedidos/components/order-product-table";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";
import { AppTabs } from "@/ui/components/app/primitives/app-tabs";

const DISPATCHABLE_STATES = [
  "CONFIRMADO",
  "EN_PREPARACION",
  "PARCIALMENTE_DESPACHADO",
] as const;

export default function OrderDetailPage() {
  const params = useParams();
  const location = useLocation();
  const id = Number(params.id);
  const role = useStore((state) => state.userRol);

  const backTo = getReturnRoute(location.state, "/marcas-gt/pedidos");
  const currentUrl = location.pathname + location.search;
  const query = useOrder(id);
  const requestValidation = useRequestOrderValidation();
  const confirmOrder = useConfirmOrder();

  const tabState = useUrlTabState<OrderDetailTab>({
    defaultValue: "resumen",
    allowedValues: ORDER_DETAIL_TABS,
  });

  const order = query.data;
  const canWrite = role === "ADMIN" || role === "VENDEDOR" || role === "BODEGA";
  const canRegisterPayment = ["ADMIN", "CONTABILIDAD", "VENDEDOR"].includes(
    role ?? "",
  );
  const canReadCredit = ["ADMIN", "VENDEDOR", "CONTABILIDAD"].includes(
    role ?? "",
  );
  const linkedCredit =
    order?.solicitudesCredito.find(
      (application) => !["RECHAZADA", "CANCELADA"].includes(application.estado),
    ) ??
    order?.solicitudesCredito[0] ??
    null;
  const canStartCredit =
    canWrite &&
    order?.condicionPago === "CREDITO" &&
    order.estado === "PENDIENTE_VALIDACION" &&
    !linkedCredit;

  const canPlanDispatch =
    (role === "ADMIN" || role === "BODEGA") &&
    Boolean(
      order &&
      DISPATCHABLE_STATES.includes(
        order.estado as (typeof DISPATCHABLE_STATES)[number],
      ) &&
      order.progreso.unidadesPendientesDespacho > 0,
    );

  const tabs = order
    ? [
        {
          value: "resumen" as const,
          label: "Resumen",
          content: <OrderDetailSummary order={order} />,
        },
        {
          value: "productos" as const,
          label: "Productos",
          badge: (
            <AppBadge tone="neutral" size="xs">
              {order.detalles.length}
            </AppBadge>
          ),
          content: <OrderProductTable data={order.detalles} />,
        },
        {
          value: "operacion" as const,
          label: "Operación",
          content: <OrderOperationsPanel order={order} />,
        },
        {
          value: "actividad" as const,
          label: "Actividad",
          content: <OrderActivity orderId={id} />,
        },
      ]
    : [];

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title={
            order ? (
              <span className="inline-flex flex-wrap items-center gap-2">
                {order.numero}
                <AppBadge tone={ORDER_STATE_TONES[order.estado]} size="xs">
                  {ORDER_STATE_LABELS[order.estado]}
                </AppBadge>
                {order.acciones.requiereCredito ? (
                  <AppBadge tone="warning" size="xs">
                    Requiere crédito
                  </AppBadge>
                ) : null}
              </span>
            ) : (
              "Detalle de pedido"
            )
          }
          description={
            order
              ? order.cliente.nombreCompleto + " · " + order.vendedor.nombre
              : undefined
          }
          backTo={backTo}
          backLabel="Volver a pedidos"
          actions={
            order ? (
              <>
                {order.acciones.puedeEditar && canWrite ? (
                  <AppButton asChild variant="secondary" size="sm">
                    <Link
                      to={"/marcas-gt/pedidos/" + id + "/editar"}
                      state={{
                        from: currentUrl,
                        listFrom: backTo,
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                      Editar
                    </Link>
                  </AppButton>
                ) : null}

                {order.acciones.puedeSolicitarValidacion && canWrite ? (
                  <AppConfirmDialog
                    title="Solicitar validación"
                    description="El pedido dejará de ser editable y pasará a revisión. Debe contener al menos un producto."
                    preset="send"
                    confirmText="Enviar a validación"
                    loadingText="Enviando..."
                    isLoading={requestValidation.isPending}
                    trigger={
                      <AppButton
                        variant="secondary"
                        size="sm"
                        leftIcon={<Send />}
                        disabled={order.detalles.length === 0}
                      >
                        Solicitar validación
                      </AppButton>
                    }
                    onConfirm={async () => {
                      await requestValidation.mutateAsync({ id });
                    }}
                  />
                ) : null}

                {role === "ADMIN" && order.acciones.puedeConfirmar ? (
                  <AppConfirmDialog
                    title="Confirmar pedido"
                    description="El pedido quedará confirmado y podrá continuar a reserva y despacho."
                    preset="success"
                    confirmText="Confirmar pedido"
                    loadingText="Confirmando..."
                    isLoading={confirmOrder.isPending}
                    trigger={
                      <AppButton
                        variant="primary"
                        size="sm"
                        leftIcon={<CheckCircle2 />}
                      >
                        Confirmar
                      </AppButton>
                    }
                    onConfirm={async () => {
                      await confirmOrder.mutateAsync({ id });
                    }}
                  />
                ) : null}

                {canReadCredit &&
                order.condicionPago === "CREDITO" &&
                linkedCredit ? (
                  <AppButton asChild variant="secondary" size="sm">
                    <Link
                      to={"/marcas-gt/creditos/solicitudes/" + linkedCredit.id}
                      state={{
                        from: currentUrl,
                        listFrom: backTo,
                      }}
                    >
                      <WalletCards className="h-4 w-4" />
                      Ver crédito
                    </Link>
                  </AppButton>
                ) : null}

                {canStartCredit ? (
                  <AppButton asChild variant="primary" size="sm">
                    <Link
                      to={
                        "/marcas-gt/creditos/solicitudes/nueva?pedidoId=" + id
                      }
                      state={{
                        from: currentUrl,
                        listFrom: backTo,
                      }}
                    >
                      <WalletCards className="h-4 w-4" />
                      Tramitar crédito
                    </Link>
                  </AppButton>
                ) : null}

                {canRegisterPayment && order.estado !== "CANCELADO" ? (
                  <AppButton asChild variant="secondary" size="sm">
                    <Link
                      to={
                        "/marcas-gt/pagos/nuevo?clienteId=" +
                        order.cliente.id +
                        "&pedidoId=" +
                        id
                      }
                      state={{
                        from: currentUrl,
                        listFrom: backTo,
                      }}
                    >
                      <Banknote className="h-4 w-4" />
                      Registrar pago
                    </Link>
                  </AppButton>
                ) : null}

                {canPlanDispatch ? (
                  <AppButton asChild variant="primary" size="sm">
                    <Link
                      to={"/marcas-gt/despachos/nuevo?pedidoId=" + id}
                      state={{
                        from: currentUrl,
                        listFrom: backTo,
                      }}
                    >
                      <Truck className="h-4 w-4" />
                      Planificar despacho
                    </Link>
                  </AppButton>
                ) : null}

                {order.acciones.puedeCancelar && canWrite ? (
                  <AppButton asChild variant="danger" size="sm">
                    <Link
                      to={"/marcas-gt/pedidos/" + id + "/cancelar"}
                      state={{
                        from: currentUrl,
                        listFrom: backTo,
                      }}
                    >
                      <XCircle className="h-4 w-4" />
                      Cancelar
                    </Link>
                  </AppButton>
                ) : null}
              </>
            ) : undefined
          }
        />

        <AppDataState
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && !order}
          emptyTitle="Pedido no encontrado"
          emptyDescription="El pedido solicitado no existe o no está disponible para tu usuario."
        >
          {order ? (
            <AppTabs
              tabs={tabs}
              value={tabState.value}
              onValueChange={tabState.setValue}
              variant="minimal"
              size="sm"
            />
          ) : null}
        </AppDataState>
      </AppStack>
    </AppContainer>
  );
}
