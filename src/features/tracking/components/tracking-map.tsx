import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { GoogleMap, InfoWindow, Marker, OverlayView, Polyline } from "@react-google-maps/api";
import { Layers, LocateFixed, Maximize2, Minus, Plus } from "lucide-react";

import { GoogleMapsProvider } from "@/features/common/maps/google-maps-provider";
import { trackingCoordinateValid, trackingDateTime } from "../api/tracking.types";

export type MapEmployee = {
  id: number;
  nombre: string;
  rol: string;
  latitud: number;
  longitud: number;
  descripcion?: string;
  capturadoEn?: string | null;
  precision?: number | null;
  stale?: boolean;
};

export type MapSegment = {
  id: number;
  points: Array<{ latitud: number; longitud: number; capturadoEn?: string | null }>;
};

type Props = {
  employees?: MapEmployee[];
  segments?: MapSegment[];
  /** Optional replay: keep full route visible while highlighting points up to the timeline cursor. */
  playbackSegments?: MapSegment[];
  selectedId?: number | null;
  onSelect?: (id: number) => void;
  /** When replaying, follow the explicit timeline cursor instead of fitting the full route. */
  focusPoint?: { latitud: number; longitud: number } | null;
  height?: number;
};

type MapCoordinate = { lat: number; lng: number };

const ROUTE_COLORS = ["#22c59d", "#60a5fa", "#f59e0b", "#a78bfa"] as const;

const MAP_OPTIONS: google.maps.MapOptions = {
  mapTypeId: "hybrid",
  disableDefaultUI: true,
  clickableIcons: false,
  gestureHandling: "greedy",
  keyboardShortcuts: true,
  streetViewControl: false,
};

function toCoordinate(point: { latitud: number; longitud: number }): MapCoordinate {
  return { lat: point.latitud, lng: point.longitud };
}

function personColor(person: MapEmployee): string {
  if (person.stale) return "#d97706";
  if (person.rol === "ADMIN") return "#e11d48";
  if (person.rol === "REPARTIDOR") return "#d97706";
  return "#059669";
}

function MapAction({ label, onClick, children }: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-md text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
    >
      {children}
    </button>
  );
}

