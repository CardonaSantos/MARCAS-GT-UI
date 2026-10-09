// Mantener esta ruta de importación para los formularios existentes de Entregas.
export { getCurrentPosition } from "@/features/common/utils/geolocation";
export type { GeolocationResult } from "@/features/common/utils/geolocation";

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
