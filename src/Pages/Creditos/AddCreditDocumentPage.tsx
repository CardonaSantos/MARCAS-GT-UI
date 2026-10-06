import { zodResolver } from "@hookform/resolvers/zod";
import { FilePlus2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useAddCreditDocument } from "@/features/creditos/api/credit.mutations";
import { useCreditApplication } from "@/features/creditos/api/credit.queries";
import { toAddCreditDocumentPayload } from "@/features/creditos/common/credit.mappers";
import {
  CREDIT_DOCUMENT_TYPE_LABELS,
  CREDIT_DOCUMENT_TYPES,
} from "@/features/creditos/common/credit.constants";
import {
  creditDocumentSchema,
  type CreditDocumentFormValues,
} from "@/features/creditos/schemas/credit.schemas";
import {
  AppForm,
  AppFormInput,
  AppFormSingleSelect,
  AppFormSubmit,
  AppFormTextarea,
} from "@/ui/components/app/form";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppGrid } from "@/ui/components/app/primitives/app-grid";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function AddCreditDocumentPage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const id = Number(params.id);
  const defaultBack =
    "/marcas-gt/creditos/solicitudes/" + id + "?tab=documentos";
  const backTo = getReturnRoute(location.state, defaultBack);

  const query = useCreditApplication(id);
  const mutation = useAddCreditDocument();

  const form = useForm<CreditDocumentFormValues>({
    resolver: zodResolver(creditDocumentSchema),
    defaultValues: {
      tipo: "DPI",
      url: "",
      key: "",
      mimeType: "",
      size: "",
      observaciones: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: CreditDocumentFormValues) => {
    if (!query.data?.acciones.puedeAgregarExpediente) return;

    await mutation.mutateAsync({
      id,
      payload: toAddCreditDocumentPayload(values),
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
          title="Registrar documento"
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
                <AppAlert
                  tone="info"
                  title="Registro por URL"
                  description="El contrato actual del servidor registra una URL ya alojada; este endpoint no recibe archivos multipart. Por eso esta vista no simula una carga de archivos."
                />

                <AppCard title="Documento" size="sm">
                  <AppGrid cols={{ base: 1, md: 2 }} gap="md">
                    <AppFormSingleSelect<
                      CreditDocumentFormValues,
                      CreditDocumentFormValues["tipo"]
                    >
                      name="tipo"
                      label="Tipo"
                      options={CREDIT_DOCUMENT_TYPES.map((value) => ({
                        value,
                        label: CREDIT_DOCUMENT_TYPE_LABELS[value],
                      }))}
                      isClearable={false}
                      required
                    />

                    <AppFormInput<CreditDocumentFormValues>
                      name="mimeType"
                      label="MIME type"
                      maxLength={200}
                      placeholder="application/pdf"
                    />

                    <div className="md:col-span-2">
                      <AppFormInput<CreditDocumentFormValues>
                        name="url"
                        label="URL / ubicación"
                        maxLength={2000}
                        placeholder="https://..."
                        required
                      />
                    </div>

                    <AppFormInput<CreditDocumentFormValues>
                      name="key"
                      label="Key de almacenamiento"
                      maxLength={1000}
                      placeholder="Opcional"
                    />

                    <AppFormInput<CreditDocumentFormValues>
                      name="size"
                      label="Tamaño en bytes"
                      type="number"
                      min={0}
                      inputMode="numeric"
                      placeholder="Opcional"
                    />
                  </AppGrid>

                  <div className="mt-4">
                    <AppFormTextarea<CreditDocumentFormValues>
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
                  <AppFormSubmit<CreditDocumentFormValues>
                    leftIcon={<FilePlus2 />}
                    loadingText="Registrando..."
                    disableWhenInvalid
                  >
                    Registrar documento
                  </AppFormSubmit>
                </div>
              </AppStack>
            </AppForm>
          ) : query.data ? (
            <AppCard
              title="Expediente no editable"
              description="El estado actual no permite agregar documentos."
              size="sm"
            />
          ) : null}
        </AppDataState>
      </AppStack>
    </AppContainer>
  );
}
