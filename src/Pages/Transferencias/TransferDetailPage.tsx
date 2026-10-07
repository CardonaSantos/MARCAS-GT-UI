import {
  CheckCircle2,
  PackageCheck,
  Pencil,
  Send,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import { useStore } from "@/Context/ContextSucursal";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useUrlTabState } from "@/features/common/navigation/use-url-tab-state";
import {
  useCancelTransfer,
  usePrepareTransfer,
  useRegisterTransferOutbound,
  useRegisterTransferReceipt,
} from "@/features/transferencias/api/transfer.mutations";
import {
  useTransfer,
  useTransferEvents,
  useTransferOperations,
} from "@/features/transferencias/api/transfer.queries";
import type { TransferOperation } from "@/features/transferencias/api/transfer.types";
import {
  TRANSFER_DETAIL_TABS,
  TRANSFER_STATE_LABELS,
  type TransferDetailTab,
  transferStateTone,
} from "@/features/transferencias/common/transfer.constants";
import {
  TransferActivity,
  TransferOverview,
  TransferProducts,
} from "@/features/transferencias/components/transfer-detail-panels";
import { TransferOperationsTable } from "@/features/transferencias/components/transfer-operations-table";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";
import { AppTabs } from "@/ui/components/app/primitives/app-tabs";
import { AppTextarea } from "@/ui/components/app/primitives/app-textarea";

