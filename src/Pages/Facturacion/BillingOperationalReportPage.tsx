import type { ColumnDef } from "@tanstack/react-table";
import { RotateCcw } from "lucide-react";
import { useLocation, useSearchParams } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  formatDecimal,
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { setSearchParam } from "@/features/common/navigation/url-state.utils";
import { useBillingOperationalReport } from "@/features/facturacion/api/billing.queries";
import type {
  BillingOperationalReport,
  FelOperationState,
  FiscalDocumentState,
  InvoiceState,
} from "@/features/facturacion/api/billing.types";
import {
  FISCAL_STATE_LABELS,
  INVOICE_STATE_LABELS,
} from "@/features/facturacion/common/billing.constants";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDatePicker } from "@/ui/components/app/primitives/app-date-picker";
import { AppStack } from "@/ui/components/app/primitives/app-stack";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";

type InvoiceRow = BillingOperationalReport["facturas"][number];
type FiscalRow = BillingOperationalReport["documentosFiscales"][number];
type FelRow = BillingOperationalReport["operacionesFel"][number];

export default function BillingOperationalReportPage() {
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const backTo = getReturnRoute(location.state, "/marcas-gt/facturacion/facturas");
  const fechaDesde = params.get("fechaDesde") ?? "";
  const fechaHasta = params.get("fechaHasta") ?? "";
  const query = useBillingOperationalReport({
    fechaDesde: fechaDesde || undefined,
    fechaHasta: fechaHasta || undefined,
  });
  const report = query.data;

  const update = (patch: Record<string, string | null | undefined>) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([key, value]) => setSearchParam(next, key, value));
    setParams(next, { replace: true });
  };

  const invoiceColumns: ColumnDef<InvoiceRow, unknown>[] = [
    {
      accessorKey: "estado",
      header: "Estado factura",
      size: 180,
      cell: ({ row }) => INVOICE_STATE_LABELS[row.original.estado as InvoiceState],
    },
    { accessorKey: "cantidad", header: "Cantidad", size: 100, meta: { align: "right" } },
    {
      accessorKey: "monto",
      header: "Monto",
      size: 120,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.monto),
    },
  ];

  const fiscalColumns: ColumnDef<FiscalRow, unknown>[] = [
    {
      accessorKey: "estado",
      header: "Estado fiscal",
      size: 220,
      cell: ({ row }) =>
        FISCAL_STATE_LABELS[row.original.estado as FiscalDocumentState],
    },
    { accessorKey: "cantidad", header: "Cantidad", size: 100, meta: { align: "right" } },
  ];

  const felColumns: ColumnDef<FelRow, unknown>[] = [
    {
      accessorKey: "estado",
      header: "Estado operación",
      size: 220,
      cell: ({ row }) => String(row.original.estado as FelOperationState).replace(/_+/g, " "),
    },
    { accessorKey: "cantidad", header: "Cantidad", size: 100, meta: { align: "right" } },
    {
      accessorKey: "intentosPromedio",
      header: "Intentos prom.",
      size: 120,
      meta: { align: "right" },
      cell: ({ row }) => formatDecimal(row.original.intentosPromedio),
    },
  ];

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Reporte operativo de facturación"
          description="Estados comerciales, preparación fiscal y operaciones FEL."
          backTo={backTo}
          backLabel="Volver a facturación"
        />

        <AppAlert
          tone={report?.integracionExterna.habilitada ? "success" : "info"}
          title="Integración externa FEL"
          description={
            report?.integracionExterna.mensaje ??
            "La integración con Grupo CDS permanece deshabilitada."
          }
        />

        <AppCard title="Rango" size="sm">
          <div className="grid gap-2 md:grid-cols-3">
            <AppDatePicker
              value={fechaDesde}
              outputFormat="iso"
              boundary="startOfDay"
              aria-label="Desde"
              onChange={(value) => update({ fechaDesde: value ?? null })}
            />
            <AppDatePicker
              value={fechaHasta}
              outputFormat="iso"
              boundary="endOfDay"
              aria-label="Hasta"
              onChange={(value) => update({ fechaHasta: value ?? null })}
            />
            <AppButton
              variant="secondary"
              size="sm"
              leftIcon={<RotateCcw />}
              onClick={() => setParams(new URLSearchParams(), { replace: true })}
            >
              Limpiar
            </AppButton>
          </div>
        </AppCard>

        <AppCard title="Facturas" size="sm">
          <AppDataTable
            data={report?.facturas ?? []}
            columns={invoiceColumns}
            getRowId={(row) => row.estado}
            isLoading={query.isLoading}
            error={query.error}
            onRetry={() => void query.refetch()}
            paginationMode="none"
            density="xs"
            responsiveMode="scroll"
            emptyTitle="Sin facturas en el rango"
          />
        </AppCard>

        <AppCard title="Documentos fiscales" size="sm">
          <AppDataTable
            data={report?.documentosFiscales ?? []}
            columns={fiscalColumns}
            getRowId={(row) => row.estado}
            isLoading={query.isLoading}
            error={query.error}
            onRetry={() => void query.refetch()}
            paginationMode="none"
            density="xs"
            responsiveMode="scroll"
            emptyTitle="Sin documentos fiscales"
          />
        </AppCard>

        <AppCard title="Operaciones FEL" size="sm">
          <AppDataTable
            data={report?.operacionesFel ?? []}
            columns={felColumns}
            getRowId={(row) => row.estado}
            isLoading={query.isLoading}
            error={query.error}
            onRetry={() => void query.refetch()}
            paginationMode="none"
            density="xs"
            responsiveMode="scroll"
            emptyTitle="Sin operaciones FEL"
          />
        </AppCard>
      </AppStack>
    </AppContainer>
  );
}
