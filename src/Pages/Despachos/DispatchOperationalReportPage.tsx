import type { ColumnDef } from "@tanstack/react-table";
import { RotateCcw } from "lucide-react";
import { useLocation, useSearchParams } from "react-router-dom";

import {
  formatDecimal,
  formatInteger,
} from "@/features/common/formatters/value.formatters";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { setSearchParam } from "@/features/common/navigation/url-state.utils";
import { useDispatchOperationalReport } from "@/features/despachos/api/dispatch.queries";
import type { DispatchOperationalReport } from "@/features/despachos/api/dispatch.types";
import { DispatchBodegaSelect } from "@/features/despachos/components/dispatch-selects";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDatePicker } from "@/ui/components/app/primitives/app-date-picker";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";
import { AppStack } from "@/ui/components/app/primitives/app-stack";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";

type Trend = DispatchOperationalReport["tendenciaDiaria"][number];
type Warehouse = DispatchOperationalReport["bodegas"][number];

export default function DispatchOperationalReportPage() {
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const backTo = getReturnRoute(location.state, "/marcas-gt/despachos");

  const bodegaId = Number(params.get("bodegaId")) || null;
  const fechaDesde = params.get("fechaDesde") ?? "";
  const fechaHasta = params.get("fechaHasta") ?? "";

  const query = useDispatchOperationalReport({
    bodegaId: bodegaId ?? undefined,
    fechaDesde: fechaDesde || undefined,
    fechaHasta: fechaHasta || undefined,
  });

  const update = (
    patch: Record<string, string | number | null | undefined>,
  ) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([key, value]) =>
      setSearchParam(next, key, value),
    );
    setParams(next, { replace: true });
  };

  const trendColumns: ColumnDef<Trend, unknown>[] = [
    { accessorKey: "fecha", header: "Fecha", size: 115 },
    {
      accessorKey: "creadas",
      header: "Creadas",
      size: 85,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.creadas),
    },
    {
      accessorKey: "preparadas",
      header: "Preparadas",
      size: 95,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.preparadas),
    },
    {
      accessorKey: "despachadas",
      header: "Despachadas",
      size: 100,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.despachadas),
    },
    {
      accessorKey: "unidadesDespachadas",
      header: "Unidades",
      size: 90,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.unidadesDespachadas),
    },
    {
      accessorKey: "fallosOperacion",
      header: "Fallos",
      size: 80,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.fallosOperacion),
    },
  ];

  const warehouseColumns: ColumnDef<Warehouse, unknown>[] = [
    {
      id: "bodega",
      header: "Bodega",
      size: 190,
      meta: { grow: true },
      cell: ({ row }) => row.original.bodega.nombre,
    },
    {
      accessorKey: "ordenes",
      header: "Órdenes",
      size: 85,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.ordenes),
    },
    {
      accessorKey: "despachadas",
      header: "Despachadas",
      size: 100,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.despachadas),
    },
    {
      accessorKey: "unidadesDespachadas",
      header: "Unidades",
      size: 90,
      meta: { align: "right" },
      cell: ({ row }) => formatInteger(row.original.unidadesDespachadas),
    },
    {
      accessorKey: "porcentajeATiempo",
      header: "A tiempo",
      size: 90,
      meta: { align: "right" },
      cell: ({ row }) =>
        formatDecimal(row.original.porcentajeATiempo) + "%",
    },
    {
      accessorKey: "horasPromedioPreparacion",
      header: "Prep. prom.",
      size: 105,
      meta: { align: "right" },
      cell: ({ row }) =>
        row.original.horasPromedioPreparacion == null
          ? "—"
          : formatDecimal(row.original.horasPromedioPreparacion) + " h",
    },
    {
      accessorKey: "horasPromedioCiclo",
      header: "Ciclo prom.",
      size: 105,
      meta: { align: "right" },
      cell: ({ row }) =>
        row.original.horasPromedioCiclo == null
          ? "—"
          : formatDecimal(row.original.horasPromedioCiclo) + " h",
    },
  ];

  const report = query.data;

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Reporte operativo de despachos"
          description={
            report
              ? "Rango: " + report.rango.dias + " días"
              : "Puntualidad, aging de cola y confiabilidad de operaciones."
          }
          backTo={backTo}
          backLabel="Volver a despachos"
        />

        <AppCard title="Filtros" size="sm">
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            <DispatchBodegaSelect
              value={bodegaId}
              onChange={(value) => update({ bodegaId: value })}
              placeholder="Todas las bodegas"
            />
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

        <AppGrid cols={{ base: 1, sm: 2, xl: 4 }} gap="sm">
          <AppCard title="Despachadas" size="sm">
            <p className="text-2xl font-semibold">
              {formatInteger(report?.puntualidad.despachadas, "—")}
            </p>
            <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
              {formatDecimal(report?.puntualidad.porcentajeATiempo, "—")}% a tiempo
            </p>
          </AppCard>
          <AppCard title="Cola abierta" size="sm">
            <p className="text-2xl font-semibold">
              {formatInteger(report?.colaAbierta.total, "—")}
            </p>
            <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
              {formatInteger(report?.colaAbierta.mas48h, "—")} con más de 48 h
            </p>
          </AppCard>
          <AppCard title="Operaciones fallidas" size="sm">
            <p className="text-2xl font-semibold">
              {formatInteger(report?.confiabilidadOperaciones.fallidas, "—")}
            </p>
            <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
              Tasa {formatDecimal(report?.confiabilidadOperaciones.tasaFallo, "—")}%
            </p>
          </AppCard>
          <AppCard title="Con reintentos" size="sm">
            <p className="text-2xl font-semibold">
              {formatInteger(report?.confiabilidadOperaciones.conReintentos, "—")}
            </p>
            <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
              {formatDecimal(
                report?.confiabilidadOperaciones.porcentajeConReintento,
                "—",
              )}%
            </p>
          </AppCard>
        </AppGrid>

        <AppCard title="Tendencia diaria" size="sm">
          <AppDataTable
            data={report?.tendenciaDiaria ?? []}
            columns={trendColumns}
            getRowId={(row) => row.fecha}
            isLoading={query.isLoading}
            error={query.error}
            onRetry={() => void query.refetch()}
            paginationMode="none"
            density="xs"
            responsiveMode="scroll"
            emptyTitle="Sin tendencia"
          />
        </AppCard>

        <AppCard title="Desempeño por bodega" size="sm">
          <AppDataTable
            data={report?.bodegas ?? []}
            columns={warehouseColumns}
            getRowId={(row) => String(row.bodega.id)}
            isLoading={query.isLoading}
            error={query.error}
            onRetry={() => void query.refetch()}
            paginationMode="none"
            density="xs"
            responsiveMode="scroll"
            emptyTitle="Sin datos de bodegas"
          />
        </AppCard>
      </AppStack>
    </AppContainer>
  );
}
