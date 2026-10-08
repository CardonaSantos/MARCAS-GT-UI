import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useCreateCategory } from "@/features/categorias/api/category.mutations";
import { useCategories } from "@/features/categorias/api/category.queries";
import type { Category } from "@/features/categorias/api/category.types";
import { categoryNameExists } from "@/features/categorias/common/category.utils";
import { CategoryDeleteDialog } from "@/features/categorias/components/category-delete-dialog";
import { CategoryEditDialog } from "@/features/categorias/components/category-edit-dialog";
import { CategoryFormFields } from "@/features/categorias/components/category-form-fields";
import { CategoryList } from "@/features/categorias/components/category-list";
import {
  categorySchema,
  emptyCategoryForm,
  type CategoryFormValues,
} from "@/features/categorias/schemas/category.schemas";
import { AppForm, AppFormSubmit } from "@/ui/components/app/form";
import { useAppFormHandlers } from "@/ui/components/app/handlers";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function CrearCategoria() {
  const location = useLocation();
  const backTo = getReturnRoute(location.state, "/marcas-gt/ver-productos");
  const categoriesQuery = useCategories();
  const createCategory = useCreateCategory();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: emptyCategoryForm,
    mode: "onTouched",
  });
  const handlers = useAppFormHandlers(form);
  const categories = categoriesQuery.data ?? [];

  const onCreate = async (values: CategoryFormValues) => {
    if (categoryNameExists(values.nombre, categories)) {
      form.setError("nombre", {
        type: "manual",
        message: "Ya existe una categoría con ese nombre.",
      });
      return;
    }

    try {
      await createCategory.mutateAsync({ nombre: values.nombre.trim() });
      handlers.reset(emptyCategoryForm);
    } catch {
      // El hook muestra el error. Mantener el nombre escrito si falla.
    }
  };

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Categorías de productos"
          backTo={backTo}
          backLabel="Volver al catálogo"
        />

        <div className="grid min-w-0 items-start gap-4 lg:grid-cols-[minmax(280px,0.85fr)_minmax(0,1.5fr)]">
          <AppCard title="Nueva categoría" size="sm">
            <AppForm form={form} onSubmit={onCreate}>
              <AppStack gap="md">
                <CategoryFormFields />
                <div className="flex justify-end">
                  <AppFormSubmit<CategoryFormValues>
                    leftIcon={<Plus />}
                    loadingText="Creando..."
                    disabled={createCategory.isPending}
                  >
                    Crear categoría
                  </AppFormSubmit>
                </div>
              </AppStack>
            </AppForm>
          </AppCard>

          <CategoryList
            categories={categories}
            isLoading={categoriesQuery.isLoading}
            isFetching={categoriesQuery.isFetching}
            isError={categoriesQuery.isError}
            onRetry={() => void categoriesQuery.refetch()}
            onEdit={setEditingCategory}
            onDelete={setDeletingCategory}
          />
        </div>

        <CategoryEditDialog
          category={editingCategory}
          categories={categories}
          onClose={() => setEditingCategory(null)}
        />
        <CategoryDeleteDialog
          category={deletingCategory}
          onClose={() => setDeletingCategory(null)}
        />
      </AppStack>
    </AppContainer>
  );
}
