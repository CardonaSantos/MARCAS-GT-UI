import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { Area } from "react-easy-crop";

import {
  cropProductImage,
  MAX_PRODUCT_IMAGE_BYTES,
  MAX_PRODUCT_IMAGES,
  readProductImage,
} from "./product-image.utils";

export function useProductImages() {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropArea, setCropArea] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const dismissEditor = useCallback(() => {
    setSelectedImage(null);
    setEditingIndex(null);
    setCropArea(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }, []);

  const addFile = useCallback(async (file: File) => {
    if (selectedImage || isProcessing) return;
    if (images.length >= MAX_PRODUCT_IMAGES) {
      toast.warning(`Máximo ${MAX_PRODUCT_IMAGES} imágenes por producto.`);
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.warning("Selecciona un archivo de imagen.");
      return;
    }
    if (file.size > MAX_PRODUCT_IMAGE_BYTES) {
      toast.warning("La imagen supera el límite de 5 MB.");
      return;
    }
    setIsProcessing(true);
    try {
      const url = await readProductImage(file);
      setEditingIndex(null);
      setSelectedImage(url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al leer la imagen.");
    } finally {
      setIsProcessing(false);
    }
  }, [images.length, isProcessing, selectedImage]);

  const edit = useCallback((index: number) => {
    if (isProcessing || selectedImage || !images[index]) return;
    setEditingIndex(index);
    setSelectedImage(images[index]);
  }, [images, isProcessing, selectedImage]);

  const applyImage = useCallback((image: string) => {
    setImages((previous) => {
      if (editingIndex !== null) {
        return previous.map((value, index) => index === editingIndex ? image : value);
      }
      if (previous.length >= MAX_PRODUCT_IMAGES) return previous;
      return [...previous, image];
    });
    dismissEditor();
  }, [dismissEditor, editingIndex]);

  const saveCrop = useCallback(async () => {
    if (!selectedImage || !cropArea || isProcessing) return;
    setIsProcessing(true);
    try {
      const image = await cropProductImage(selectedImage, cropArea);
      applyImage(image);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al recortar imagen.");
    } finally {
      setIsProcessing(false);
    }
  }, [selectedImage, cropArea, isProcessing, applyImage]);

  const remove = useCallback((index: number) => {
    if (isProcessing || selectedImage) return;
    setImages((old) => old.filter((_, i) => i !== index));
  }, [isProcessing, selectedImage]);

  const reset = useCallback(() => {
    setImages([]);
    dismissEditor();
  }, [dismissEditor]);

  return {
    images, selectedImage, crop, zoom, isProcessing,
    setCrop, setZoom, setCropArea,
    addFile, edit, remove, reset, dismissEditor,
    useOriginal: () => selectedImage && !isProcessing && applyImage(selectedImage),
    saveCrop,
  };
}

export type ProductImagesController = ReturnType<typeof useProductImages>;
