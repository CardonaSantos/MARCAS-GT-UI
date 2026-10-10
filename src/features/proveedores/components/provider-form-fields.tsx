import { AppFormInput, AppFormSwitch, AppFormTextarea } from "@/ui/components/app/form";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid, AppGridItem } from "@/ui/components/app/primitives/app-grid";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

import type { ProviderFormValues } from "../schemas/provider.schemas";

/** Utilizado tanto en el alta como en la edición. Solo nombre es obligatorio. */
export function ProviderFormFields() {
  return (
    <AppStack gap="md">
      <AppCard title="Identificación del proveedor" size="sm">
        <AppGrid cols={{ base: 1, md: 2 }} gap="md">
          <AppFormInput<ProviderFormValues>
            name="nombre" label="Nombre del proveedor" required
            placeholder="Nombre comercial o persona"
            maxLength={150}
          />
          <AppFormInput<ProviderFormValues>
            name="razonSocial" label="Razón social" placeholder="Opcional"
            maxLength={200}
          />
          <AppFormInput<ProviderFormValues>
            name="rfc" label="NIT / RFC" placeholder="Identificación fiscal (opcional)"
            maxLength={40}
          />
          <AppFormSwitch<ProviderFormValues>
            name="activo"
            fieldLabel="Estado del proveedor"
            fieldDescription="Determina si está disponible para nuevas operaciones."
            label="Proveedor activo"
          />
        </AppGrid>
      </AppCard>

      <AppCard title="Contacto" size="sm">
        <AppGrid cols={{ base: 1, md: 2 }} gap="md">
          <AppFormInput<ProviderFormValues>
            name="telefono" label="Teléfono general" placeholder="Opcional"
            type="tel" maxLength={40}
          />
          <AppFormInput<ProviderFormValues>
            name="correo" label="Correo general" type="email"
            placeholder="contacto@proveedor.com"
            autoComplete="off"
          />
          <AppFormInput<ProviderFormValues>
            name="nombreContacto" label="Persona de contacto"
            placeholder="Nombre del contacto" maxLength={150}
          />
          <AppFormInput<ProviderFormValues>
            name="telefonoContacto" label="Teléfono del contacto"
            type="tel" placeholder="Opcional" maxLength={40}
          />
          <AppGridItem span="full">
            <AppFormInput<ProviderFormValues>
              name="emailContacto" label="Correo del contacto" type="email"
              placeholder="contacto@proveedor.com" autoComplete="off"
            />
          </AppGridItem>
        </AppGrid>
      </AppCard>

      <AppCard title="Ubicación y observaciones" size="sm">
        <AppGrid cols={{ base: 1, md: 2 }} gap="md">
          <AppFormInput<ProviderFormValues>
            name="pais" label="País" placeholder="Opcional" maxLength={100}
          />
          <AppFormInput<ProviderFormValues>
            name="ciudad" label="Ciudad" placeholder="Opcional" maxLength={120}
          />
          <AppFormInput<ProviderFormValues>
            name="codigoPostal" label="Código postal"
            placeholder="Opcional" maxLength={25}
          />
          <AppGridItem span="full">
            <AppFormInput<ProviderFormValues>
              name="direccion" label="Dirección" placeholder="Dirección del proveedor"
              maxLength={250}
            />
          </AppGridItem>
          <AppGridItem span="full">
            <AppFormTextarea<ProviderFormValues>
              name="notas" label="Notas"
              placeholder="Condiciones de suministro, contactos alternativos, indicaciones..."
              maxLength={2000} rows={3}
            />
          </AppGridItem>
        </AppGrid>
      </AppCard>
    </AppStack>
  );
}
