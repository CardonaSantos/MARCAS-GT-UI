import { UserRound } from "lucide-react";

import { AppFormInput } from "@/ui/components/app/form";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";
import type { CustomerFormValues } from "../schemas/customer.schemas";

export function CustomerIdentityFields() {
  return (
    <AppCard title="Datos del cliente" icon={<UserRound />} size="sm">
      <AppGrid cols={{ base: 1, sm: 2 }} gap="md">
        <AppFormInput<CustomerFormValues>
          name="nombre" label="Nombres" required
          placeholder="Nombres del cliente" autoComplete="given-name"
          maxLength={150}
        />
        <AppFormInput<CustomerFormValues>
          name="apellido" label="Apellidos" required
          placeholder="Apellidos del cliente" autoComplete="family-name"
          maxLength={150}
        />
        <AppFormInput<CustomerFormValues>
          name="telefono" label="Teléfono" required
          type="tel" autoComplete="tel" maxLength={50}
          placeholder="Ej. 502 5555 0000"
        />
        <AppFormInput<CustomerFormValues>
          name="correo" label="Correo electrónico" required
          type="email" autoComplete="email" maxLength={250}
          placeholder="cliente@correo.com"
        />
      </AppGrid>
    </AppCard>
  );
}
