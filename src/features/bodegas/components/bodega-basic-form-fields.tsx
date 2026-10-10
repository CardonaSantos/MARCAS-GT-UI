import type { FieldPath, FieldValues } from "react-hook-form";

import {
  AppFormInput,
  AppFormTextarea,
} from "@/ui/components/app/form";
import { AppGrid, AppGridItem } from "@/ui/components/app/primitives/app-grid";

type BodegaBaseFieldValues = FieldValues & {
  codigo: string;
  nombre: string;
  descripcion: string | null;
  direccion: string | null;
  telefono: string | null;
};

export function BodegaBasicFormFields<
  TFieldValues extends BodegaBaseFieldValues,
>() {
  const field = (name: keyof BodegaBaseFieldValues) =>
    name as FieldPath<TFieldValues>;

  return (
    <AppGrid cols={{ base: 1, md: 2 }} gap="md">
      <AppFormInput<TFieldValues>
        name={field("codigo")}
        label="Código"
        placeholder="Ej. CENTRAL"
        required
        maxLength={30}
        autoComplete="off"
      />

      <AppFormInput<TFieldValues>
        name={field("nombre")}
        label="Nombre"
        placeholder="Ej. Bodega Central"
        required
        maxLength={120}
        autoComplete="organization"
      />

      <AppGridItem span="full">
        <AppFormTextarea<TFieldValues>
          name={field("descripcion")}
          label="Descripción"
          placeholder="Describe el propósito o cobertura de la bodega."
          maxLength={500}
          rows={4}
        />
      </AppGridItem>

      <AppGridItem span="full">
        <AppFormInput<TFieldValues>
          name={field("direccion")}
          label="Dirección"
          placeholder="Dirección física de la bodega"
          maxLength={250}
          autoComplete="street-address"
        />
      </AppGridItem>

      <AppFormInput<TFieldValues>
        name={field("telefono")}
        label="Teléfono"
        placeholder="Ej. 5555-5555"
        maxLength={40}
        inputMode="tel"
        autoComplete="tel"
      />
    </AppGrid>
  );
}
