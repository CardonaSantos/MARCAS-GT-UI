import type { ColumnDef } from "@tanstack/react-table";
import { Banknote, CheckCircle2, Eye, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useStore } from "@/Context/ContextSucursal";
import {
  formatDateTime,
  formatMoney,
} from "@/features/common/formatters/value.formatters";
import { createIdempotencyKey } from "@/features/common/utils/idempotency";
import {
  useRegisterPayment,
  useVerifyPayment,
} from "@/features/pagos/api/payment.mutations";
import { usePaymentBanks } from "@/features/pagos/api/payment.queries";
import type { PaymentMethod } from "@/features/pagos/api/payment.types";
import {
  BANK_REQUIRED_METHODS,
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
} from "@/features/pagos/common/payment.constants";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";
import { AppInput } from "@/ui/components/app/primitives/app-input";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";
import { AppTextarea } from "@/ui/components/app/primitives/app-textarea";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import { createAppRowActionsColumn } from "@/ui/components/app/table/app-table-row-actions";

import type { CreditPortfolioDetail } from "../api/credit.types";

type CreditPaymentRow = CreditPortfolioDetail["pagos"][number];

type PaymentDraft = {
  metodo: PaymentMethod;
  monto: string;
  bancoId: number | null;
  referencia: string;
  observaciones: string;
};

function paymentTone(state: string) {
  if (state === "VERIFICADO") return "success" as const;
  if (state === "PENDIENTE") return "warning" as const;
  if (state === "RECHAZADO") return "danger" as const;
  return "neutral" as const;
}

