"use client";

import * as React from "react";
import { MarkerF } from "@react-google-maps/api";

import { AdvancedMarker, Map, useMap } from "./tracking-google-compat";

import {
  Battery,
  Clock3,
  ExternalLink,
  MapPin,
  MessageCircle,
  Phone,
  RadioTower,
  Route,
  UsersRound,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "./tracking-avatar";

import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppInline } from "@/ui/components/app/primitives/app-inline";
import { AppSearchInput } from "@/ui/components/app/primitives/app-search-input";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

const handleCall = (value: string) => "tel:" + value.replace(/[^+0-9]/g,"");
const handleOpenWhatsapp = (value: string) => "https://wa.me/" + value.replace(/[^0-9]/g,"");

import type { TrackingRealtimeView } from "../api/tracking.types";

import { TrackingMapControls } from "./tracking-map-controls";

type TrackingRealtimeMapProps = {
  rows: TrackingRealtimeView[];
};

const DEFAULT_CENTER = {
  lat: 15.679026415483003,
  lng: -91.74822125438106,
};

const NEARBY_RADIUS_METERS = 35;

function formatMinutes(total: number): string {
  const safe = Math.max(0, Math.floor(total));

  const hours = Math.floor(safe / 60);
  const minutes = safe % 60;

  if (hours <= 0) {
    return `${minutes} min`;
  }

  if (minutes <= 0) {
    return `${hours} h`;
  }

  return `${hours} h ${minutes} min`;
}

function formatClock(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("es-GT", {
    timeZone: "America/Guatemala",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function formatFreshness(value: string, nowMs: number): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Sin dato";
  }

  const seconds = Math.max(0, Math.floor((nowMs - date.getTime()) / 1000));

  if (seconds < 45) {
    return "Ahora";
  }

  if (seconds < 3600) {
    return `Hace ${Math.floor(seconds / 60)} min`;
  }

  return `Hace ${Math.floor(seconds / 3600)} h`;
}

function distanceMeters(
  a: {
    latitud: number;
    longitud: number;
  },
  b: {
    latitud: number;
    longitud: number;
  },
): number {
  const earthRadius = 6_371_000;

  const toRadians = (value: number) => (value * Math.PI) / 180;

  const dLat = toRadians(b.latitud - a.latitud);
  const dLng = toRadians(b.longitud - a.longitud);

  const lat1 = toRadians(a.latitud);
  const lat2 = toRadians(b.latitud);

  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);

  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;

  return 2 * earthRadius * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Live GPS markers are rendered with the native Google Maps marker layer.
 * The CRM's HTML AdvancedMarker adapter proved unreliable for live points
 * in MARCAS. This component deliberately does not share its anchor or CSS
 * layout with the historical replay map.
 */
function TrackingMarker({
  row,
  selected,
  onSelect,
}: {
  row: TrackingRealtimeView;
  selected: boolean;
  onSelect: () => void;
}) {
  const location = row.ubicacion;
  if (!location) return null;

  const receivedAt = new Date(location.recibidoEn).getTime();
  const isStale =
    !Number.isFinite(receivedAt) ||
    Date.now() - receivedAt >= 15 * 60_000;

  // A marker always represents the last received point, even if it is old.
  // We distinguish old GPS visually rather than hiding the employee.
  const color = isStale ? "#d97706" : "#059669";
  const icon: google.maps.Symbol = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: 1,
    strokeColor: "#ffffff",
    strokeOpacity: 1,
    strokeWeight: selected ? 4 : 3,
    scale: selected ? 20 : 17,
  };

  return (
    <MarkerF
      position={{ lat: location.latitud, lng: location.longitud }}
      title={row.tecnico.nombre + (isStale ? " · GPS antiguo" : " · GPS reciente")}
      icon={icon}
      label={{
        text: (row.tecnico.nombre.trim().charAt(0) || "?").toUpperCase(),
        color: "#ffffff",
        fontSize: selected ? "16px" : "14px",
        fontWeight: "700",
      }}
      zIndex={selected ? 2000 : 100}
      onClick={onSelect}
    />
  );
}

function TrackingCamera({
  selected,
}: {
  selected: TrackingRealtimeView | null;
}) {
  const map = useMap();

  React.useEffect(() => {
    if (!map || !selected?.ubicacion) {
      return;
    }

    map.panTo({
      lat: selected.ubicacion.latitud,
      lng: selected.ubicacion.longitud,
    });

    if ((map.getZoom() ?? 0) < 16) {
      map.setZoom(16);
    }
  }, [
    map,
    selected?.tecnico.id,
    selected?.ubicacion?.latitud,
    selected?.ubicacion?.longitud,
  ]);

  return null;
}

