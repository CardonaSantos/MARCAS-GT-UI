import type { ColumnDef } from "@tanstack/react-table";
import { RotateCcw } from "lucide-react";
import { useLocation, useSearchParams } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  formatDecimal,
  formatInteger,
} from "@/features/common/formatters/value.formatters";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { setSearchParam } from "@/features/common/navigation/url-state.utils";
import { useDeliveryOperationalReport } from "@/features/entregas/api/delivery.queries";
import type {
  DeliveryOperationalReport,
  DeliveryUser,
} from "@/features/entregas/api/delivery.types";
import {
  DELIVERY_FAILURE_REASON_LABELS,
} from "@/features/entregas/common/delivery.constants";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDatePicker } from "@/ui/components/app/primitives/app-date-picker";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";
import { AppStack } from "@/ui/components/app/primitives/app-stack";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";

type RepartidorRow = DeliveryOperationalReport["repartidores"][number];
type ReasonRow = DeliveryOperationalReport["motivosNoEntrega"][number];

export default function DeliveryOperationalReportPage() {
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const backTo = getReturnRoute(location.state, "/marcas-gt/entregas");
  const fechaDesde = params.get("fechaDesde") ?? "";
  const fechaHasta = params.get("fechaHasta") ?? "";

  const query = useDeliveryOperationalReport({
    fechaDesde: fechaDesde || undefined,
    fechaHasta: fechaHasta || undefined,
  });
  const report = query.data;

  const update = (patch: Record<string, string | null | undefined>) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([key, value]) =>
      setSearchParam(next, key, value),
    );
    setParams(next, { replace: true });
  };

  const repartidorColumns: ColumnDef<RepartidorRow, unknown>[] = [
    {
      id: "usuario",
      header: "Repartidor",
      size: 200,
      meta: { grow: true },
      cell: ({ row }) => row.original.usuario.nombre,
    },
    {
      accessorKey: "intentos",
      header: "Intentos",
      size: 90,
      meta: { align: "right" },
    },
    {
      accessorKey: "exitosas",
      header: "Exitosas",
      size: 90,
      meta: { align: "right" },
    },
    {
      accessorKey: "tasaExito",
      header: "Éxito",
      size: 90,
      meta: { align: "right" },
      cell: ({ row }) => formatDecimal(row.original.tasaExito) + "%",
    },
    {
      accessorKey: "unidadesEntregadas",
      header: "Unidades",
      size: 90,
      meta: { align: "right" },
    },
    {
      accessorKey: "horasPromedio",
      header: "Horas prom.",
      size: 100,
      meta: { align: "right" },
      cell: ({ row }) =>
        row.original.horasPromedio == null
          ? "—"
          : formatDecimal(row.original.horasPromedio) + " h",
    },
    {
      accessorKey: "fueraRadio",
      header: "Fuera radio",
      size: 100,
      meta: { align: "right" },
    },
  ];

  const reasonColumns: ColumnDef<ReasonRow, unknown>[] = [
    {
      accessorKey: "motivo",
      header: "Motivo",
      size: 260,
      meta: { grow: true },
      cell: ({ row }) =>
        DELIVERY_FAILURE_REASON_LABELS[row.original.motivo],
    },
    {
      accessorKey: "cantidad",
      header: "Cantidad",
      size: 100,
      meta: { align: "right" },
    },
  ];

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Reporte operativo de entregas"
          description="Efectividad, puntualidad, evidencia y desempeño de repartidores."
          backTo={backTo}
          backLabel="Volver a entregas"
        />

        <AppCard title="Filtros" size="sm">
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

        <AppGrid cols={{ base: 1, sm: 2, xl: 4 }} gap="sm">
          <AppCard title="Tasa de éxito" size="sm">
            <p className="text-2xl font-semibold">
              {formatDecimal(report?.efectividad.tasaExito, "—")}%
            </p>
            <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
              {formatInteger(report?.efectividad.intentos, "—")} intentos finalizados
            </p>
          </AppCard>
          <AppCard title="Completas" size="sm">
            <p className="text-2xl font-semibold">
              {formatInteger(report?.efectividad.completas, "—")}
            </p>
            <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
              Parciales: {formatInteger(report?.efectividad.parciales, "—")}
            </p>
          </AppCard>
          <AppCard title="Fallidas" size="sm">
            <p className="text-2xl font-semibold">
              {report
                ? report.efectividad.rechazadas +
                  report.efectividad.noEntregadas
                : "—"}
            </p>
            <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
              Rechazadas + no entregadas
            </p>
          </AppCard>
          <AppCard title="Puntualidad" size="sm">
            <p className="text-2xl font-semibold">
              {formatInteger(report?.puntualidad.aTiempo, "—")}
            </p>
            <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
              a tiempo · {formatInteger(report?.puntualidad.tarde, "—")} tarde
            </p>
          </AppCard>
        </AppGrid>

        <AppGrid cols={{ base: 1, sm: 2, xl: 4 }} gap="sm">
          <AppCard title="Con firma" size="sm">
            <p className="text-xl font-semibold">
              {formatInteger(report?.evidencia.conFirma, "—")}
            </p>
          </AppCard>
          <AppCard title="Con fotografía" size="sm">
            <p className="text-xl font-semibold">
              {formatInteger(report?.evidencia.conFoto, "—")}
            </p>
          </AppCard>
          <AppCard title="Con GPS" size="sm">
            <p className="text-xl font-semibold">
              {formatInteger(report?.evidencia.conGps, "—")}
            </p>
          </AppCard>
          <AppCard title="Sin evidencia" size="sm">
            <p className="text-xl font-semibold">
              {formatInteger(report?.evidencia.sinEvidencia, "—")}
            </p>
          </AppCard>
        </AppGrid>

        <AppCard title="Desempeño por repartidor" size="sm">
          <AppDataTable<RepartidorRow>
            data={report?.repartidores ?? []}
            columns={repartidorColumns}
            getRowId={(row) => String((row.usuario as DeliveryUser).id)}
            isLoading={query.isLoading}
            isFetching={query.isFetching}
            error={query.error}
            onRetry={() => void query.refetch()}
            paginationMode="none"
            density="xs"
            responsiveMode="scroll"
            emptyTitle="Sin datos de repartidores"
          />
        </AppCard>

        <AppCard title="Motivos de no entrega" size="sm">
          <AppDataTable<ReasonRow>
            data={report?.motivosNoEntrega ?? []}
            columns={reasonColumns}
            getRowId={(row) => row.motivo}
            isLoading={query.isLoading}
            isFetching={query.isFetching}
            error={query.error}
            onRetry={() => void query.refetch()}
            paginationMode="none"
            density="xs"
            responsiveMode="scroll"
            emptyTitle="Sin motivos registrados"
          />
        </AppCard>
      </AppStack>
    </AppContainer>
  );
}
