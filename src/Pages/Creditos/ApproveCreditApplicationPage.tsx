import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { formatMoney } from "@/features/common/formatters/value.formatters";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  getListReturnRoute,
  getReturnRoute,
} from "@/features/common/navigation/route-state";
import { useIdempotencyKey } from "@/features/common/utils/idempotency";
import { useApproveCreditWithSchedule } from "@/features/creditos/api/credit.mutations";
import { useCreditApplication } from "@/features/creditos/api/credit.queries";
import { toApproveCreditPayload } from "@/features/creditos/common/credit.mappers";
import { financedCreditAmount, moneyCents, validCreditAdvance } from "@/features/creditos/common/credit-advance.utils";
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
import { AppInput } from "@/ui/components/app/primitives/app-input";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";
import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";
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
  const mutation = useApproveCreditWithSchedule();
  const [frequency, setFrequency] = useState<"MENSUAL" | "QUINCENAL" | "SEMANAL">("MENSUAL");
  const [installments, setInstallments] = useState("1");
  const [firstDue, setFirstDue] = useState(() => {
    const future = new Date();
    future.setUTCDate(future.getUTCDate() + 30);
    return future.toISOString().slice(0, 10);
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const installmentCount = Number(installments);
  const validSchedule = Number.isInteger(installmentCount) &&
    installmentCount >= 1 && installmentCount <= 120 && Boolean(firstDue);
  const dueDate = useMemo(() => {
    const date = new Date(firstDue + "T12:00:00.000Z");
    return Number.isNaN(date.getTime()) ? null : date;
  }, [firstDue]);

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
      anticipoRequerido: query.data.origen.pedido.condicionPago === "MIXTO"
        ? query.data.montos.anticipoPropuesto : "0.00",
      observaciones: "",
    });
  }, [form, query.data]);

  const isMixed = query.data?.origen.pedido.condicionPago === "MIXTO";
  const authorized = form.watch("montoAutorizado");
  const advance = form.watch("anticipoRequerido");
  const validAdvance = validCreditAdvance(isMixed ? "MIXTO" : "CREDITO", advance, authorized);
  const financed = financedCreditAmount(authorized, advance);
  const validFinancedSchedule = validSchedule && validAdvance &&
    (moneyCents(financed ?? "") ?? 0) >= installmentCount;

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

  const onSubmit = async (_values: CreditApprovalFormValues) => {
    if (!query.data?.acciones.puedeAprobar || !ready || !validFinancedSchedule || !dueDate) return;
    setConfirmOpen(true);
  };

  const confirmApproval = async () => {
    const values = form.getValues();
    if (!validFinancedSchedule || !dueDate) return;
    const result = await mutation.mutateAsync({
      id,
      payload: {
        ...toApproveCreditPayload(values, key),
        plan: {
          frecuencia: frequency,
          numeroCuotas: installmentCount,
          primeraFechaVencimiento: dueDate.toISOString(),
        },
      },
    });
    navigate("/marcas-gt/creditos/cartera/" + result.creditoId + "?tab=plan-pagos", {
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
                  description={isMixed
                    ? "En crédito con anticipo se autoriza el total del pedido. El anticipo se descontará del saldo a financiar."
                    : "En crédito puro se financia el total del pedido, sin anticipo."}
                  size="sm"
                >
                  <AppGrid cols={{ base: 1, md: 2, lg: 3 }} gap="md">
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
                      label={isMixed ? "Anticipo requerido (Q)" : "Anticipo (no aplica)"}
                      type="number"
                      min={0}
                      step="0.01"
                      inputMode="decimal"
                      readOnly={!isMixed}
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
                        ". Anticipo: " + formatMoney(advance || 0) +
                        ". Saldo financiado: " + (financed == null ? "—" : formatMoney(financed)) + "."
                      }
                    />
                  </div>
                  {isMixed ? (
                    <div className="mt-3">
                      <AppAlert tone={validAdvance ? "info" : "warning"}
                        title={validAdvance ? "Anticipo y financiación separados" : "Revisa el anticipo"}
                        description={validAdvance
                          ? "El anticipo se cobra desde Pagos; debe verificarse y aplicarse antes de entregar el pedido y activar las cuotas."
                          : "Ingresa un anticipo mayor que Q0.00 y menor que el monto autorizado."} />
                    </div>
                  ) : null}
                </AppCard>

                <AppCard
                  title="Programar cuotas"
                  description={isMixed
                    ? "El calendario quedará en borrador hasta que ADMIN o CONTABILIDAD active las cuotas. Antes debe estar verificado y aplicado el anticipo."
                    : "Se guardará el calendario en borrador. ADMIN o CONTABILIDAD podrá activarlo sin esperar la entrega."}
                  size="sm"
                >
                  <AppGrid cols={{ base: 1, md: 3 }} gap="md">
                    <div className="min-w-0">
                      <label className="mb-2 block text-xs font-medium">Frecuencia *</label>
                      <AppSingleSelect<"MENSUAL" | "QUINCENAL" | "SEMANAL">
                        value={frequency}
                        onChange={(value) => { if (value) setFrequency(value); }}
                        options={[
                          { value: "SEMANAL", label: "Semanal" },
                          { value: "QUINCENAL", label: "Quincenal" },
                          { value: "MENSUAL", label: "Mensual" },
                        ]}
                      />
                    </div>
                    <div className="min-w-0">
                      <label htmlFor="installments-count" className="mb-2 block text-xs font-medium">
                        Número de cuotas *
                      </label>
                      <AppInput
                        id="installments-count"
                        type="number"
                        min={1}
                        max={120}
                        inputMode="numeric"
                        value={installments}
                        aria-invalid={!validSchedule}
                        onChange={(e) => setInstallments(e.target.value)}
                      />
                    </div>
                    <div className="min-w-0">
                      <label htmlFor="first-due-date" className="mb-2 block text-xs font-medium">
                        Primera fecha de pago *
                      </label>
                      <AppInput
                        id="first-due-date"
                        type="date"
                        value={firstDue}
                        onChange={(e) => setFirstDue(e.target.value)}
                        required
                      />
                    </div>
                  </AppGrid>
                  {!validFinancedSchedule && validAdvance && (moneyCents(financed ?? "") ?? 0) < installmentCount ? (
                    <p className="mt-2 text-sm text-red-500" role="alert">El saldo financiado no alcanza para generar cuotas positivas.</p>
                  ) : null}
                  <p className="mt-3 text-xs text-[hsl(var(--app-muted-foreground))]">
                    La suma se distribuye sin perder centavos. La última cuota absorbe el redondeo.
                  </p>
                </AppCard>

                <AppConfirmDialog
                  open={confirmOpen}
                  onOpenChange={setConfirmOpen}
                  title="Aprobar crédito y programar cuotas"
                  description={"Se autorizarán " + formatMoney(authorized) +
                    " con anticipo de " + formatMoney(advance || 0) +
                    " y saldo financiado de " + (financed ? formatMoney(financed) : "—") +
                    " en " + installmentCount + " cuota(s). " +
                    (isMixed ? "El anticipo debe quedar verificado y aplicado antes de la entrega." :
                      "Las cuotas se crearán cuando ADMIN o CONTABILIDAD active el plan.")}
                  preset="success"
                  confirmText="Aprobar y programar"
                  loadingText="Autorizando..."
                  isLoading={mutation.isPending}
                  onConfirm={confirmApproval}
                  contentCard
                />

                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <AppButton asChild variant="secondary">
                    <Link to={backTo} state={{ from: listFrom }}>
                      Volver
                    </Link>
                  </AppButton>
                  <AppFormSubmit<CreditApprovalFormValues>
                    leftIcon={<CheckCircle2 />}
                    loadingText="Aprobando..."
                    disableWhenInvalid
                    disabled={!ready || !validFinancedSchedule || mutation.isPending}
                    className="w-full sm:w-auto"
                  >
                    Aprobar y programar cuotas
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
