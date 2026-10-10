import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCcw, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useCreateCustomer } from "@/features/clientes/api/customer.mutations";
import { toCreateCustomerPayload } from "@/features/clientes/common/customer.mappers";
import { CustomerIdentityFields } from "@/features/clientes/components/customer-identity-fields";
import { CustomerLocationFields } from "@/features/clientes/components/customer-location-fields";
import { CustomerCommercialFields } from "@/features/clientes/components/customer-commercial-fields";
import { CustomerPreferencesFields } from "@/features/clientes/components/customer-preferences-fields";
import {
  customerSchema, emptyCustomerForm, type CustomerFormValues,
} from "@/features/clientes/schemas/customer.schemas";
import { useAppFormHandlers } from "@/ui/components/app/handlers";
import { AppForm, AppFormSubmit } from "@/ui/components/app/form";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

/** Mantener la ruta legacy /marcas-gt/crear-cliente para enlaces existentes. */
export default function CreateClient() {
  const location = useLocation();
  const backTo = getReturnRoute(location.state, "/marcas-gt/clientes");
  const createCustomer = useCreateCustomer();
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: emptyCustomerForm,
    mode: "onTouched",
  });
  const handlers = useAppFormHandlers(form);
  const busy = form.formState.isSubmitting || createCustomer.isPending;

  const onSubmit = async (values: CustomerFormValues) => {
    try {
      await createCustomer.mutateAsync(toCreateCustomerPayload(values));
      // Los datos no se pierden si el API rechaza el registro.
      handlers.reset(emptyCustomerForm);
    } catch {
      // La mutación muestra el error y el formulario queda editable.
    }
  };

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Nuevo cliente"
          backTo={backTo}
          backLabel="Volver a clientes"
        />

        <AppForm form={form} onSubmit={onSubmit}>
          <AppStack gap="md">
            <div className="grid min-w-0 items-start gap-4 xl:grid-cols-2">
              <AppStack gap="md">
                <CustomerIdentityFields />
                <CustomerLocationFields />
              </AppStack>
              <AppStack gap="md">
                <CustomerCommercialFields />
                <CustomerPreferencesFields />
              </AppStack>
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              <AppButton asChild type="button" variant="secondary" disabled={busy}>
                <Link to={backTo}>Cancelar</Link>
              </AppButton>
              <AppButton
                type="button" variant="outline" leftIcon={<RotateCcw />}
                disabled={busy} onClick={() => handlers.reset(emptyCustomerForm)}
              >
                Limpiar
              </AppButton>
              <AppFormSubmit<CustomerFormValues>
                leftIcon={<UserPlus />}
                disabled={busy}
                loadingText="Registrando..."
              >
                Crear cliente
              </AppFormSubmit>
            </div>
          </AppStack>
        </AppForm>
      </AppStack>
    </AppContainer>
  );
}
