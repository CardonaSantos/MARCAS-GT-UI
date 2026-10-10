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
import { useUpdateCreditApplication } from "@/features/creditos/api/credit.mutations";
import { useCreditApplication } from "@/features/creditos/api/credit.queries";
import {
  toCreditApplicationFormValues,
  toUpdateCreditApplicationPayload,
} from "@/features/creditos/common/credit.mappers";
import { CreditApplicationFormFields } from "@/features/creditos/components/credit-application-form-fields";
import {
  creditApplicationFormSchema,
  type CreditApplicationFormValues,
} from "@/features/creditos/schemas/credit.schemas";
import { AppForm, AppFormSubmit } from "@/ui/components/app/form";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function EditCreditApplicationPage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const id = Number(params.id);
  const detailUrl = "/marcas-gt/creditos/solicitudes/" + id;
  const backTo = getReturnRoute(location.state, detailUrl);
  const listFrom = getListReturnRoute(location.state, "/marcas-gt/creditos");

  const query = useCreditApplication(id);
  const mutation = useUpdateCreditApplication();

  const form = useForm<CreditApplicationFormValues>({
    resolver: zodResolver(creditApplicationFormSchema),
    defaultValues: {
      pedidoId: null,
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
    if (query.data) {
      form.reset(toCreditApplicationFormValues(query.data));
    }
  }, [form, query.data]);

  const onSubmit = async (values: CreditApplicationFormValues) => {
    if (!query.data?.acciones.puedeEditar) return;

    await mutation.mutateAsync({
      id,
      payload: toUpdateCreditApplicationPayload(values),
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
          title="Editar solicitud"
          description={query.data?.numero}
          backTo={backTo}
          backState={{ from: listFrom }}
          backLabel="Volver al detalle"
        />

        <AppDataState
          isLoading={query.isLoading}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && !query.data}
          emptyTitle="Solicitud no encontrada"
        >
          {query.data?.acciones.puedeEditar ? (
            <AppForm form={form} onSubmit={onSubmit}>
              <AppStack gap="md">
                <CreditApplicationFormFields lockOrder />

                <div className="flex justify-end gap-2">
                  <AppButton asChild variant="secondary">
                    <Link to={backTo} state={{ from: listFrom }}>
                      Cancelar
                    </Link>
                  </AppButton>

                  <AppFormSubmit<CreditApplicationFormValues>
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
          ) : query.data ? (
            <AppCard
              title="La solicitud ya no es editable"
              description="El servidor sólo permite editar solicitudes PENDIENTE."
              size="sm"
            />
          ) : null}
        </AppDataState>
      </AppStack>
    </AppContainer>
  );
}
