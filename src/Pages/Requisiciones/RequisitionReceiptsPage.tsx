import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { RotateCcw } from "lucide-react";

import { useStore } from "@/Context/ContextSucursal";
import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { useBodegaSelectables } from "@/features/bodegas/api/bodega.queries";
import {
  useProviderSelectables,
  useUserSelectables,
} from "@/features/common/catalogs/catalog.queries";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  formatDateTime,
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import { useRegisterRequisitionReceipt } from "@/features/requisiciones/api/requisition.mutations";
import { useRequisitionReceiptList } from "@/features/requisiciones/api/requisition.queries";
import type {
  RequisitionReceipt,
  RequisitionReceiptState,
} from "@/features/requisiciones/api/requisition.types";
import {
  REQUISITION_RECEIPT_STATES,
  REQUISITION_RECEIPT_STATE_LABELS,
  requisitionReceiptTone,
} from "@/features/requisiciones/common/requisition.constants";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppInput } from "@/ui/components/app/primitives/app-input";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";
import { AppStack } from "@/ui/components/app/primitives/app-stack";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import { createAppRowActionsColumn } from "@/ui/components/app/table/app-table-row-actions";

export default function RequisitionReceiptsPage() {
  const location = useLocation();
  const role = useStore((state) => state.userRol);
  const canRetry = role === "ADMIN" || role === "BODEGA";
  const currentUrl = location.pathname + location.search;

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [estado, setEstado] = useState<RequisitionReceiptState | null>(null);
  const [bodegaId, setBodegaId] = useState<number | null>(null);
  const [proveedorId, setProveedorId] = useState<number | null>(null);
  const [recibidoPorId, setRecibidoPorId] = useState<number | null>(null);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [retryReceipt, setRetryReceipt] = useState<RequisitionReceipt | null>(null);

  const filters = useMemo(
    () => ({
      page: pageIndex + 1,
      limit: pageSize,
      estado: estado ?? undefined,
      bodegaDestinoId: bodegaId ?? undefined,
      proveedorId: proveedorId ?? undefined,
      recibidoPorId: recibidoPorId ?? undefined,
      fechaDesde: fechaDesde || undefined,
      fechaHasta: fechaHasta || undefined,
    }),
    [pageIndex, pageSize, estado, bodegaId, proveedorId, recibidoPorId, fechaDesde, fechaHasta],
  );

  const query = useRequisitionReceiptList(filters);
  const bodegasQuery = useBodegaSelectables({ limit: 100 });
  const providersQuery = useProviderSelectables();
  const usersQuery = useUserSelectables();
  const retryMutation = useRegisterRequisitionReceipt();

  const meta = query.data?.meta;

  const retry = async () => {
    if (!retryReceipt) return;
    await retryMutation.mutateAsync({
      id: retryReceipt.requisicionId,
      payload: {
        claveIdempotencia: retryReceipt.claveIdempotencia,
        documentoReferencia: retryReceipt.documentoReferencia,
        observaciones: retryReceipt.observaciones,
        detalles: retryReceipt.detalles.map((line) => ({
          requisicionDetalleId: line.requisicionDetalleId,
          cantidad: line.cantidad,
          costoUnitario: line.costoUnitario,
        })),
      },
    });
    setRetryReceipt(null);
  };

  const reset = () => {
    setPageIndex(0);
    setEstado(null);
    setBodegaId(null);
    setProveedorId(null);
    setRecibidoPorId(null);
    setFechaDesde("");
    setFechaHasta("");
  };

  const columns: ColumnDef<RequisitionReceipt, unknown>[] = [
    {
      accessorKey: "id",
      header: "Recepción",
      size: 100,
      cell: ({ row }) => "#" + row.original.id,
    },
    {
      accessorKey: "requisicionId",
      header: "Requisición",
      size: 120,
      cell: ({ row }) => (
        <Link
          to={"/marcas-gt/requisiciones/" + row.original.requisicionId}
          state={{ from: currentUrl }}
          className="font-medium text-[hsl(var(--app-primary))] hover:underline"
        >
          {"#" + row.original.requisicionId}
        </Link>
      ),
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 110,
      cell: ({ row }) => (
        <AppBadge tone={requisitionReceiptTone(row.original.estado)} size="xs">
          {REQUISITION_RECEIPT_STATE_LABELS[row.original.estado]}
        </AppBadge>
      ),
    },
    {
      accessorKey: "documentoReferencia",
      header: "Documento",
      size: 150,
      cell: ({ row }) => row.original.documentoReferencia ?? "—",
    },
    {
      accessorKey: "unidades",
      header: "Unidades",
      size: 95,
      meta: { align: "right" },
    },
    {
      accessorKey: "costoTotal",
      header: "Costo",
      size: 115,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.costoTotal),
    },
    {
      id: "recibidoPor",
      header: "Recibido por",
      size: 160,
      cell: ({ row }) => row.original.recibidoPor.nombre,
    },
    {
      accessorKey: "recibidoEn",
      header: "Fecha",
      size: 160,
      cell: ({ row }) => formatDateTime(row.original.recibidoEn),
    },
    createAppRowActionsColumn<RequisitionReceipt>({
      actions: (row) => [
        {
          label: "Reintentar recepción",
          hidden: !canRetry || row.original.estado !== "FALLIDA",
          onClick: () => setRetryReceipt(row.original),
        },
      ],
    }),
  ];

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Recepciones de requisiciones"
          description="Consulta recepciones físicas y recupera operaciones fallidas sin duplicar movimientos de inventario."
          backTo="/marcas-gt/requisiciones"
          backLabel="Volver a requisiciones"
        />

        <AppDataTable
          data={query.data?.data ?? []}
          columns={columns}
          getRowId={(row) => String(row.id)}
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          error={query.error}
          onRetry={() => void query.refetch()}
          toolbar={
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
              <AppSingleSelect<RequisitionReceiptState>
                value={estado}
                options={REQUISITION_RECEIPT_STATES.map((value) => ({
                  value,
                  label: REQUISITION_RECEIPT_STATE_LABELS[value],
                }))}
                onChange={(value) => {
                  setEstado(value);
                  setPageIndex(0);
                }}
                placeholder="Estado"
              />
              <AppSingleSelect<number>
                value={bodegaId}
                options={(bodegasQuery.data ?? []).map((item) => ({
                  value: item.id,
                  label: item.codigo + " · " + item.nombre,
                }))}
                onChange={(value) => {
                  setBodegaId(value);
                  setPageIndex(0);
                }}
                placeholder="Bodega"
              />
              <AppSingleSelect<number>
                value={proveedorId}
                options={(providersQuery.data ?? []).map((item) => ({
                  value: item.id,
                  label: item.nombre,
                }))}
                onChange={(value) => {
                  setProveedorId(value);
                  setPageIndex(0);
                }}
                placeholder="Proveedor"
              />
              <AppSingleSelect<number>
                value={recibidoPorId}
                options={(usersQuery.data ?? [])
                  .filter((item) => item.rol === "ADMIN" || item.rol === "BODEGA")
                  .map((item) => ({
                    value: item.id,
                    label: item.nombre,
                  }))}
                onChange={(value) => {
                  setRecibidoPorId(value);
                  setPageIndex(0);
                }}
                placeholder="Recibido por"
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
          }
          paginationMode="server"
          pagination={{
            pageIndex,
            pageSize,
            totalRows: meta?.total ?? 0,
            pageCount: Math.max(meta?.totalPages ?? 1, 1),
            onPaginationChange: (next: PaginationState) => {
              setPageIndex(next.pageIndex);
              setPageSize(next.pageSize);
            },
          }}
          stickyHeader
          density="xs"
          responsiveMode="scroll"
          enableColumnVisibility
          emptyTitle="Sin recepciones"
          emptyDescription="No se encontraron recepciones con los filtros seleccionados."
        />

        <AppConfirmDialog
          open={retryReceipt !== null}
          onOpenChange={(open) => {
            if (!open && !retryMutation.isPending) setRetryReceipt(null);
          }}
          preset="warning"
          title="Reintentar recepción"
          description="Se reutilizará la misma clave de idempotencia. El server no volverá a duplicar movimientos ya aplicados."
          confirmText="Reintentar"
          loadingText="Reintentando..."
          isLoading={retryMutation.isPending}
          onConfirm={retry}
          contentCard
        >
          {retryReceipt ? (
            <div className="space-y-2 text-sm">
              <p><strong>Recepción:</strong> #{retryReceipt.id}</p>
              <p><strong>Requisición:</strong> #{retryReceipt.requisicionId}</p>
              <p><strong>Unidades:</strong> {retryReceipt.unidades}</p>
              <p><strong>Error:</strong> {retryReceipt.errorAplicacion ?? "No disponible"}</p>
            </div>
          ) : null}
        </AppConfirmDialog>
      </AppStack>
    </AppContainer>
  );
}
