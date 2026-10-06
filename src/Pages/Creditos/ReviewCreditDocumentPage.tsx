import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useReviewCreditDocument } from "@/features/creditos/api/credit.mutations";
import { useCreditApplication } from "@/features/creditos/api/credit.queries";
import { toReviewCreditDocumentPayload } from "@/features/creditos/common/credit.mappers";
import { CREDIT_DOCUMENT_STATE_LABELS } from "@/features/creditos/common/credit.constants";
import {
  creditDocumentReviewSchema,
  type CreditDocumentReviewFormValues,
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

export default function ReviewCreditDocumentPage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const id = Number(params.id);
  const documentId = Number(params.documentId);
  const defaultBack =
    "/marcas-gt/creditos/solicitudes/" + id + "?tab=documentos";
  const backTo = getReturnRoute(location.state, defaultBack);

  const query = useCreditApplication(id);
  const mutation = useReviewCreditDocument();
  const document = query.data?.documentos.find(
    (item) => item.id === documentId,
  );

  const form = useForm<CreditDocumentReviewFormValues>({
    resolver: zodResolver(creditDocumentReviewSchema),
    defaultValues: {
      estado: "VALIDADO",
      observaciones: "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (!document) return;

    form.reset({
      estado:
        document.estado === "PENDIENTE"
          ? "VALIDADO"
          : document.estado,
      observaciones: document.observaciones ?? "",
    });
  }, [document, form]);

  const onSubmit = async (values: CreditDocumentReviewFormValues) => {
    if (!query.data?.acciones.puedeRevisarExpediente || !document) return;

    await mutation.mutateAsync({
      id,
      documentId,
      payload: toReviewCreditDocumentPayload(values),
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
          title="Revisar documento"
          description={document?.url}
          backTo={backTo}
          backLabel="Volver al expediente"
        />

        <AppDataState
          isLoading={query.isLoading}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && (!query.data || !document)}
          emptyTitle="Documento no encontrado"
        >
          {query.data?.acciones.puedeRevisarExpediente && document ? (
            <AppForm form={form} onSubmit={onSubmit}>
              <AppStack gap="md">
                <AppCard title="Revisión" size="sm">
                  <AppFormSingleSelect<
                    CreditDocumentReviewFormValues,
                    CreditDocumentReviewFormValues["estado"]
                  >
                    name="estado"
                    label="Resultado"
                    options={[
                      {
                        value: "VALIDADO",
                        label: CREDIT_DOCUMENT_STATE_LABELS.VALIDADO,
                      },
                      {
                        value: "RECHAZADO",
                        label: CREDIT_DOCUMENT_STATE_LABELS.RECHAZADO,
                      },
                    ]}
                    isClearable={false}
                    required
                  />

                  <div className="mt-4">
                    <AppFormTextarea<CreditDocumentReviewFormValues>
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
                  <AppFormSubmit<CreditDocumentReviewFormValues>
                    leftIcon={<ShieldCheck />}
                    loadingText="Revisando..."
                    disableWhenInvalid
                  >
                    Guardar revisión
                  </AppFormSubmit>
                </div>
              </AppStack>
            </AppForm>
          ) : query.data && document ? (
            <AppCard
              title="El documento no puede revisarse"
              description="La solicitud debe estar EN_REVISION."
              size="sm"
            />
          ) : null}
        </AppDataState>
      </AppStack>
    </AppContainer>
  );
}
