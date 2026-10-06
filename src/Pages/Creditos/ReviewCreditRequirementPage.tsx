import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardCheck } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useReviewCreditRequirement } from "@/features/creditos/api/credit.mutations";
import { useCreditApplication } from "@/features/creditos/api/credit.queries";
import { toReviewCreditRequirementPayload } from "@/features/creditos/common/credit.mappers";
import { CREDIT_REQUIREMENT_STATE_LABELS } from "@/features/creditos/common/credit.constants";
import {
  creditRequirementReviewSchema,
  type CreditRequirementReviewFormValues,
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

export default function ReviewCreditRequirementPage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const id = Number(params.id);
  const requirementId = Number(params.requirementId);
  const defaultBack =
    "/marcas-gt/creditos/solicitudes/" + id + "?tab=requisitos";
  const backTo = getReturnRoute(location.state, defaultBack);

  const query = useCreditApplication(id);
  const mutation = useReviewCreditRequirement();
  const requirement = query.data?.requisitos.find(
    (item) => item.id === requirementId,
  );

  const form = useForm<CreditRequirementReviewFormValues>({
    resolver: zodResolver(creditRequirementReviewSchema),
    defaultValues: {
      estado: "CUMPLIDO",
      observaciones: "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (!requirement) return;

    form.reset({
      estado:
        requirement.estado === "PENDIENTE"
          ? "CUMPLIDO"
          : requirement.estado,
      observaciones: requirement.observaciones ?? "",
    });
  }, [form, requirement]);

  const onSubmit = async (values: CreditRequirementReviewFormValues) => {
    if (!query.data?.acciones.puedeRevisarExpediente || !requirement) return;

    await mutation.mutateAsync({
      id,
      requirementId,
      payload: toReviewCreditRequirementPayload(values),
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
          title="Revisar requisito"
          description={requirement?.nombre}
          backTo={backTo}
          backLabel="Volver al expediente"
        />

        <AppDataState
          isLoading={query.isLoading}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && (!query.data || !requirement)}
          emptyTitle="Requisito no encontrado"
        >
          {query.data?.acciones.puedeRevisarExpediente && requirement ? (
            <AppForm form={form} onSubmit={onSubmit}>
              <AppStack gap="md">
                <AppCard
                  title={requirement.codigo + " · " + requirement.nombre}
                  description={requirement.descripcion ?? undefined}
                  size="sm"
                >
                  <AppFormSingleSelect<
                    CreditRequirementReviewFormValues,
                    CreditRequirementReviewFormValues["estado"]
                  >
                    name="estado"
                    label="Resultado"
                    options={[
                      {
                        value: "CUMPLIDO",
                        label: CREDIT_REQUIREMENT_STATE_LABELS.CUMPLIDO,
                      },
                      {
                        value: "NO_CUMPLE",
                        label: CREDIT_REQUIREMENT_STATE_LABELS.NO_CUMPLE,
                      },
                      {
                        value: "EXONERADO",
                        label: CREDIT_REQUIREMENT_STATE_LABELS.EXONERADO,
                      },
                    ]}
                    isClearable={false}
                    required
                  />

                  <div className="mt-4">
                    <AppFormTextarea<CreditRequirementReviewFormValues>
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
                  <AppFormSubmit<CreditRequirementReviewFormValues>
                    leftIcon={<ClipboardCheck />}
                    loadingText="Revisando..."
                    disableWhenInvalid
                  >
                    Guardar revisión
                  </AppFormSubmit>
                </div>
              </AppStack>
            </AppForm>
          ) : query.data && requirement ? (
            <AppCard
              title="El requisito no puede revisarse"
              description="La solicitud debe estar EN_REVISION."
              size="sm"
            />
          ) : null}
        </AppDataState>
      </AppStack>
    </AppContainer>
  );
}
