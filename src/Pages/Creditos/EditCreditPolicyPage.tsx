import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  getListReturnRoute,
  getReturnRoute,
} from "@/features/common/navigation/route-state";
import { useUpdateCreditPolicy } from "@/features/creditos/api/credit.mutations";
import { useCreditPolicy } from "@/features/creditos/api/credit.queries";
import {
  toCreditPolicyFormValues,
  toUpdateCreditPolicyPayload,
} from "@/features/creditos/common/credit.mappers";
import { CreditPolicyFormFields } from "@/features/creditos/components/credit-policy-form-fields";
import {
  creditPolicyFormSchema,
  type CreditPolicyFormValues,
} from "@/features/creditos/schemas/credit.schemas";
import { AppForm, AppFormSubmit } from "@/ui/components/app/form";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function EditCreditPolicyPage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const id = Number(params.id);
  const detailUrl = "/marcas-gt/creditos/politicas/" + id;
  const backTo = getReturnRoute(location.state, detailUrl);
  const listFrom = getListReturnRoute(
    location.state,
    "/marcas-gt/creditos/politicas",
  );

  const query = useCreditPolicy(id);
  const mutation = useUpdateCreditPolicy();

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

  useEffect(() => {
    if (query.data) {
      form.reset(toCreditPolicyFormValues(query.data));
    }
  }, [form, query.data]);

  const onSubmit = async (values: CreditPolicyFormValues) => {
    await mutation.mutateAsync({
      id,
      payload: toUpdateCreditPolicyPayload(values),
    });

    navigate(detailUrl, {
      replace: true,
      state: { from: listFrom },
    });
  };

  return (
    <AppContainer size="xl" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Editar política"
          description={query.data?.nombre}
          backTo={backTo}
          backState={{ from: listFrom }}
          backLabel="Volver al detalle"
        />

        <AppDataState
          isLoading={query.isLoading}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && !query.data}
          emptyTitle="Política no encontrada"
        >
          {query.data ? (
            <AppForm form={form} onSubmit={onSubmit}>
              <AppStack gap="md">
                <CreditPolicyFormFields />

                <div className="flex justify-end gap-2">
                  <AppButton asChild variant="secondary">
                    <Link to={backTo} state={{ from: listFrom }}>
                      Cancelar
                    </Link>
                  </AppButton>
                  <AppFormSubmit<CreditPolicyFormValues>
                    leftIcon={<Save />}
                    loadingText="Guardando..."
                    disableWhenInvalid
                    disabled={!form.formState.isDirty}
                  >
                    Guardar cambios
                  </AppFormSubmit>
                </div>
              </AppStack>
            </AppForm>
          ) : null}
        </AppDataState>
      </AppStack>
    </AppContainer>
  );
}
