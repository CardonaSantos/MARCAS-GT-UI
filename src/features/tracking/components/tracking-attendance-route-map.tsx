"use client";

import * as React from "react";

import {
  AdvancedMarker,
  Map as GoogleMap,
  useMap,
} from "./tracking-google-compat";

import { Flag, MapPinned, Navigation } from "lucide-react";

import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppInline } from "@/ui/components/app/primitives/app-inline";

import type { TrackingLocation } from "../api/tracking.types";
import { GoogleMapsProvider } from "@/features/common/maps/google-maps-provider";

type Props = {
  locations: TrackingLocation[];
  /** History time cursor: null means the full journey. */
  cursorPoint?: TrackingLocation | null;
  playedLocations?: TrackingLocation[] | null;
};

const FALLBACK_CENTER = {
  lat: 15.679026415483003,
  lng: -91.74822125438106,
};

const ROUTE_COLORS = [
  "#7c3aed",
  "#0891b2",
  "#16a34a",
  "#ea580c",
  "#dc2626",
  "#2563eb",
];

type SessionFilter = "all" | number;

export function TrackingAttendanceRouteMap({ locations, cursorPoint = null, playedLocations = null }: Props) {
  const [sessionFilter, setSessionFilter] =
    React.useState<SessionFilter>("all");

  const sessionIds = React.useMemo(
    () =>
      Array.from(
        new Set(
          locations
            .map((location) => location.sesionTrackingId)
            .filter((value): value is number => value !== null),
        ),
      ),
    [locations],
  );

  const visibleLocations = React.useMemo(() => {
    if (sessionFilter === "all") return locations;

    return locations.filter(
      (location) => location.sesionTrackingId === sessionFilter,
    );
  }, [locations, sessionFilter]);

  const visiblePlayed = playedLocations === null ? null :
    playedLocations.filter((point) => sessionFilter === "all" || point.sesionTrackingId === sessionFilter);
  const replayPoint = visiblePlayed ? visiblePlayed[visiblePlayed.length - 1] ?? null : null;
  const first = visibleLocations[0] ?? null;
  const last = visibleLocations[visibleLocations.length - 1] ?? null;

  const defaultCenter = first
    ? { lat: first.latitud, lng: first.longitud }
    : FALLBACK_CENTER;

  return (
    <AppCard
      variant="outline"
      size="sm"
      radius="lg"
      className="min-w-0 overflow-hidden"
      title={
        <AppInline gap="xs" align="center">
          <MapPinned className="h-4 w-4 text-primary" />
          <span>Recorrido GPS</span>
        </AppInline>
      }
      action={
        <AppBadge tone="info" appearance="soft" size="xs">
          {visibleLocations.length} puntos
        </AppBadge>
      }
    >
      {sessionIds.length > 1 ? (
        <div className="mb-2 flex max-w-full gap-1 overflow-x-auto pb-1">
          <AppButton
            type="button"
            size="xs"
            variant={sessionFilter === "all" ? "primary" : "outline"}
            onClick={() => setSessionFilter("all")}
          >
            Todas
          </AppButton>

          {sessionIds.map((sessionId) => (
            <AppButton
              key={sessionId}
              type="button"
              size="xs"
              variant={sessionFilter === sessionId ? "primary" : "outline"}
              onClick={() => setSessionFilter(sessionId)}
            >
              Sesión #{sessionId}
            </AppButton>
          ))}
        </div>
      ) : null}

      {visibleLocations.length === 0 ? (
        <div className="flex min-h-[24rem] items-center justify-center rounded-[var(--app-radius-md)] border border-dashed border-border bg-muted/20 p-4 text-center text-xs text-muted-foreground">
          Esta jornada todavía no tiene puntos GPS.
        </div>
      ) : (
        <div className="h-[clamp(24rem,52dvh,38rem)] min-w-0 overflow-hidden rounded-[var(--app-radius-md)] border border-border">
          <GoogleMapsProvider><GoogleMap
            key={String(sessionFilter)}
            mapId="e209b83095802909"
            defaultCenter={defaultCenter}
            defaultZoom={15}
            className="h-full w-full"
            gestureHandling="greedy"
            mapTypeId="hybrid"
            reuseMaps
          >
            <RouteBounds locations={visibleLocations} />
            <RouteLines locations={visibleLocations} playedLocations={visiblePlayed} />
            {cursorPoint && replayPoint ? <ReplayCamera location={replayPoint} /> : null}

            {first ? (
              <AdvancedMarker
                position={{ lat: first.latitud, lng: first.longitud }}
                title="Inicio del recorrido visible"
                zIndex={20}
              >
                <div className="flex size-8 items-center justify-center rounded-full border-2 border-background bg-success text-white shadow-lg">
                  <Navigation className="h-4 w-4" />
                </div>
              </AdvancedMarker>
            ) : null}

            {replayPoint ? (
              <AdvancedMarker
                position={{ lat: replayPoint.latitud, lng: replayPoint.longitud }}
                title="Ubicación seleccionada en la línea de tiempo"
                zIndex={200}
              >
                <div className="flex size-10 items-center justify-center rounded-full border-[3px] border-white bg-emerald-500 text-white shadow-xl ring-2 ring-emerald-400/40">
                  <Navigation className="h-4 w-4" />
                </div>
              </AdvancedMarker>
            ) : null}

            {last && last.id !== first?.id ? (
              <AdvancedMarker
                position={{ lat: last.latitud, lng: last.longitud }}
                title="Último punto del recorrido visible"
                zIndex={20}
              >
                <div className="flex size-8 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-lg">
                  <Flag className="h-4 w-4" />
                </div>
              </AdvancedMarker>
            ) : null}
          </GoogleMap></GoogleMapsProvider>
        </div>
      )}

      <div className="mt-2 text-[10px] text-muted-foreground">
        Cada sesión se dibuja como un tramo independiente; no se conectan pausas
        o reinicios entre sesiones.
      </div>
    </AppCard>
  );
}

