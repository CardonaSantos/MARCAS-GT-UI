import {
  CheckCircle2,
  PackageCheck,
  Printer,
  Pencil,
  Play,
  Truck,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import { useStore } from "@/Context/ContextSucursal";
import { dispatchReceiptPath } from "@/features/comprobantes/common/receipt.helpers";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useUrlTabState } from "@/features/common/navigation/use-url-tab-state";
import {
  useCompleteDispatchPreparation,
  useRetryDispatchOperation,
} from "@/features/despachos/api/dispatch.mutations";
import {
  useDispatch,
  useDispatchOperationsByDispatch,
} from "@/features/despachos/api/dispatch.queries";
import {
  DISPATCH_DETAIL_TABS,
  DISPATCH_STATE_LABELS,
  DISPATCH_STATE_TONES,
  type DispatchDetailTab,
} from "@/features/despachos/common/dispatch.constants";
import { DispatchActivity } from "@/features/despachos/components/dispatch-activity";
import { DispatchDetailSummary } from "@/features/despachos/components/dispatch-detail-summary";
import { DispatchLinesTable } from "@/features/despachos/components/dispatch-lines-table";
import { DispatchLogisticsPanel } from "@/features/despachos/components/dispatch-logistics-panel";
import { DispatchOperationsTable } from "@/features/despachos/components/dispatch-operations-table";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";
import { AppTabs } from "@/ui/components/app/primitives/app-tabs";

