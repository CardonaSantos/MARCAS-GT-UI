import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CalendarDays, MapPinned, Route, Timer } from "lucide-react";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { useTrackingAttendance, useTrackingLocations } from "@/features/tracking/api/tracking.queries";
import {
  trackingBusinessDate, trackingCoordinateValid, trackingDateTime, trackingDuration,
} from "@/features/tracking/api/tracking.types";
import type { TrackingLocation } from "@/features/tracking/api/tracking.types";
import { TrackingMap } from "@/features/tracking/components/tracking-map";
import type { MapSegment } from "@/features/tracking/components/tracking-map";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppInput } from "@/ui/components/app/primitives/app-input";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function TrackingAttendancePage() {
  const { id } = useParams();
  const asistenciaId = Number(id);
  const validId = Number.isInteger(asistenciaId) && asistenciaId > 0;
  const [sessionId, setSessionId] = useState<number | undefined>();
  const [maxPrecision, setMaxPrecision] = useState("");
  const [cursor, setCursor] = useState<number | null>(null);
  const detailQuery = useTrackingAttendance(asistenciaId);
  const locationQuery = useTrackingLocations(asistenciaId, sessionId);
  const detail = detailQuery.data;

  const points = useMemo(() => (locationQuery.data?.pages.flatMap((page) => page.items) ?? [])
    .filter((point) => trackingCoordinateValid(point))
    .filter((point) => !maxPrecision || point.precision === null || point.precision <= Number(maxPrecision))
    .sort((a, b) => {
      const byCapture = new Date(a.capturadoEn ?? a.recibidoEn).getTime() - new Date(b.capturadoEn ?? b.recibidoEn).getTime();
      return byCapture || a.id - b.id;
    }), [locationQuery.data, maxPrecision]);

  const maxIndex = Math.max(0, points.length - 1);
  const selectedIndex = cursor === null ? maxIndex : Math.min(cursor, maxIndex);
  const visiblePoints = cursor === null ? points : points.slice(0, selectedIndex + 1);
  const selectedPoint: TrackingLocation | undefined = cursor === null ? undefined : visiblePoints[visiblePoints.length - 1];

  const segments = useMemo<MapSegment[]>(() => {
    const buckets = new Map<number, TrackingLocation[]>();
    visiblePoints.forEach((point) => {
      const key = point.sesionTrackingId ?? 0;
      const bucket = buckets.get(key) ?? [];
      bucket.push(point);
      buckets.set(key, bucket);
    });
    return Array.from(buckets.entries()).map(([id, series]) => ({ id, points: series }));
  }, [visiblePoints]);
  const total = locationQuery.data?.pages[0]?.total ?? 0;
  const loaded = locationQuery.data?.pages.reduce((sum, page) => sum + page.items.length, 0) ?? 0;

  if (!validId) return <AppAlert tone="danger" title="Identificador de jornada inválido" />;

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader title={"Auditoría de jornada #" + asistenciaId}
          description={detail ? detail.usuario.nombre + " · " + trackingBusinessDate(detail.asistencia.fecha) : "Detalle de asistencia y recorrido GPS"}
          backTo="/marcas-gt/tracking/historial" backLabel="Volver al historial"
          actions={<AppButton asChild variant="secondary" size="sm"><Link to="/marcas-gt/tracking"><MapPinned className="h-4 w-4" />Mapa en vivo</Link></AppButton>} />
        {detailQuery.isError ? <AppAlert tone="danger" title="No se pudo cargar la jornada"
          description={detailQuery.error instanceof Error ? detailQuery.error.message : "Intenta nuevamente."} /> : null}
        {detailQuery.isLoading ? <p className="py-6 text-center text-sm">Consultando jornada…</p> : null}
        {detail ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <AppCard title="Hora de entrada" icon={<CalendarDays className="h-4 w-4" />} size="sm"><p className="text-sm font-medium">{trackingDateTime(detail.asistencia.horaEntrada)}</p></AppCard>
              <AppCard title="Hora de salida" icon={<CalendarDays className="h-4 w-4" />} size="sm"><p className="text-sm font-medium">{trackingDateTime(detail.asistencia.horaSalida)}</p></AppCard>
              <AppCard title="Tiempo con tracking" icon={<Route className="h-4 w-4" />} size="sm"><p className="text-xl font-semibold">{trackingDuration(detail.resumen.minutosTracking)}</p></AppCard>
              <AppCard title="Jornada / sin tracking" icon={<Timer className="h-4 w-4" />} size="sm">
                <p className="text-sm font-semibold">{trackingDuration(detail.resumen.minutosJornada)}</p>
                <p className="text-xs text-[hsl(var(--app-muted-foreground))]">Sin seguimiento: {trackingDuration(detail.resumen.minutosSinTracking)}</p>
              </AppCard>
            </div>
            {detail.resumen.sesionesExpiradas > 0 ? (
              <AppAlert tone="warning" title="Existen sesiones expiradas"
                description={"Se detectaron " + detail.resumen.sesionesExpiradas + " sesiones cerradas por falta de heartbeat. Su duración no se extiende hasta la hora actual."} />
            ) : null}
            <AppCard title="Sesiones de seguimiento" description={"Total: " + detail.resumen.sesionesTotal + " · Finalizadas: " + detail.resumen.sesionesFinalizadas + " · Expiradas: " + detail.resumen.sesionesExpiradas} size="sm">
              <div className="grid gap-2 lg:grid-cols-2">
                {detail.sesiones.map((session) => (
                  <button type="button" key={session.id} onClick={() => { setSessionId((current) => current === session.id ? undefined : session.id); setCursor(null); }}
                    className={"rounded-lg border p-3 text-left transition-colors hover:bg-[hsl(var(--app-muted))] " +
                      (sessionId === session.id ? "border-emerald-500" : "border-[hsl(var(--app-border))]")}>
                    <div className="flex items-center justify-between gap-2">
                      <strong className="text-sm">Sesión #{session.id}</strong><span className="text-xs">{session.estado}</span>
                    </div>
                    <p className="mt-2 text-xs text-[hsl(var(--app-muted-foreground))]">{trackingDateTime(session.iniciadoEn)} → {trackingDateTime(session.finalizadoEn)}</p>
                    <p className="mt-1 text-xs">{trackingDuration(session.duracionMinutos)} · {session.puntosRegistrados} puntos</p>
                  </button>
                ))}
              </div>
            </AppCard>
            <AppCard title="Recorrido GPS" description="Los tramos se separan por sesión; los puntos se ordenan por fecha de captura, no por recepción en el servidor." size="sm">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <AppButton variant="secondary" size="sm" onClick={() => { setSessionId(undefined); setCursor(null); }} disabled={!sessionId}>Todas las sesiones</AppButton>
                <label className="flex items-center gap-2 text-xs">
                  Precisión máxima (metros)
                  <AppInput className="w-24" type="number" min={1} placeholder="Todas" value={maxPrecision}
                    onChange={(event) => { setMaxPrecision(event.target.value); setCursor(null); }} />
                </label>
              </div>
              {locationQuery.isError ? <AppAlert tone="danger" title="No se pudieron cargar las coordenadas"
                description={locationQuery.error instanceof Error ? locationQuery.error.message : "Reintenta consultar el recorrido."} /> : null}
              <TrackingMap height={490} segments={segments}
                employees={selectedPoint ? [{
                  id: -1, nombre: "Punto seleccionado", rol: "Histórico",
                  latitud: selectedPoint.latitud, longitud: selectedPoint.longitud,
                  capturadoEn: selectedPoint.capturadoEn, precision: selectedPoint.precision,
                }] : []} />
              <div className="mt-3 space-y-2">
                <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                  Puntos cargados: {loaded} de {total}. Visibles con filtro: {points.length}.
                  {loaded < total ? " El recorrido aún es parcial: carga el resto para auditarlo completo." : ""}
                </p>
                {points.length > 0 ? (
                  <div className="space-y-2">
                    <label className="block text-xs font-medium" htmlFor="tracking-time-cursor">Línea de tiempo GPS</label>
                    <input id="tracking-time-cursor" type="range" className="w-full accent-emerald-500"
                      min={0} max={maxIndex} value={selectedIndex} onChange={(event) => setCursor(Number(event.target.value))} />
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span>{trackingDateTime(points[0].capturadoEn)} · Inicio</span>
                      <span>{trackingDateTime(points[selectedIndex].capturadoEn)} · Punto {selectedIndex + 1} de {points.length}</span>
                      <span>{trackingDateTime(points[maxIndex].capturadoEn)} · Final</span>
                    </div>
                    <AppButton variant="secondary" size="sm" disabled={cursor === null} onClick={() => setCursor(null)}>Mostrar recorrido completo cargado</AppButton>
                  </div>
                ) : null}
                {locationQuery.hasNextPage ? (
                  <AppButton variant="secondary" size="sm" disabled={locationQuery.isFetchingNextPage}
                    onClick={() => { void locationQuery.fetchNextPage(); setCursor(null); }}>
                    {locationQuery.isFetchingNextPage ? "Cargando puntos…" : "Cargar 500 puntos más"}
                  </AppButton>
                ) : null}
              </div>
            </AppCard>
            <AppAlert tone="neutral" title="Criterio de auditoría"
              description="El trazado une muestras GPS disponibles de una misma sesión. No equivale a una ruta vial certificada; la precisión del GPS, los intervalos sin reporte y las ubicaciones ausentes pueden alterar su representación." />
          </>
        ) : null}
        {!detailQuery.isLoading && !detail && !detailQuery.isError ? (
          <AppAlert tone="warning" title="Jornada sin información de tracking" description="El registro no existe o pertenece al sistema anterior de asistencia." />
        ) : null}
      </AppStack>
    </AppContainer>
  );
}
