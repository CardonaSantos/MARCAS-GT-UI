import { MessageCircle } from "lucide-react";

import { AppFormInput, AppFormSingleSelect, AppFormTextarea } from "@/ui/components/app/form";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid, AppGridItem } from "@/ui/components/app/primitives/app-grid";
import {
  customerContactPreferenceOptions, type CustomerFormValues,
} from "../schemas/customer.schemas";

export function CustomerPreferencesFields() {
  return (
    <AppCard title="Comunicación y condiciones" icon={<MessageCircle />} size="sm">
      <AppGrid cols={{ base: 1, sm: 2 }} gap="md">
        <AppFormSingleSelect<CustomerFormValues, string>
          name="preferenciaContacto" label="Contacto preferido"
          placeholder="No especificado"
          options={[{ value: "", label: "No especificado" }, ...customerContactPreferenceOptions]}
          isClearable={false}
        />
        <AppFormInput<CustomerFormValues>
          name="descuentoInicial" label="Descuento inicial (%)"
          placeholder="0" inputMode="decimal"
          description="Opcional. Al registrar un porcentaje mayor que cero se crea un descuento para el cliente."
        />
        <AppGridItem span="full">
          <AppFormTextarea<CustomerFormValues>
            name="comentarios" label="Observaciones" rows={3}
            maxLength={2000}
            placeholder="Preferencias, indicaciones o notas adicionales"
          />
        </AppGridItem>
      </AppGrid>
    </AppCard>
  );
}
