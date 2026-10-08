import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useAppFormHandlers } from "@/ui/components/app/handlers";
import { AppForm, AppFormSubmit } from "@/ui/components/app/form";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import {
  AppDialog,
  AppDialogBody,
  AppDialogContent,
  AppDialogFooter,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogDescription,
} from "@/ui/components/app/primitives/app-dialog";

import { useUpdateCategory } from "../api/category.mutations";
import type { Category } from "../api/category.types";
import { categoryNameExists } from "../common/category.utils";
import { categorySchema, type CategoryFormValues } from "../schemas/category.schemas";
import { CategoryFormFields } from "./category-form-fields";

interface CategoryEditDialogProps {
  category: Category | null;
  categories: readonly Category[];
  onClose: () => void;
}

export function CategoryEditDialog({
  category,
  categories,
  onClose,
}: CategoryEditDialogProps) {
  const mutation = useUpdateCategory();
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { nombre: "" },
    mode: "onTouched",
  });
  const handlers = useAppFormHandlers(form);

  useEffect(() => {
    handlers.reset({ nombre: category?.nombre ?? "" });
  }, [category?.id, category?.nombre, handlers.reset]);

  const onSubmit = async (values: CategoryFormValues) => {
    if (!category) return;
    if (categoryNameExists(values.nombre, categories, category.id)) {
      form.setError("nombre", { type: "manual", message: "Ya existe otra categoría con ese nombre." });
      return;
    }
    try {
      await mutation.mutateAsync({
        id: category.id,
        payload: { nombre: values.nombre.trim() },
      });
      onClose();
    } catch {
      // El hook notifica el error. Conservar el formulario abierto.
    }
  };

  return (
    <AppDialog
      open={category !== null}
      onOpenChange={(open) => {
        if (!open && !mutation.isPending) onClose();
      }}
    >
      <AppDialogContent
        size="md"
        onEscapeKeyDown={(event) => {
          if (mutation.isPending) event.preventDefault();
        }}
        onInteractOutside={(event) => {
          if (mutation.isPending) event.preventDefault();
        }}
      >
        <AppForm form={form} onSubmit={onSubmit}>
          <AppDialogHeader>
            <AppDialogTitle className="flex items-center gap-2">
              <Pencil className="h-4 w-4" />
              Editar categoría
            </AppDialogTitle>
            <AppDialogDescription>
              Actualiza el nombre que aparece en el catálogo de productos.
            </AppDialogDescription>
          </AppDialogHeader>
          <AppDialogBody className="py-4">
            <CategoryFormFields />
          </AppDialogBody>
          <AppDialogFooter className="flex justify-end gap-2">
            <AppButton
              type="button"
              variant="secondary"
              disabled={mutation.isPending}
              onClick={onClose}
            >
              Cancelar
            </AppButton>
            <AppFormSubmit<CategoryFormValues>
              leftIcon={<Save />}
              loadingText="Guardando..."
              disabled={mutation.isPending}
            >
              Guardar cambios
            </AppFormSubmit>
          </AppDialogFooter>
        </AppForm>
      </AppDialogContent>
    </AppDialog>
  );
}