export default function TransferDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const location = useLocation();
  const role = useStore((state) => state.userRol);
  const backTo = getReturnRoute(location.state, "/marcas-gt/transferencias");
  const currentUrl = location.pathname + location.search;

  const query = useTransfer(id);
  const operationsQuery = useTransferOperations(id, { page: 1, limit: 100 });
  const eventsQuery = useTransferEvents(id, { page: 1, limit: 100 });

  const prepareMutation = usePrepareTransfer();
  const cancelMutation = useCancelTransfer();
  const outboundMutation = useRegisterTransferOutbound();
  const receiptMutation = useRegisterTransferReceipt();

  const [prepareOpen, setPrepareOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [retryOperation, setRetryOperation] =
    useState<TransferOperation | null>(null);

  const tabState = useUrlTabState<TransferDetailTab>({
    defaultValue: "resumen",
    allowedValues: TRANSFER_DETAIL_TABS,
  });

  const transfer = query.data;
  const canOperate = role === "ADMIN" || role === "BODEGA";

  const confirmPrepare = async () => {
    await prepareMutation.mutateAsync({ id });
    setPrepareOpen(false);
  };

  const confirmCancel = async () => {
    if (cancelReason.trim().length < 3) return;
    await cancelMutation.mutateAsync({
      id,
      payload: { motivo: cancelReason.trim() },
    });
    setCancelReason("");
    setCancelOpen(false);
  };

  const confirmRetry = async () => {
    if (!retryOperation) return;

    if (retryOperation.tipo === "SALIDA") {
      await outboundMutation.mutateAsync({
        id: retryOperation.transferenciaId,
        payload: {
          claveIdempotencia: retryOperation.claveIdempotencia,
          documentoReferencia: retryOperation.documentoReferencia,
          observaciones: retryOperation.observaciones,
          ocurridaEn: retryOperation.ocurridaEn,
        },
      });
    } else {
      await receiptMutation.mutateAsync({
        id: retryOperation.transferenciaId,
        payload: {
          claveIdempotencia: retryOperation.claveIdempotencia,
          documentoReferencia: retryOperation.documentoReferencia,
          observaciones: retryOperation.observaciones,
          ocurridaEn: retryOperation.ocurridaEn,
          detalles: retryOperation.detalles.map((line) => ({
            transferenciaDetalleId: line.transferenciaDetalleId,
            cantidad: line.cantidad,
          })),
        },
      });
    }

    setRetryOperation(null);
  };

  const tabs = transfer
    ? [
        {
          value: "resumen" as const,
          label: "Resumen",
          content: <TransferOverview transfer={transfer} />,
        },
        {
          value: "productos" as const,
          label: "Productos",
          badge: (
            <AppBadge tone="neutral" size="xs">
              {transfer.detalles.length}
            </AppBadge>
          ),
          content: <TransferProducts transfer={transfer} />,
        },
        {
          value: "operaciones" as const,
          label: "Operaciones",
          badge:
            (operationsQuery.data?.meta.total ?? 0) > 0 ? (
              <AppBadge tone="neutral" size="xs">
                {operationsQuery.data?.meta.total ?? 0}
              </AppBadge>
            ) : undefined,
          content: (
            <TransferOperationsTable
              operations={operationsQuery.data?.data ?? []}
              isLoading={operationsQuery.isLoading}
              isFetching={operationsQuery.isFetching}
              error={operationsQuery.error}
              onRetryQuery={() => void operationsQuery.refetch()}
              onRetryOperation={
                canOperate ? (operation) => setRetryOperation(operation) : undefined
              }
            />
          ),
        },
        {
          value: "actividad" as const,
          label: "Actividad",
          content: (
            <TransferActivity
              events={eventsQuery.data?.data ?? []}
              isLoading={eventsQuery.isLoading}
              isFetching={eventsQuery.isFetching}
              error={eventsQuery.error}
              onRetry={() => void eventsQuery.refetch()}
            />
          ),
        },
      ]
    : [];

  const retryBusy =
    outboundMutation.isPending || receiptMutation.isPending;

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title={
            transfer ? (
              <span className="inline-flex flex-wrap items-center gap-2">
                {"Transferencia #" + transfer.id}
                <AppBadge
                  tone={transferStateTone(transfer.estado)}
                  size="xs"
                >
                  {TRANSFER_STATE_LABELS[transfer.estado]}
                </AppBadge>
              </span>
            ) : (
              "Detalle de transferencia"
            )
          }
          description={
            transfer
              ? transfer.bodegaOrigen.nombre +
                " → " +
                transfer.bodegaDestino.nombre
              : undefined
          }
          backTo={backTo}
          backLabel="Volver a transferencias"
          actions={
            transfer ? (
              <div className="flex flex-wrap gap-2">
                {canOperate && transfer.acciones.puedeEditar ? (
                  <AppButton asChild variant="secondary" size="sm">
                    <Link
                      to={"/marcas-gt/transferencias/" + id + "/editar"}
                      state={{ from: currentUrl }}
                    >
                      <Pencil className="h-4 w-4" />
                      Editar
                    </Link>
                  </AppButton>
                ) : null}

                {canOperate && transfer.acciones.puedePreparar ? (
                  <AppButton
                    variant="primary"
                    size="sm"
                    leftIcon={<CheckCircle2 />}
                    onClick={() => setPrepareOpen(true)}
                  >
                    Preparar
                  </AppButton>
                ) : null}

                {canOperate && transfer.acciones.puedeEnviar ? (
                  <AppButton asChild variant="primary" size="sm">
                    <Link
                      to={"/marcas-gt/transferencias/" + id + "/salida"}
                      state={{ from: currentUrl }}
                    >
                      <Send className="h-4 w-4" />
                      Registrar salida
                    </Link>
                  </AppButton>
                ) : null}

                {canOperate && transfer.acciones.puedeRecibir ? (
                  <AppButton asChild variant="primary" size="sm">
                    <Link
                      to={"/marcas-gt/transferencias/" + id + "/recibir"}
                      state={{ from: currentUrl }}
                    >
                      <PackageCheck className="h-4 w-4" />
                      Registrar recepción
                    </Link>
                  </AppButton>
                ) : null}

                {canOperate && transfer.acciones.puedeCancelar ? (
                  <AppButton
                    variant="secondary"
                    size="sm"
                    leftIcon={<XCircle />}
                    onClick={() => {
                      setCancelReason("");
                      setCancelOpen(true);
                    }}
                  >
                    Cancelar transferencia
                  </AppButton>
                ) : null}
              </div>
            ) : undefined
          }
        />

        <AppDataState
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && !transfer}
          emptyTitle="Transferencia no encontrada"
          emptyDescription="La transferencia no existe o no está disponible."
        >
          {transfer ? (
            <AppTabs
              tabs={tabs}
              value={tabState.value}
              onValueChange={tabState.setValue}
              variant="minimal"
              size="sm"
            />
          ) : null}
        </AppDataState>

        <AppConfirmDialog
          open={prepareOpen}
          onOpenChange={setPrepareOpen}
          preset="warning"
          title="Preparar transferencia"
          description="El server validará disponibilidad actual en la bodega origen. PREPARAR no reserva ni descuenta inventario."
          confirmText="Validar y preparar"
          loadingText="Validando..."
          isLoading={prepareMutation.isPending}
          confirmDisabled={!transfer || transfer.detalles.length === 0}
          onConfirm={confirmPrepare}
          contentCard
        >
          {transfer ? (
            <div className="space-y-2 text-sm">
              <p>
                <strong>Origen:</strong> {transfer.bodegaOrigen.nombre}
              </p>
              <p>
                <strong>Destino:</strong> {transfer.bodegaDestino.nombre}
              </p>
              <p>
                <strong>Productos:</strong> {transfer.detalles.length}
              </p>
              <p>
                <strong>Unidades:</strong>{" "}
                {transfer.progreso.unidadesSolicitadas}
              </p>
              <p className="text-[hsl(var(--app-muted-foreground))]">
                La disponibilidad puede cambiar después de preparar porque no existe reserva de stock en V1.
              </p>
            </div>
          ) : null}
        </AppConfirmDialog>

        <AppConfirmDialog
          open={cancelOpen}
          onOpenChange={(open) => {
            if (!open && !cancelMutation.isPending) {
              setCancelOpen(false);
              setCancelReason("");
            }
          }}
          preset="warning"
          title="Cancelar transferencia"
          description="Sólo se puede cancelar antes de registrar una salida física. El motivo quedará en la auditoría."
          confirmText="Cancelar transferencia"
          loadingText="Cancelando..."
          isLoading={cancelMutation.isPending}
          confirmDisabled={cancelReason.trim().length < 3}
          onConfirm={confirmCancel}
          contentCard
        >
          <div>
            <label
              htmlFor="transfer-cancel-reason"
              className="mb-1 block text-xs font-medium"
            >
              Motivo *
            </label>
            <AppTextarea
              id="transfer-cancel-reason"
              rows={4}
              maxLength={500}
              value={cancelReason}
              onChange={(event) => setCancelReason(event.target.value)}
              placeholder="Explica por qué se cancela el traslado..."
            />
          </div>
        </AppConfirmDialog>

        <AppConfirmDialog
          open={retryOperation !== null}
          onOpenChange={(open) => {
            if (!open && !retryBusy) setRetryOperation(null);
          }}
          preset="warning"
          title="Reintentar operación"
          description="Se reutilizarán la misma clave de idempotencia y las mismas cantidades. El server evita duplicar movimientos ya aplicados."
          confirmText="Reintentar"
          loadingText="Reintentando..."
          isLoading={retryBusy}
          onConfirm={confirmRetry}
          contentCard
        >
          {retryOperation ? (
            <div className="space-y-2 text-sm">
              <p>
                <strong>Operación:</strong> #{retryOperation.id}
              </p>
              <p>
                <strong>Tipo:</strong> {retryOperation.tipo}
              </p>
              <p>
                <strong>Estado:</strong> {retryOperation.estado}
              </p>
              <p>
                <strong>Unidades:</strong> {retryOperation.unidades}
              </p>
              <p>
                <strong>Error:</strong>{" "}
                {retryOperation.errorAplicacion ?? "Sin detalle de error"}
              </p>
            </div>
          ) : null}
        </AppConfirmDialog>
      </AppStack>
    </AppContainer>
  );
}
