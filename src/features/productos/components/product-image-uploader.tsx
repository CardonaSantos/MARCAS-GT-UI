import { ImagePlus, Pencil, Scissors, Trash2, X } from "lucide-react";
import Cropper from "react-easy-crop";
import { useDropzone } from "react-dropzone";

import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

import type { ProductImagesController } from "../common/use-product-images";
import { MAX_PRODUCT_IMAGES } from "../common/product-image.utils";

interface ProductImageUploaderProps {
  controller: ProductImagesController;
  disabled?: boolean;
}

export function ProductImageUploader({ controller, disabled }: ProductImageUploaderProps) {
  const busy = disabled || controller.isProcessing;
  const editing = controller.selectedImage !== null;
  const dropzone = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    disabled: busy || editing || controller.images.length >= MAX_PRODUCT_IMAGES,
    onDrop: (files) => {
      if (files[0]) void controller.addFile(files[0]);
    },
  });

  return (
    <AppCard title="Imágenes" icon={<ImagePlus />} size="sm">
      <AppStack gap="md">
        <div
          {...dropzone.getRootProps()}
          className="flex min-h-24 cursor-pointer items-center justify-center rounded-lg border border-dashed border-[hsl(var(--app-border))] p-4 text-center transition-colors hover:bg-[hsl(var(--app-muted))] aria-disabled:cursor-not-allowed"
          aria-disabled={busy || editing || controller.images.length >= MAX_PRODUCT_IMAGES}
        >
          <input {...dropzone.getInputProps()} />
          <div className="space-y-1">
            <ImagePlus className="mx-auto h-5 w-5 text-[hsl(var(--app-muted-foreground))]" />
            <p className="text-sm">Arrastra una imagen o haz clic para elegirla</p>
            <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
              {controller.images.length}/{MAX_PRODUCT_IMAGES} imágenes · máximo 5 MB por archivo
            </p>
          </div>
        </div>

        {controller.selectedImage ? (
          <div className="space-y-3 rounded-lg border border-[hsl(var(--app-border))] p-3">
            <p className="text-sm font-medium">Recortar o conservar imagen original</p>
            <div className="relative h-52 w-full overflow-hidden rounded-md bg-black/80">
              <Cropper
                image={controller.selectedImage}
                crop={controller.crop}
                zoom={controller.zoom}
                aspect={4 / 3}
                onCropChange={controller.setCrop}
                onZoomChange={controller.setZoom}
                onCropComplete={(_, croppedPixels) => controller.setCropArea(croppedPixels)}
              />
            </div>
            <label className="flex items-center gap-3 text-xs">
              Zoom
              <input type="range" min={1} max={3} step={0.1}
                value={controller.zoom}
                onChange={(e) => controller.setZoom(Number(e.target.value))}
                className="min-w-0 flex-1" disabled={busy} />
            </label>
            <div className="flex flex-wrap gap-2">
              <AppButton size="sm" variant="primary" type="button"
                leftIcon={<Scissors />} loading={controller.isProcessing}
                onClick={() => void controller.saveCrop()} disabled={busy}>
                Guardar recorte
              </AppButton>
              <AppButton size="sm" variant="secondary" type="button"
                onClick={controller.useOriginal} disabled={busy}>
                Imagen completa
              </AppButton>
              <AppButton size="sm" variant="ghost" type="button"
                leftIcon={<X />} onClick={controller.dismissEditor} disabled={busy}>
                Cancelar
              </AppButton>
            </div>
          </div>
        ) : null}

        {controller.images.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {controller.images.map((image, index) => (
              <div key={index} className="overflow-hidden rounded-md border border-[hsl(var(--app-border))]">
                <img src={image} alt={`Foto del producto ${index + 1}`}
                  className="aspect-square w-full object-contain" />
                <div className="flex justify-end gap-1 p-1">
                  <AppButton type="button" variant="ghost" size="xs"
                    title="Editar imagen" aria-label={`Editar imagen ${index + 1}`}
                    onClick={() => controller.edit(index)} disabled={busy || editing}>
                    <Pencil className="h-4 w-4" />
                  </AppButton>
                  <AppButton type="button" variant="ghost" size="xs"
                    title="Eliminar imagen" aria-label={`Eliminar imagen ${index + 1}`}
                    onClick={() => controller.remove(index)} disabled={busy || editing}>
                    <Trash2 className="h-4 w-4" />
                  </AppButton>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </AppStack>
    </AppCard>
  );
}