export default function DispatchDetailPage() {
  const params = useParams();
  const location = useLocation();
  const id = Number(params.id);
  const role = useStore((state) => state.userRol);
  const canOperate = role === "ADMIN" || role === "BODEGA";
  const currentUrl = location.pathname + location.search;
  const backTo = getReturnRoute(location.state, "/marcas-gt/despachos");

  const query = useDispatch(id);
  const operationsQuery = useDispatchOperationsByDispatch(id, {
    page: 1,
    limit: 100,
  });
  const complete = useCompleteDispatchPreparation();
  const retry = useRetryDispatchOperation();
  const [retryingId, setRetryingId] = useState<number | null>(null);

  const tabState = useUrlTabState<DispatchDetailTab>({
    defaultValue: "resumen",
    allowedValues: DISPATCH_DETAIL_TABS,
  });

  const dispatch = query.data;
  const recentReceiptId = (location.state as { justDispatchedOperationId?: number } | null)?.justDispatchedOperationId;
  const latestAppliedOutput = (operationsQuery.data?.data ?? []).find((op) =>
    op.tipo === "SALIDA_DESPACHO" && op.estado === "APLICADA");
  const operations = operationsQuery.data?.data ?? [];
  const failedTypes = new Set(
    operations
      .filter((operation) => operation.estado === "FALLIDA")
      .map((operation) => operation.tipo),
  );

  const blockStart = failedTypes.has("RESERVA_PREPARACION");
  const blockOutput = failedTypes.has("SALIDA_DESPACHO");
  const blockCancel = failedTypes.has("LIBERACION_RESERVA");

  const tabs = dispatch
    ? [
        {
          value: "resumen" as const,
          label: "Resumen",
          content: <DispatchDetailSummary dispatch={dispatch} />,
        },
        {
          value: "productos" as const,
          label: "Productos",
          badge: (
            <AppBadge tone="neutral" size="xs">
              {dispatch.detalles.length}
            </AppBadge>
          ),
          content: <DispatchLinesTable data={dispatch.detalles} />,
        },
        {
          value: "operaciones" as const,
          label: "Operaciones",
          badge:
            dispatch.operaciones.fallidas > 0 ? (
              <AppBadge tone="danger" size="xs">
                {dispatch.operaciones.fallidas}
              </AppBadge>
            ) : undefined,
          content: (
            <DispatchOperationsTable
              data={operations}
              isLoading={operationsQuery.isLoading}
              isFetching={operationsQuery.isFetching}
              error={operationsQuery.error}
              onRetryQuery={() => void operationsQuery.refetch()}
              canOperate={canOperate}
              canPrintReceipt={canOperate}
              retryingOperationId={retryingId}
              onRetryOperation={async (operationId) => {
                setRetryingId(operationId);
                try {
                  await retry.mutateAsync({ operationId });
                } finally {
                  setRetryingId(null);
                }
              }}
            />
          ),
        },
        {
          value: "actividad" as const,
          label: "Actividad",
          content: (
            <DispatchActivity
              dispatchId={id}
              canAddObservation={dispatch.acciones.puedeAgregarObservacion}
            />
          ),
        },
        {
          value: "logistica" as const,
          label: "Logística",
          content: <DispatchLogisticsPanel dispatch={dispatch} />,
        },
      ]
    : [];

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title={
            dispatch ? (
              <span className="inline-flex flex-wrap items-center gap-2">
                {dispatch.numero}
                <AppBadge
                  tone={DISPATCH_STATE_TONES[dispatch.estado]}
                  size="xs"
                >
                  {DISPATCH_STATE_LABELS[dispatch.estado]}
                </AppBadge>
              </span>
            ) : (
              "Detalle de despacho"
            )
          }
          description={
            dispatch
              ? dispatch.pedido.numero +
                " · " +
                dispatch.cliente.nombreCompleto +
                " · " +
                dispatch.bodega.nombre
              : undefined
          }
          backTo={backTo}
          backLabel="Volver a despachos"
          actions={
            dispatch ? (
              <>
                {canOperate && latestAppliedOutput ? (
                  <AppButton asChild variant="secondary" size="sm">
                    <Link to={dispatchReceiptPath(id, latestAppliedOutput.id)} state={{ from: currentUrl }}>
                      <Printer className="h-4 w-4" /> Comprobante de salida
                    </Link>
                  </AppButton>
                ) : null}
                {canOperate && dispatch.acciones.puedeEditar ? (
                  <AppButton asChild variant="secondary" size="sm">
                    <Link
                      to={"/marcas-gt/despachos/" + id + "/editar"}
                      state={{ from: currentUrl, listFrom: backTo }}
                    >
                      <Pencil className="h-4 w-4" />
                      Editar
                    </Link>
                  </AppButton>
                ) : null}

                {canOperate &&
                dispatch.acciones.puedeIniciarPreparacion &&
                !blockStart ? (
                  <AppButton asChild variant="primary" size="sm">
                    <Link
                      to={
                        "/marcas-gt/despachos/" +
                        id +
                        "/iniciar-preparacion"
                      }
                      state={{ from: currentUrl, listFrom: backTo }}
                    >
                      <Play className="h-4 w-4" />
                      Iniciar preparación
                    </Link>
                  </AppButton>
                ) : null}

                {canOperate &&
                dispatch.acciones.puedeActualizarPreparacion ? (
                  <AppButton asChild variant="secondary" size="sm">
                    <Link
                      to={"/marcas-gt/despachos/" + id + "/preparacion"}
                      state={{ from: currentUrl, listFrom: backTo }}
                    >
                      <PackageCheck className="h-4 w-4" />
                      Actualizar preparación
                    </Link>
                  </AppButton>
                ) : null}

                {canOperate &&
                dispatch.acciones.puedeFinalizarPreparacion ? (
                  <AppConfirmDialog
                    title="Finalizar preparación"
                    description="Todas las líneas quedarán confirmadas como preparadas y la orden podrá registrar salida física."
                    preset="success"
                    confirmText="Finalizar preparación"
                    loadingText="Finalizando..."
                    isLoading={complete.isPending}
                    trigger={
                      <AppButton
                        variant="primary"
                        size="sm"
                        leftIcon={<CheckCircle2 />}
                      >
                        Finalizar preparación
                      </AppButton>
                    }
                    onConfirm={async () => {
                      await complete.mutateAsync({ id });
                    }}
                  />
                ) : null}

                {canOperate &&
                dispatch.acciones.puedeDespachar &&
                !blockOutput ? (
                  <AppButton asChild variant="primary" size="sm">
                    <Link
                      to={"/marcas-gt/despachos/" + id + "/salida"}
                      state={{ from: currentUrl, listFrom: backTo }}
                    >
                      <Truck className="h-4 w-4" />
                      Registrar salida
                    </Link>
                  </AppButton>
                ) : null}

                {canOperate &&
                dispatch.acciones.puedeCancelar &&
                !blockCancel ? (
                  <AppButton asChild variant="danger" size="sm">
                    <Link
                      to={"/marcas-gt/despachos/" + id + "/cancelar"}
                      state={{ from: currentUrl, listFrom: backTo }}
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

        {canOperate && recentReceiptId ? (
          <AppAlert tone="success" title="Salida registrada correctamente"
            description="Puedes revisar y emitir el comprobante de esta salida sin buscar la operación."
            action={<AppButton asChild variant="secondary" size="sm">
              <Link to={dispatchReceiptPath(id, recentReceiptId)} state={{ from: currentUrl }}>
                <Printer className="h-4 w-4" /> Ver comprobante de esta salida
              </Link>
            </AppButton>} />
        ) : null}
        <AppDataState
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && !dispatch}
          emptyTitle="Despacho no encontrado"
          emptyDescription="La orden solicitada no existe o no está disponible para tu usuario."
        >
          {dispatch ? (
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