function GoogleTrackingMap({
  employees = [],
  segments = [],
  playbackSegments,
  selectedId = null,
  onSelect,
  focusPoint = null,
  height = 500,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [openedId, setOpenedId] = useState<number | null>(null);
  const [mapType, setMapType] = useState<"hybrid" | "roadmap">("hybrid");

  const validEmployees = useMemo(
    () => employees.filter((person) => trackingCoordinateValid(person)),
    [employees],
  );
  const validSegments = useMemo(
    () =>
      segments.map((segment) => ({
        ...segment,
        points: segment.points.filter((point) => trackingCoordinateValid(point)),
      })).filter((segment) => segment.points.length > 0),
    [segments],
  );
  const validPlaybackSegments = useMemo(
    () => playbackSegments?.map((segment) => ({
      ...segment,
      points: segment.points.filter((point) => trackingCoordinateValid(point)),
    })).filter((segment) => segment.points.length > 0),
    [playbackSegments],
  );
  const coordinates = useMemo(
    () => [
      ...validSegments.flatMap((segment) => segment.points.map(toCoordinate)),
      ...validEmployees.map(toCoordinate),
    ],
    [validSegments, validEmployees],
  );

  // Only joining/leaving workers or loaded-route changes triggers an automatic fit.
  const identity = useMemo(
    () =>
      validSegments.map((segment) => segment.id + ":" + segment.points.length).sort().join(":") +
      "|" + validEmployees.map((person) => person.id).sort((a, b) => a - b).join(":"),
    [validSegments, validEmployees],
  );

  const currentCoordinates = useRef(coordinates);
  currentCoordinates.current = coordinates;
  const currentEmployees = useRef(validEmployees);
  currentEmployees.current = validEmployees;
  const selectedPerson = validEmployees.find((person) => person.id === selectedId);
  const selectedLatitude = selectedPerson?.latitud;
  const selectedLongitude = selectedPerson?.longitud;

  const fitToContent = useCallback((map: google.maps.Map) => {
    const points = currentCoordinates.current;
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setCenter(points[0]);
      map.setZoom(16);
      return;
    }
    const bounds = new google.maps.LatLngBounds();
    points.forEach((point) => bounds.extend(point));
    map.fitBounds(bounds, 80);
  }, []);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    fitToContent(map);
  }, [fitToContent]);

  const onMapUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  // CRM-style camera: fit once per route change, then follow only a selected
  // person or an explicit replay point. Do not recenter on every background GPS.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (focusPoint && trackingCoordinateValid(focusPoint)) {
      map.panTo(toCoordinate(focusPoint));
      if ((map.getZoom() ?? 0) < 16) map.setZoom(16);
    } else if (selectedId === null) {
      fitToContent(map);
    }
  }, [identity, fitToContent, focusPoint?.latitud, focusPoint?.longitud, selectedId]);

  useEffect(() => {
    if (selectedId === null || !mapRef.current) return;
    const selected = currentEmployees.current.find((person) => person.id === selectedId);
    if (!selected) return;
    mapRef.current.panTo(toCoordinate(selected));
    if ((mapRef.current.getZoom() ?? 0) < 16) mapRef.current.setZoom(16);
  }, [selectedId, selectedLatitude, selectedLongitude]);

  useEffect(() => {
    if (openedId !== null && !validEmployees.some((person) => person.id === openedId)) {
      setOpenedId(null);
    }
  }, [openedId, validEmployees]);

  const toggleMapType = () => {
    const next = mapType === "hybrid" ? "roadmap" : "hybrid";
    setMapType(next);
    mapRef.current?.setMapTypeId(next);
  };

  const toggleFullscreen = () => {
    const node = containerRef.current;
    if (!node) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void node.requestFullscreen().catch(() => undefined);
    }
  };

  const infoEmployee = validEmployees.find((person) => person.id === openedId) ?? null;

  if (!coordinates.length) {
    return (
      <div
        className="flex items-center justify-center rounded-lg border border-[hsl(var(--app-border))] bg-[hsl(var(--app-muted))] px-6 text-center text-sm text-[hsl(var(--app-muted-foreground))]"
        style={{ minHeight: height }}
      >
        No hay coordenadas GPS disponibles para representar en el mapa.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-lg border border-[hsl(var(--app-border))] bg-slate-900"
      style={{ height }}
    >
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        options={MAP_OPTIONS}
        onLoad={onMapLoad}
        onUnmount={onMapUnmount}
        onClick={() => setOpenedId(null)}
      >
        {validSegments.map((segment, index) => (
          <Polyline
            key={"full-" + segment.id}
            path={segment.points.map(toCoordinate)}
            options={{
              strokeColor: ROUTE_COLORS[index % ROUTE_COLORS.length],
              strokeWeight: validPlaybackSegments ? 4 : 5,
              strokeOpacity: validPlaybackSegments ? 0.42 : 1,
              zIndex: 10,
              geodesic: false,
              clickable: false,
            }}
          />
        ))}
        {validPlaybackSegments?.map((segment) => {
          const colorIndex = validSegments.findIndex((item) => item.id === segment.id);
          return (
            <Polyline
              key={"played-" + segment.id}
              path={segment.points.map(toCoordinate)}
              options={{
                strokeColor: ROUTE_COLORS[Math.max(0, colorIndex) % ROUTE_COLORS.length],
                strokeWeight: 6,
                strokeOpacity: 1,
                zIndex: 20,
                geodesic: false,
                clickable: false,
              }}
            />
          );
        })}

        {validSegments.flatMap((segment) => {
          const endpoints = segment.points.length > 1
            ? [segment.points[0], segment.points[segment.points.length - 1]]
            : [segment.points[0]];
          return endpoints.map((point, index) => (
            <Marker
              key={segment.id + "-" + index}
              position={toCoordinate(point)}
              title={(index === 0 ? "Inicio" : "Fin") + " de sesión #" + segment.id +
                " · " + trackingDateTime(point.capturadoEn)}
              zIndex={index === 0 ? 5 : 6}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 7,
                fillColor: index === 0 ? "#3b82f6" : "#f59e0b",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
              }}
            />
          ));
        })}

        {validEmployees.map((person) => {
          const selected = selectedId === person.id;
          const label = (person.nombre.trim().charAt(0) || "?").toUpperCase();
          const color = personColor(person);
          return (
            <OverlayView
              key={"person-" + person.id}
              position={toCoordinate(person)}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <button
                type="button"
                aria-label={"Ver ubicación de " + person.nombre}
                title={person.nombre + " · " + person.rol + " · GPS " + trackingDateTime(person.capturadoEn)}
                onClick={(event) => {
                  event.stopPropagation();
                  setOpenedId(person.id);
                  onSelect?.(person.id);
                }}
                className="group relative flex flex-col items-center focus-visible:outline-none"
                style={{ transform: "translate(-50%, -100%)", zIndex: selected ? 200 : 100 }}
              >
                <span
                  className={"relative flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-white text-lg font-bold text-white shadow-xl ring-offset-2 transition-transform group-hover:scale-110 " +
                    (selected ? "scale-110 ring-2 ring-sky-400" : "")}
                  style={{ backgroundColor: color }}
                >
                  {selected ? <span className="absolute -inset-2 animate-ping rounded-full bg-sky-400/30" /> : null}
                  <span className="relative">{label}</span>
                </span>
                <span className="-mt-px h-0 w-0 border-x-[7px] border-t-[10px] border-x-transparent" style={{ borderTopColor: color }} />
                <span className="mt-1 max-w-[160px] truncate rounded bg-white/95 px-2 py-0.5 text-[11px] font-semibold text-slate-900 shadow">
                  {person.nombre}
                </span>
              </button>
            </OverlayView>
          );
        })}

        {infoEmployee ? (
          <InfoWindow
            position={toCoordinate(infoEmployee)}
            onCloseClick={() => setOpenedId(null)}
            options={{ pixelOffset: new google.maps.Size(0, -58) }}
          >
            <div className="max-w-[240px] space-y-1 text-sm text-slate-800">
              <p className="font-semibold">{infoEmployee.nombre}</p>
              <p className="text-xs text-slate-500">{infoEmployee.rol}</p>
              {infoEmployee.descripcion ? <p className="text-xs">{infoEmployee.descripcion}</p> : null}
              {infoEmployee.capturadoEn ? (
                <p className="text-xs">Último GPS: {trackingDateTime(infoEmployee.capturadoEn)}</p>
              ) : null}
              {infoEmployee.stale ? <p className="text-xs font-medium text-amber-700">Ubicación antigua: no se ha recibido GPS reciente.</p> : null}
              {infoEmployee.precision != null ? (
                <p className="text-xs">Precisión ±{Math.round(infoEmployee.precision)} m</p>
              ) : null}
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>

      <div className="absolute right-3 top-3 z-10 flex flex-col gap-1 rounded-lg border border-slate-200 bg-white/95 p-1 shadow-xl backdrop-blur-sm">
        <MapAction label={mapType === "hybrid" ? "Ver mapa de calles" : "Ver mapa satelital"} onClick={toggleMapType}>
          <Layers className="h-4 w-4" />
        </MapAction>
        <MapAction label="Ajustar a todas las ubicaciones" onClick={() => mapRef.current && fitToContent(mapRef.current)}>
          <LocateFixed className="h-4 w-4" />
        </MapAction>
        <div className="my-0.5 h-px bg-slate-200" />
        <MapAction label="Acercar" onClick={() => mapRef.current?.setZoom((mapRef.current.getZoom() ?? 13) + 1)}>
          <Plus className="h-4 w-4" />
        </MapAction>
        <MapAction label="Alejar" onClick={() => mapRef.current?.setZoom((mapRef.current.getZoom() ?? 13) - 1)}>
          <Minus className="h-4 w-4" />
        </MapAction>
        <div className="my-0.5 h-px bg-slate-200" />
        <MapAction label="Pantalla completa" onClick={toggleFullscreen}>
          <Maximize2 className="h-4 w-4" />
        </MapAction>
      </div>

      <div className="pointer-events-none absolute bottom-5 left-3 z-10 rounded bg-slate-900/80 px-2 py-1 text-[10px] text-white shadow">
        {validSegments.length
          ? validSegments.length + " sesión(es) · " +
            validSegments.reduce((sum, segment) => sum + segment.points.length, 0) + " puntos"
          : validEmployees.length + " ubicación(es)"}
      </div>
    </div>
  );
}

export function TrackingMap(props: Props) {
  return (
    <GoogleMapsProvider>
      <GoogleTrackingMap {...props} />
    </GoogleMapsProvider>
  );
}