function TrackingInitialBounds({
  rows,
  selectedId,
}: {
  rows: TrackingRealtimeView[];
  selectedId: number | null;
}) {
  const map = useMap();

  const idsKey = React.useMemo(
    () =>
      rows
        .filter((row) => row.ubicacion !== null)
        .map((row) => row.tecnico.id)
        .sort((a, b) => a - b)
        .join(","),
    [rows],
  );

  const previousIdsRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (!map || selectedId !== null) {
      return;
    }

    if (previousIdsRef.current === idsKey) {
      return;
    }

    previousIdsRef.current = idsKey;

    const visibleRows = rows.filter((row) => row.ubicacion !== null);

    if (visibleRows.length === 0) {
      return;
    }

    const bounds = new google.maps.LatLngBounds();

    visibleRows.forEach((row) => {
      if (!row.ubicacion) {
        return;
      }

      bounds.extend({
        lat: row.ubicacion.latitud,
        lng: row.ubicacion.longitud,
      });
    });

    map.fitBounds(bounds, 64);

    if (visibleRows.length === 1) {
      map.setZoom(16);
    }
  }, [idsKey, map, rows, selectedId]);

  return null;
}

function TechnicianPicker({
  rows,
  selectedId,
  onSelect,
  nowMs,
}: {
  rows: TrackingRealtimeView[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  nowMs: number;
}) {
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    const needle = search.trim().toLowerCase();

    const source = needle
      ? rows.filter((row) => row.tecnico.nombre.toLowerCase().includes(needle))
      : rows;

    return [...source].sort((a, b) =>
      a.tecnico.nombre.localeCompare(b.tecnico.nombre, "es"),
    );
  }, [rows, search]);

  return (
    <aside className="hidden min-h-0 border-l border-border bg-background/95 lg:flex lg:flex-col">
      {/* HEADER */}
      <div className="shrink-0 border-b border-border p-2">
        <AppInline align="center" justify="between" gap="xs">
          <AppInline align="center" gap="xs">
            <UsersRound className="h-3.5 w-3.5 text-primary" />

            <span className="text-xs font-semibold">En seguimiento</span>
          </AppInline>

          <AppBadge size="xs" tone="success" appearance="soft">
            {rows.length}
          </AppBadge>
        </AppInline>

        <div className="mt-2">
          <AppSearchInput
            value={search}
            onValueChange={setSearch}
            debounceMs={0}
            placeholder="Buscar empleado..."
            size="xs"
            clearable
          />
        </div>
      </div>

      {/* LISTADO */}
      <div className="min-h-0 flex-1 overflow-y-auto p-1.5">
        <AppStack gap="xs">
          {filtered.map((row) => {
            const selected = selectedId === row.tecnico.id;

            return (
              <button
                key={row.tecnico.id}
                type="button"
                onClick={() => onSelect(row.tecnico.id)}
                className={[
                  "w-full rounded-[var(--app-radius-md)] border p-2 text-left",
                  "transition-colors",

                  selected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-background hover:bg-muted/60",
                ].join(" ")}
              >
                <AppInline gap="sm" align="center" wrap={false}>
                  <Avatar className="size-8 shrink-0">
                    <AvatarImage src={row.tecnico.avatarUrl ?? undefined} />

                    <AvatarFallback>
                      {row.tecnico.nombre.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-semibold">
                      {row.tecnico.nombre}
                    </div>

                    <div className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                      {row.ubicacion ? (
                        <>
                          <MapPin className="h-3 w-3 text-success" />

                          {formatFreshness(row.ubicacion.recibidoEn, nowMs)}
                        </>
                      ) : (
                        <>
                          <RadioTower className="h-3 w-3 text-warning" />
                          Esperando GPS
                        </>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="text-[10px] font-medium">
                      {row.ubicacion?.bateria ?? "—"}%
                    </div>

                    <div className="text-[9px] text-muted-foreground">
                      {formatMinutes(row.jornada.minutosTracking)}
                    </div>
                  </div>
                </AppInline>
              </button>
            );
          })}
        </AppStack>
      </div>
    </aside>
  );
}

function MobilePicker({
  rows,
  selectedId,
  onSelect,
}: {
  rows: TrackingRealtimeView[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  return (
    <div className="absolute bottom-2 left-2 right-2 z-20 overflow-x-auto lg:hidden">
      <div className="flex min-w-max gap-1.5 rounded-[var(--app-radius-md)] border border-border bg-background/90 p-1.5 shadow-lg backdrop-blur">
        {rows.map((row) => (
          <AppButton
            key={row.tecnico.id}
            type="button"
            size="xs"
            variant={selectedId === row.tecnico.id ? "primary" : "secondary"}
            onClick={() => onSelect(row.tecnico.id)}
          >
            {row.tecnico.nombre}
          </AppButton>
        ))}
      </div>
    </div>
  );
}

function SelectedTechnicianCard({
  selected,
  nearby,
  onSelect,
  onClose,
  nowMs,
}: {
  selected: TrackingRealtimeView;
  nearby: TrackingRealtimeView[];
  onSelect: (id: number) => void;
  onClose: () => void;
  nowMs: number;
}) {
  const location = selected.ubicacion;

  if (!location) {
    return null;
  }

  return (
    <AdvancedMarker
      position={{
        lat: location.latitud,
        lng: location.longitud,
      }}
      zIndex={2000}
    >
      <div
        className="pointer-events-auto absolute bottom-12 left-1/2 -translate-x-1/2"
        onClick={(event) => event.stopPropagation()}
      >
        <AppCard
          variant="outline"
          size="xs"
          radius="lg"
          className="w-[min(22rem,calc(100vw-2rem))] bg-background/95 shadow-2xl backdrop-blur"
        >
          <AppStack gap="sm">
            <AppInline align="start" gap="sm" wrap={false}>
              <Avatar className="size-9 shrink-0">
                <AvatarImage src={selected.tecnico.avatarUrl ?? undefined} />

                <AvatarFallback>
                  {selected.tecnico.nombre.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">
                  {selected.tecnico.nombre}
                </div>

                <AppInline gap="xs" align="center" wrap>
                  <AppBadge size="xs" tone="success" appearance="soft">
                    En seguimiento
                  </AppBadge>

                  <span className="text-[10px] text-muted-foreground">
                    Sesión #{selected.tracking.sesionId}
                  </span>
                </AppInline>
              </div>

              <AppButton
                type="button"
                variant="ghost"
                size="iconXs"
                aria-label="Cerrar detalle"
                title="Cerrar detalle"
                onClick={onClose}
              >
                <X className="h-3.5 w-3.5" />
              </AppButton>
            </AppInline>

            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
              <Metric
                icon={<Clock3 className="h-3.5 w-3.5" />}
                label="Entrada"
                value={formatClock(selected.jornada.horaEntrada)}
              />

              <Metric
                icon={<Route className="h-3.5 w-3.5" />}
                label="Tracking"
                value={formatMinutes(selected.jornada.minutosTracking)}
              />

              <Metric
                icon={<Battery className="h-3.5 w-3.5" />}
                label="Batería"
                value={location.bateria === null ? "—" : `${location.bateria}%`}
              />

              <Metric
                icon={<RadioTower className="h-3.5 w-3.5" />}
                label="Reporte"
                value={formatFreshness(location.recibidoEn, nowMs)}
              />
            </div>

            {selected.jornada.sesionesTotal > 1 ||
            selected.jornada.minutosSinTrackingConfirmados > 0 ? (
              <div className="rounded-[var(--app-radius-sm)] border border-border bg-muted/40 px-2 py-1.5 text-[10px] text-muted-foreground">
                {selected.jornada.sesionesTotal} sesiones hoy
                {" · "}
                {formatMinutes(
                  selected.jornada.minutosSinTrackingConfirmados,
                )}{" "}
                sin tracking confirmado
              </div>
            ) : null}

            {nearby.length > 1 ? (
              <div>
                <div className="mb-1 text-[10px] font-medium text-muted-foreground">
                  {nearby.length} empleados a menos de {NEARBY_RADIUS_METERS} m
                </div>

                <div className="flex max-w-full gap-1 overflow-x-auto pb-1">
                  {nearby.map((row) => (
                    <AppButton
                      key={row.tecnico.id}
                      type="button"
                      size="xs"
                      variant={
                        row.tecnico.id === selected.tecnico.id
                          ? "primary"
                          : "outline"
                      }
                      onClick={() => onSelect(row.tecnico.id)}
                    >
                      {row.tecnico.nombre}
                    </AppButton>
                  ))}
                </div>
              </div>
            ) : null}

            {selected.actividad.ticketsEnProceso.length > 0 ? (
              <AppInline gap="xs" align="center">
                <AppBadge size="xs" tone="info" appearance="soft">
                  {selected.actividad.ticketsEnProceso.length} ticket(s)
                </AppBadge>

                <span className="truncate text-[10px] text-muted-foreground">
                  {selected.actividad.ticketsEnProceso[0]?.titulo ??
                    `Ticket #${selected.actividad.ticketsEnProceso[0]?.id}`}
                </span>
              </AppInline>
            ) : null}

            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {selected.tecnico.telefono ? (<>
              <AppButton asChild variant="outline" size="xs">
                <a
                  href={handleOpenWhatsapp(selected.tecnico.telefono ?? "")}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  WhatsApp
                </a>
              </AppButton>

              <AppButton asChild variant="outline" size="xs">
                <a href={handleCall(selected.tecnico.telefono ?? "")}>
                  <Phone className="h-3.5 w-3.5" />
                  Llamar
                </a>
              </AppButton>

              </>) : null}
              <AppButton
                asChild
                variant="secondary"
                size="xs"
                className="col-span-2 sm:col-span-1"
              >
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${location.latitud},${location.longitud}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Maps
                </a>
              </AppButton>
            </div>
          </AppStack>
        </AppCard>
      </div>
    </AdvancedMarker>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[var(--app-radius-sm)] border border-border bg-muted/30 p-1.5">
      <AppInline gap="xs" align="center" wrap={false}>
        <span className="shrink-0 text-primary">{icon}</span>

        <div className="min-w-0">
          <div className="truncate text-[9px] text-muted-foreground">
            {label}
          </div>

          <div className="truncate text-[10px] font-semibold">{value}</div>
        </div>
      </AppInline>
    </div>
  );
}

export function TrackingRealtimeMap({ rows: sourceRows }: TrackingRealtimeMapProps) {
  const rows = React.useMemo(() => sourceRows.map((row) => ({
    ...row,
    ubicacion: row.ubicacion && Number.isFinite(row.ubicacion.latitud) &&
      Number.isFinite(row.ubicacion.longitud) &&
      Math.abs(row.ubicacion.latitud) <= 90 && Math.abs(row.ubicacion.longitud) <= 180
      ? row.ubicacion : null,
  })), [sourceRows]);
  const fullscreenTargetRef = React.useRef<HTMLDivElement>(null);

  const [selectedId, setSelectedId] = React.useState<number | null>(null);

  const [nowMs, setNowMs] = React.useState(() => Date.now());

  React.useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNowMs(Date.now());
    }, 30_000);

    return () => window.clearInterval(intervalId);
  }, []);

  React.useEffect(() => {
    if (
      selectedId !== null &&
      !rows.some((row) => row.tecnico.id === selectedId)
    ) {
      setSelectedId(null);
    }
  }, [rows, selectedId]);

  const selected = rows.find((row) => row.tecnico.id === selectedId) ?? null;

  const nearby = React.useMemo(() => {
    const selectedLocation = selected?.ubicacion;

    if (!selectedLocation) {
      return [];
    }

    return rows.filter((row) => {
      const rowLocation = row.ubicacion;

      if (!rowLocation) {
        return false;
      }

      return (
        distanceMeters(selectedLocation, rowLocation) <= NEARBY_RADIUS_METERS
      );
    });
  }, [rows, selected]);

  const selectTechnician = React.useCallback((id: number) => {
    setSelectedId(id);
  }, []);

  return (
    <div
      ref={fullscreenTargetRef}
      className={[
        "relative flex h-full min-h-0 w-full overflow-hidden",

        "rounded-[var(--app-radius-md)] border border-border bg-background",
        "lg:grid lg:grid-cols-[minmax(0,1fr)_18rem]",
        "2xl:grid-cols-[minmax(0,1fr)_20rem]",
      ].join(" ")}
    >
      <div className="relative h-full min-h-0 min-w-0 flex-1">
        <Map
          mapId="e209b83095802909"
          defaultZoom={12}
          defaultCenter={DEFAULT_CENTER}
          className="h-full w-full"
          gestureHandling="greedy"
          disableDefaultUI
          mapTypeId="hybrid"
          reuseMaps
          onClick={() => setSelectedId(null)}
        >
          <TrackingInitialBounds rows={rows} selectedId={selectedId} />

          <TrackingCamera selected={selected} />

          <TrackingMapControls
            rows={rows}
            selectedId={selectedId}
            fullscreenTargetRef={fullscreenTargetRef}
            onClearSelection={() => setSelectedId(null)}
          />

          {rows.map((row) => (
            <TrackingMarker
              key={row.tecnico.id}
              row={row}
              selected={row.tecnico.id === selectedId}
              onSelect={() => selectTechnician(row.tecnico.id)}
            />
          ))}

          {selected?.ubicacion ? (
            <SelectedTechnicianCard
              selected={selected}
              nearby={nearby}
              nowMs={nowMs}
              onSelect={selectTechnician}
              onClose={() => setSelectedId(null)}
            />
          ) : null}
        </Map>

        <MobilePicker
          rows={rows}
          selectedId={selectedId}
          onSelect={selectTechnician}
        />
      </div>

      <TechnicianPicker
        rows={rows}
        selectedId={selectedId}
        nowMs={nowMs}
        onSelect={selectTechnician}
      />
    </div>
  );
}
