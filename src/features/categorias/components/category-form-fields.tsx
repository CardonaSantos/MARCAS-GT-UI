import { AppFormInput } from "@/ui/components/app/form";

import type { CategoryFormValues } from "../schemas/category.schemas";

export function CategoryFormFields() {
  return (
    <AppFormInput<CategoryFormValues>
      name="nombre"
      label="Nombre de la categoría"
      placeholder="Ej. Camisetas"
      maxLength={120}
      autoComplete="off"
      required
    />
  );
}
