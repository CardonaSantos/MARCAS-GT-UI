import { ShoppingBag } from "lucide-react";

import { AppFormMultiSelect, AppFormSingleSelect } from "@/ui/components/app/form";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid, AppGridItem } from "@/ui/components/app/primitives/app-grid";
import {
  customerTypeOptions, customerInterestOptions, customerPurchaseVolumeOptions,
  customerMonthlyBudgetOptions, type CustomerFormValues,
} from "../schemas/customer.schemas";

export function CustomerCommercialFields() {
  return (
    <AppCard title="Perfil comercial" icon={<ShoppingBag />} size="sm">
      <AppGrid cols={{ base: 1, sm: 2 }} gap="md">
        <AppFormSingleSelect<CustomerFormValues, string>
          name="tipoCliente" label="Tipo de cliente"
          options={[{ value: "", label: "No especificado" }, ...customerTypeOptions]}
          placeholder="Selecciona un tipo"
          isClearable={false}
        />
        <AppFormSingleSelect<CustomerFormValues, string>
          name="volumenCompra" label="Volumen mensual estimado"
          options={[{ value: "", label: "No especificado" }, ...customerPurchaseVolumeOptions]}
          placeholder="No especificado"
          isClearable={false}
        />
        <AppFormSingleSelect<CustomerFormValues, string>
          name="presupuestoMensual" label="Presupuesto mensual estimado"
          options={[{ value: "", label: "No especificado" }, ...customerMonthlyBudgetOptions]}
          placeholder="No especificado"
          isClearable={false}
        />
        <AppGridItem span="full">
          <AppFormMultiSelect<CustomerFormValues, string>
            name="categoriasInteres" label="Categorías de interés"
            options={customerInterestOptions}
            placeholder="Selecciona una o más preferencias"
            noOptionsText="Sin categorías disponibles"
            description="Preferencias comerciales del cliente; no alteran el catálogo de productos."
          />
        </AppGridItem>
      </AppGrid>
    </AppCard>
  );
}
