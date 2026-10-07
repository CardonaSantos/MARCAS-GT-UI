import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import { ExternalLink, Link2, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { createIdempotencyKey } from "@/features/common/utils/idempotency";
import { formatDateTime } from "@/features/common/formatters/value.formatters";
import {
  AppForm,
  AppFormInput,
  AppFormSubmit,
  AppFormTextarea,
} from "@/ui/components/app/form";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import { createAppRowActionsColumn } from "@/ui/components/app/table/app-table-row-actions";

import { useAddPaymentProof } from "../api/payment.mutations";
import type {
  PaymentDetail,
  PaymentProof,
} from "../api/payment.types";
import { toPaymentProofPayload } from "../common/payment.mappers";
import {
  paymentProofSchema,
  type PaymentProofFormValues,
} from "../schemas/payment.schemas";

export function PaymentProofs({
  payment,
}: {
  payment: PaymentDetail;
}) {
  const mutation = useAddPaymentProof();
  const [pending, setPending] = useState<PaymentProofFormValues | null>(null);
  const [open, setOpen] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState("");

  const form = useForm<PaymentProofFormValues>({
    resolver: zodResolver(paymentProofSchema),
    defaultValues: {
      url: "",
      key: "",
      mimeType: "",
      size: "",
      descripcion: "",
    },
    mode: "onTouched",
  });

  const requestConfirmation = (values: PaymentProofFormValues) => {
    setPending(values);
    setIdempotencyKey(createIdempotencyKey("payment-proof"));
    setOpen(true);
  };

  const confirm = async () => {
    if (!pending) return;
    await mutation.mutateAsync({
      id: payment.id,
      payload: toPaymentProofPayload(pending, idempotencyKey),
    });
    form.reset({
      url: "",
      key: "",
      mimeType: "",
      size: "",
      descripcion: "",
    });
    setPending(null);
  };

  const columns: ColumnDef<PaymentProof, unknown>[] = [
    {
      accessorKey: "descripcion",
      header: "Descripción",
      size: 260,
      meta: { grow: true },
      cell: ({ row }) => row.original.descripcion ?? "Comprobante",
    },
    {
      accessorKey: "mimeType",
      header: "Formato",
      size: 130,
      cell: ({ row }) => row.original.mimeType ?? "—",
    },
    {
      accessorKey: "size",
      header: "Tamaño",
      size: 95,
      meta: { align: "right" },
      cell: ({ row }) =>
        row.original.size == null
          ? "—"
          : Math.max(1, Math.round(row.original.size / 1024)) + " KB",
    },
    {
      id: "subidoPor",
      header: "Registrado por",
      size: 160,
      cell: ({ row }) => row.original.subidoPor?.nombre ?? "—",
    },
    {
      accessorKey: "creadoEn",
      header: "Fecha",
      size: 155,
      cell: ({ row }) => formatDateTime(row.original.creadoEn),
    },
    createAppRowActionsColumn<PaymentProof>({
      actions: (row) => [
        {
          label: "Abrir comprobante",
          icon: <ExternalLink />,
          onClick: () =>
            window.open(row.original.url, "_blank", "noopener,noreferrer"),
        },
      ],
    }),
  ];

  return (
    <div className="space-y-4">
      <AppAlert
        tone="info"
        title="Almacenamiento externo pendiente"
        description="Pagos registra actualmente la URL y metadata del comprobante. La carga de archivos se conectará a DigitalOcean Spaces sin cambiar el dominio de Pagos."
      />

      {payment.acciones.puedeAgregarComprobante ? (
        <AppForm form={form} onSubmit={requestConfirmation}>
          <div className="grid gap-3 md:grid-cols-2">
            <AppFormInput<PaymentProofFormValues>
              name="url"
              label="URL del comprobante"
              placeholder="https://..."
              required
            />
            <AppFormInput<PaymentProofFormValues>
              name="key"
              label="Key de storage"
              maxLength={500}
            />
            <AppFormInput<PaymentProofFormValues>
              name="mimeType"
              label="MIME type"
              placeholder="image/jpeg"
              maxLength={200}
            />
            <AppFormInput<PaymentProofFormValues>
              name="size"
              label="Tamaño en bytes"
              type="number"
              min={0}
            />
            <div className="md:col-span-2">
              <AppFormTextarea<PaymentProofFormValues>
                name="descripcion"
                label="Descripción"
                rows={3}
                maxLength={1000}
              />
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <AppFormSubmit<PaymentProofFormValues>
              leftIcon={<Plus />}
              loadingText="Revisando..."
              disableWhenInvalid
            >
              Agregar comprobante
            </AppFormSubmit>
          </div>
        </AppForm>
      ) : null}

      <AppDataTable
        data={payment.comprobantes}
        columns={columns}
        getRowId={(row) => String(row.id)}
        paginationMode="none"
        density="xs"
        responsiveMode="scroll"
        emptyTitle="Sin comprobantes"
        emptyDescription="Todavía no hay comprobantes asociados a este pago."
        toolbar={
          <span className="inline-flex items-center gap-2 text-xs text-[hsl(var(--app-muted-foreground))]">
            <Link2 className="h-4 w-4" />
            {payment.comprobantes.length} comprobantes
          </span>
        }
      />

      <AppConfirmDialog
        open={open}
        onOpenChange={setOpen}
        preset="send"
        title="Confirmar comprobante"
        description="Revisa la URL y metadata antes de registrar el comprobante. Esta acción genera auditoría."
        confirmText="Registrar comprobante"
        loadingText="Registrando..."
        onConfirm={confirm}
        isLoading={mutation.isPending}
        contentCard
      >
        {pending ? (
          <div className="space-y-2 text-sm">
            <p><strong>URL:</strong> {pending.url}</p>
            <p><strong>Tipo:</strong> {pending.mimeType || "No indicado"}</p>
            <p><strong>Descripción:</strong> {pending.descripcion || "Sin descripción"}</p>
          </div>
        ) : null}
      </AppConfirmDialog>
    </div>
  );
}
