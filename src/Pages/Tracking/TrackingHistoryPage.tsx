import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, MapPinned, RotateCcw } from "lucide-react";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { useTrackingHistory } from "@/features/tracking/api/tracking.queries";
import { trackingBusinessDate, trackingDateTime, trackingDuration } from "@/features/tracking/api/tracking.types";
import type { TrackingSessionStatus } from "@/features/tracking/api/tracking.types";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppInput } from "@/ui/components/app/primitives/app-input";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

const states = ["ACTIVA", "FINALIZADA", "EXPIRADA"] as const;

export default function TrackingHistoryPage() {
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Number(params.get("page")) || 1);
  const search = params.get("search") ?? "";
  const since = params.get("desde") ?? "";
  const until = params.get("hasta") ?? "";
  const rawState = params.get("estado");
  const estadoSesion: TrackingSessionStatus | undefined = states.find((state) => state === rawState);

  const patch = (key: string, value: string) => {
    setParams((previous) => {
      const next = new URLSearchParams(previous);
      if (!value) next.delete(key);
      else next.set(key, value);
      if (key !== "page") next.delete("page");
      return next;
    }, { replace: true });
  };

  const query = useTrackingHistory({
    page, limit: 20, search: search.trim() || undefined, estadoSesion,
    fechaDesde: since ? since + "T00:00:00.000Z" : undefined,
    fechaHasta: until ? until + "T23:59:59.999Z" : undefined,
  });
  const result = query.data;

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader title="Auditoría de jornadas"
          description="Historial de asistencias asociadas a sesiones GPS, con duraciones calculadas a partir del seguimiento confirmado."
          actions={<AppButton asChild variant="secondary" size="sm"><Link to="/marcas-gt/tracking"><MapPinned className="h-4 w-4" />Monitoreo en vivo</Link></AppButton>}
        />
        <AppCard title="Filtros del historial" size="sm">
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
            <AppInput value={search} placeholder="Nombre o correo…" aria-label="Buscar empleado"
              onChange={(event) => patch("search", event.target.value)} />
            <select aria-label="Estado de sesión" value={estadoSesion ?? ""} onChange={(event) => patch("estado", event.target.value)}
              className="rounded-md border border-[hsl(var(--app-border))] bg-[hsl(var(--app-card))] px-3 py-2 text-sm">
              <option value="">Todas las sesiones</option>
              {states.map((state) => <option key={state} value={state}>{state}</option>)}
            </select>
            <AppInput type="date" aria-label="Desde" value={since} max={until || undefined} onChange={(event) => patch("desde", event.target.value)} />
            <AppInput type="date" aria-label="Hasta" value={until} min={since || undefined} onChange={(event) => patch("hasta", event.target.value)} />
            <AppButton variant="secondary" size="sm" onClick={() => setParams(new URLSearchParams(), { replace: true })}>
              <RotateCcw className="h-4 w-4" />Limpiar
            </AppButton>
          </div>
        </AppCard>
        {query.isError ? <AppAlert tone="danger" title="No fue posible cargar el historial"
          description={query.error instanceof Error ? query.error.message : "Reintenta la consulta."} /> : null}
        <AppCard title="Jornadas registradas" description="Sólo jornadas vinculadas a sesiones Tracking V1." size="sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="border-b border-[hsl(var(--app-border))] text-xs text-[hsl(var(--app-muted-foreground))]">
                <tr>{["Jornada", "Empleado", "Entrada", "Salida", "Sesiones", "Tracking", "Estado", "Detalle"].map((label) =>
                  <th key={label} scope="col" className="px-3 py-3 font-medium">{label}</th>)}</tr>
              </thead>
              <tbody>
                {(result?.items ?? []).map((item) => (
                  <tr key={item.asistenciaId} className="border-b border-[hsl(var(--app-border))] last:border-b-0">
                    <td className="px-3 py-3">{trackingBusinessDate(item.fecha)}</td>
                    <td className="px-3 py-3"><p className="font-medium">{item.usuario.nombre}</p><p className="text-xs text-[hsl(var(--app-muted-foreground))]">{item.usuario.rol}</p></td>
                    <td className="px-3 py-3">{trackingDateTime(item.horaEntrada)}</td>
                    <td className="px-3 py-3">{trackingDateTime(item.horaSalida)}</td>
                    <td className="px-3 py-3 tabular-nums">{item.tracking.sesionesTotal}</td>
                    <td className="px-3 py-3 tabular-nums">{trackingDuration(item.tracking.minutosTracking)}</td>
                    <td className="px-3 py-3">{item.tracking.haySesionActiva ? "Activa" : item.tracking.sesionesExpiradas ? "Con expiración" : "Finalizada"}</td>
                    <td className="px-3 py-3"><Link className="inline-flex items-center gap-1 text-emerald-500 hover:underline" to={"/marcas-gt/tracking/jornadas/" + item.asistenciaId}>Ver <ArrowRight className="h-3 w-3" /></Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {query.isLoading ? <p className="py-8 text-center text-sm">Cargando jornadas…</p> : null}
            {!query.isLoading && !result?.items?.length && !query.isError ? (
              <p className="py-10 text-center text-sm text-[hsl(var(--app-muted-foreground))]">No se encontraron jornadas para los filtros indicados.</p>
            ) : null}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[hsl(var(--app-border))] pt-3">
            <p className="text-xs text-[hsl(var(--app-muted-foreground))]">{result?.total ?? 0} jornadas · Página {page} de {Math.max(1, result?.totalPages ?? 1)}</p>
            <div className="flex gap-2">
              <AppButton size="sm" variant="secondary" disabled={page <= 1 || query.isFetching} onClick={() => patch("page", String(page - 1))}>Anterior</AppButton>
              <AppButton size="sm" variant="secondary" disabled={page >= (result?.totalPages ?? 1) || query.isFetching} onClick={() => patch("page", String(page + 1))}>Siguiente</AppButton>
            </div>
          </div>
        </AppCard>
      </AppStack>
    </AppContainer>
  );
}
