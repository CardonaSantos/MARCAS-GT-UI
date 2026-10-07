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

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("El archivo no pudo convertirse a contenido."));
        return;
      }
      resolve(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
