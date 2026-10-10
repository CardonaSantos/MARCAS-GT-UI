import type { FieldPath, FieldValues } from "react-hook-form";

import { AppFormInput } from "@/ui/components/app/form";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";

type ReferenceFieldValues = FieldValues & {
  referenciaTipo: string;
  referenciaId: string;
};

export function InventoryReferenceFields<
  TFieldValues extends ReferenceFieldValues,
>() {
  const field = (name: keyof ReferenceFieldValues) =>
    name as FieldPath<TFieldValues>;

  return (
    <AppGrid cols={{ base: 1, md: 2 }} gap="md">
      <AppFormInput<TFieldValues>
        name={field("referenciaTipo")}
        label="Tipo de referencia"
        description="Opcional. Si se indica, también debe ingresarse el ID."
        placeholder="Ej. DOCUMENTO, AJUSTE_EXTERNO"
        maxLength={80}
      />

      <AppFormInput<TFieldValues>
        name={field("referenciaId")}
        label="ID de referencia"
        type="number"
        min={1}
        inputMode="numeric"
        placeholder="Ej. 25"
      />
    </AppGrid>
  );
}
