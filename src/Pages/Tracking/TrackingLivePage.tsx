import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, CalendarClock, MapPin, Radio, RefreshCw, Search, Users } from "lucide-react";
import { useTrackingRealtime } from "@/features/tracking/api/tracking.queries";
import { trackingCoordinateValid, trackingDateTime, trackingDuration } from "@/features/tracking/api/tracking.types";
import { useTrackingSocket } from "@/features/tracking/realtime/use-tracking-socket";
import { TrackingMap } from "@/features/tracking/components/tracking-map";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppInput } from "@/ui/components/app/primitives/app-input";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function TrackingLivePage() {
  const query = useTrackingRealtime();
  const connection = useTrackingSocket();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const entries = useMemo(() => Array.isArray(query.data) ? query.data : [], [query.data]);
  const roles = useMemo(() => Array.from(new Set(entries.map((item) => item.usuario.rol))).sort(), [entries]);
  const visible = useMemo(() => entries
    .filter((item) => !role || item.usuario.rol === role)
    .filter((item) => (item.usuario.nombre + " " + item.usuario.rol).toLowerCase().includes(search.toLowerCase().trim()))
    .sort((a, b) => a.usuario.nombre.localeCompare(b.usuario.nombre)), [entries, role, search]);
  const mapped = visible.filter((item) => trackingCoordinateValid(item.ubicacion));
  const selected = visible.find((item) => item.usuario.id === selectedId) ?? null;

  useEffect(() => {
    if (selectedId !== null && !visible.some((item) => item.usuario.id === selectedId)) {
      setSelectedId(null);
    }
  }, [selectedId, visible]);

  const fresh = mapped.filter((item) => {
    const time = new Date(item.ubicacion!.capturadoEn ?? item.ubicacion!.recibidoEn).getTime();
    return Number.isFinite(time) && Date.now() - time < 15 * 60_000;
  }).length;

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Monitoreo GPS"
          description="Ubicación en vivo de las jornadas activas. Los puntos proceden de los dispositivos que tienen tracking habilitado."
          actions={
            <div className="flex flex-wrap gap-2">
              <AppButton asChild variant="secondary" size="sm"><Link to="/marcas-gt/tracking/historial"><CalendarClock className="h-4 w-4" />Historial de jornadas</Link></AppButton>
              <AppButton variant="secondary" size="sm" onClick={() => void query.refetch()} disabled={query.isFetching}><RefreshCw className="h-4 w-4" />Actualizar</AppButton>
            </div>
          }
        />

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <AppCard title="Sesiones activas" icon={<Users className="h-4 w-4" />} size="sm"><p className="text-2xl font-semibold tabular-nums">{entries.length}</p></AppCard>
          <AppCard title="Ubicaciones disponibles" icon={<MapPin className="h-4 w-4" />} size="sm"><p className="text-2xl font-semibold tabular-nums">{entries.filter((item) => trackingCoordinateValid(item.ubicacion)).length}</p></AppCard>
          <AppCard title="GPS de últimos 15 min" icon={<Activity className="h-4 w-4" />} size="sm"><p className="text-2xl font-semibold tabular-nums">{fresh}</p></AppCard>
          <AppCard title="Conexión al servidor" icon={<Radio className="h-4 w-4" />} size="sm">
            <p className="text-sm font-semibold">{connection === "connected" ? "En vivo" : connection === "connecting" ? "Conectando…" : "Modo consulta"}</p>
            <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">Respaldo HTTP cada 60 segundos</p>
          </AppCard>
        </div>

        {query.isError ? (
          <AppAlert tone="danger" title="No se pudo consultar la ubicación de empleados"
            description={query.error instanceof Error ? query.error.message : "Verifica la conexión y los permisos de ADMIN."} />
        ) : null}

        <div className="grid min-w-0 gap-4 xl:grid-cols-[330px_minmax(0,1fr)]">
          <AppCard title="Personal en seguimiento" description="Selecciona una persona para verla en el mapa." size="sm">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--app-muted-foreground))]" />
                <AppInput className="pl-9" placeholder="Buscar empleado…" aria-label="Buscar empleado" value={search} onChange={(event) => setSearch(event.target.value)} />
              </div>
              <select className="w-full rounded-md border border-[hsl(var(--app-border))] bg-[hsl(var(--app-card))] px-3 py-2 text-sm"
                aria-label="Filtrar por rol" value={role} onChange={(event) => setRole(event.target.value)}>
                <option value="">Todos los roles</option>
                {roles.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
              <div className="max-h-[440px] space-y-2 overflow-y-auto pr-1">
                {query.isLoading ? <p className="py-5 text-center text-sm">Consultando sesiones…</p> : null}
                {!query.isLoading && visible.length === 0 ? (
                  <p className="py-7 text-center text-sm text-[hsl(var(--app-muted-foreground))]">No se encontraron jornadas con seguimiento activo.</p>
                ) : null}
                {visible.map((item) => {
                  const position = item.ubicacion;
                  const hasGps = trackingCoordinateValid(position);
                  const old = hasGps && Date.now() - new Date(position!.capturadoEn ?? position!.recibidoEn).getTime() >= 15 * 60_000;
                  return (
                    <button key={item.usuario.id} type="button" onClick={() => setSelectedId(item.usuario.id)}
                      className={"w-full rounded-lg border p-3 text-left transition-colors hover:bg-[hsl(var(--app-muted))] " +
                        (item.usuario.id === selectedId ? "border-emerald-500" : "border-[hsl(var(--app-border))]")}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{item.usuario.nombre}</p>
                          <p className="text-xs text-[hsl(var(--app-muted-foreground))]">{item.usuario.rol}</p>
                        </div>
                        <span className={"shrink-0 rounded px-2 py-0.5 text-[10px] font-medium " + (hasGps ? old ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500" : "bg-slate-500/10 text-slate-400")}>
                          {!hasGps ? "Sin GPS" : old ? "GPS antiguo" : "GPS reciente"}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-[hsl(var(--app-muted-foreground))]">Último GPS: {trackingDateTime(position?.capturadoEn)}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </AppCard>

          <div className="min-w-0 space-y-3">
            <TrackingMap height={540}
              employees={mapped.map((item) => ({
                id: item.usuario.id, nombre: item.usuario.nombre, rol: item.usuario.rol,
                latitud: item.ubicacion!.latitud, longitud: item.ubicacion!.longitud,
                capturadoEn: item.ubicacion!.capturadoEn, precision: item.ubicacion!.precision,
                descripcion: "Jornada #" + item.tracking.asistenciaId,
              }))}
              selectedId={selectedId} onSelect={setSelectedId} />
            {selected ? (
              <AppCard title={selected.usuario.nombre} description={selected.usuario.rol + " · Sesión #" + selected.tracking.sesionId} size="sm">
                <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <div><p className="text-xs text-[hsl(var(--app-muted-foreground))]">Último reporte</p><p>{trackingDateTime(selected.ubicacion?.capturadoEn)}</p></div>
                  <div><p className="text-xs text-[hsl(var(--app-muted-foreground))]">Tracking confirmado</p><p>{trackingDuration(selected.jornada.minutosTracking)}</p></div>
                  <div><p className="text-xs text-[hsl(var(--app-muted-foreground))]">Batería</p><p>{selected.ubicacion?.bateria != null ? selected.ubicacion.bateria + "%" : "—"}</p></div>
                  <div><p className="text-xs text-[hsl(var(--app-muted-foreground))]">Precisión GPS</p><p>{selected.ubicacion?.precision != null ? "± " + Math.round(selected.ubicacion.precision) + " m" : "—"}</p></div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <AppButton asChild size="sm" variant="secondary"><Link to={"/marcas-gt/tracking/jornadas/" + selected.tracking.asistenciaId}>Auditar jornada</Link></AppButton>
                  {trackingCoordinateValid(selected.ubicacion) ? (
                    <AppButton asChild size="sm" variant="secondary">
                      <a target="_blank" rel="noreferrer" href={"https://www.google.com/maps/search/?api=1&query=" + selected.ubicacion!.latitud + "," + selected.ubicacion!.longitud}>Abrir coordenadas</a>
                    </AppButton>
                  ) : null}
                </div>
                {selected.actividad?.visitasActivas?.length ? <p className="mt-3 text-xs">Visitas activas: {selected.actividad.visitasActivas.length}</p> : null}
                {selected.actividad?.enviosActivos?.length ? <p className="mt-1 text-xs">Envíos activos: {selected.actividad.enviosActivos.map((envio) => envio.numero).join(", ")}</p> : null}
              </AppCard>
            ) : (
              <p className="text-xs text-[hsl(var(--app-muted-foreground))]">La ubicación reflejada es la última coordenada recibida; no implica presencia continua ni exactitud absoluta.</p>
            )}
          </div>
        </div>
      </AppStack>
    </AppContainer>
  );
}
