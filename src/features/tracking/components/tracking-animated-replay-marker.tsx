import * as React from "react";
import type { TrackingLocation } from "../api/tracking.types";
import { useMap } from "./tracking-google-compat";

// Pin similar al del CRM, pero la coordenada coincide con el centro (21,21).
// No usa OverlayView ni offsets CSS compartidos con el mapa en vivo.
const REPLAY_PIN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42">
  <circle cx="21" cy="21" r="19" fill="#059669" stroke="#ffffff" stroke-width="3"/>
  <path d="M14 22 L29 13 L24 29 L20 23 Z" fill="#ffffff"/>
</svg>`;
const REPLAY_PIN_URL = "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(REPLAY_PIN_SVG);

const EASING_DURATION_MS = 300;
const MAX_ANIMATED_STEPS = 12;

type Coordinate = { lat: number; lng: number };
const toCoordinate = (point: TrackingLocation): Coordinate => ({
  lat: point.latitud,
  lng: point.longitud,
});

function distance(a: Coordinate, b: Coordinate): number {
  // Solo se utiliza para repartir el avance a lo largo de los segmentos GPS.
  const avgLatRad = ((a.lat + b.lat) / 2) * Math.PI / 180;
  return Math.hypot((b.lat - a.lat) * 111_000,
    (b.lng - a.lng) * 111_000 * Math.cos(avgLatRad));
}

/** Mover el pin sobre los segmentos reales, nunca en diagonal entre curvas. */
function interpolatePath(path: Coordinate[], progress: number): Coordinate {
  if (path.length === 1) return path[0];
  const lengths: number[] = [];
  let total = 0;
  for (let i = 1; i < path.length; i++) {
    const segment = distance(path[i - 1], path[i]);
    lengths.push(segment);
    total += segment;
  }
  if (total < 0.001) return path[path.length - 1];

  let remaining = Math.max(0, Math.min(1, progress)) * total;
  for (let i = 0; i < lengths.length; i++) {
    const segment = lengths[i];
    if (remaining <= segment || i === lengths.length - 1) {
      const ratio = segment < 0.001 ? 1 : Math.min(1, remaining / segment);
      return {
        lat: path[i].lat + (path[i + 1].lat - path[i].lat) * ratio,
        lng: path[i].lng + (path[i + 1].lng - path[i].lng) * ratio,
      };
    }
    remaining -= segment;
  }
  return path[path.length - 1];
}

export function TrackingAnimatedReplayMarker({
  location,
  route,
}: {
  location: TrackingLocation | null;
  route: TrackingLocation[];
}) {
  const map = useMap();
  const markerRef = React.useRef<google.maps.Marker | null>(null);
  const frameRef = React.useRef<number | null>(null);
  const previousRef = React.useRef<TrackingLocation | null>(null);

  React.useEffect(() => {
    if (!map) return;
    const marker = new google.maps.Marker({
      map,
      visible: false,
      clickable: false,
      zIndex: 300,
      title: "Ubicación GPS seleccionada",
      icon: {
        url: REPLAY_PIN_URL,
        scaledSize: new google.maps.Size(42, 42),
        size: new google.maps.Size(42, 42),
        anchor: new google.maps.Point(21, 21),
      },
    });
    markerRef.current = marker;
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      previousRef.current = null;
      marker.setMap(null);
      markerRef.current = null;
    };
  }, [map]);

  React.useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    if (!location) {
      marker.setVisible(false);
      previousRef.current = null;
      return;
    }

    const previous = previousRef.current;
    const target = toCoordinate(location);
    previousRef.current = location;
    marker.setVisible(true);

    const fromIndex = previous ? route.findIndex((p) => p.id === previous.id) : -1;
    const toIndex = route.findIndex((p) => p.id === location.id);
    const steps = Math.abs(toIndex - fromIndex);
    const sameSession = Boolean(previous &&
      previous.sesionTrackingId === location.sesionTrackingId);
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    // Saltos entre sesiones, selección masiva o primer punto: no inventar
    // una trayectoria intermedia que el servidor nunca registró.
    if (!previous || !sameSession || fromIndex < 0 || toIndex < 0 ||
        steps === 0 || steps > MAX_ANIMATED_STEPS || prefersReducedMotion) {
      marker.setPosition(target);
      return;
    }

    const forward = toIndex > fromIndex;
    const section = forward
      ? route.slice(fromIndex, toIndex + 1)
      : route.slice(toIndex, fromIndex + 1).reverse();
    if (!section.every((point) => point.sesionTrackingId === location.sesionTrackingId)) {
      marker.setPosition(target);
      return;
    }

    // Si el usuario arrastra rápidamente, continuar desde la ubicación
    // visual actual en lugar de reiniciar cada fotograma en el punto previo.
    const startPosition = marker.getPosition();
    const start = startPosition
      ? { lat: startPosition.lat(), lng: startPosition.lng() }
      : toCoordinate(section[0]);
    const path = [start, ...section.slice(1).map(toCoordinate)];
    const startAt = performance.now();
    const animate = (timestamp: number) => {
      const t = Math.min(1, (timestamp - startAt) / EASING_DURATION_MS);
      const eased = t * t * (3 - 2 * t);
      marker.setPosition(interpolatePath(path, eased));
      if (t < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        marker.setPosition(target);
        frameRef.current = null;
      }
    };
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [map, location?.id, location?.latitud, location?.longitud, location?.sesionTrackingId, route]);

  return null;
}
