import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import { Camera, ExternalLink, FileImage, FileText, Paperclip, Trash2, Upload, UploadCloud, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
import { AppButton } from "@/ui/components/app/primitives/app-button";
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
  const cameraRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [confirmUpload, setConfirmUpload] = useState(false);
  const [uploadKey, setUploadKey] = useState("");
  const [pendingDelete, setPendingDelete] = useState<DeliveryEvidence | null>(null);

  const form = useForm<DeliveryEvidenceFormValues>({
    resolver: zodResolver(deliveryEvidenceSchema),
    defaultValues: { tipo: "FOTO", descripcion: "" },
    mode: "onTouched",
  });

  useEffect(() => {
    if (!file || !file.type.startsWith("image/")) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const clearFile = () => {
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
    if (cameraRef.current) cameraRef.current.value = "";
  };

  const onFileChange = (next: File | null) => {
    if (!next) return;
    if (next.size === 0 || next.size > 10 * 1024 * 1024 ||
        !["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(next.type)) {
      toast.error("Selecciona JPG, PNG, WebP o PDF de hasta 10 MB. Las fotos HEIC no son compatibles.");
      clearFile();
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
    clearFile();
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
          description="Adjunta una fotografía, firma o documento desde tu teléfono o computadora."
          size="sm"
        >
          <AppForm form={form} onSubmit={onSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <AppFormSingleSelect<DeliveryEvidenceFormValues, string>
                name="tipo"
                label="Tipo"
                options={DELIVERY_EVIDENCE_TYPES.map((value) => ({
                  value,
                  label: DELIVERY_EVIDENCE_TYPE_LABELS[value],
                }))}
                required
              />

              <div className="min-w-0 space-y-2">
                <span className="block text-xs font-medium">Archivo *</span>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
                  className="sr-only"
                  aria-label="Seleccionar archivo de evidencia"
                  onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
                />
                <input
                  ref={cameraRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="sr-only"
                  aria-label="Tomar fotografía de evidencia con la cámara"
                  onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
                />

                <div className="rounded-md border border-dashed border-[hsl(var(--app-border))] p-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    <AppButton
                      type="button"
                      variant="secondary"
                      size="sm"
                      leftIcon={<UploadCloud />}
                      onClick={() => fileRef.current?.click()}
                      disabled={addMutation.isPending}
                      className="w-full sm:w-auto"
                    >
                      Seleccionar archivo
                    </AppButton>
                    <AppButton
                      type="button"
                      variant="secondary"
                      size="sm"
                      leftIcon={<Camera />}
                      onClick={() => cameraRef.current?.click()}
                      disabled={addMutation.isPending}
                      className="w-full sm:w-auto"
                    >
                      Tomar foto
                    </AppButton>
                  </div>
                  <p className="mt-2 text-xs text-[hsl(var(--app-muted-foreground))]">
                    JPG, PNG, WebP o PDF · máximo 10 MB
                  </p>

                  {file ? (
                    <div className="mt-3 flex min-w-0 items-center gap-3 rounded-md border border-[hsl(var(--app-border))] p-2" aria-live="polite">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Vista previa del archivo seleccionado"
                          className="h-16 w-16 shrink-0 rounded object-cover"
                        />
                      ) : file.type === "application/pdf" ? (
                        <FileText aria-hidden="true" className="h-8 w-8 shrink-0 text-[hsl(var(--app-muted-foreground))]" />
                      ) : (
                        <FileImage aria-hidden="true" className="h-8 w-8 shrink-0 text-[hsl(var(--app-muted-foreground))]" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium" title={file.name}>{file.name}</p>
                        <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                          {Math.max(1, Math.round(file.size / 1024)).toLocaleString("es-GT")} KB · Listo para adjuntar
                        </p>
                      </div>
                      <AppButton
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearFile}
                        disabled={addMutation.isPending}
                        aria-label="Quitar archivo seleccionado"
                        title="Quitar archivo"
                      >
                        <X className="h-4 w-4" />
                      </AppButton>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="md:col-span-2">
                <AppFormTextarea<DeliveryEvidenceFormValues>
                  name="descripcion"
                  label="Descripción (opcional)"
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
                disabled={!file || addMutation.isPending}
                className="w-full sm:w-auto"
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
          <div className="min-w-0 space-y-1 text-sm">
            <p className="break-all"><strong>Archivo:</strong> {file.name}</p>
            <p><strong>Tipo:</strong> {DELIVERY_EVIDENCE_TYPE_LABELS[form.getValues("tipo")]}</p>
            <p><strong>Tamaño:</strong> {Math.max(1, Math.round(file.size / 1024))} KB</p>
          </div>
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
