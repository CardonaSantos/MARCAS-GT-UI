import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useCreateCreditPolicy } from "@/features/creditos/api/credit.mutations";
import { toCreateCreditPolicyPayload } from "@/features/creditos/common/credit.mappers";
import { CreditPolicyFormFields } from "@/features/creditos/components/credit-policy-form-fields";
import {
  creditPolicyFormSchema,
  type CreditPolicyFormValues,
} from "@/features/creditos/schemas/credit.schemas";
import { AppForm, AppFormSubmit } from "@/ui/components/app/form";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function CreateCreditPolicyPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const backTo = getReturnRoute(
    location.state,
    "/marcas-gt/creditos/politicas",
  );

  const mutation = useCreateCreditPolicy();

  const form = useForm<CreditPolicyFormValues>({
    resolver: zodResolver(creditPolicyFormSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      montoMaximo: "",
      plazoMaximoDias: "",
      requisitos: [],
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: CreditPolicyFormValues) => {
    const created = await mutation.mutateAsync(
      toCreateCreditPolicyPayload(values),
    );

    navigate("/marcas-gt/creditos/politicas/" + created.id, {
      replace: true,
      state: { from: backTo },
    });
  };

  return (
    <AppContainer size="xl" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Nueva política de crédito"
          description="Configura límites y requisitos para crédito puro."
          backTo={backTo}
          backLabel="Volver a políticas"
        />

        <AppForm form={form} onSubmit={onSubmit}>
          <AppStack gap="md">
            <CreditPolicyFormFields />

            <div className="flex justify-end gap-2">
              <AppButton asChild variant="secondary">
                <Link to={backTo}>Cancelar</Link>
              </AppButton>
              <AppFormSubmit<CreditPolicyFormValues>
                leftIcon={<Save />}
                loadingText="Creando..."
                disableWhenInvalid
              >
                Crear política
              </AppFormSubmit>
            </div>
          </AppStack>
        </AppForm>
      </AppStack>
    </AppContainer>
  );
}
