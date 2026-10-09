import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AppForm, AppFormSubmit } from "@/ui/components/app/form";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";
import { AppDialog, AppDialogBody, AppDialogContent, AppDialogFooter,
  AppDialogHeader, AppDialogTitle, AppDialogDescription } from "@/ui/components/app/primitives/app-dialog";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

import { useCatalogProduct } from "../api/catalog.queries";
import {
  useDeleteCatalogProductImage,
  useUpdateCatalogProduct,
  useUploadCatalogProductImages,
} from "../api/product.mutations";
import { getCloudinaryPublicId, toCatalogProductForm, toCatalogUpdatePayload } from "../common/catalog.mappers";
import { useProductImages } from "../common/use-product-images";
import { ProductFormFields } from "./product-form-fields";
import { ProductImageUploader } from "./product-image-uploader";
import { createProductSchema, emptyProductForm, type CreateProductFormValues } from "../schemas/product.schemas";

interface Props {
  id: number | null;
  onClose: () => void;
}

export function ProductCatalogEditDialog({ id, onClose }: Props) {
  const query = useCatalogProduct(id);
  const product = query.data;
  const update = useUpdateCatalogProduct();
  const upload = useUploadCatalogProductImages();
  const remove = useDeleteCatalogProductImage();
  const images = useProductImages();
  const [imageToDelete, setImageToDelete] = useState<{ id: number; url: string } | null>(null);
  const form = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: emptyProductForm,
    mode: "onTouched",
  });

  useEffect(() => {
    if (id && product?.id === id) {
      form.reset(toCatalogProductForm(product));
      images.reset();
    }
  }, [id, product?.id, form.reset, images.reset]);

  const busy = update.isPending || upload.isPending || remove.isPending || form.formState.isSubmitting;
  const close = () => {
    if (!busy && !images.isProcessing) onClose();
  };

  const onSave = async (values: CreateProductFormValues) => {
    if (!product) return;
    try {
      await update.mutateAsync({ id: product.id, payload: toCatalogUpdatePayload(values) });
      onClose();
    } catch {
      // Conservamos el formulario para poder reintentar.
    }
  };

  const onUpload = async () => {
    if (!product || !images.images.length) return;
    if (images.selectedImage || images.isProcessing) {
      toast.warning("Guarda o cancela primero el recorte.");
      return;
    }
    if (product.imagenes.length + images.images.length > 6) {
      toast.warning("Máximo seis imágenes por producto. Elimina alguna foto antes de continuar.");
      return;
    }
    try {
      await upload.mutateAsync({ id: product.id, images: [...images.images] });
      images.reset();
    } catch {
      // No descartar las fotos nuevas si el envío falla.
    }
  };

  const confirmDelete = async () => {
    if (!product || !imageToDelete) return;
    const publicId = getCloudinaryPublicId(imageToDelete.url);
    if (!publicId) {
      toast.warning("Esta foto no tiene una URL Cloudinary válida para eliminarla.");
      return;
    }
    try {
      await remove.mutateAsync({
        productId: product.id,
        imageId: imageToDelete.id,
        publicId,
      });
      setImageToDelete(null);
    } catch {
      // La confirmación permanece abierta ante un error.
    }
  };

  return (
    <>
      <AppDialog open={id !== null} onOpenChange={(open) => { if (!open) close(); }}>
        <AppDialogContent size="5xl" viewport="tall"
          onEscapeKeyDown={(event) => { if (busy) event.preventDefault(); }}
          onInteractOutside={(event) => { if (busy) event.preventDefault(); }}>
          <AppDialogHeader>
            <AppDialogTitle>Editar producto</AppDialogTitle>
            <AppDialogDescription>
              Actualiza catálogo, precios, categorías e imágenes. El stock se gestiona desde Inventario.
            </AppDialogDescription>
          </AppDialogHeader>
          <AppDialogBody className="space-y-4 py-3">
            {query.isLoading ? <p className="text-sm" role="status">Cargando producto...</p> : null}
            {query.isError ? (
              <div className="space-y-2">
                <p className="text-sm text-red-500" role="alert">No se pudo cargar el producto.</p>
                <AppButton size="sm" onClick={() => void query.refetch()}>Reintentar</AppButton>
              </div>
            ) : null}
            {product ? (
              <AppStack gap="md">
                <AppForm form={form} onSubmit={onSave} id="catalog-edit-form">
                  <AppStack gap="md">
                    <ProductFormFields />
                    <div className="flex justify-end">
                      <AppFormSubmit<CreateProductFormValues> leftIcon={<Save />}
                        loadingText="Guardando..." disabled={busy || images.isProcessing}>
                        Guardar información
                      </AppFormSubmit>
                    </div>
                  </AppStack>
                </AppForm>

                <section className="space-y-3 border-t border-[hsl(var(--app-border))] pt-4">
                  <h3 className="text-sm font-semibold">Imágenes actuales ({product.imagenes.length})</h3>
                  {product.imagenes.length ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
                      {product.imagenes.map((img) => (
                        <div key={img.id} className="overflow-hidden rounded border border-[hsl(var(--app-border))]">
                          <a href={img.url} target="_blank" rel="noreferrer" aria-label="Abrir imagen">
                            <img src={img.url} alt={`Imagen del producto ${product.nombre}`}
                              className="aspect-square w-full object-contain" />
                          </a>
                          <AppButton variant="ghost" size="sm" type="button"
                            className="w-full" leftIcon={<Trash2 />}
                            disabled={busy}
                            onClick={() => setImageToDelete(img)}>
                            Eliminar
                          </AppButton>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-xs text-[hsl(var(--app-muted-foreground))]">Sin imágenes.</p>}

                  <ProductImageUploader controller={images}
                    disabled={busy || product.imagenes.length + images.images.length >= 6} />
                  <div className="flex justify-end">
                    <AppButton type="button" variant="secondary" size="sm"
                      leftIcon={<ImagePlus />} loading={upload.isPending}
                      onClick={() => void onUpload()}
                      disabled={busy || images.isProcessing || !!images.selectedImage ||
                        images.images.length === 0 || product.imagenes.length + images.images.length > 6}>
                      Subir nuevas imágenes
                    </AppButton>
                  </div>
                </section>
              </AppStack>
            ) : null}
          </AppDialogBody>
          <AppDialogFooter className="flex flex-wrap justify-end gap-2">
            <AppButton type="button" variant="secondary" disabled={busy} onClick={close}>Cerrar</AppButton>
          </AppDialogFooter>
        </AppDialogContent>
      </AppDialog>

      <AppConfirmDialog
        open={imageToDelete !== null}
        onOpenChange={(open) => { if (!open && !remove.isPending) setImageToDelete(null); }}
        preset="delete"
        title="Eliminar imagen"
        description="Se quitará la fotografía del catálogo y de Cloudinary. Esta acción no se puede deshacer."
        confirmText="Eliminar imagen"
        isLoading={remove.isPending}
        onConfirm={confirmDelete}
        onConfirmError={() => { /* El hook muestra el error. */ }}
      />
    </>
  );
}
