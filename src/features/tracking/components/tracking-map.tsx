import { useEffect, useRef } from "react";
import {
  CircleMarker, LayersControl, MapContainer, Polyline, Popup, ScaleControl,
  TileLayer, useMap,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
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
  points: Array<{latitud: number; longitud: number; capturadoEn?: string | null}>;
};

type Props = {
  employees?: MapEmployee[];
  segments?: MapSegment[];
  selectedId?: number | null;
  onSelect?: (id: number) => void;
  height?: number;
};

function FitToContent({ coordinates, signature }: {coordinates: LatLngExpression[]; signature: string}) {
  const map = useMap();
  const latest = useRef(coordinates);
  latest.current = coordinates;
  useEffect(() => {
    if (latest.current.length === 0) return;
    if (latest.current.length === 1) map.setView(latest.current[0], 15);
    else map.fitBounds(latest.current as [number, number][], { padding: [35, 35], maxZoom: 15 });
  }, [map, signature]);
  return null;
}

function FocusEmployee({ coordinate, selectedId }: {coordinate: LatLngExpression | null; selectedId: number | null}) {
  const map = useMap();
  const latest = useRef(coordinate);
  latest.current = coordinate;
  // Follow an explicit selection, not every GPS heartbeat.
  useEffect(() => {
    if (latest.current) map.flyTo(latest.current, Math.max(map.getZoom(), 14), { duration: 0.45 });
  }, [map, selectedId]);
  return null;
}

export function TrackingMap({ employees = [], segments = [], selectedId = null, onSelect, height = 500 }: Props) {
  const validEmployees = employees.filter((person) => trackingCoordinateValid(person));
  const validSegments = segments.map((segment) => ({
    ...segment, points: segment.points.filter((point) => trackingCoordinateValid(point)),
  })).filter((segment) => segment.points.length > 0);
  const coordinates: LatLngExpression[] = validSegments.flatMap((segment) =>
    segment.points.map((point) => [point.latitud, point.longitud] as [number, number]));
  coordinates.push(...validEmployees.map((person) => [person.latitud, person.longitud] as [number, number]));
  const selected = validEmployees.find((person) => person.id === selectedId);
  const focus = selected ? ([selected.latitud, selected.longitud] as [number, number]) : null;
  const identity = validSegments.map((segment) => segment.id).join(":") + "|" +
    validEmployees.map((person) => person.id).sort((a, b) => a - b).join(":");

  if (coordinates.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-[hsl(var(--app-border))] bg-[hsl(var(--app-muted))] px-6 text-center text-sm text-[hsl(var(--app-muted-foreground))]" style={{ minHeight: height }}>
        No hay coordenadas GPS disponibles para representar en el mapa.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[hsl(var(--app-border))]" style={{ height }}>
      <MapContainer center={coordinates[0]} zoom={13} scrollWheelZoom className="h-full w-full" zoomControl>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Mapa oscuro">
            <TileLayer attribution='&copy; OpenStreetMap contributors &copy; CARTO' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Mapa de calles">
            <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
        </LayersControl>
        <ScaleControl position="bottomleft" />
        <FitToContent coordinates={coordinates} signature={identity} />
        <FocusEmployee coordinate={focus} selectedId={selectedId} />
        {validSegments.map((segment, index) => (
          <Polyline
            key={segment.id}
            positions={segment.points.map((point) => [point.latitud, point.longitud] as [number, number])}
            pathOptions={{ color: ["#18ba9a", "#60a5fa", "#f59e0b", "#a78bfa"][index % 4], weight: 4, opacity: 0.85 }}
          />
        ))}
        {validSegments.flatMap((segment) => [segment.points[0], segment.points[segment.points.length - 1]]
          .filter((point): point is MapSegment["points"][number] => Boolean(point))).map((point, index) => (
          <CircleMarker key={"endpoint-" + index} center={[point.latitud, point.longitud]} radius={6}
            pathOptions={{ color: "#fff", weight: 2, fillColor: index % 2 === 0 ? "#3b82f6" : "#f59e0b", fillOpacity: 1 }}>
            <Popup>{index % 2 === 0 ? "Inicio" : "Fin"} de sesión · {trackingDateTime(point.capturadoEn)}</Popup>
          </CircleMarker>
        ))}
        {validEmployees.map((person) => (
          <CircleMarker key={person.id} center={[person.latitud, person.longitud]}
            radius={person.id === selectedId ? 13 : 10}
            pathOptions={{ color: "#fff", weight: 2, fillColor: person.id === selectedId ? "#0ea5e9" : "#10b981", fillOpacity: 0.95 }}
            eventHandlers={{ click: () => onSelect?.(person.id) }}>
            <Popup>
              <div className="space-y-1 text-sm">
                <strong>{person.nombre}</strong>
                <div>{person.rol}</div>
                {person.descripcion ? <div>{person.descripcion}</div> : null}
                {person.capturadoEn ? <div>GPS: {trackingDateTime(person.capturadoEn)}</div> : null}
                {person.precision != null ? <div>Precisión: ±{Math.round(person.precision)} m</div> : null}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
