import { zodResolver } from "@hookform/resolvers/zod";
import { PackagePlus, RotateCcw, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useCreateProduct } from "@/features/productos/api/product.mutations";
import { toCreateProductPayload } from "@/features/productos/common/product.mappers";
import { useProductImages } from "@/features/productos/common/use-product-images";
import { ProductFormFields } from "@/features/productos/components/product-form-fields";
import { ProductImageUploader } from "@/features/productos/components/product-image-uploader";
import { ProductPreview } from "@/features/productos/components/product-preview";
import {
  createProductSchema,
  emptyProductForm,
  type CreateProductFormValues,
} from "@/features/productos/schemas/product.schemas";
import { AppForm, AppFormSubmit } from "@/ui/components/app/form";
import { useAppFormHandlers } from "@/ui/components/app/handlers";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function CreateProduct() {
  const location = useLocation();
  const backTo = getReturnRoute(location.state, "/marcas-gt/ver-productos");
  const createProduct = useCreateProduct();
  const images = useProductImages();
  const form = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: emptyProductForm,
    mode: "onTouched",
  });
  const handlers = useAppFormHandlers(form);
  const isBusy = form.formState.isSubmitting || createProduct.isPending;

  const clearForm = () => {
    if (isBusy || images.isProcessing) return;
    handlers.reset(emptyProductForm);
    images.reset();
  };

  const onSubmit = async (values: CreateProductFormValues) => {
    form.clearErrors("root");
    if (images.isProcessing || images.selectedImage) {
      toast.warning("Guarda o cancela la imagen que estás editando antes de registrar.");
      return;
    }

    try {
      await createProduct.mutateAsync(toCreateProductPayload(values, images.images));
      handlers.reset(emptyProductForm);
      images.reset();
    } catch {
      // El hook muestra el error. Mantener datos y fotografías si falla.
    }
  };

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Nuevo producto"
          backTo={backTo}
          backLabel="Volver al catálogo"
        />

        <AppForm form={form} onSubmit={onSubmit}>
          <AppStack gap="md">
            <div className="grid min-w-0 items-start gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,1fr)]">
              <AppStack gap="md">
                <AppCard title="Información del producto" icon={<PackagePlus />} size="sm">
                  <ProductFormFields />
                </AppCard>
                <ProductImageUploader controller={images} disabled={isBusy} />
              </AppStack>
              <ProductPreview images={images.images} />
            </div>

            {form.formState.errors.root?.message ? (
              <AppAlert tone="danger" title="No se pudo crear el producto"
                description={form.formState.errors.root.message} />
            ) : null}

            <div className="flex flex-wrap justify-end gap-2">
              <AppButton asChild variant="secondary" disabled={isBusy}>
                <Link to={backTo}>Cancelar</Link>
              </AppButton>
              <AppButton variant="outline" leftIcon={<RotateCcw />}
                onClick={clearForm} disabled={isBusy || images.isProcessing}>
                Limpiar
              </AppButton>
              <AppFormSubmit<CreateProductFormValues>
                leftIcon={<Save />} loadingText="Registrando..."
                disabled={isBusy || images.isProcessing || !!images.selectedImage}
              >
                Crear producto
              </AppFormSubmit>
            </div>
          </AppStack>
        </AppForm>
      </AppStack>
    </AppContainer>
  );
}
