/**
 * Posición puntual de alta precisión. Se utiliza únicamente al pulsar
 * «Usar ubicación actual»; no inicia tracking continuo.
 *
 * El navegador requiere un contexto seguro (HTTPS o localhost) y permiso.
 */
export type GeolocationResult = {
  latitud: number;
  longitud: number;
  precisionM: number | null;
};

export function getCurrentPosition(): Promise<GeolocationResult> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Este navegador no soporta geolocalización."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitud: position.coords.latitude,
          longitud: position.coords.longitude,
          precisionM: Number.isFinite(position.coords.accuracy)
            ? position.coords.accuracy
            : null,
        });
      },
      (error) => {
        reject(
          new Error(
            error.message || "No se pudo obtener la ubicación actual.",
          ),
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 30000,
      },
    );
  });
}
