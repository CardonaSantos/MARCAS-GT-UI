import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useReviewCreditReference } from "@/features/creditos/api/credit.mutations";
import { useCreditApplication } from "@/features/creditos/api/credit.queries";
import { toReviewCreditReferencePayload } from "@/features/creditos/common/credit.mappers";
import { CREDIT_REFERENCE_RESULT_LABELS } from "@/features/creditos/common/credit.constants";
import {
  creditReferenceReviewSchema,
  type CreditReferenceReviewFormValues,
} from "@/features/creditos/schemas/credit.schemas";
import {
  AppForm,
  AppFormSingleSelect,
  AppFormSubmit,
  AppFormTextarea,
} from "@/ui/components/app/form";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function ReviewCreditReferencePage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const id = Number(params.id);
  const referenceId = Number(params.referenceId);
  const defaultBack =
    "/marcas-gt/creditos/solicitudes/" + id + "?tab=referencias";
  const backTo = getReturnRoute(location.state, defaultBack);

  const query = useCreditApplication(id);
  const mutation = useReviewCreditReference();
  const reference = query.data?.referencias.find(
    (item) => item.id === referenceId,
  );

  const form = useForm<CreditReferenceReviewFormValues>({
    resolver: zodResolver(creditReferenceReviewSchema),
    defaultValues: {
      resultado: "VERIFICADA",
      observaciones: "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (!reference) return;

    form.reset({
      resultado:
        reference.resultado === "PENDIENTE"
          ? "VERIFICADA"
          : reference.resultado,
      observaciones: reference.observaciones ?? "",
    });
  }, [form, reference]);

  const onSubmit = async (values: CreditReferenceReviewFormValues) => {
    if (!query.data?.acciones.puedeRevisarExpediente || !reference) return;

    await mutation.mutateAsync({
      id,
      referenceId,
      payload: toReviewCreditReferencePayload(values),
    });

    navigate(defaultBack, {
      replace: true,
      state: { from: "/marcas-gt/creditos" },
    });
  };

  return (
    <AppContainer size="lg" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Revisar referencia"
          description={reference?.nombre}
          backTo={backTo}
          backLabel="Volver al expediente"
        />

        <AppDataState
          isLoading={query.isLoading}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && (!query.data || !reference)}
          emptyTitle="Referencia no encontrada"
        >
          {query.data?.acciones.puedeRevisarExpediente && reference ? (
            <AppForm form={form} onSubmit={onSubmit}>
              <AppStack gap="md">
                <AppCard
                  title="Resultado de verificación"
                  description={
                    reference.nombre + " · " + reference.telefono
                  }
                  size="sm"
                >
                  <AppFormSingleSelect<
                    CreditReferenceReviewFormValues,
                    CreditReferenceReviewFormValues["resultado"]
                  >
                    name="resultado"
                    label="Resultado"
                    options={[
                      {
                        value: "VERIFICADA",
                        label: CREDIT_REFERENCE_RESULT_LABELS.VERIFICADA,
                      },
                      {
                        value: "NO_VERIFICADA",
                        label: CREDIT_REFERENCE_RESULT_LABELS.NO_VERIFICADA,
                      },
                      {
                        value: "RECHAZADA",
                        label: CREDIT_REFERENCE_RESULT_LABELS.RECHAZADA,
                      },
                    ]}
                    isClearable={false}
                    required
                  />

                  <div className="mt-4">
                    <AppFormTextarea<CreditReferenceReviewFormValues>
                      name="observaciones"
                      label="Observaciones"
                      maxLength={500}
                      rows={4}
                    />
                  </div>
                </AppCard>

                <div className="flex justify-end gap-2">
                  <AppButton asChild variant="secondary">
                    <Link to={backTo}>Cancelar</Link>
                  </AppButton>
                  <AppFormSubmit<CreditReferenceReviewFormValues>
                    leftIcon={<ShieldCheck />}
                    loadingText="Revisando..."
                    disableWhenInvalid
                  >
                    Guardar revisión
                  </AppFormSubmit>
                </div>
              </AppStack>
            </AppForm>
          ) : query.data && reference ? (
            <AppCard
              title="La referencia no puede revisarse"
              description="La solicitud debe estar EN_REVISION."
              size="sm"
            />
          ) : null}
        </AppDataState>
      </AppStack>
    </AppContainer>
  );
}
