import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { parsePositiveIntParam } from "@/features/common/navigation/url-state.utils";
import { useCreateCreditApplication } from "@/features/creditos/api/credit.mutations";
import { toCreateCreditApplicationPayload } from "@/features/creditos/common/credit.mappers";
import { CreditApplicationFormFields } from "@/features/creditos/components/credit-application-form-fields";
import {
  creditApplicationFormSchema,
  type CreditApplicationFormValues,
} from "@/features/creditos/schemas/credit.schemas";
import { AppForm, AppFormSubmit } from "@/ui/components/app/form";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function CreateCreditApplicationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const backTo = getReturnRoute(location.state, "/marcas-gt/creditos");
  const initialOrderId = parsePositiveIntParam(searchParams.get("pedidoId"));

  const mutation = useCreateCreditApplication();

  const form = useForm<CreditApplicationFormValues>({
    resolver: zodResolver(creditApplicationFormSchema),
    defaultValues: {
      pedidoId: initialOrderId,
      politicaId: null,
      montoSolicitado: "0.00",
      condicionPago: "CREDITO",
      anticipoPropuesto: "0.00",
      plazoDias: "30",
      motivo: "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (initialOrderId && form.getValues("pedidoId") !== initialOrderId) {
      form.setValue("pedidoId", initialOrderId);
    }
  }, [form, initialOrderId]);

  const onSubmit = async (values: CreditApplicationFormValues) => {
    const created = await mutation.mutateAsync(
      toCreateCreditApplicationPayload(values),
    );

    navigate("/marcas-gt/creditos/solicitudes/" + created.id, {
      replace: true,
      state: { from: backTo },
    });
  };

  return (
    <AppContainer size="xl" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Nueva solicitud de crédito"
          description=""
          backTo={backTo}
          backLabel="Volver a solicitudes"
        />

        <AppForm form={form} onSubmit={onSubmit}>
          <AppStack gap="md">
            <CreditApplicationFormFields />

            <div className="flex justify-end gap-2">
              <AppButton asChild variant="secondary">
                <Link to={backTo}>Cancelar</Link>
              </AppButton>

              <AppFormSubmit<CreditApplicationFormValues>
                leftIcon={<Save />}
                loadingText="Creando..."
                disableWhenInvalid
              >
                Crear solicitud
              </AppFormSubmit>
            </div>
          </AppStack>
        </AppForm>
      </AppStack>
    </AppContainer>
  );
}
