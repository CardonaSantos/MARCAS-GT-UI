import type { ColumnDef } from "@tanstack/react-table";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

import { useStore } from "@/Context/ContextSucursal";
import { formatDateTime, formatMoney } from "@/features/common/formatters/value.formatters";
import { createIdempotencyKey } from "@/features/common/utils/idempotency";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";
import { AppTextarea } from "@/ui/components/app/primitives/app-textarea";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import { createAppRowActionsColumn } from "@/ui/components/app/table/app-table-row-actions";

import { useReversePaymentApplication } from "../api/payment.mutations";
import { usePaymentApplications } from "../api/payment.queries";
import type { PaymentApplication } from "../api/payment.types";
import {
  PAYMENT_APPLICATION_STATE_LABELS,
  PAYMENT_APPLICATION_STATE_TONES,
} from "../common/payment.constants";
import { AppBadge } from "@/ui/components/app/primitives/app-badge";

export function PaymentApplications({
  paymentId,
}: {
  paymentId: number;
}) {
  const role = useStore((state) => state.userRol);
  const canOperate = role === "ADMIN" || role === "CONTABILIDAD";
  const query = usePaymentApplications(paymentId);
  const mutation = useReversePaymentApplication();
  const [selected, setSelected] = useState<PaymentApplication | null>(null);
  const [reason, setReason] = useState("");
  const [key, setKey] = useState("");

  const openReverse = (application: PaymentApplication) => {
    setSelected(application);
    setReason("");
    setKey(createIdempotencyKey("payment-application-reverse"));
  };

  const close = () => {
    if (mutation.isPending) return;
    setSelected(null);
    setReason("");
  };

  const confirm = async () => {
    if (!selected || reason.trim().length < 3) return;
    await mutation.mutateAsync({
      paymentId,
      applicationId: selected.id,
      payload: {
        motivo: reason.trim(),
        claveIdempotencia: key,
      },
    });
    setSelected(null);
    setReason("");
  };

  const columns: ColumnDef<PaymentApplication, unknown>[] = [
    {
      accessorKey: "id",
      header: "Aplicación",
      size: 95,
      cell: ({ row }) => "#" + row.original.id,
    },
    {
      accessorKey: "estado",
      header: "Estado",
      size: 110,
      cell: ({ row }) => (
        <AppBadge
          tone={PAYMENT_APPLICATION_STATE_TONES[row.original.estado]}
          size="xs"
        >
          {PAYMENT_APPLICATION_STATE_LABELS[row.original.estado]}
        </AppBadge>
      ),
    },
    {
      id: "cuenta",
      header: "Cuenta por cobrar",
      size: 150,
      cell: ({ row }) =>
        row.original.cuentaPorCobrar.numeroDocumento ??
        "#" + row.original.cuentaPorCobrar.id,
    },
    {
      id: "factura",
      header: "Factura",
      size: 120,
      cell: ({ row }) =>
        row.original.cuentaPorCobrar.factura
          ? "#" + row.original.cuentaPorCobrar.factura.id
          : "—",
    },
    {
      id: "credito",
      header: "Crédito",
      size: 135,
      cell: ({ row }) =>
        row.original.cuentaPorCobrar.credito?.numero ?? "—",
    },
    {
      accessorKey: "monto",
      header: "Monto aplicado",
      size: 120,
      meta: { align: "right" },
      cell: ({ row }) => formatMoney(row.original.monto),
    },
    {
      id: "saldo",
      header: "Saldo CxC",
      size: 115,
      meta: { align: "right" },
      cell: ({ row }) =>
        formatMoney(row.original.cuentaPorCobrar.saldoPendiente),
    },
    {
      accessorKey: "creadoEn",
      header: "Fecha",
      size: 155,
      cell: ({ row }) => formatDateTime(row.original.creadoEn),
    },
    createAppRowActionsColumn<PaymentApplication>({
      actions: (row) => [
        {
          label: "Revertir aplicación",
          icon: <RotateCcw />,
          hidden: !canOperate || row.original.estado !== "ACTIVA",
          onClick: () => openReverse(row.original),
        },
      ],
    }),
  ];

  return (
    <div className="space-y-4">
      <AppAlert
        tone="info"
        title="Relación con crédito"
        description="Las aplicaciones disminuyen la Cuenta por Cobrar. El servidor recalcula automáticamente el estado del pedido y, cuando la CxC tiene crédito asociado, ACTIVO/CERRADO del crédito."
      />

      <AppDataTable
        data={query.data?.data ?? []}
        columns={columns}
        getRowId={(row) => String(row.id)}
        isLoading={query.isLoading}
        isFetching={query.isFetching}
        error={query.error}
        onRetry={() => void query.refetch()}
        paginationMode="none"
        density="xs"
        responsiveMode="scroll"
        emptyTitle="Sin aplicaciones"
        emptyDescription="Este pago todavía no se ha aplicado a cuentas por cobrar."
      />

      <AppConfirmDialog
        open={selected !== null}
        onOpenChange={(next) => {
          if (!next) close();
        }}
        preset="warning"
        title="Revertir aplicación"
        description="La reversión devolverá saldo a la Cuenta por Cobrar y puede reabrir el crédito o cambiar el estado de pago del pedido."
        confirmText="Revertir aplicación"
        loadingText="Revirtiendo..."
        onConfirm={confirm}
        isLoading={mutation.isPending}
        confirmDisabled={reason.trim().length < 3}
        contentCard
      >
        {selected ? (
          <div className="space-y-3 text-sm">
            <p>
              <strong>Monto:</strong> {formatMoney(selected.monto)}
            </p>
            <p>
              <strong>CxC:</strong>{" "}
              {selected.cuentaPorCobrar.numeroDocumento ??
                "#" + selected.cuentaPorCobrar.id}
            </p>
            <div>
              <label className="mb-1 block text-xs font-medium">
                Motivo de reversión *
              </label>
              <AppTextarea
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                rows={3}
                maxLength={1000}
                placeholder="Describe por qué debe revertirse..."
              />
            </div>
          </div>
        ) : null}
      </AppConfirmDialog>
    </div>
  );
}
