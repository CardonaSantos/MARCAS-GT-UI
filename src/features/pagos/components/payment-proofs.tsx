import type { ColumnDef } from "@tanstack/react-table";
import { ExternalLink, FileImage, FileText, Link2, Plus, Trash2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { marcasApi } from "@/API/api";
import { marcasEndpoints } from "@/API/routes/endpoints";
import { useStore } from "@/Context/ContextSucursal";
import { formatDateTime } from "@/features/common/formatters/value.formatters";
import { createIdempotencyKey } from "@/features/common/utils/idempotency";
import { getApiErrorMessage } from "@/lib/api-error";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";
import { AppTextarea } from "@/ui/components/app/primitives/app-textarea";
import { AppDataTable } from "@/ui/components/app/table/app-data-table";
import { createAppRowActionsColumn } from "@/ui/components/app/table/app-table-row-actions";

import { useDeletePaymentProof, useUploadPaymentProof } from "../api/payment.mutations";
import type { PaymentDetail, PaymentProof } from "../api/payment.types";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

function fileSize(bytes: number | null) {
  if (bytes == null) return "—";
  return Math.max(1, Math.round(bytes / 1024)).toLocaleString("es-GT") + " KB";
}

export function PaymentProofs({ payment }: { payment: PaymentDetail }) {
  const role = useStore((s) => s.userRol);
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [confirmUpload, setConfirmUpload] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState("");
  const [pendingDelete, setPendingDelete] = useState<PaymentProof | null>(null);
  const upload = useUploadPaymentProof();
  const remove = useDeletePaymentProof();

  const onFileChange = (next: File | null) => {
    if (!next) {
      setFile(null);
      return;
    }
    if (next.size === 0 || next.size > MAX_FILE_SIZE) {
      toast.error("El archivo debe tener contenido y no superar 10 MB.");
      if (fileRef.current) fileRef.current.value = "";
      setFile(null);
      return;
    }
    if (!ACCEPTED.includes(next.type)) {
      toast.error("Selecciona JPG, PNG, WebP o PDF.");
      if (fileRef.current) fileRef.current.value = "";
      setFile(null);
      return;
    }
    setFile(next);
  };

  const requestUpload = () => {
    if (!file || upload.isPending) return;
    setIdempotencyKey(createIdempotencyKey("payment-proof"));
    setConfirmUpload(true);
  };

  const confirm = async () => {
    if (!file) return;
    await upload.mutateAsync({
      id: payment.id,
      file,
      descripcion: description.trim(),
      claveIdempotencia: idempotencyKey,
    });
    setFile(null);
    setDescription("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const openProof = (proof: PaymentProof) => {
    // Abrir ventana durante el gesto del usuario para evitar bloqueadores popup.
    const popup = window.open("about:blank", "_blank");
    if (popup) popup.opener = null;

    void marcasApi.get<{ url: string; mimeType: string | null }>(
      marcasEndpoints.pagos.proofFile(payment.id, proof.id),
    ).then(({ url }) => {
      if (!/^https:\/\//i.test(url)) {
        throw new Error("El enlace del comprobante no es seguro.");
      }
      if (popup && !popup.closed) {
        popup.location.replace(url);
      } else {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    }).catch((error: unknown) => {
      popup?.close();
      toast.error(getApiErrorMessage(error));
    });
  };

  const confirmDelete = async () => {
    if (!pendingDelete || role !== "ADMIN") return;
    await remove.mutateAsync({ id: payment.id, proofId: pendingDelete.id });
    setPendingDelete(null);
  };

  const columns: ColumnDef<PaymentProof, unknown>[] = [
    {
      accessorKey: "descripcion",
      header: "Archivo / descripción",
      size: 290,
      meta: { grow: true },
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.mimeType === "application/pdf" ? (
            <FileText className="h-4 w-4 shrink-0 text-[hsl(var(--app-muted-foreground))]" />
          ) : (
            <FileImage className="h-4 w-4 shrink-0 text-[hsl(var(--app-muted-foreground))]" />
          )}
          <span className="truncate" title={row.original.descripcion ?? ""}>
            {row.original.descripcion ?? "Comprobante"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "mimeType",
      header: "Formato",
      size: 110,
      cell: ({ row }) =>
        row.original.mimeType === "application/pdf"
          ? "PDF"
          : row.original.mimeType?.replace("image/", "").toUpperCase() ?? "—",
    },
    {
      accessorKey: "size",
      header: "Tamaño",
      size: 100,
      meta: { align: "right" },
      cell: ({ row }) => fileSize(row.original.size),
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
          label: "Ver archivo",
          icon: <ExternalLink />,
          onClick: () => openProof(row.original),
        },
        {
          label: "Eliminar comprobante",
          icon: <Trash2 />,
          hidden: role !== "ADMIN",
          onClick: () => setPendingDelete(row.original),
        },
      ],
    }),
  ];

  return (
    <div className="space-y-4">
      {payment.acciones.puedeAgregarComprobante ? (
        <section className="space-y-3 rounded-md border border-[hsl(var(--app-border))] p-3">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold">Adjuntar comprobante</h3>
            <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
              Carga una imagen o PDF del pago. Se guardará de forma privada en DigitalOcean Spaces.
            </p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
            className="sr-only"
            aria-label="Seleccionar archivo de comprobante"
            onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
          />
          <div className="flex flex-wrap items-center gap-3">
            <AppButton
              variant="secondary"
              size="sm"
              leftIcon={<UploadCloud />}
              onClick={() => fileRef.current?.click()}
              disabled={upload.isPending}
            >
              Seleccionar archivo
            </AppButton>
            <span className="text-xs text-[hsl(var(--app-muted-foreground))]">
              {file ? file.name + " · " + fileSize(file.size) : "JPG, PNG, WebP o PDF, máximo 10 MB"}
            </span>
          </div>
          <div className="space-y-1">
            <label
              htmlFor={"comprobante-descripcion-" + payment.id}
              className="text-xs font-medium"
            >
              Descripción (opcional)
            </label>
            <AppTextarea
              id={"comprobante-descripcion-" + payment.id}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={2}
              maxLength={1000}
              placeholder="Ej. Boleta de transferencia del pedido"
              disabled={upload.isPending}
            />
          </div>
          <div className="flex justify-end">
            <AppButton
              variant="primary"
              size="sm"
              leftIcon={<Plus />}
              disabled={!file}
              loading={upload.isPending}
              loadingText="Cargando..."
              onClick={requestUpload}
            >
              Adjuntar al pago
            </AppButton>
          </div>
        </section>
      ) : null}

      <AppDataTable
        data={payment.comprobantes}
        columns={columns}
        getRowId={(row) => String(row.id)}
        paginationMode="none"
        density="xs"
        responsiveMode="scroll"
        emptyTitle="Sin comprobantes"
        emptyDescription="Todavía no hay archivos asociados a este pago."
        toolbar={
          <span className="inline-flex items-center gap-2 text-xs text-[hsl(var(--app-muted-foreground))]">
            <Link2 className="h-4 w-4" />
            {payment.comprobantes.length} comprobantes
          </span>
        }
      />

      <AppConfirmDialog
        open={confirmUpload}
        onOpenChange={setConfirmUpload}
        preset="send"
        title="Adjuntar comprobante al pago"
        description="Confirma el archivo seleccionado. Solo usuarios autorizados podrán abrirlo."
        confirmText="Subir comprobante"
        loadingText="Subiendo archivo..."
        onConfirm={confirm}
        isLoading={upload.isPending}
        contentCard
      >
        {file ? (
          <div className="space-y-1 text-sm">
            <p><strong>Archivo:</strong> {file.name}</p>
            <p><strong>Tamaño:</strong> {fileSize(file.size)}</p>
            <p><strong>Descripción:</strong> {description || "Sin descripción"}</p>
          </div>
        ) : null}
      </AppConfirmDialog>

      <AppConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(next) => { if (!next && !remove.isPending) setPendingDelete(null); }}
        preset="delete"
        title="Eliminar comprobante"
        description="Se ocultará del pago, se registrará quién lo eliminó y se solicitará borrar el archivo de Spaces."
        confirmText="Eliminar comprobante"
        loadingText="Eliminando..."
        onConfirm={confirmDelete}
        isLoading={remove.isPending}
        contentCard
      >
        {pendingDelete ? (
          <p className="text-sm">{pendingDelete.descripcion ?? "Comprobante #" + pendingDelete.id}</p>
        ) : null}
      </AppConfirmDialog>
    </div>
  );
}
