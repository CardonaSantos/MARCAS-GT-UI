import {
  CheckCircle2,
  FilePlus2,
  Landmark,
  Pencil,
  Plus,
  RefreshCw,
  Send,
  XCircle,
} from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useUrlTabState } from "@/features/common/navigation/use-url-tab-state";
import {
  useRetryCreditIntegration,
  useSubmitCreditApplication,
} from "@/features/creditos/api/credit.mutations";
import { useCreditApplication } from "@/features/creditos/api/credit.queries";
import {
  CREDIT_APPLICATION_STATE_LABELS,
  CREDIT_APPLICATION_STATE_TONES,
  CREDIT_DETAIL_TABS,
  type CreditDetailTab,
} from "@/features/creditos/common/credit.constants";
import { CreditActivity } from "@/features/creditos/components/credit-activity";
import { CreditDetailSummary } from "@/features/creditos/components/credit-detail-summary";
import { CreditDocumentsTable } from "@/features/creditos/components/credit-documents-table";
import { CreditFinancialPanel } from "@/features/creditos/components/credit-financial-panel";
import { CreditReferencesTable } from "@/features/creditos/components/credit-references-table";
import { CreditRequirementsTable } from "@/features/creditos/components/credit-requirements-table";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppStack } from "@/ui/components/app/primitives/app-stack";
import { AppTabs } from "@/ui/components/app/primitives/app-tabs";

