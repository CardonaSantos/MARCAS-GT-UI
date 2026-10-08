# Tracking UI — validación operativa

Módulo: MARCAS GT, rama update-requerimientos. Protección ADMIN para monitoreo e histórico.
Servidor: src/modules/tracking, base /real-time-location/tracking.

## Pantallas

- /marcas-gt/tracking — snapshot GET /realtime, socket namespace /ws, fallback HTTP cada 60 s.
- /marcas-gt/tracking/historial — GET /history (page, limit, search, estadoSesion, fechaDesde, fechaHasta).
- /marcas-gt/tracking/jornadas/:id — GET /attendance/:id y /attendance/:id/locations (paginación de 500).
- Los mapas usan Leaflet + teselas CARTO/OSM. Requieren internet para cargar las teselas, no una API key de Google.

## Checklist manual, ejecutar contra backend de pruebas

1. Confirmar build: npm ci && npm run build. Ejecutar también npm run lint para revisar advertencias del repositorio.
2. Usuario ADMIN: abrir monitoreo sin sesiones; debe mostrarse estado vacío y no una ubicación inventada.
3. Iniciar tracking mediante una sesión real (POST /start con token de vendedor/repartidor). El operador debería verlo en la lista aunque todavía no tenga GPS.
4. Registrar GPS (POST /location con sesionTrackingId, latitud, longitud, capturadoEn y claveIdempotencia). Verificar que aparece en el mapa y que la tarjeta muestra su fecha y precisión.
5. Validar Socket.IO: el snapshot debe refrescarse al recibir tracking:location-updated, sin mover automáticamente el mapa con cada heartbeat.
6. Interrumpir la conexión WebSocket: la consulta HTTP debe seguir funcionando. Al reconectar, debe invalidarse el snapshot.
7. Finalizar la sesión mediante POST /:sesionTrackingId/finish. Confirmar que desaparece de activas y permanece en el histórico.
8. Historial: probar búsqueda por nombre/correo, filtros de fecha y estado, paginación y el enlace de detalle.
9. En una jornada con múltiples sesiones, verificar duración, puntos, períodos sin tracking y que la ruta no conecte distintos períodos de captura.
10. Para más de 500 puntos GPS, probar «Cargar 500 puntos más» y confirmar que el total y el recorrido se actualizan sin perder el filtro por sesión.
11. Si hay puntos GPS con baja precisión, probar el filtro de precisión. La ruta es aproximada: no se debe presentar como trazado vial exacto.
12. Intentar acceder como VENDEDOR, BODEGA y REPARTIDOR a las rutas administrativas. El frontend y el backend deben impedir acceso.
13. Comprobar fechas en zona America/Guatemala y rangos históricos que abarcan distintos días.
14. Probar sesiones expiradas (configuración TRACKING_STALE_AFTER_MINUTES del servidor) y su reflejo en historial.

## Límites y decisiones

- La UI administrativa **no crea coordenadas** ni inicia tracking ajeno: refleja sesiones que envían GPS desde un cliente.
- Las visitas activas y los envíos activos se muestran si están presentes en el snapshot realtime. La correlación de visitas terminadas con paradas históricas no está incluida en el read-side y requerirá integración adicional.
- **PENDIENTE DE RECONCILIACIÓN**: las pantallas legacy /attendance/check-in y /attendance/check-out todavía coexisten con Tracking V1, que administra una jornada única por usuario/día. No ampliar su uso hasta verificar compatibilidad del servicio legacy con la restricción Asistencia_usuarioId_fecha_key y el cierre de sesión.
- El valor de «minutos de tracking» es tiempo confirmado por el servidor; los intervalos sin reporte no deben inferirse como trabajo realizado.
- La falta de GPS no equivale a una ausencia laboral.
