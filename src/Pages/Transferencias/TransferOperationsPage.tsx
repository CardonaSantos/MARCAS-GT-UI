import { RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

import { useStore } from "@/Context/ContextSucursal";
import { useBodegaSelectables } from "@/features/bodegas/api/bodega.queries";
import { useUserSelectables } from "@/features/common/catalogs/catalog.queries";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  useRegisterTransferOutbound,
  useRegisterTransferReceipt,
} from "@/features/transferencias/api/transfer.mutations";
import { useTransferOperationList } from "@/features/transferencias/api/transfer.queries";
import type {
  TransferOperation,
  TransferOperationState,
  TransferOperationType,
} from "@/features/transferencias/api/transfer.types";
import {
  TRANSFER_OPERATION_STATES,
  TRANSFER_OPERATION_STATE_LABELS,
  TRANSFER_OPERATION_TYPES,
  TRANSFER_OPERATION_TYPE_LABELS,
} from "@/features/transferencias/common/transfer.constants";
import { TransferOperationsTable } from "@/features/transferencias/components/transfer-operations-table";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppInput } from "@/ui/components/app/primitives/app-input";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function TransferOperationsPage() {
  const role = useStore((state) => state.userRol);
  const canRetry = role === "ADMIN" || role === "BODEGA";

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [tipo, setTipo] = useState<TransferOperationType | null>(null);
  const [estado, setEstado] = useState<TransferOperationState | null>(null);
  const [bodegaOrigenId, setBodegaOrigenId] = useState<number | null>(null);
  const [bodegaDestinoId, setBodegaDestinoId] = useState<number | null>(null);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [retryOperation, setRetryOperation] =
    useState<TransferOperation | null>(null);

  const filters = useMemo(
    () => ({
      page: pageIndex + 1,
      limit: pageSize,
      tipo: tipo ?? undefined,
      estado: estado ?? undefined,
      bodegaOrigenId: bodegaOrigenId ?? undefined,
      bodegaDestinoId: bodegaDestinoId ?? undefined,
      usuarioId: usuarioId ?? undefined,
      fechaDesde: fechaDesde || undefined,
      fechaHasta: fechaHasta || undefined,
    }),
    [
      pageIndex,
      pageSize,
      tipo,
      estado,
      bodegaOrigenId,
      bodegaDestinoId,
      usuarioId,
      fechaDesde,
      fechaHasta,
    ],
  );

  const query = useTransferOperationList(filters);
  const bodegasQuery = useBodegaSelectables({ limit: 100 });
  const usersQuery = useUserSelectables();
  const outboundMutation = useRegisterTransferOutbound();
  const receiptMutation = useRegisterTransferReceipt();

  const meta = query.data?.meta;
  const retryBusy = outboundMutation.isPending || receiptMutation.isPending;

  const reset = () => {
    setPageIndex(0);
    setTipo(null);
    setEstado(null);
    setBodegaOrigenId(null);
    setBodegaDestinoId(null);
    setUsuarioId(null);
    setFechaDesde("");
    setFechaHasta("");
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

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Operaciones de transferencias"
          description="Supervisa salidas y recepciones físicas, operaciones pendientes o fallidas."
          backTo="/marcas-gt/transferencias"
          backLabel="Volver a transferencias"
        />

        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          <AppSingleSelect<TransferOperationType>
            value={tipo}
            options={TRANSFER_OPERATION_TYPES.map((value) => ({
              value,
              label: TRANSFER_OPERATION_TYPE_LABELS[value],
            }))}
            onChange={(value) => {
              setTipo(value);
              setPageIndex(0);
            }}
            placeholder="Tipo de operación"
          />

          <AppSingleSelect<TransferOperationState>
            value={estado}
            options={TRANSFER_OPERATION_STATES.map((value) => ({
              value,
              label: TRANSFER_OPERATION_STATE_LABELS[value],
            }))}
            onChange={(value) => {
              setEstado(value);
              setPageIndex(0);
            }}
            placeholder="Estado"
          />

          <AppSingleSelect<number>
            value={bodegaOrigenId}
            options={(bodegasQuery.data ?? []).map((item) => ({
              value: item.id,
              label: item.codigo + " · " + item.nombre,
            }))}
            onChange={(value) => {
              setBodegaOrigenId(value);
              setPageIndex(0);
            }}
            placeholder="Bodega origen"
          />

          <AppSingleSelect<number>
            value={bodegaDestinoId}
            options={(bodegasQuery.data ?? []).map((item) => ({
              value: item.id,
              label: item.codigo + " · " + item.nombre,
            }))}
            onChange={(value) => {
              setBodegaDestinoId(value);
              setPageIndex(0);
            }}
            placeholder="Bodega destino"
          />

          <AppSingleSelect<number>
            value={usuarioId}
            options={(usersQuery.data ?? [])
              .filter((item) => item.rol === "ADMIN" || item.rol === "BODEGA")
              .map((item) => ({
                value: item.id,
                label: item.nombre,
              }))}
            onChange={(value) => {
              setUsuarioId(value);
              setPageIndex(0);
            }}
            placeholder="Usuario"
          />

          <AppInput
            type="date"
            value={fechaDesde}
            onChange={(event) => {
              setFechaDesde(event.target.value);
              setPageIndex(0);
            }}
            aria-label="Fecha desde"
          />

          <AppInput
            type="date"
            value={fechaHasta}
            onChange={(event) => {
              setFechaHasta(event.target.value);
              setPageIndex(0);
            }}
            aria-label="Fecha hasta"
          />

          <AppButton
            variant="secondary"
            size="sm"
            leftIcon={<RotateCcw />}
            onClick={reset}
          >
            Limpiar filtros
          </AppButton>
        </div>

        <TransferOperationsTable
          operations={query.data?.data ?? []}
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          error={query.error}
          onRetryQuery={() => void query.refetch()}
          onRetryOperation={
            canRetry ? (operation) => setRetryOperation(operation) : undefined
          }
          showTransfer
          pagination={{
            pageIndex,
            pageSize,
            totalRows: meta?.total ?? 0,
            pageCount: Math.max(meta?.totalPages ?? 1, 1),
            onPaginationChange: (next) => {
              setPageIndex(next.pageIndex);
              setPageSize(next.pageSize);
            },
          }}
        />

        <AppConfirmDialog
          open={retryOperation !== null}
          onOpenChange={(open) => {
            if (!open && !retryBusy) setRetryOperation(null);
          }}
          preset="warning"
          title="Reintentar operación"
          description="Se reutilizará exactamente la misma clave de idempotencia y las mismas cantidades. No se creará una operación física nueva."
          confirmText="Reintentar"
          loadingText="Reintentando..."
          isLoading={retryBusy}
          onConfirm={confirmRetry}
          contentCard
        >
          {retryOperation ? (
            <div className="space-y-2 text-sm">
              <p>
                <strong>Transferencia:</strong> #
                {retryOperation.transferenciaId}
              </p>
              <p>
                <strong>Operación:</strong> #{retryOperation.id}
              </p>
              <p>
                <strong>Tipo:</strong>{" "}
                {TRANSFER_OPERATION_TYPE_LABELS[retryOperation.tipo]}
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
