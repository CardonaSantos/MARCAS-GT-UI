import {
  Banknote,
  CalendarClock,
  CheckCircle2,
  Plus,
  Save,
  WalletCards,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useStore } from "@/Context/ContextSucursal";
import {
  formatDate,
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import { createIdempotencyKey } from "@/features/common/utils/idempotency";
import { useApplyPayment } from "@/features/pagos/api/payment.mutations";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";
import { AppInput } from "@/ui/components/app/primitives/app-input";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";

import {
  useActivateCreditPaymentPlan,
  useCreateCreditPaymentPlan,
  useUpdateCreditPaymentPlan,
} from "../api/credit.mutations";
import type {
  CreditPaymentPlanFrequency,
  CreditPortfolioDetail,
} from "../api/credit.types";
import {
  CREDIT_PAYMENT_PLAN_FREQUENCIES,
  CREDIT_PAYMENT_PLAN_FREQUENCY_LABELS,
} from "../common/credit.constants";

type DraftInstallment = {
  fechaVencimiento: string;
  montoProgramado: string;
};

type SaveReview = {
  frequency: CreditPaymentPlanFrequency;
  installments: DraftInstallment[];
  total: string;
} | null;

type ApplyReview = {
  paymentId: number;
  paymentAvailable: string;
  installmentId: number;
  accountId: number;
  installmentNumber: number;
  installmentBalance: string;
  amount: string;
} | null;

function moneyToCents(value: string | number) {
  return Math.round(Number(value) * 100);
}

function centsToMoney(value: number) {
  return (value / 100).toFixed(2);
}

function toDateInput(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function daysInMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

function addMonths(dateText: string, months: number) {
  const [year, month, day] = dateText.split("-").map(Number);
  const baseMonth = month - 1 + months;
  const targetYear = year + Math.floor(baseMonth / 12);
  const targetMonth = ((baseMonth % 12) + 12) % 12;
  const targetDay = Math.min(day, daysInMonth(targetYear, targetMonth));
  return [
    String(targetYear).padStart(4, "0"),
    String(targetMonth + 1).padStart(2, "0"),
    String(targetDay).padStart(2, "0"),
  ].join("-");
}

function addDays(dateText: string, days: number) {
  const [year, month, day] = dateText.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

function dueDateFor(
  firstDate: string,
  frequency: CreditPaymentPlanFrequency,
  index: number,
) {
  if (frequency === "SEMANAL") return addDays(firstDate, index * 7);
  if (frequency === "QUINCENAL") return addDays(firstDate, index * 15);
  if (frequency === "MENSUAL") return addMonths(firstDate, index);
  return firstDate;
}

function generateInstallments(
  financed: string,
  count: number,
  firstDate: string,
  frequency: CreditPaymentPlanFrequency,
): DraftInstallment[] {
  const total = moneyToCents(financed);
  const base = Math.floor(total / count);
  const remainder = total - base * count;

  return Array.from({ length: count }, (_, index) => ({
    fechaVencimiento: dueDateFor(firstDate, frequency, index),
    montoProgramado: centsToMoney(base + (index < remainder ? 1 : 0)),
  }));
}

function toneForAccount(state: string) {
  if (state === "PAGADA") return "success" as const;
  if (state === "VENCIDA") return "danger" as const;
  if (state === "PARCIAL") return "warning" as const;
  return "neutral" as const;
}

export function CreditPaymentPlanPanel({
  credit,
}: {
  credit: CreditPortfolioDetail;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const role = useStore((state) => state.userRol);
  const canApply = role === "ADMIN" || role === "CONTABILIDAD";
  const canRegister = ["ADMIN", "CONTABILIDAD", "VENDEDOR"].includes(
    role ?? "",
  );

  const createMutation = useCreateCreditPaymentPlan();
  const updateMutation = useUpdateCreditPaymentPlan();
  const activateMutation = useActivateCreditPaymentPlan();
  const applyMutation = useApplyPayment();

  const existingPlan = credit.planPago;
  const editable = credit.acciones.puedeGestionarPlan;
  const active = existingPlan?.estado === "ACTIVO";
  const advanceRequired = Number(credit.montos.anticipoRequerido) > 0;
  const advanceMissing = Number(
    credit.anticipo?.saldoPendiente ?? credit.montos.anticipoRequerido,
  );
  const advanceReady =
    !advanceRequired ||
    (credit.anticipo?.estado === "PAGADA" && advanceMissing === 0);
  const pendingAdvanceId = credit.anticipo?.pagoPendienteId ?? null;
  const advancePaymentUrl =
    "/marcas-gt/pagos/nuevo?clienteId=" +
    credit.cliente.id +
    "&pedidoId=" +
    credit.pedido.id +
    "&monto=" +
    advanceMissing.toFixed(2) +
    "&concepto=anticipo";

  const [frequency, setFrequency] =
    useState<CreditPaymentPlanFrequency>("MENSUAL");
  const [installmentCount, setInstallmentCount] = useState(1);
  const [firstDate, setFirstDate] = useState("");
  const [installments, setInstallments] = useState<DraftInstallment[]>([]);
  const [saveReview, setSaveReview] = useState<SaveReview>(null);
  const [activateOpen, setActivateOpen] = useState(false);
  const [activateKey, setActivateKey] = useState("");
  const [applyReview, setApplyReview] = useState<ApplyReview>(null);
  const [applyKey, setApplyKey] = useState("");
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (!existingPlan) return;
    setFrequency(existingPlan.frecuencia);
    setInstallmentCount(existingPlan.numeroCuotas);
    setFirstDate(toDateInput(existingPlan.primeraFechaVencimiento));
    setInstallments(
      existingPlan.cuotas.map((item) => ({
        fechaVencimiento: toDateInput(item.fechaVencimiento),
        montoProgramado: item.montoProgramado,
      })),
    );
  }, [existingPlan]);

  const availablePayments = useMemo(
    () =>
      credit.pagos.filter(
        (payment) =>
          payment.estado === "VERIFICADO" &&
          Number(payment.montoDisponible) > 0,
      ),
    [credit.pagos],
  );

  useEffect(() => {
    if (
      selectedPaymentId == null ||
      !availablePayments.some((payment) => payment.id === selectedPaymentId)
    ) {
      setSelectedPaymentId(availablePayments[0]?.id ?? null);
    }
  }, [availablePayments, selectedPaymentId]);

  const planHasChanges =
    !!existingPlan &&
    (existingPlan.frecuencia !== frequency ||
      existingPlan.cuotas.length !== installments.length ||
      existingPlan.cuotas.some(
        (cuota, index) =>
          toDateInput(cuota.fechaVencimiento) !==
            installments[index]?.fechaVencimiento ||
          moneyToCents(cuota.montoProgramado) !==
            moneyToCents(installments[index]?.montoProgramado ?? ""),
      ));

  const draftTotal = installments.reduce(
    (total, installment) =>
      total + moneyToCents(installment.montoProgramado || "0"),
    0,
  );
  const financedCents = moneyToCents(credit.montos.financiado);
  const totalMatches = draftTotal === financedCents;

  const generate = () => {
    if (!firstDate || installmentCount < 1 || installmentCount > 120) return;
    setInstallments(
      generateInstallments(
        credit.montos.financiado,
        installmentCount,
        firstDate,
        frequency,
      ),
    );
  };

  const requestSave = () => {
    if (
      !editable ||
      !installments.length ||
      !totalMatches ||
      installments.some(
        (item) => !item.fechaVencimiento || Number(item.montoProgramado) <= 0,
      )
    ) {
      return;
    }

    setSaveReview({
      frequency,
      installments,
      total: centsToMoney(draftTotal),
    });
  };

  const confirmSave = async () => {
    if (!saveReview) return;
    const payload = {
      frecuencia: saveReview.frequency,
      cuotas: saveReview.installments.map((item) => ({
        fechaVencimiento: new Date(
          item.fechaVencimiento + "T12:00:00",
        ).toISOString(),
        montoProgramado: Number(item.montoProgramado).toFixed(2),
      })),
      claveIdempotencia: createIdempotencyKey(
        existingPlan ? "credit-plan-update" : "credit-plan-create",
      ),
    };

    if (existingPlan) {
      await updateMutation.mutateAsync({
        id: credit.id,
        payload: {
          ...payload,
          expectedVersion: existingPlan.version,
        },
      });
    } else {
      await createMutation.mutateAsync({
        id: credit.id,
        payload,
      });
    }

    setSaveReview(null);
  };

  const requestActivate = () => {
    if (
      !existingPlan ||
      !credit.acciones.puedeActivarPlan ||
      !advanceReady ||
      planHasChanges
    )
      return;
    setActivateKey(createIdempotencyKey("credit-plan-activate"));
    setActivateOpen(true);
  };

  const confirmActivate = async () => {
    if (!existingPlan) return;
    await activateMutation.mutateAsync({
      id: credit.id,
      payload: {
        expectedVersion: existingPlan.version,
        claveIdempotencia: activateKey,
      },
    });
    setActivateOpen(false);
  };

  const requestApply = (
    installment: NonNullable<
      CreditPortfolioDetail["planPago"]
    >["cuotas"][number],
  ) => {
    const payment = availablePayments.find(
      (item) => item.id === selectedPaymentId,
    );
    if (!payment || !installment.cuentaPorCobrarId) return;

    const amount = Math.min(
      moneyToCents(payment.montoDisponible),
      moneyToCents(installment.saldoPendiente),
    );

    if (amount <= 0) return;

    setApplyKey(createIdempotencyKey("credit-installment-apply"));
    setApplyReview({
      paymentId: payment.id,
      paymentAvailable: payment.montoDisponible,
      installmentId: installment.id,
      accountId: installment.cuentaPorCobrarId,
      installmentNumber: installment.numero,
      installmentBalance: installment.saldoPendiente,
      amount: centsToMoney(amount),
    });
  };

  const goRegisterPayment = (
    installment: NonNullable<
      CreditPortfolioDetail["planPago"]
    >["cuotas"][number],
  ) => {
    const next = new URLSearchParams(location.search);
    next.set("tab", "pagos");
    next.set("monto", Number(installment.saldoPendiente).toFixed(2));
    next.set("cuota", String(installment.numero));
    navigate(
      {
        pathname: location.pathname,
        search: "?" + next.toString(),
      },
      { state: location.state },
    );
  };

  const confirmApply = async () => {
    if (!applyReview) return;

    await applyMutation.mutateAsync({
      id: applyReview.paymentId,
      payload: {
        cuentaPorCobrarId: applyReview.accountId,
        monto: Number(applyReview.amount).toFixed(2),
        claveIdempotencia: applyKey,
      },
    });

    setApplyReview(null);
  };

  if (active && existingPlan) {
    return (
      <div className="space-y-4">
        <AppAlert
          tone={
            existingPlan.cuotas.every(
              (cuota) => Number(cuota.saldoPendiente) === 0,
            )
              ? "success"
              : "info"
          }
          title={
            existingPlan.cuotas.every(
              (cuota) => Number(cuota.saldoPendiente) === 0,
            )
              ? "Plan liquidado"
              : "Plan activo"
          }
          description={
            existingPlan.cuotas.every(
              (cuota) => Number(cuota.saldoPendiente) === 0,
            )
              ? "Todas las cuotas están pagadas y las cuentas por cobrar tienen saldo cero. El despacho y la entrega siguen su proceso por separado."
              : "Cada cuota tiene su Cuenta por Cobrar. Puedes registrar, verificar y aplicar pagos sin esperar la entrega del pedido."
          }
        />

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <AppCard title="Programado" icon={<WalletCards />} size="sm">
            <p className="text-xl font-semibold">
              {formatMoney(existingPlan.montoProgramado)}
            </p>
          </AppCard>
          <AppCard title="Cuotas" icon={<CalendarClock />} size="sm">
            <p className="text-xl font-semibold">{existingPlan.numeroCuotas}</p>
          </AppCard>
          <AppCard title="Frecuencia" size="sm">
            <p className="text-sm font-semibold">
              {CREDIT_PAYMENT_PLAN_FREQUENCY_LABELS[existingPlan.frecuencia]}
            </p>
          </AppCard>
          <AppCard title="Primera cuota" size="sm">
            <p className="text-sm font-semibold">
              {formatDate(existingPlan.primeraFechaVencimiento)}
            </p>
          </AppCard>
        </div>

        {canApply && availablePayments.length > 0 ? (
          <AppCard
            title="Dinero verificado disponible"
            description="Selecciona un pago ya verificado y aplícalo directamente a la cuota correspondiente sin salir del crédito."
            size="sm"
          >
            <div className="max-w-md">
              <AppSingleSelect<number>
                value={selectedPaymentId}
                options={availablePayments.map((payment) => ({
                  value: payment.id,
                  label:
                    "Pago #" +
                    payment.id +
                    " · disponible " +
                    formatMoney(payment.montoDisponible),
                }))}
                onChange={setSelectedPaymentId}
                isClearable={false}
              />
            </div>
          </AppCard>
        ) : canRegister &&
          existingPlan.cuotas.some(
            (installment) => Number(installment.saldoPendiente) > 0,
          ) ? (
          <AppCard
            title="No hay dinero verificado disponible"
            description="Las cuotas siguen abiertas. Registra el siguiente cobro y, cuando esté verificado, podrás aplicarlo a la cuota."
            icon={<Banknote />}
            size="sm"
          >
            <div className="flex justify-end">
              <AppButton
                variant="primary"
                size="sm"
                leftIcon={<Banknote />}
                onClick={() => {
                  const nextInstallment = existingPlan.cuotas.find(
                    (installment) => Number(installment.saldoPendiente) > 0,
                  );
                  if (nextInstallment) goRegisterPayment(nextInstallment);
                }}
              >
                Registrar siguiente pago
              </AppButton>
            </div>
          </AppCard>
        ) : null}

        <div className="space-y-2">
          {existingPlan.cuotas.map((installment) => (
            <AppCard
              key={installment.id}
              title={"Cuota #" + installment.numero}
              description={"Vence " + formatDate(installment.fechaVencimiento)}
              size="sm"
            >
              <div className="grid items-end gap-3 sm:grid-cols-2 xl:grid-cols-6">
                <div>
                  <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                    Programado
                  </p>
                  <p className="mt-1 font-semibold">
                    {formatMoney(installment.montoProgramado)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                    Pagado
                  </p>
                  <p className="mt-1 font-semibold">
                    {formatMoney(installment.montoPagado)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                    Pendiente
                  </p>
                  <p className="mt-1 font-semibold">
                    {formatMoney(installment.saldoPendiente)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                    Estado
                  </p>
                  <div className="mt-1">
                    <AppBadge
                      tone={toneForAccount(installment.estado)}
                      size="xs"
                    >
                      {installment.estado}
                    </AppBadge>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                    CxC
                  </p>
                  <p className="mt-1 font-medium">
                    {installment.cuentaPorCobrarId
                      ? "#" + installment.cuentaPorCobrarId
                      : "—"}
                  </p>
                </div>
                <div className="flex justify-end">
                  {canApply &&
                  selectedPaymentId &&
                  installment.cuentaPorCobrarId &&
                  Number(installment.saldoPendiente) > 0 &&
                  availablePayments.length > 0 ? (
                    <AppButton
                      variant="primary"
                      size="sm"
                      onClick={() => requestApply(installment)}
                    >
                      Aplicar pago
                    </AppButton>
                  ) : canRegister &&
                    Number(installment.saldoPendiente) > 0 &&
                    availablePayments.length === 0 ? (
                    <AppButton
                      variant="secondary"
                      size="sm"
                      leftIcon={<Banknote />}
                      onClick={() => goRegisterPayment(installment)}
                    >
                      Registrar pago
                    </AppButton>
                  ) : null}
                </div>
              </div>
            </AppCard>
          ))}
        </div>

        <AppConfirmDialog
          open={applyReview !== null}
          onOpenChange={(next) => {
            if (!next && !applyMutation.isPending) setApplyReview(null);
          }}
          preset="warning"
          title="Aplicar pago a cuota"
          description="Esta operación disminuirá la Cuenta por Cobrar y recalculará automáticamente el crédito y el estado de pago del pedido."
          confirmText="Aplicar pago"
          loadingText="Aplicando..."
          isLoading={applyMutation.isPending}
          confirmDisabled={
            !applyReview ||
            !Number.isFinite(Number(applyReview.amount)) ||
            Number(applyReview.amount) <= 0 ||
            Number(applyReview.amount) >
              Math.min(
                Number(applyReview.paymentAvailable),
                Number(applyReview.installmentBalance),
              )
          }
          onConfirm={confirmApply}
          contentCard
        >
          {applyReview ? (
            <div className="space-y-3 text-sm">
              <p>
                <strong>Pago:</strong> #{applyReview.paymentId}
              </p>
              <p>
                <strong>Cuota:</strong> #{applyReview.installmentNumber}
              </p>
              <p>
                <strong>Disponible del pago:</strong>{" "}
                {formatMoney(applyReview.paymentAvailable)}
              </p>
              <p>
                <strong>Saldo de la cuota:</strong>{" "}
                {formatMoney(applyReview.installmentBalance)}
              </p>
              <label className="block text-xs font-medium">
                Monto a aplicar
              </label>
              <AppInput
                type="number"
                min={0.01}
                step="0.01"
                max={Math.min(
                  Number(applyReview.paymentAvailable),
                  Number(applyReview.installmentBalance),
                )}
                value={applyReview.amount}
                onChange={(event) =>
                  setApplyReview((current) =>
                    current
                      ? { ...current, amount: event.target.value }
                      : current,
                  )
                }
              />
            </div>
          ) : null}
        </AppConfirmDialog>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AppAlert
        tone={existingPlan ? "info" : "warning"}
        title={existingPlan ? "Plan en borrador" : "Crear plan de pagos"}
        description={
          existingPlan
            ? "Las cuotas ya están programadas. Puedes activarlas ahora sin esperar la entrega; al activarlas se generará una CxC por cuota."
            : "Programa los importes y vencimientos, guarda el borrador y después activa las cuentas por cobrar."
        }
      />

      {advanceRequired ? (
        <AppCard
          title="Anticipo para activar las cuotas"
          icon={<Banknote />}
          size="sm"
        >
          <div className="grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <p className="text-[hsl(var(--app-muted-foreground))]">
                Anticipo autorizado
              </p>
              <p className="mt-1 font-semibold tabular-nums">
                {formatMoney(credit.montos.anticipoRequerido)}
              </p>
            </div>
            <div>
              <p className="text-[hsl(var(--app-muted-foreground))]">
                Anticipo aplicado a CxC
              </p>
              <p className="mt-1 font-semibold tabular-nums">
                {formatMoney(credit.montos.anticipoAplicado)}
              </p>
            </div>
            <div>
              <p className="text-[hsl(var(--app-muted-foreground))]">
                Saldo financiado en cuotas
              </p>
              <p className="mt-1 font-semibold tabular-nums">
                {formatMoney(credit.montos.financiado)}
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm text-[hsl(var(--app-muted-foreground))]">
            {advanceReady
              ? "Anticipo liquidado. El administrador ya puede activar el plan de cuotas."
              : "Registra un único anticipo, verifícalo y aplícalo antes de activar. No es necesario entregar el pedido para comenzar a cobrar cuotas."}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {pendingAdvanceId ? (
              <AppButton asChild variant="primary" size="sm">
                <Link
                  to={"/marcas-gt/pagos/" + pendingAdvanceId}
                  state={{ from: location.pathname + location.search }}
                >
                  Revisar pago pendiente
                </Link>
              </AppButton>
            ) : null}
            {!pendingAdvanceId &&
            !advanceReady &&
            advanceMissing > 0 &&
            canRegister ? (
              <AppButton asChild variant="primary" size="sm">
                <Link
                  to={advancePaymentUrl}
                  state={{ from: location.pathname + location.search }}
                >
                  Registrar anticipo
                </Link>
              </AppButton>
            ) : null}
            <AppButton asChild variant="secondary" size="sm">
              <Link
                to={"/marcas-gt/pedidos/" + credit.pedido.id + "?tab=operacion"}
                state={{ from: location.pathname + location.search }}
              >
                Ver pagos del pedido
              </Link>
            </AppButton>
          </div>
        </AppCard>
      ) : null}

      {existingPlan?.estado === "BORRADOR" &&
      credit.acciones.puedeActivarPlan ? (
        <AppCard
          title="Activar cuotas y cuentas por cobrar"
          icon={<CheckCircle2 />}
          size="sm"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium">
                {advanceReady
                  ? "Plan listo para activar"
                  : "Falta verificar y aplicar el anticipo"}
              </p>
              <p className="mt-1 text-sm text-[hsl(var(--app-muted-foreground))]">
                {planHasChanges
                  ? "Tienes cambios sin guardar. Guarda el borrador antes de activarlo."
                  : "Se crearán " +
                    existingPlan.numeroCuotas +
                    " CxC por " +
                    formatMoney(existingPlan.montoProgramado) +
                    ". El cobro puede iniciar de inmediato y el plan ya no se podrá editar."}
              </p>
            </div>
            <AppButton
              variant="primary"
              size="sm"
              leftIcon={<CheckCircle2 />}
              disabled={
                !advanceReady || planHasChanges || activateMutation.isPending
              }
              onClick={requestActivate}
            >
              Activar cuotas ahora
            </AppButton>
          </div>
        </AppCard>
      ) : null}

      {editable ? (
        <AppCard title="Configuración" size="sm">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-medium">
                Frecuencia
              </label>
              <AppSingleSelect<CreditPaymentPlanFrequency>
                value={frequency}
                options={CREDIT_PAYMENT_PLAN_FREQUENCIES.map((value) => ({
                  value,
                  label: CREDIT_PAYMENT_PLAN_FREQUENCY_LABELS[value],
                }))}
                onChange={(value) => value && setFrequency(value)}
                isClearable={false}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">
                Primera fecha de vencimiento
              </label>
              <AppInput
                type="date"
                value={firstDate}
                onChange={(event) => setFirstDate(event.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">
                Número de cuotas
              </label>
              <AppInput
                type="number"
                min={1}
                max={120}
                value={installmentCount}
                onChange={(event) =>
                  setInstallmentCount(
                    Math.max(1, Math.min(120, Number(event.target.value) || 1)),
                  )
                }
              />
            </div>
            <div className="flex items-end">
              <AppButton
                variant="secondary"
                width="full"
                leftIcon={<Plus />}
                onClick={generate}
                disabled={!firstDate}
              >
                Generar propuesta
              </AppButton>
            </div>
          </div>
        </AppCard>
      ) : null}

      {installments.length > 0 ? (
        <AppCard
          title="Cuotas propuestas"
          description={
            "Financiado " +
            formatMoney(credit.montos.financiado) +
            " · programado " +
            formatMoney(centsToMoney(draftTotal))
          }
          size="sm"
        >
          <div className="space-y-2">
            {installments.map((installment, index) => (
              <div
                key={index}
                className="grid items-center gap-2 rounded-md border border-[hsl(var(--app-border))] p-2 sm:grid-cols-[70px_1fr_1fr]"
              >
                <span className="text-sm font-semibold">#{index + 1}</span>
                <AppInput
                  type="date"
                  value={installment.fechaVencimiento}
                  disabled={!editable}
                  onChange={(event) =>
                    setInstallments((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index
                          ? {
                              ...item,
                              fechaVencimiento: event.target.value,
                            }
                          : item,
                      ),
                    )
                  }
                />
                <AppInput
                  type="number"
                  min={0.01}
                  step="0.01"
                  value={installment.montoProgramado}
                  disabled={!editable}
                  onChange={(event) =>
                    setInstallments((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index
                          ? {
                              ...item,
                              montoProgramado: event.target.value,
                            }
                          : item,
                      ),
                    )
                  }
                />
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <AppBadge tone={totalMatches ? "success" : "danger"} size="sm">
                {totalMatches
                  ? "Total correcto"
                  : "Debe sumar " + formatMoney(credit.montos.financiado)}
              </AppBadge>
            </div>

            <div className="flex flex-wrap gap-2">
              {editable ? (
                <AppButton
                  variant="secondary"
                  size="sm"
                  leftIcon={<Save />}
                  disabled={!totalMatches}
                  onClick={requestSave}
                >
                  Revisar y guardar borrador
                </AppButton>
              ) : null}
            </div>
          </div>
        </AppCard>
      ) : null}

      <AppConfirmDialog
        open={saveReview !== null}
        onOpenChange={(next) => {
          if (!next && !createMutation.isPending && !updateMutation.isPending) {
            setSaveReview(null);
          }
        }}
        preset="send"
        title={
          existingPlan ? "Confirmar cambios del plan" : "Crear plan en borrador"
        }
        description="Revisa el número de cuotas, fechas y monto total. Guardar el borrador todavía no genera deuda ni CxC."
        confirmText={existingPlan ? "Guardar cambios" : "Crear borrador"}
        loadingText="Guardando..."
        isLoading={createMutation.isPending || updateMutation.isPending}
        onConfirm={confirmSave}
        contentCard
      >
        {saveReview ? (
          <div className="space-y-2 text-sm">
            <p>
              <strong>Frecuencia:</strong>{" "}
              {CREDIT_PAYMENT_PLAN_FREQUENCY_LABELS[saveReview.frequency]}
            </p>
            <p>
              <strong>Cuotas:</strong> {saveReview.installments.length}
            </p>
            <p>
              <strong>Total programado:</strong> {formatMoney(saveReview.total)}
            </p>
            <p>
              <strong>Primera cuota:</strong>{" "}
              {formatDate(
                saveReview.installments[0]?.fechaVencimiento + "T12:00:00",
              )}
            </p>
          </div>
        ) : null}
      </AppConfirmDialog>

      <AppConfirmDialog
        open={activateOpen}
        onOpenChange={(next) => {
          if (!activateMutation.isPending) setActivateOpen(next);
        }}
        preset="warning"
        title="Activar plan de pagos"
        description="Se creará inmediatamente una Cuenta por Cobrar por cada cuota, aunque el pedido todavía no esté entregado. Los vencimientos programados comenzarán a contar desde sus fechas; los anteriores a hoy se considerarán vencidos. La operación no se puede deshacer editando el borrador."
        confirmText="Activar y generar CxC"
        loadingText="Activando..."
        isLoading={activateMutation.isPending}
        confirmDisabled={!advanceReady || planHasChanges}
        onConfirm={confirmActivate}
        contentCard
      >
        {existingPlan ? (
          <div className="space-y-2 text-sm">
            <p>
              <strong>Crédito:</strong> {credit.numero}
            </p>
            {/* comiteo */}
            <p>
              <strong>Cuotas:</strong> {existingPlan.numeroCuotas}
            </p>
            <p>
              <strong>Monto:</strong>{" "}
              {formatMoney(existingPlan.montoProgramado)}
            </p>
            <p>
              <strong>Pedido:</strong> {credit.pedido.numero} ·{" "}
              {credit.pedido.estado}
            </p>
          </div>
        ) : null}
      </AppConfirmDialog>
    </div>
  );
}
