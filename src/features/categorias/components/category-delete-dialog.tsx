import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";

import { useDeleteCategory } from "../api/category.mutations";
import type { Category } from "../api/category.types";

interface CategoryDeleteDialogProps {
  category: Category | null;
  onClose: () => void;
}

export function CategoryDeleteDialog({ category, onClose }: CategoryDeleteDialogProps) {
  const mutation = useDeleteCategory();
  const relatedProducts = category?.productos?.length ?? 0;

  return (
    <AppConfirmDialog
      open={category !== null}
      onOpenChange={(open) => {
        if (!open && !mutation.isPending) onClose();
      }}
      preset="delete"
      title="Eliminar categoría"
      description={
        category ? (
          <>
            Se eliminará «{category.nombre}».
            {relatedProducts > 0
              ? ` Se quitará la categoría de ${relatedProducts} productos asociados; los productos no se eliminarán.`
              : " Esta acción no se puede deshacer."}
          </>
        ) : undefined
      }
      confirmText="Eliminar categoría"
      loadingText="Eliminando..."
      isLoading={mutation.isPending}
      onConfirm={async () => {
        if (!category) return;
        await mutation.mutateAsync({ id: category.id });
        onClose();
      }}
      onConfirmError={() => {
        // El hook de mutación ya presenta el error.
      }}
    />
  );
}
