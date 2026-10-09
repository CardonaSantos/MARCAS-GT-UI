import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import { ExternalLink, Paperclip, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createIdempotencyKey } from "@/features/common/utils/idempotency";
import { marcasApi } from "@/API/api";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatDateTime } from "@/features/common/formatters/value.formatters";
import {
  AppForm,
  AppFormSingleSelect,
  AppFormSubmit,
  AppFormTextarea,
} from "@/ui/components/app/form";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import { createAppRowActionsColumn } from "@/ui/components/app/table/app-table-row-actions";

import {
  useUploadDeliveryEvidence,
  useRemoveDeliveryEvidence,
} from "../api/delivery.mutations";
import { useDeliveryEvidence } from "../api/delivery.queries";
import type { DeliveryEvidence } from "../api/delivery.types";
import {
  DELIVERY_EVIDENCE_TYPES,
  DELIVERY_EVIDENCE_TYPE_LABELS,
} from "../common/delivery.constants";
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
  const addMutation = useUploadDeliveryEvidence();
  const removeMutation = useRemoveDeliveryEvidence();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [confirmUpload, setConfirmUpload] = useState(false);
  const [uploadKey, setUploadKey] = useState("");
  const [pendingDelete, setPendingDelete] = useState<DeliveryEvidence | null>(null);

  const form = useForm<DeliveryEvidenceFormValues>({
    resolver: zodResolver(deliveryEvidenceSchema),
    defaultValues: { tipo: "FOTO", descripcion: "" },
    mode: "onTouched",
  });

  const onFileChange = (next: File | null) => {
    if (!next) { setFile(null); return; }
    if (next.size === 0 || next.size > 10 * 1024 * 1024 ||
        !["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(next.type)) {
      toast.error("Selecciona una imagen JPG, PNG, WebP o PDF de hasta 10 MB.");
      if (fileRef.current) fileRef.current.value = "";
      setFile(null);
      return;
    }
    setFile(next);
  };

  const onSubmit = (_values: DeliveryEvidenceFormValues) => {
    if (!file) {
      toast.error("Selecciona un archivo para adjuntar.");
      return;
    }
    setUploadKey(createIdempotencyKey("delivery-evidence"));
    setConfirmUpload(true);
  };

  const confirmEvidence = async () => {
    if (!file) return;
    const values = form.getValues();
    await addMutation.mutateAsync({
      id: deliveryId,
      file,
      tipo: values.tipo,
      descripcion: values.descripcion?.trim(),
      claveIdempotencia: uploadKey,
    });
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
    form.reset({ tipo: "FOTO", descripcion: "" });
  };

  const openEvidence = (evidence: DeliveryEvidence) => {
    const popup = window.open("about:blank", "_blank");
    if (popup) popup.opener = null;
    void marcasApi.get<{ url: string; mimeType: string | null }>(
      marcasEndpoints.entregas.evidenceFile(deliveryId, evidence.id),
    ).then(({ url }) => {
      if (!/^https:\/\//i.test(url)) throw new Error("Enlace de evidencia no seguro.");
      if (popup && !popup.closed) popup.location.replace(url);
      else window.open(url, "_blank", "noopener,noreferrer");
    }).catch((error: unknown) => {
      popup?.close();
      toast.error(getApiErrorMessage(error));
    });
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await removeMutation.mutateAsync({
      id: deliveryId,
      evidenceId: pendingDelete.id,
    });
    setPendingDelete(null);
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
          onClick: () => openEvidence(row.original),
        },
        {
          label: "Eliminar",
          icon: <Trash2 />,
          hidden: !canRemove,
          onClick: () => setPendingDelete(row.original),
        },
      ],
    }),
  ];

  return (
    <div className="space-y-4">
      {canAdd ? (
        <AppCard
          title="Agregar evidencia"
          description="Firma, fotografía o documento privado en DigitalOcean Spaces. JPG, PNG, WebP o PDF (máximo 10 MB)."
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
                  ref={fileRef}
                  accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
                  type="file"
                  className="block w-full rounded-md border border-[hsl(var(--app-border))] bg-transparent px-3 py-2 text-sm"
                  onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
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

      <AppConfirmDialog
        open={confirmUpload}
        onOpenChange={setConfirmUpload}
        preset="send"
        title="Adjuntar evidencia de entrega"
        description="El archivo se guardará en privado y se relacionará con esta entrega."
        confirmText="Subir evidencia"
        loadingText="Subiendo..."
        onConfirm={confirmEvidence}
        isLoading={addMutation.isPending}
        contentCard
      >
        {file ? (
          <p className="text-sm">{file.name} · {Math.max(1, Math.round(file.size / 1024))} KB</p>
        ) : null}
      </AppConfirmDialog>
      <AppConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => { if (!open && !removeMutation.isPending) setPendingDelete(null); }}
        preset="delete"
        title="Eliminar evidencia"
        description="Se eliminará la evidencia del registro y se registrará la operación."
        confirmText="Eliminar evidencia"
        onConfirm={confirmDelete}
        isLoading={removeMutation.isPending}
        contentCard
      >
        {pendingDelete ? <p className="text-sm">{pendingDelete.descripcion || "Evidencia #" + pendingDelete.id}</p> : null}
      </AppConfirmDialog>

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
