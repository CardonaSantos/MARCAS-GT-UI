import { UserRound } from "lucide-react";
import { AppFormInput } from "@/ui/components/app/form";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";
import type { ProspectFormValues } from "../schemas/prospect.schemas";

export function ProspectIdentityFields() {
  return (
    <AppCard title="Datos del prospecto" icon={<UserRound />} size="sm">
      <AppGrid cols={{ base: 1, sm: 2 }} gap="md">
        <AppFormInput<ProspectFormValues>
          name="nombreCompleto"
          label="Nombres"
          placeholder="Nombre del contacto"
          maxLength={150}
          description=""
        />
        <AppFormInput<ProspectFormValues>
          name="apellido"
          label="Apellidos"
          maxLength={150}
          placeholder="Apellidos (opcional)"
        />
        <AppFormInput<ProspectFormValues>
          name="empresaTienda"
          label="Empresa o tienda"
          placeholder="Nombre del negocio"
          maxLength={200}
        />
        <AppFormInput<ProspectFormValues>
          name="telefono"
          label="Teléfono"
          type="tel"
          autoComplete="tel"
          maxLength={50}
          placeholder="Número de contacto"
        />
        <AppFormInput<ProspectFormValues>
          name="correo"
          label="Correo"
          type="email"
          autoComplete="email"
          maxLength={250}
          placeholder="correo@empresa.com (opcional)"
        />
      </AppGrid>
    </AppCard>
  );
}
