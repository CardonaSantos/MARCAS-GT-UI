import { RotateCcw } from "lucide-react";
import { useLocation, useSearchParams } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  formatDecimal,
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { setSearchParam } from "@/features/common/navigation/url-state.utils";
import { useTransportOperationalReport } from "@/features/transporte/api/transport.queries";
import { TransportBodegaSelect } from "@/features/transporte/components/transport-selects";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDatePicker } from "@/ui/components/app/primitives/app-date-picker";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

function Hours({ value }: { value: number | null | undefined }) {
  return <>{value == null ? "—" : formatDecimal(value) + " h"}</>;
}

export default function TransportOperationalReportPage() {
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const backTo = getReturnRoute(
    location.state,
    "/marcas-gt/transporte/envios",
  );

  const bodegaId = Number(params.get("bodegaId")) || null;
  const fechaDesde = params.get("fechaDesde") ?? "";
  const fechaHasta = params.get("fechaHasta") ?? "";

  const query = useTransportOperationalReport({
    bodegaId: bodegaId ?? undefined,
    fechaDesde: fechaDesde || undefined,
    fechaHasta: fechaHasta || undefined,
  });
  const report = query.data;

  const update = (
    patch: Record<string, string | number | null | undefined>,
  ) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([key, value]) =>
      setSearchParam(next, key, value),
    );
    setParams(next, { replace: true });
  };

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Reporte operativo de transporte"
          description="Puntualidad, tiempos de ciclo, incidencias y costo logístico externo."
          backTo={backTo}
          backLabel="Volver a transporte"
        />

        <AppCard title="Filtros" size="sm">
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            <TransportBodegaSelect
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
          <AppCard title="Envíos" size="sm">
            <p className="text-2xl font-semibold">{report?.totalEnvios ?? "—"}</p>
            <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
              {report
                ? report.modalidad.internos +
                  " internos · " +
                  report.modalidad.externos +
                  " externos"
                : "—"}
            </p>
          </AppCard>

          <AppCard title="Puntualidad de salida" size="sm">
            <p className="text-2xl font-semibold">
              {formatDecimal(report?.puntualidadSalida.porcentajeATiempo, "—")}%
            </p>
            <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
              {report
                ? report.puntualidadSalida.aTiempo +
                  " a tiempo · " +
                  report.puntualidadSalida.tarde +
                  " tarde"
                : "—"}
            </p>
          </AppCard>

          <AppCard title="Incidencias" size="sm">
            <p className="text-2xl font-semibold">
              {report?.incidencias.abiertas ?? "—"}
            </p>
            <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
              {report ? report.incidencias.total + " registradas" : "—"}
            </p>
          </AppCard>

          <AppCard title="Costo externo" size="sm">
            <p className="text-2xl font-semibold">
              {formatMoney(report?.costoExterno, "—")}
            </p>
            <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
              Acumulado del rango
            </p>
          </AppCard>
        </AppGrid>

        <AppGrid cols={{ base: 1, sm: 2, xl: 4 }} gap="sm">
          <AppCard title="Creación → asignación" size="sm">
            <p className="text-xl font-semibold">
              <Hours value={report?.tiemposPromedioHoras.creacionAAsignacion} />
            </p>
          </AppCard>
          <AppCard title="Asignación → carga" size="sm">
            <p className="text-xl font-semibold">
              <Hours value={report?.tiemposPromedioHoras.asignacionACarga} />
            </p>
          </AppCard>
          <AppCard title="Carga → salida" size="sm">
            <p className="text-xl font-semibold">
              <Hours value={report?.tiemposPromedioHoras.cargaASalida} />
            </p>
          </AppCard>
          <AppCard title="Duración de ruta" size="sm">
            <p className="text-xl font-semibold">
              <Hours value={report?.tiemposPromedioHoras.duracionRuta} />
            </p>
          </AppCard>
        </AppGrid>
      </AppStack>
    </AppContainer>
  );
}
