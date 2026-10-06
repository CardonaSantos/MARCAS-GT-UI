import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { formatMoney } from "@/features/common/formatters/value.formatters";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  getListReturnRoute,
  getReturnRoute,
} from "@/features/common/navigation/route-state";
import { useIdempotencyKey } from "@/features/common/utils/idempotency";
import { useApproveCreditApplication } from "@/features/creditos/api/credit.mutations";
import { useCreditApplication } from "@/features/creditos/api/credit.queries";
import { toApproveCreditPayload } from "@/features/creditos/common/credit.mappers";
import {
  creditApprovalSchema,
  type CreditApprovalFormValues,
} from "@/features/creditos/schemas/credit.schemas";
import {
  AppForm,
  AppFormInput,
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

export default function ApproveCreditApplicationPage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const id = Number(params.id);
  const detailUrl = "/marcas-gt/creditos/solicitudes/" + id;
  const backTo = getReturnRoute(location.state, detailUrl);
  const listFrom = getListReturnRoute(location.state, "/marcas-gt/creditos");
  const key = useIdempotencyKey("credit-approve");

  const query = useCreditApplication(id);
  const mutation = useApproveCreditApplication();

  const form = useForm<CreditApprovalFormValues>({
    resolver: zodResolver(creditApprovalSchema),
    defaultValues: {
      montoAutorizado: "0.00",
      plazoAutorizadoDias: "30",
      anticipoRequerido: "0.00",
      observaciones: "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (!query.data) return;

    form.reset({
      montoAutorizado: Number(query.data.montos.solicitado).toFixed(2),
      plazoAutorizadoDias: String(query.data.plazos.solicitadoDias),
      anticipoRequerido: "0.00",
      observaciones: "",
    });
  }, [form, query.data]);

  const readiness = query.data
    ? {
        requisitos:
          query.data.expediente.requisitosPendientes +
          query.data.expediente.requisitosNoCumplidos,
        referencias: query.data.expediente.referenciasPendientes,
        documentos: query.data.expediente.documentosPendientes,
      }
    : null;

  const ready =
    readiness != null &&
    readiness.requisitos === 0 &&
    readiness.referencias === 0 &&
    readiness.documentos === 0;

  const onSubmit = async (values: CreditApprovalFormValues) => {
    if (!query.data?.acciones.puedeAprobar || !ready) return;

    await mutation.mutateAsync({
      id,
      payload: toApproveCreditPayload(values, key),
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
          title="Aprobar crédito"
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
          {query.data?.acciones.puedeAprobar ? (
            <AppForm form={form} onSubmit={onSubmit}>
              <AppStack gap="md">
                {!ready && readiness ? (
                  <AppAlert
                    tone="warning"
                    title="El expediente todavía no está listo"
                    description={
                      "Pendientes/no conformes: requisitos " +
                      readiness.requisitos +
                      ", referencias " +
                      readiness.referencias +
                      ", documentos " +
                      readiness.documentos +
                      "."
                    }
                  />
                ) : null}

                <AppCard
                  title="Resolución"
                  description="En crédito puro, el monto autorizado debe coincidir con el monto solicitado y el total vigente del Pedido."
                  size="sm"
                >
                  <AppGrid cols={{ base: 1, md: 2 }} gap="md">
                    <AppFormInput<CreditApprovalFormValues>
                      name="montoAutorizado"
                      label="Monto autorizado"
                      readOnly
                      required
                    />

                    <AppFormInput<CreditApprovalFormValues>
                      name="plazoAutorizadoDias"
                      label="Plazo autorizado (días)"
                      type="number"
                      min={1}
                      max={3650}
                      inputMode="numeric"
                      required
                    />

                    <AppFormInput<CreditApprovalFormValues>
                      name="anticipoRequerido"
                      label="Anticipo requerido"
                      readOnly
                      required
                    />
                  </AppGrid>

                  <div className="mt-4">
                    <AppFormTextarea<CreditApprovalFormValues>
                      name="observaciones"
                      label="Observaciones"
                      maxLength={1000}
                      rows={4}
                    />
                  </div>

                  <div className="mt-4">
                    <AppAlert
                      tone="info"
                      title="Monto del Pedido"
                      description={
                        "Total vigente: " +
                        formatMoney(query.data.origen.pedido.total) +
                        ". Anticipo: Q0.00."
                      }
                    />
                  </div>
                </AppCard>

                <div className="flex justify-end gap-2">
                  <AppButton asChild variant="secondary">
                    <Link to={backTo} state={{ from: listFrom }}>
                      Volver
                    </Link>
                  </AppButton>
                  <AppFormSubmit<CreditApprovalFormValues>
                    leftIcon={<CheckCircle2 />}
                    loadingText="Aprobando..."
                    disableWhenInvalid
                    disabled={!ready}
                  >
                    Aprobar crédito
                  </AppFormSubmit>
                </div>
              </AppStack>
            </AppForm>
          ) : query.data ? (
            <AppCard
              title="La solicitud no puede aprobarse"
              description="El estado actual no permite esta operación."
              size="sm"
            />
          ) : null}
        </AppDataState>
      </AppStack>
    </AppContainer>
  );
}