export default function CreditApplicationDetailPage() {
  const params = useParams();
  const location = useLocation();
  const id = Number(params.id);

  const backTo = getReturnRoute(location.state, "/marcas-gt/creditos");
  const currentUrl = location.pathname + location.search;

  const query = useCreditApplication(id);
  const submitMutation = useSubmitCreditApplication();
  const retryMutation = useRetryCreditIntegration();

  const tabState = useUrlTabState<CreditDetailTab>({
    defaultValue: "resumen",
    allowedValues: CREDIT_DETAIL_TABS,
  });

  const credit = query.data;

  const tabs = credit
    ? [
        {
          value: "resumen" as const,
          label: "Resumen",
          content: <CreditDetailSummary credit={credit} />,
        },
        {
          value: "requisitos" as const,
          label: "Requisitos",
          badge: (
            <AppBadge tone="neutral" size="xs">
              {credit.requisitos.length}
            </AppBadge>
          ),
          content: (
            <AppCard
              title="Requisitos del expediente"
              description="Los requisitos provienen de la política vigente al crear o actualizar la solicitud."
              size="sm"
            >
              <CreditRequirementsTable
                creditId={id}
                data={credit.requisitos}
                canReview={credit.acciones.puedeRevisarExpediente}
              />
            </AppCard>
          ),
        },
        {
          value: "referencias" as const,
          label: "Referencias",
          badge: (
            <AppBadge tone="neutral" size="xs">
              {credit.referencias.length}
            </AppBadge>
          ),
          content: (
            <AppStack gap="sm">
              {credit.acciones.puedeAgregarExpediente ? (
                <div className="flex justify-end">
                  <AppButton asChild variant="primary" size="sm">
                    <Link
                      to={
                        "/marcas-gt/creditos/solicitudes/" +
                        id +
                        "/referencias/nueva"
                      }
                      state={{ from: currentUrl }}
                    >
                      <Plus className="h-4 w-4" />
                      Agregar referencia
                    </Link>
                  </AppButton>
                </div>
              ) : null}

              <CreditReferencesTable
                creditId={id}
                data={credit.referencias}
                canEdit={credit.acciones.puedeAgregarExpediente}
                canReview={credit.acciones.puedeRevisarExpediente}
              />
            </AppStack>
          ),
        },
        {
          value: "documentos" as const,
          label: "Documentos",
          badge: (
            <AppBadge tone="neutral" size="xs">
              {credit.documentos.length}
            </AppBadge>
          ),
          content: (
            <AppStack gap="sm">
              {credit.acciones.puedeAgregarExpediente ? (
                <div className="flex justify-end">
                  <AppButton asChild variant="primary" size="sm">
                    <Link
                      to={
                        "/marcas-gt/creditos/solicitudes/" +
                        id +
                        "/documentos/nuevo"
                      }
                      state={{ from: currentUrl }}
                    >
                      <FilePlus2 className="h-4 w-4" />
                      Registrar documento
                    </Link>
                  </AppButton>
                </div>
              ) : null}

              <CreditDocumentsTable
                creditId={id}
                data={credit.documentos}
                canReview={credit.acciones.puedeRevisarExpediente}
              />
            </AppStack>
          ),
        },
        {
          value: "financiero" as const,
          label: "Financiero",
          content: <CreditFinancialPanel credit={credit} />,
        },
        {
          value: "actividad" as const,
          label: "Actividad",
          content: <CreditActivity creditId={id} />,
        },
      ]
    : [];

  return (
    <AppContainer size="full" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title={
            credit ? (
              <span className="inline-flex flex-wrap items-center gap-2">
                {credit.numero}
                <AppBadge
                  tone={CREDIT_APPLICATION_STATE_TONES[credit.estado]}
                  size="xs"
                >
                  {CREDIT_APPLICATION_STATE_LABELS[credit.estado]}
                </AppBadge>
              </span>
            ) : (
              "Detalle de solicitud"
            )
          }
          description={
            credit
              ? credit.cliente.nombreCompleto +
                " · " +
                credit.origen.pedido.numero
              : undefined
          }
          backTo={backTo}
          backLabel="Volver a solicitudes"
          actions={
            credit ? (
              <>
                {credit.credito ? (
                  <AppButton asChild variant="secondary" size="sm">
                    <Link
                      to={"/marcas-gt/creditos/cartera/" + credit.credito.id}
                      state={{ from: currentUrl }}
                    >
                      <Landmark className="h-4 w-4" />
                      Ver crédito
                    </Link>
                  </AppButton>
                ) : null}

                {credit.acciones.puedeEditar ? (
                  <AppButton asChild variant="secondary" size="sm">
                    <Link
                      to={
                        "/marcas-gt/creditos/solicitudes/" +
                        id +
                        "/editar"
                      }
                      state={{ from: currentUrl, listFrom: backTo }}
                    >
                      <Pencil className="h-4 w-4" />
                      Editar
                    </Link>
                  </AppButton>
                ) : null}

                {credit.acciones.puedeEnviarRevision ? (
                  <AppConfirmDialog
                    title="Enviar expediente a revisión"
                    description="La solicitud pasará a EN_REVISION. ADMIN o CONTABILIDAD podrán revisar requisitos, referencias y documentos."
                    preset="send"
                    confirmText="Enviar a revisión"
                    loadingText="Enviando..."
                    isLoading={submitMutation.isPending}
                    trigger={
                      <AppButton
                        variant="secondary"
                        size="sm"
                        leftIcon={<Send />}
                      >
                        Enviar a revisión
                      </AppButton>
                    }
                    onConfirm={async () => {
                      await submitMutation.mutateAsync({ id });
                    }}
                  />
                ) : null}

                {credit.acciones.puedeAprobar ? (
                  <AppButton asChild variant="primary" size="sm">
                    <Link
                      to={
                        "/marcas-gt/creditos/solicitudes/" +
                        id +
                        "/aprobar"
                      }
                      state={{ from: currentUrl, listFrom: backTo }}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Aprobar
                    </Link>
                  </AppButton>
                ) : null}

                {credit.acciones.puedeRechazar ? (
                  <AppButton asChild variant="danger" size="sm">
                    <Link
                      to={
                        "/marcas-gt/creditos/solicitudes/" +
                        id +
                        "/rechazar"
                      }
                      state={{ from: currentUrl, listFrom: backTo }}
                    >
                      <XCircle className="h-4 w-4" />
                      Rechazar
                    </Link>
                  </AppButton>
                ) : null}

                {credit.acciones.puedeReintentarIntegracion ? (
                  <AppConfirmDialog
                    title="Reintentar integración con Pedido"
                    description="Se volverá a intentar aplicar la decisión de crédito al pedido relacionado."
                    preset="warning"
                    confirmText="Reintentar"
                    loadingText="Reintentando..."
                    isLoading={retryMutation.isPending}
                    trigger={
                      <AppButton
                        variant="secondary"
                        size="sm"
                        leftIcon={<RefreshCw />}
                      >
                        Reintentar integración
                      </AppButton>
                    }
                    onConfirm={async () => {
                      await retryMutation.mutateAsync({ id });
                    }}
                  />
                ) : null}

                {credit.acciones.puedeCancelar ? (
                  <AppButton asChild variant="danger" size="sm">
                    <Link
                      to={
                        "/marcas-gt/creditos/solicitudes/" +
                        id +
                        "/cancelar"
                      }
                      state={{ from: currentUrl, listFrom: backTo }}
                    >
                      <XCircle className="h-4 w-4" />
                      Cancelar
                    </Link>
                  </AppButton>
                ) : null}
              </>
            ) : undefined
          }
        />

        <AppDataState
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && !credit}
          emptyTitle="Solicitud no encontrada"
          emptyDescription="La solicitud no existe o no está disponible para tu usuario."
        >
          {credit ? (
            <AppTabs
              tabs={tabs}
              value={tabState.value}
              onValueChange={tabState.setValue}
              variant="minimal"
              size="sm"
            />
          ) : null}
        </AppDataState>
      </AppStack>
    </AppContainer>
  );
}
