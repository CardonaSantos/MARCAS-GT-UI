import { zodResolver } from "@hookform/resolvers/zod";
import { FileCheck2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  getListReturnRoute,
  getReturnRoute,
} from "@/features/common/navigation/route-state";
import { usePrepareInvoice } from "@/features/facturacion/api/billing.mutations";
import { useInvoice } from "@/features/facturacion/api/billing.queries";
import { toPrepareInvoicePayload } from "@/features/facturacion/common/billing.mappers";
import {
  prepareInvoiceSchema,
  type PrepareInvoiceFormValues,
} from "@/features/facturacion/schemas/billing.schemas";
import {
  AppForm,
  AppFormInput,
  AppFormSingleSelect,
  AppFormSubmit,
} from "@/ui/components/app/form";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function PrepareInvoicePage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const id = Number(params.id);
  const detailUrl = "/marcas-gt/facturacion/facturas/" + id;
  const backTo = getReturnRoute(location.state, detailUrl);
  const listFrom = getListReturnRoute(location.state, "/marcas-gt/facturacion/facturas");
  const query = useInvoice(id);
  const mutation = usePrepareInvoice();

  const form = useForm<PrepareInvoiceFormValues>({
    resolver: zodResolver(prepareInvoiceSchema),
    defaultValues: {
      tipoDte: "FACT",
      entorno: "PRUEBAS",
      establecimientoId: "",
      serieInterna: "FEL",
      versionEsquema: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: PrepareInvoiceFormValues) => {
    if (!query.data?.acciones.puedePreparar) return;
    await mutation.mutateAsync({
      id,
      payload: toPrepareInvoicePayload(values),
    });
    navigate(detailUrl, {
      replace: true,
      state: { from: listFrom },
    });
  };

  return (
    <AppContainer size="lg" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Preparar documento fiscal"
          description={
            query.data
              ? "Factura #" + query.data.id + " · " + query.data.cliente.nombreCompleto
              : undefined
          }
          backTo={backTo}
          backLabel="Volver a la factura"
        />

        <AppDataState
          isLoading={query.isLoading}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && !query.data}
          emptyTitle="Factura no encontrada"
        >
          {query.data ? (
            <AppForm form={form} onSubmit={onSubmit}>
              <AppStack gap="md">
                <AppAlert
                  tone="info"
                  title="Preparación, no certificación"
                  description="Este paso genera el snapshot fiscal y deja la factura LISTA_EMISION. No envía nada a Grupo CDS."
                />

                {!query.data.cliente.fiscal ? (
                  <AppAlert
                    tone="warning"
                    title="Cliente sin perfil fiscal"
                    description="La preparación será rechazada hasta configurar el receptor fiscal."
                  />
                ) : null}

                <AppCard title="DTE" size="sm">
                  <div className="grid gap-3 md:grid-cols-2">
                    <AppFormInput<PrepareInvoiceFormValues>
                      name="tipoDte"
                      label="Tipo DTE"
                      maxLength={8}
                      required
                    />
                    <AppFormSingleSelect<PrepareInvoiceFormValues, string>
                      name="entorno"
                      label="Entorno"
                      options={[{ value: "PRUEBAS", label: "Pruebas" }]}
                      required
                      disabled
                    />
                    <AppFormInput<PrepareInvoiceFormValues>
                      name="establecimientoId"
                      label="Establecimiento fiscal ID"
                      type="number"
                      min={1}
                      placeholder="Vacío = principal"
                    />
                    <AppFormInput<PrepareInvoiceFormValues>
                      name="serieInterna"
                      label="Serie interna"
                      maxLength={40}
                    />
                    <AppFormInput<PrepareInvoiceFormValues>
                      name="versionEsquema"
                      label="Versión esquema"
                      maxLength={30}
                    />
                  </div>
                </AppCard>

                <div className="flex justify-between gap-2">
                  <AppButton asChild variant="secondary">
                    <Link
                      to="/marcas-gt/facturacion/configuracion-fiscal"
                      state={{ from: backTo }}
                    >
                      Configuración fiscal
                    </Link>
                  </AppButton>
                  <div className="flex gap-2">
                    <AppButton asChild variant="secondary">
                      <Link to={backTo}>Cancelar</Link>
                    </AppButton>
                    <AppFormSubmit<PrepareInvoiceFormValues>
                      leftIcon={<FileCheck2 />}
                      loadingText="Preparando..."
                      disableWhenInvalid
                      disabled={!query.data.acciones.puedePreparar}
                    >
                      Preparar DTE
                    </AppFormSubmit>
                  </div>
                </div>
              </AppStack>
            </AppForm>
          ) : null}
        </AppDataState>
      </AppStack>
    </AppContainer>
  );
}
