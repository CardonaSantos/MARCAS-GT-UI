# Google Maps — Tracking UI

Crea `.env.local` en la raíz de MARCAS-GT-UI (junto a package.json):

```dotenv
VITE_GOOGLE_MAPS_API_KEY=tu_clave_google_maps
```

Conserva la variable `VITE_API_URL` ya configurada. Reinicia Vite (`npm run dev`).
En Railway, añade `VITE_GOOGLE_MAPS_API_KEY` al servicio que **compila** el frontend y vuelve a desplegarlo.

Activa **Maps JavaScript API** y facturación en Google Cloud Console. Restringe la clave
a **Sitios web (HTTP referrers)** y permite exclusivamente **Maps JavaScript API**.
Incluye los dominios de producción y de desarrollo, por ejemplo `http://localhost:5173/*`.
Las claves `VITE_*` son visibles en el navegador por diseño. No contienen secretos
de servidor: su protección depende de las restricciones configuradas en Google Cloud.

La antigua clave literal presente en los mapas heredados estuvo publicada en el código:
recomendamos **revocarla o rotarla** y utilizar otra clave restringida.

## Componentes

- `src/features/common/maps/google-maps-provider.tsx`: carga compartida y estados de error.
- `src/features/tracking/components/tracking-map.tsx`: mapa de monitoreo e historial.
- `src/Pages/Employees.tsx` y `src/components/Map/Map.tsx`: mapas heredados.

La librería `@react-google-maps/api` ya forma parte del proyecto. Tracking no necesita
paquetes nuevos. Las rutas se reconstruyen con posiciones GPS reales de cada sesión,
no se infiere un recorrido vial entre los puntos registrados.

## Pruebas

1. `npm run build`.
2. Abrir `/marcas-gt/tracking`, comprobar selección, vista híbrida/calles,
   controles y actualizaciones por Socket.IO sin recentrar por cada ubicación.
3. En `/marcas-gt/tracking/historial`, consultar una jornada y
   comprobar segmentos, extremos y línea temporal.
4. Verificar estados de clave faltante e inválida.
5. Revisar que `/marcas-gt/empleados` y los mapas heredados funcionen.
