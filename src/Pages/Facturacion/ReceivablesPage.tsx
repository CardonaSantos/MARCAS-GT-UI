import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { useCustomerSelectables } from "@/features/common/catalogs/catalog.queries";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  formatDateTime,
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import {
  useReceivables,
  useReceivableSummary,
} from "@/features/facturacion/api/billing.queries";
import type {
  ReceivableState,
  ReceivableView,
} from "@/features/facturacion/api/billing.types";
import {
  RECEIVABLE_STATES,
  RECEIVABLE_STATE_LABELS,
  RECEIVABLE_STATE_TONES,
} from "@/features/facturacion/common/billing.constants";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";
import { AppSearchInput } from "@/ui/components/app/primitives/app-search-input";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";
import { AppStack } from "@/ui/components/app/primitives/app-stack";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";

export default function ReceivablesPage() {
  const location = useLocation();
  const customers = useCustomerSelectables();
  const [page, setPage] = useState({ pageIndex: 0, pageSize: 20 });
  const [search, setSearch] = useState("");
  const [serverSearch, setServerSearch] = useState("");
  const [estado, setEstado] = useState<ReceivableState | null>(null);
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [soloVencidas, setSoloVencidas] = useState(false);

  const query = useReceivables({
    page: page.pageIndex + 1,
    limit: page.pageSize,
    search: serverSearch || undefined,
    estado: estado ?? undefined,
    clienteId: clienteId ?? undefined,
    soloVencidas: soloVencidas || undefined,
  });
  const summary = useReceivableSummary({});
  const meta = query.data?.meta;
  const from = location.pathname + location.search;

  const columns: ColumnDef<ReceivableView, unknown>[] = [
    {
      accessorKey: "id",
      header: "CxC",
      size: 80,
      cell: ({ row }) => "#" + row.original.id,
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 110,
      cell: ({ row }) => (
        <AppBadge tone={RECEIVABLE_STATE_TONES[row.original.estado]} size="xs">
          {RECEIVABLE_STATE_LABELS[row.original.estado]}
        </AppBadge>
      ),
    },
    {
      id: "cliente",
      header: "Cliente",
      size: 200,
      meta: { grow: true },
      cell: ({ row }) => row.original.cliente.nombreCompleto,
    },
    {
      id: "factura",
      header: "Factura",
      size: 120,
      cell: ({ row }) =>
        row.original.factura ? (
          <Link
            to={"/marcas-gt/facturacion/facturas/" + row.original.factura.id}
            state={{ from }}
            className="font-medium text-[hsl(var(--app-primary))] hover:underline"
          >
            #{row.original.factura.id}
          </Link>
        ) : (
          "—"
        ),
    },
    {
      accessorKey: "montoOriginal",
      header: "Original",
      size: 110,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.montoOriginal),
    },
    {
      accessorKey: "saldoPendiente",
      header: "Saldo",
      size: 110,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.saldoPendiente),
    },
    {
      accessorKey: "fechaVencimiento",
      header: "Vencimiento",
      size: 155,
      cell: ({ row }) => formatDateTime(row.original.fechaVencimiento),
    },
    {
      accessorKey: "diasVencida",
      header: "Días vencida",
      size: 100,
      meta: { align: "right" },
    },
  ];

  const paginationChange = (next: PaginationState) => setPage(next);

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Cuentas por cobrar"
          description="Cartera generada por facturación y saldo pendiente por cliente."
          backTo="/marcas-gt/facturacion/facturas"
          backLabel="Volver a facturación"
        />

        <AppGrid cols={{ base: 1, sm: 2, xl: 4 }} gap="sm">
          <AppCard title="Cuentas" size="sm">
            <p className="text-2xl font-semibold">{summary.data?.cuentas ?? "—"}</p>
          </AppCard>
          <AppCard title="Saldo pendiente" size="sm">
            <p className="text-2xl font-semibold">
              {summary.data ? formatMoney(summary.data.saldoPendiente) : "—"}
            </p>
          </AppCard>
          <AppCard title="Vigente" size="sm">
            <p className="text-2xl font-semibold">
              {summary.data ? formatMoney(summary.data.aging.vigente) : "—"}
            </p>
          </AppCard>
          <AppCard title="Más de 90 días" size="sm">
            <p className="text-2xl font-semibold">
              {summary.data ? formatMoney(summary.data.aging.d90_plus) : "—"}
            </p>
          </AppCard>
        </AppGrid>

        <AppDataTable
          data={query.data?.data ?? []}
          columns={columns}
          getRowId={(row) => String(row.id)}
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          error={query.error}
          onRetry={() => void query.refetch()}
          toolbar={
            <div className="grid w-full gap-2 md:grid-cols-2 xl:grid-cols-4">
              <AppSearchInput
                value={search}
                onValueChange={setSearch}
                onDebouncedChange={setServerSearch}
                placeholder="Buscar cliente o documento..."
              />
              <AppSingleSelect<ReceivableState>
                value={estado}
                options={RECEIVABLE_STATES.map((value) => ({
                  value,
                  label: RECEIVABLE_STATE_LABELS[value],
                }))}
                onChange={setEstado}
                placeholder="Estado"
              />
              <AppSingleSelect<number>
                value={clienteId}
                options={(customers.data ?? []).map((customer) => ({
                  value: customer.id,
                  label: customer.nombreCompleto,
                }))}
                onChange={setClienteId}
                placeholder="Cliente"
                isLoading={customers.isLoading}
              />
              <div className="flex items-center justify-end gap-2">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={soloVencidas}
                    onChange={(event) => setSoloVencidas(event.target.checked)}
                  />
                  Sólo vencidas
                </label>
                <AppButton
                  variant="secondary"
                  size="sm"
                  leftIcon={<RotateCcw />}
                  onClick={() => {
                    setSearch("");
                    setServerSearch("");
                    setEstado(null);
                    setClienteId(null);
                    setSoloVencidas(false);
                    setPage((current) => ({ ...current, pageIndex: 0 }));
                  }}
                >
                  Limpiar
                </AppButton>
              </div>
            </div>
          }
          paginationMode="server"
          pagination={{
            pageIndex: page.pageIndex,
            pageSize: page.pageSize,
            totalRows: meta?.total ?? 0,
            pageCount: Math.max(meta?.totalPages ?? 1, 1),
            onPaginationChange: paginationChange,
          }}
          density="xs"
          responsiveMode="scroll"
          stickyHeader
          emptyTitle="Sin cuentas por cobrar"
        />
      </AppStack>
    </AppContainer>
  );
}