function RouteBounds({
  locations,
}: {
  locations: TrackingLocation[];
}) {
  const map = useMap();

  React.useEffect(() => {
    if (!map || locations.length === 0) return;

    const bounds = new google.maps.LatLngBounds();

    locations.forEach((location) => {
      bounds.extend({
        lat: location.latitud,
        lng: location.longitud,
      });
    });

    map.fitBounds(bounds, 56);

    if (locations.length === 1) map.setZoom(17);
  }, [locations, map]);

  return null;
}

function RouteLines({
  locations, playedLocations,
}: {
  locations: TrackingLocation[];
  playedLocations: TrackingLocation[] | null;
}) {
  const map = useMap();

  React.useEffect(() => {
    if (!map) {
      return;
    }

    const grouped = new Map<number, google.maps.LatLngLiteral[]>();

    locations.forEach((location) => {
      const sessionId = location.sesionTrackingId ?? 0;

      const current = grouped.get(sessionId) ?? [];

      current.push({
        lat: location.latitud,
        lng: location.longitud,
      });

      grouped.set(sessionId, current);
    });

    const polylines = Array.from(grouped.values()).map(
      (path, index) =>
        new google.maps.Polyline({
          map,
          path,
          geodesic: true,
          strokeColor: ROUTE_COLORS[index % ROUTE_COLORS.length],
          strokeOpacity: playedLocations ? 0.3 : 0.9,
          strokeWeight: 4,
          clickable: false,
        }),
    );

    if (playedLocations) {
      const played = new Map<number, google.maps.LatLngLiteral[]>();
      playedLocations.forEach((location) => {
        const id = location.sesionTrackingId ?? 0;
        const points = played.get(id) ?? [];
        points.push({ lat: location.latitud, lng: location.longitud });
        played.set(id, points);
      });
      Array.from(played.entries()).forEach(([sessionId, path]) => {
        const i = Array.from(grouped.keys()).indexOf(sessionId);
        polylines.push(new google.maps.Polyline({
          map, path, geodesic: true, clickable: false,
          strokeColor: ROUTE_COLORS[Math.max(0, i) % ROUTE_COLORS.length],
          strokeWeight: 6, strokeOpacity: 1, zIndex: 30,
        }));
      });
    }
    return () => {
      polylines.forEach((polyline) => polyline.setMap(null));
    };
  }, [locations, playedLocations, map]);

  return null;
}

function ReplayCamera({ location }: { location: TrackingLocation }) {
  const map = useMap();
  React.useEffect(() => {
    if (!map) return;
    map.panTo({lat: location.latitud, lng: location.longitud});
    if ((map.getZoom() ?? 0) < 15) map.setZoom(15);
  }, [map, location.latitud, location.longitud]);
  return null;
}
