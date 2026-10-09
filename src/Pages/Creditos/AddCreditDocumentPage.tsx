import { Camera, FileText, UploadCloud, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import { getReturnRoute } from "@/features/common/navigation/route-state";
import { useUploadCreditDocument } from "@/features/creditos/api/credit.mutations";
import { useCreditApplication } from "@/features/creditos/api/credit.queries";
import {
  CREDIT_DOCUMENT_TYPE_LABELS,
  CREDIT_DOCUMENT_TYPES,
} from "@/features/creditos/common/credit.constants";
import { AppButton } from "@/ui/components/app/primitives/app-button";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppConfirmDialog } from "@/ui/components/app/primitives/app-confirm-dialog";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppDataState } from "@/ui/components/app/primitives/app-data-state";
import { AppSingleSelect } from "@/ui/components/app/primitives/app-single-select";
import { AppTextarea } from "@/ui/components/app/primitives/app-textarea";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

type DocumentType = (typeof CREDIT_DOCUMENT_TYPES)[number];

export default function AddCreditDocumentPage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const id = Number(params.id);
  const defaultBack = "/marcas-gt/creditos/solicitudes/" + id + "?tab=documentos";
  const backTo = getReturnRoute(location.state, defaultBack);
  const query = useCreditApplication(id);
  const mutation = useUploadCreditDocument();

  const [tipo, setTipo] = useState<DocumentType>("DPI");
  const [observaciones, setObservaciones] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file?.type.startsWith("image/")) {
      setPreview(null);
      return;
    }
    const src = URL.createObjectURL(file);
    setPreview(src);
    return () => URL.revokeObjectURL(src);
  }, [file]);

  const clearFile = () => {
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
    if (cameraRef.current) cameraRef.current.value = "";
  };

  const chooseFile = (next?: File) => {
    if (!next) return;
    if (!["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(next.type) ||
        next.size === 0 || next.size > 10 * 1024 * 1024) {
      toast.error("Selecciona JPG, PNG, WebP o PDF de hasta 10 MB.");
      clearFile();
      return;
    }
    setFile(next);
  };

  const confirm = async () => {
    if (!file || !query.data?.acciones.puedeAgregarExpediente) return;
    await mutation.mutateAsync({ id, file, tipo, observaciones });
    navigate(defaultBack, { replace: true, state: { from: "/marcas-gt/creditos" } });
  };

  return (
    <AppContainer size="lg" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Adjuntar documento"
          description={query.data?.numero}
          backTo={backTo}
          backLabel="Volver al expediente"
        />
        <AppDataState
          isLoading={query.isLoading}
          error={query.error}
          onRetry={() => void query.refetch()}
          isEmpty={!query.isLoading && !query.data}
          emptyTitle="Solicitud no encontrada"
        >
          {query.data?.acciones.puedeAgregarExpediente ? (
            <AppCard
              title="Documento del expediente"
              description="Guarda archivos privados desde tu dispositivo o toma una fotografía. El documento quedará pendiente de revisión administrativa."
              size="sm"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="min-w-0">
                  <label className="mb-2 block text-xs font-medium">Tipo de documento *</label>
                  <AppSingleSelect<DocumentType>
                    value={tipo}
                    onChange={(next) => { if (next) setTipo(next); }}
                    options={CREDIT_DOCUMENT_TYPES.map((value) => ({
                      value,
                      label: CREDIT_DOCUMENT_TYPE_LABELS[value],
                    }))}
                  />
                </div>
                <div className="min-w-0">
                  <label className="mb-2 block text-xs font-medium">Archivo *</label>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
                    className="sr-only"
                    aria-label="Seleccionar archivo de crédito"
                    onChange={(e) => chooseFile(e.target.files?.[0])}
                  />
                  <input
                    ref={cameraRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="sr-only"
                    aria-label="Tomar foto de documento con el teléfono"
                    onChange={(e) => chooseFile(e.target.files?.[0])}
                  />
                  <div className="rounded-md border border-dashed border-[hsl(var(--app-border))] p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                      <AppButton
                        variant="secondary"
                        size="sm"
                        leftIcon={<UploadCloud />}
                        className="w-full sm:w-auto"
                        onClick={() => fileRef.current?.click()}
                      >
                        Seleccionar archivo
                      </AppButton>
                      <AppButton
                        variant="secondary"
                        size="sm"
                        leftIcon={<Camera />}
                        className="w-full sm:w-auto"
                        onClick={() => cameraRef.current?.click()}
                      >
                        Tomar foto
                      </AppButton>
                    </div>
                    <p className="mt-2 text-xs text-[hsl(var(--app-muted-foreground))]">
                      JPG, PNG, WebP o PDF · máximo 10 MB
                    </p>
                    {file ? (
                      <div className="mt-3 flex min-w-0 items-center gap-2 rounded border border-[hsl(var(--app-border))] p-2">
                        {preview ? (
                          <img src={preview} alt="Vista previa" className="h-14 w-14 shrink-0 rounded object-cover" />
                        ) : <FileText className="h-8 w-8 shrink-0" />}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium" title={file.name}>{file.name}</p>
                          <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                            {Math.max(1, Math.round(file.size / 1024))} KB
                          </p>
                        </div>
                        <AppButton
                          variant="ghost"
                          size="sm"
                          aria-label="Quitar archivo"
                          onClick={clearFile}
                        >
                          <X className="h-4 w-4" />
                        </AppButton>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="min-w-0 md:col-span-2">
                  <label htmlFor="credit-file-notes" className="mb-2 block text-xs font-medium">
                    Observaciones (opcional)
                  </label>
                  <AppTextarea
                    id="credit-file-notes"
                    rows={3}
                    maxLength={500}
                    value={observaciones}
                    onChange={(event) => setObservaciones(event.target.value)}
                    placeholder="Descripción del documento"
                  />
                </div>
              </div>
              <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <AppButton asChild variant="secondary" className="w-full sm:w-auto">
                  <Link to={backTo}>Cancelar</Link>
                </AppButton>
                <AppButton
                  variant="primary"
                  leftIcon={<UploadCloud />}
                  disabled={!file || mutation.isPending}
                  className="w-full sm:w-auto"
                  onClick={() => setConfirmOpen(true)}
                >
                  Adjuntar al expediente
                </AppButton>
              </div>
              <AppConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="Confirmar documento de crédito"
                description={file ? "Se guardará " + file.name + " en DigitalOcean Spaces privado." : ""}
                preset="send"
                confirmText="Subir documento"
                loadingText="Subiendo..."
                isLoading={mutation.isPending}
                onConfirm={confirm}
                contentCard
              />
            </AppCard>
          ) : query.data ? (
            <AppCard
              title="Expediente no editable"
              description="El estado actual no permite agregar documentos."
              size="sm"
            />
          ) : null}
        </AppDataState>
      </AppStack>
    </AppContainer>
  );
}
