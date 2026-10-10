import type { Area } from "react-easy-crop";

export const MAX_PRODUCT_IMAGES = 6;
export const MAX_PRODUCT_IMAGE_BYTES = 5 * 1024 * 1024;

export function readProductImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No fue posible leer la imagen."));
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Formato de imagen inválido."));
        return;
      }
      resolve(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export async function cropProductImage(source: string, area: Area): Promise<string> {
  const image = new Image();
  image.src = source;
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("No fue posible cargar la imagen para recortar."));
  });

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(area.width);
  canvas.height = Math.round(area.height);
  const context = canvas.getContext("2d");
  if (!context || !canvas.width || !canvas.height) {
    throw new Error("No se pudo procesar el recorte.");
  }
  context.drawImage(
    image, area.x, area.y, area.width, area.height,
    0, 0, canvas.width, canvas.height,
  );
  return canvas.toDataURL("image/jpeg", 0.9);
}
