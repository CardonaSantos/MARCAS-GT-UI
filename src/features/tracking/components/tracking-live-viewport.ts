import type { TrackingRealtimeView } from "../api/tracking.types";

/**
 * Encaje de cámara exclusivo para el mapa en vivo.
 * Google Maps fitBounds cambia el zoom de manera diferida. Para un
 * empleado usamos centro + zoom explícitos, sin competir con fitBounds.
 */
export function fitTrackingLiveViewport(
  map: google.maps.Map,
  rows: TrackingRealtimeView[],
): void {
  const points = rows.flatMap((row) => {
    const location = row.ubicacion;
    if (!location) return [];
    if (!Number.isFinite(location.latitud) || !Number.isFinite(location.longitud)) return [];
    if (Math.abs(location.latitud) > 90 || Math.abs(location.longitud) > 180) return [];
    return [{ lat: location.latitud, lng: location.longitud }];
  });

  if (points.length === 0) return;

  if (points.length === 1) {
    map.setCenter(points[0]);
    map.setZoom(16);
    return;
  }

  const bounds = new google.maps.LatLngBounds();
  points.forEach((point) => bounds.extend(point));
  map.fitBounds(bounds, { top: 65, right: 65, bottom: 65, left: 65 });

  // Evita que varios empleados muy próximos produzcan zoom excesivo.
  google.maps.event.addListenerOnce(map, "idle", () => {
    const zoom = map.getZoom();
    if (zoom !== undefined && zoom > 16) map.setZoom(16);
  });
}