export function CreditPortfolioPayments({
  credit,
  currentUrl,
}: {
  credit: CreditPortfolioDetail;
  currentUrl: string;
}) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const role = useStore((state) => state.userRol);
  const canVerify = role === "ADMIN" || role === "CONTABILIDAD";
  const draftMixed = credit.pedido.condicionPago === "MIXTO" &&
    credit.planPago?.estado !== "ACTIVO";
  const advanceAlreadyLinked = draftMixed &&
    (!!credit.anticipo?.pagoPendienteId ||
      credit.anticipo?.estado === "PAGADA" ||
      Number(credit.montos.anticipoAplicado) > 0);
  const isSettled = credit.estado === "CERRADO";
  const canRegisterNewPayment = !isSettled && !advanceAlreadyLinked;
  const banks = usePaymentBanks();
  const registerMutation = useRegisterPayment();
  const verifyMutation = useVerifyPayment();

  const [showRegister, setShowRegister] = useState(false);
  const [draft, setDraft] = useState<PaymentDraft>({
    metodo: "EFECTIVO",
    monto: "",
    bancoId: null,
    referencia: "",
    observaciones: "",
  });
  const [registerReview, setRegisterReview] = useState<PaymentDraft | null>(
    null,
  );
  const [registerKey, setRegisterKey] = useState("");
  const [verifyPayment, setVerifyPayment] = useState<CreditPaymentRow | null>(
    null,
  );
  const [verifyKey, setVerifyKey] = useState("");

  const requestedAmount = searchParams.get("monto");
  const requestedInstallment = searchParams.get("cuota");

  useEffect(() => {
    if (!requestedAmount || Number(requestedAmount) <= 0 || !canRegisterNewPayment) return;

    setShowRegister(true);
    setDraft((current) => ({
      ...current,
      monto: requestedAmount,
      observaciones:
        current.observaciones ||
        (requestedInstallment
          ? "Cobro para cuota #" +
            requestedInstallment +
            " de " +
            credit.numero
          : "Cobro relacionado con " + credit.numero),
    }));
  }, [credit.numero, requestedAmount, requestedInstallment, canRegisterNewPayment]);

  const bankRequired = BANK_REQUIRED_METHODS.includes(draft.metodo);
  const selectedBank = (banks.data ?? []).find(
    (bank) => bank.id === draft.bancoId,
  );

  const canReviewRegistration =
    Number(draft.monto) > 0 &&
    canRegisterNewPayment &&
    (!draftMixed || Number(draft.monto) === Number(credit.anticipo?.montoOriginal)) &&
    (!bankRequired ||
      (draft.bancoId != null && draft.referencia.trim().length > 0));

  const verifiedAvailable = useMemo(
    () =>
      credit.pagos.reduce(
        (total, payment) =>
          total +
          (payment.estado === "VERIFICADO"
            ? Number(payment.montoDisponible)
            : 0),
        0,
      ),
    [credit.pagos],
  );

  const requestRegister = () => {
    if (!canReviewRegistration) return;
    setRegisterKey(createIdempotencyKey("credit-payment-register"));
    setRegisterReview({ ...draft });
  };

  const confirmRegister = async () => {
    if (!registerReview) return;

    await registerMutation.mutateAsync({
      clienteId: credit.cliente.id,
      pedidoId: credit.pedido.id,
      metodo: registerReview.metodo,
      moneda: credit.pedido.moneda,
      monto: Number(registerReview.monto).toFixed(2),
      concepto: draftMixed ? "ANTICIPO" : "CUOTA",
      ...(registerReview.bancoId
        ? { bancoId: registerReview.bancoId }
        : {}),
      ...(registerReview.referencia.trim()
        ? { referencia: registerReview.referencia.trim() }
        : {}),
      ...(registerReview.observaciones.trim()
        ? { observaciones: registerReview.observaciones.trim() }
        : {}),
      claveIdempotencia: registerKey,
    });

    setRegisterReview(null);
    setDraft({
      metodo: "EFECTIVO",
      monto: "",
      bancoId: null,
      referencia: "",
      observaciones: "",
    });
    setShowRegister(false);

    const next = new URLSearchParams(searchParams);
    next.delete("monto");
    next.delete("cuota");
    setSearchParams(next, { replace: true });
  };

  const requestVerify = (payment: CreditPaymentRow) => {
    setVerifyKey(createIdempotencyKey("credit-payment-verify"));
    setVerifyPayment(payment);
  };

  const confirmVerify = async () => {
    if (!verifyPayment) return;
    await verifyMutation.mutateAsync({
      id: verifyPayment.id,
      payload: { claveIdempotencia: verifyKey },
    });
    setVerifyPayment(null);
  };

  const columns: ColumnDef<CreditPaymentRow, unknown>[] = [
    {
      accessorKey: "id",
      header: "Pago",
      size: 85,
      cell: ({ row }) => "#" + row.original.id,
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 115,
      cell: ({ row }) => (
        <AppBadge tone={paymentTone(row.original.estado)} size="xs">
          {row.original.estado}
        </AppBadge>
      ),
    },
    {
      accessorKey: "metodo",
      header: "Método",
      size: 150,
      cell: ({ row }) =>
        PAYMENT_METHOD_LABELS[
          row.original.metodo as keyof typeof PAYMENT_METHOD_LABELS
        ] ?? row.original.metodo,
    },
    {
      accessorKey: "monto",
      header: "Monto",
      size: 110,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.monto),
    },
    {
      accessorKey: "montoAplicado",
      header: "Aplicado",
      size: 110,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.montoAplicado),
    },
    {
      accessorKey: "montoDisponible",
      header: "Disponible",
      size: 110,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.montoDisponible),
    },
    {
      accessorKey: "referencia",
      header: "Referencia",
      size: 160,
      cell: ({ row }) => row.original.referencia ?? "—",
    },
    {
      accessorKey: "fechaPago",
      header: "Fecha",
      size: 155,
      cell: ({ row }) => formatDateTime(row.original.fechaPago),
    },
    createAppRowActionsColumn<CreditPaymentRow>({
      actions: (row) => [
        {
          label: "Ver pago",
          icon: <Eye />,
          onClick: () =>
            navigate("/marcas-gt/pagos/" + row.original.id, {
              state: { from: currentUrl },
            }),
        },
        {
          label: "Verificar",
          icon: <CheckCircle2 />,
          hidden: !canVerify || row.original.estado !== "PENDIENTE",
          onClick: () => requestVerify(row.original),
        },
      ],
    }),
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <AppCard title="Pagos relacionados" icon={<Banknote />} size="sm">
          <p className="text-2xl font-semibold">{credit.pagos.length}</p>
        </AppCard>
        <AppCard title="Total recibido y verificado" size="sm">
          <p className="text-2xl font-semibold">
            {formatMoney(credit.montos.pagadoVerificado)}
          </p>
        </AppCard>
        <AppCard title="Disponible sin aplicar" size="sm">
          <p className="text-2xl font-semibold">
            {formatMoney(verifiedAvailable)}
          </p>
        </AppCard>
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        {isSettled ? (
          <AppAlert tone="success" title="Crédito liquidado"
            description="Todas las cuotas del crédito están pagadas. Se conservan los pagos para consulta; no se requieren nuevos cobros." />
        ) : advanceAlreadyLinked ? (
          <AppAlert tone="info" title="Anticipo ya vinculado"
            description="No se puede registrar otro anticipo. Verifica el pago pendiente o activa el plan para cobrar cuotas." />
        ) : (
          <AppButton variant="primary" size="sm" leftIcon={<Plus />}
            onClick={() => {
              if (!showRegister && draftMixed) {
                setDraft((current) => ({
                  ...current, monto: credit.anticipo?.montoOriginal ?? credit.montos.anticipoRequerido,
                }));
              }
              setShowRegister((current) => !current);
            }}>
            {showRegister ? "Ocultar registro" : draftMixed ? "Registrar anticipo" : "Registrar pago"}
          </AppButton>
        )}
      </div>

      {showRegister && canRegisterNewPayment ? (
        <AppCard
          title={
            requestedInstallment
              ? "Registrar pago para cuota #" + requestedInstallment
              : "Registrar pago en este crédito"
          }
          description="Cliente y pedido ya están fijados por el crédito. Revisa únicamente el dinero recibido."
          size="sm"
        >
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-medium">Método</label>
              <AppSingleSelect<PaymentMethod>
                value={draft.metodo}
                options={PAYMENT_METHODS.map((value) => ({
                  value,
                  label: PAYMENT_METHOD_LABELS[value],
                }))}
                onChange={(value) =>
                  value &&
                  setDraft((current) => ({
                    ...current,
                    metodo: value,
                    bancoId: BANK_REQUIRED_METHODS.includes(value)
                      ? current.bancoId
                      : null,
                  }))
                }
                isClearable={false}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium">{draftMixed ? "Anticipo autorizado" : "Monto"}</label>
              <AppInput
                type="number"
                min={0.01}
                step="0.01"
                readOnly={draftMixed}
                value={draft.monto}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    monto: event.target.value,
                  }))
                }
                placeholder="0.00"
              />
            </div>

            {bankRequired ? (
              <div>
                <label className="mb-1 block text-xs font-medium">Banco</label>
                <AppSingleSelect<number>
                  value={draft.bancoId}
                  options={(banks.data ?? []).map((bank) => ({
                    value: bank.id,
                    label: bank.codigo
                      ? bank.nombre + " · " + bank.codigo
                      : bank.nombre,
                  }))}
                  onChange={(value) =>
                    setDraft((current) => ({
                      ...current,
                      bancoId: value,
                    }))
                  }
                  isLoading={banks.isLoading}
                />
              </div>
            ) : null}

            <div>
              <label className="mb-1 block text-xs font-medium">
                Referencia {bankRequired ? "*" : ""}
              </label>
              <AppInput
                value={draft.referencia}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    referencia: event.target.value,
                  }))
                }
                maxLength={200}
              />
            </div>

            <div className="md:col-span-2 xl:col-span-4">
              <label className="mb-1 block text-xs font-medium">
                Observaciones
              </label>
              <AppTextarea
                rows={3}
                maxLength={1000}
                value={draft.observaciones}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    observaciones: event.target.value,
                  }))
                }
                placeholder={"Cobro relacionado con " + credit.numero}
              />
            </div>
          </div>

          {bankRequired &&
          !banks.isLoading &&
          (banks.data ?? []).length === 0 ? (
            <div className="mt-3 space-y-2">
              <AppAlert
                tone="warning"
                title="No hay bancos activos"
                description="Para registrar una transferencia, depósito o cheque primero debe existir al menos un banco activo."
              />
              {canVerify ? (
                <div className="flex justify-end">
                  <AppButton
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      navigate("/marcas-gt/pagos/bancos", {
                        state: { from: currentUrl },
                      })
                    }
                  >
                    Administrar bancos
                  </AppButton>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="mt-3 flex justify-end">
            <AppButton
              variant="primary"
              size="sm"
              disabled={!canReviewRegistration}
              onClick={requestRegister}
            >
              Revisar pago
            </AppButton>
          </div>
        </AppCard>
      ) : null}

      {!isSettled ? (
        <AppAlert
          tone={verifiedAvailable > 0 ? "warning" : "info"}
          title={verifiedAvailable > 0 ? "Dinero disponible para aplicar" : "Verificar no equivale a aplicar"}
          description={verifiedAvailable > 0
            ? "Tienes " + formatMoney(verifiedAvailable) +
              " verificados y pendientes de aplicar. Abre Plan de pagos para abonarlos a las cuotas."
            : "Cuando verifiques un cobro destinado a cuotas, debes aplicarlo desde Plan de pagos para reducir el saldo."}
        />
      ) : null}

      {verifiedAvailable > 0 ? (
        <div className="flex justify-end">
          <AppButton
            variant="primary"
            size="sm"
            onClick={() => {
              const next = new URLSearchParams(searchParams);
              next.set("tab", "plan");
              next.delete("monto");
              next.delete("cuota");
              setSearchParams(next, { replace: true });
            }}
          >
            Ir a Plan de pagos
          </AppButton>
        </div>
      ) : null}

      <AppDataTable
        data={credit.pagos}
        columns={columns}
        getRowId={(row) => String(row.id)}
        paginationMode="none"
        density="xs"
        responsiveMode="scroll"
        emptyTitle="Sin pagos"
        emptyDescription="Todavía no existen pagos relacionados con este crédito."
      />

      <AppConfirmDialog
        open={registerReview !== null}
        onOpenChange={(next) => {
          if (!next && !registerMutation.isPending) setRegisterReview(null);
        }}
        preset="send"
        title="Confirmar registro del pago"
        description={draftMixed
          ? "Se registrará un único anticipo PENDIENTE. Al verificarlo se aplicará automáticamente a la CxC del anticipo."
          : "El pago quedará PENDIENTE. ADMIN o CONTABILIDAD deberá verificarlo y después aplicarlo a una cuota."}
        confirmText="Registrar pago"
        loadingText="Registrando..."
        isLoading={registerMutation.isPending}
        onConfirm={confirmRegister}
        contentCard
      >
        {registerReview ? (
          <div className="space-y-2 text-sm">
            <p>
              <strong>Crédito:</strong> {credit.numero}
            </p>
            <p>
              <strong>Pedido:</strong> {credit.pedido.numero}
            </p>
            <p>
              <strong>Método:</strong>{" "}
              {PAYMENT_METHOD_LABELS[registerReview.metodo]}
            </p>
            <p>
              <strong>Monto:</strong> {formatMoney(registerReview.monto)}
            </p>
            <p>
              <strong>Banco:</strong> {selectedBank?.nombre ?? "No aplica"}
            </p>
            <p>
              <strong>Referencia:</strong>{" "}
              {registerReview.referencia || "—"}
            </p>
          </div>
        ) : null}
      </AppConfirmDialog>

      <AppConfirmDialog
        open={verifyPayment !== null}
        onOpenChange={(next) => {
          if (!next && !verifyMutation.isPending) setVerifyPayment(null);
        }}
        preset="success"
        title="Verificar pago"
        description={credit.anticipo?.pagoPendienteId === verifyPayment?.id
          ? "Confirma que recibiste el anticipo. Al verificarlo quedará aplicado automáticamente a su cuenta."
          : "Confirma que recibiste el dinero. Después podrás aplicar el pago a una cuota del plan."}
        confirmText="Verificar pago"
        loadingText="Verificando..."
        isLoading={verifyMutation.isPending}
        onConfirm={confirmVerify}
        contentCard
      >
        {verifyPayment ? (
          <div className="space-y-2 text-sm">
            <p>
              <strong>Pago:</strong> #{verifyPayment.id}
            </p>
            <p>
              <strong>Monto:</strong> {formatMoney(verifyPayment.monto)}
            </p>
            <p>
              <strong>Referencia:</strong>{" "}
              {verifyPayment.referencia ?? "—"}
            </p>
          </div>
        ) : null}
      </AppConfirmDialog>
    </div>
  );
}
