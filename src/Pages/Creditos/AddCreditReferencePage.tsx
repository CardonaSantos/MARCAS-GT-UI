import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useAddCreditReference } from "@/features/creditos/api/credit.mutations";
import { useCreditApplication } from "@/features/creditos/api/credit.queries";
import { toAddCreditReferencePayload } from "@/features/creditos/common/credit.mappers";
import {
  CREDIT_REFERENCE_TYPE_LABELS,
  CREDIT_REFERENCE_TYPES,
} from "@/features/creditos/common/credit.constants";
import {
  creditReferenceSchema,
  type CreditReferenceFormValues,
} from "@/features/creditos/schemas/credit.schemas";
import {
  AppForm,
  AppFormInput,
  AppFormSingleSelect,
  AppFormSubmit,
  AppFormTextarea,
} from "@/ui/components/app/form";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function AddCreditReferencePage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const id = Number(params.id);
  const defaultBack =
    "/marcas-gt/creditos/solicitudes/" + id + "?tab=referencias";
  const backTo = getReturnRoute(location.state, defaultBack);

  const query = useCreditApplication(id);
  const mutation = useAddCreditReference();

  const form = useForm<CreditReferenceFormValues>({
    resolver: zodResolver(creditReferenceSchema),
    defaultValues: {
      tipo: "PERSONAL",
      nombre: "",
      telefono: "",
      relacion: "",
      observaciones: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: CreditReferenceFormValues) => {
    if (!query.data?.acciones.puedeAgregarExpediente) return;

    await mutation.mutateAsync({
      id,
      payload: toAddCreditReferencePayload(values),
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
          title="Agregar referencia"
          description={query.data?.numero}
          backTo={backTo}
          backLabel="Volver al expediente"
        />

        <AppDataState
          isLoading={query.isLoading}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && !query.data}
          emptyTitle="Solicitud no encontrada"
        >
          {query.data?.acciones.puedeAgregarExpediente ? (
            <AppForm form={form} onSubmit={onSubmit}>
              <AppStack gap="md">
                <AppCard title="Referencia" size="sm">
                  <AppGrid cols={{ base: 1, md: 2 }} gap="md">
                    <AppFormSingleSelect<
                      CreditReferenceFormValues,
                      CreditReferenceFormValues["tipo"]
                    >
                      name="tipo"
                      label="Tipo"
                      options={CREDIT_REFERENCE_TYPES.map((value) => ({
                        value,
                        label: CREDIT_REFERENCE_TYPE_LABELS[value],
                      }))}
                      isClearable={false}
                      required
                    />

                    <AppFormInput<CreditReferenceFormValues>
                      name="nombre"
                      label="Nombre"
                      maxLength={160}
                      required
                    />

                    <AppFormInput<CreditReferenceFormValues>
                      name="telefono"
                      label="Teléfono"
                      maxLength={60}
                      required
                    />

                    <AppFormInput<CreditReferenceFormValues>
                      name="relacion"
                      label="Relación"
                      maxLength={160}
                    />
                  </AppGrid>

                  <div className="mt-4">
                    <AppFormTextarea<CreditReferenceFormValues>
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
                  <AppFormSubmit<CreditReferenceFormValues>
                    leftIcon={<Plus />}
                    loadingText="Agregando..."
                    disableWhenInvalid
                  >
                    Agregar referencia
                  </AppFormSubmit>
                </div>
              </AppStack>
            </AppForm>
          ) : query.data ? (
            <AppCard
              title="Expediente no editable"
              description="El estado actual no permite agregar referencias."
              size="sm"
            />
          ) : null}
        </AppDataState>
      </AppStack>
    </AppContainer>
  );
}
