import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import { ExternalLink, Paperclip, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createIdempotencyKey } from "@/features/common/utils/idempotency";
import { formatDateTime } from "@/features/common/formatters/value.formatters";
import {
  AppForm,
  AppFormSingleSelect,
  AppFormSubmit,
  AppFormTextarea,
} from "@/ui/components/app/form";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import { createAppRowActionsColumn } from "@/ui/components/app/table/app-table-row-actions";

import {
  useAddDeliveryEvidence,
  useRemoveDeliveryEvidence,
} from "../api/delivery.mutations";
import { useDeliveryEvidence } from "../api/delivery.queries";
import type { DeliveryEvidence } from "../api/delivery.types";
import {
  DELIVERY_EVIDENCE_TYPES,
  DELIVERY_EVIDENCE_TYPE_LABELS,
} from "../common/delivery.constants";
import { fileToDataUrl } from "../common/delivery-geolocation";
import {
  deliveryEvidenceSchema,
  type DeliveryEvidenceFormValues,
} from "../schemas/delivery.schemas";

export function DeliveryEvidencePanel({
  deliveryId,
  canAdd,
  canRemove,
}: {
  deliveryId: number;
  canAdd: boolean;
  canRemove: boolean;
}) {
  const query = useDeliveryEvidence(deliveryId);
  const addMutation = useAddDeliveryEvidence();
  const removeMutation = useRemoveDeliveryEvidence();
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<DeliveryEvidenceFormValues>({
    resolver: zodResolver(deliveryEvidenceSchema),
    defaultValues: { tipo: "FOTO", descripcion: "" },
    mode: "onTouched",
  });

  const onSubmit = async (values: DeliveryEvidenceFormValues) => {
    if (!file) {
      toast.error("Selecciona un archivo para adjuntar.");
      return;
    }

    const contenido = await fileToDataUrl(file);
    await addMutation.mutateAsync({
      id: deliveryId,
      payload: {
        tipo: values.tipo,
        contenido,
        mimeType: file.type || undefined,
        size: file.size,
        descripcion: values.descripcion?.trim() || undefined,
        claveIdempotencia: createIdempotencyKey("delivery-evidence"),
      },
    });

    setFile(null);
    form.reset({ tipo: "FOTO", descripcion: "" });
  };

  const columns: ColumnDef<DeliveryEvidence, unknown>[] = [
    {
      accessorKey: "tipo",
      header: "Tipo",
      size: 120,
      cell: ({ row }) => DELIVERY_EVIDENCE_TYPE_LABELS[row.original.tipo],
    },
    {
      accessorKey: "descripcion",
      header: "Descripción",
      size: 280,
      meta: { grow: true },
      cell: ({ row }) => row.original.descripcion ?? "—",
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
      size: 100,
      meta: { align: "right" },
      cell: ({ row }) =>
        row.original.size == null
          ? "—"
          : Math.max(1, Math.round(row.original.size / 1024)) + " KB",
    },
    {
      accessorKey: "creadoEn",
      header: "Fecha",
      size: 155,
      cell: ({ row }) => formatDateTime(row.original.creadoEn),
    },
    createAppRowActionsColumn<DeliveryEvidence>({
      actions: (row) => [
        {
          label: "Abrir evidencia",
          icon: <ExternalLink />,
          onClick: () => window.open(row.original.url, "_blank", "noopener,noreferrer"),
        },
        {
          label: "Eliminar",
          icon: <Trash2 />,
          hidden: !canRemove,
          onClick: () =>
            void removeMutation.mutateAsync({
              id: deliveryId,
              evidenceId: row.original.id,
            }),
        },
      ],
    }),
  ];

  return (
    <div className="space-y-4">
      {canAdd ? (
        <AppCard
          title="Agregar evidencia"
          description="Fotografía, firma, documento u otra evidencia. El archivo se almacena mediante el backend."
          size="sm"
        >
          <AppForm form={form} onSubmit={onSubmit}>
            <div className="grid gap-3 md:grid-cols-2">
              <AppFormSingleSelect<DeliveryEvidenceFormValues, string>
                name="tipo"
                label="Tipo"
                options={DELIVERY_EVIDENCE_TYPES.map((value) => ({
                  value,
                  label: DELIVERY_EVIDENCE_TYPE_LABELS[value],
                }))}
                required
              />
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Archivo *</label>
                <input
                  type="file"
                  className="block w-full rounded-md border border-[hsl(var(--app-border))] bg-transparent px-3 py-2 text-sm"
                  onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                />
              </div>
              <div className="md:col-span-2">
                <AppFormTextarea<DeliveryEvidenceFormValues>
                  name="descripcion"
                  label="Descripción"
                  rows={2}
                  maxLength={1000}
                />
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <AppFormSubmit<DeliveryEvidenceFormValues>
                leftIcon={<Upload />}
                loadingText="Subiendo..."
                disableWhenInvalid
              >
                Adjuntar evidencia
              </AppFormSubmit>
            </div>
          </AppForm>
        </AppCard>
      ) : (
        <AppAlert
          tone="info"
          title="Evidencias bloqueadas"
          description="La entrega ya no admite cambios de evidencia o tu rol es de sólo lectura."
        />
      )}

      <AppDataTable
        data={query.data ?? []}
        columns={columns}
        getRowId={(row) => String(row.id)}
        isLoading={query.isLoading}
        isFetching={query.isFetching}
        error={query.error}
        onRetry={() => void query.refetch()}
        paginationMode="none"
        density="xs"
        responsiveMode="scroll"
        emptyTitle="Sin evidencias"
        emptyDescription="Todavía no se han adjuntado evidencias a esta entrega."
        toolbar={
          <span className="inline-flex items-center gap-2 text-xs text-[hsl(var(--app-muted-foreground))]">
            <Paperclip className="h-4 w-4" />
            {query.data?.length ?? 0} evidencias
          </span>
        }
      />
    </div>
  );
}
