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
};

export type MapSegment = {
  id: number;
  points: Array<{ latitud: number; longitud: number; capturadoEn?: string | null }>;
};

type Props = {
  employees?: MapEmployee[];
  segments?: MapSegment[];
  selectedId?: number | null;
  onSelect?: (id: number) => void;
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

function markerOffset(width: number, height: number) {
  return { x: -width / 2, y: -height };
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
  selectedId = null,
  onSelect,
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
  const coordinates = useMemo(
    () => [
      ...validSegments.flatMap((segment) => segment.points.map(toCoordinate)),
      ...validEmployees.map(toCoordinate),
    ],
    [validSegments, validEmployees],
  );

  // Stable identity: coordinates change frequently with GPS heartbeats.
  // Only joining/leaving workers or sessions triggers an automatic fit.
  const identity = useMemo(
    () =>
      validSegments.map((segment) => segment.id).sort((a, b) => a - b).join(":") +
      "|" + validEmployees.map((person) => person.id).sort((a, b) => a - b).join(":"),
    [validSegments, validEmployees],
  );

  const currentCoordinates = useRef(coordinates);
  currentCoordinates.current = coordinates;
  const currentEmployees = useRef(validEmployees);
  currentEmployees.current = validEmployees;

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
    map.fitBounds(bounds, 55);
  }, []);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    fitToContent(map);
  }, [fitToContent]);

  const onMapUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  useEffect(() => {
    if (mapRef.current) fitToContent(mapRef.current);
  }, [identity, fitToContent]);

  useEffect(() => {
    if (selectedId === null || !mapRef.current) return;
    const selected = currentEmployees.current.find((person) => person.id === selectedId);
    if (!selected) return;
    mapRef.current.panTo(toCoordinate(selected));
    if ((mapRef.current.getZoom() ?? 0) < 14) mapRef.current.setZoom(14);
  }, [selectedId]);

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
            key={segment.id}
            path={segment.points.map(toCoordinate)}
            options={{
              strokeColor: ROUTE_COLORS[index % ROUTE_COLORS.length],
              strokeWeight: 4,
              strokeOpacity: 0.9,
              geodesic: false,
              clickable: false,
            }}
          />
        ))}

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

        {validEmployees.map((person) => (
          <OverlayView
            key={person.id}
            position={toCoordinate(person)}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            getPixelPositionOffset={markerOffset}
          >
            <button
              type="button"
              title={person.nombre}
              aria-label={"Ver ubicación de " + person.nombre}
              onClick={(event) => {
                event.stopPropagation();
                setOpenedId(person.id);
                onSelect?.(person.id);
              }}
              className={
                "group flex flex-col items-center outline-none transition-transform hover:scale-110 focus-visible:scale-110 " +
                (selectedId === person.id ? "scale-110" : "")
              }
            >
              <span
                className={
                  "flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-white text-sm font-bold text-white shadow-lg ring-2 " +
                  (selectedId === person.id
                    ? "bg-sky-600 ring-sky-400"
                    : person.rol === "ADMIN"
                      ? "bg-rose-600 ring-rose-500/60"
                      : person.rol === "REPARTIDOR"
                        ? "bg-amber-600 ring-amber-500/60"
                        : "bg-emerald-600 ring-emerald-500/60")
                }
              >
                {person.nombre.trim().charAt(0).toUpperCase() || "?"}
              </span>
              <span className="mt-0.5 max-w-[120px] truncate rounded bg-slate-900/85 px-2 py-0.5 text-[10px] font-semibold text-white shadow">
                {person.nombre}
              </span>
            </button>
          </OverlayView>
        ))}

        {infoEmployee ? (
          <InfoWindow
            position={toCoordinate(infoEmployee)}
            onCloseClick={() => setOpenedId(null)}
            options={{ pixelOffset: new google.maps.Size(0, -56) }}
          >
            <div className="max-w-[240px] space-y-1 text-sm text-slate-800">
              <p className="font-semibold">{infoEmployee.nombre}</p>
              <p className="text-xs text-slate-500">{infoEmployee.rol}</p>
              {infoEmployee.descripcion ? <p className="text-xs">{infoEmployee.descripcion}</p> : null}
              {infoEmployee.capturadoEn ? (
                <p className="text-xs">Último GPS: {trackingDateTime(infoEmployee.capturadoEn)}</p>
              ) : null}
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
