import { ShoppingBag, MessageSquareText } from "lucide-react";
import { AppFormMultiSelect, AppFormSingleSelect, AppFormTextarea } from "@/ui/components/app/form";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppGrid, AppGridItem } from "@/ui/components/app/primitives/app-grid";
import {
  customerContactPreferenceOptions, customerInterestOptions, customerMonthlyBudgetOptions,
  customerPurchaseVolumeOptions, customerTypeOptions,
} from "@/features/clientes/schemas/customer.schemas";
import type { ProspectFormValues } from "../schemas/prospect.schemas";

export function ProspectCommercialFields() {
  return (
    <AppCard title="Perfil e intereses comerciales" icon={<ShoppingBag />} size="sm">
      <AppGrid cols={{ base: 1, sm: 2 }} gap="md">
        <AppFormSingleSelect<ProspectFormValues, string>
          name="tipoCliente" label="Tipo de cliente" required
          options={[{ value: "", label: "Seleccionar tipo" }, ...customerTypeOptions]}
          isClearable={false}
        />
        <AppFormSingleSelect<ProspectFormValues, string>
          name="volumenCompra" label="Volumen de compra esperado"
          options={[{ value: "", label: "No especificado" }, ...customerPurchaseVolumeOptions]}
          isClearable={false}
        />
        <AppFormSingleSelect<ProspectFormValues, string>
          name="presupuestoMensual" label="Presupuesto mensual"
          options={[{ value: "", label: "No especificado" }, ...customerMonthlyBudgetOptions]}
          isClearable={false}
        />
        <AppFormSingleSelect<ProspectFormValues, string>
          name="preferenciaContacto" label="Medio de contacto"
          options={[{ value: "", label: "No especificado" }, ...customerContactPreferenceOptions]}
          isClearable={false}
        />
        <AppGridItem span="full">
          <AppFormMultiSelect<ProspectFormValues, string>
            name="categoriasInteres" label="Categorías de interés"
            options={customerInterestOptions}
            placeholder="Selecciona intereses"
          />
        </AppGridItem>
      </AppGrid>
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <MessageSquareText className="h-4 w-4" /> Observaciones
        </div>
        <AppFormTextarea<ProspectFormValues>
          name="comentarios" label="Comentarios o necesidades" maxLength={2000} rows={3}
          placeholder="Detalles de la conversación y próximos pasos"
        />
      </div>
    </AppCard>
  );
}
